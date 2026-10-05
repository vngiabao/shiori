import { liveQuery } from "dexie";
import { db } from "./db";
import { authConfigured, currentAccount, supabase } from "./auth";
import type { Account } from "./auth";
import {
  kinds,
  personalKinds,
  emptySnapshot,
  canonical,
  cloudProfile,
  mergeSnapshots,
  rowsOf,
  snapshotOf,
  SYNC_SCHEMA,
  type LearningSnapshot,
  type SyncState,
} from "./sync-model";
import {
  createTransport,
  SyncConflict,
  type SyncTransport,
} from "./sync-transport";

export type SyncStatus = {
  phase:
    | "unconfigured"
    | "signed-out"
    | "consent"
    | "account-mismatch"
    | "paused"
    | "offline"
    | "syncing"
    | "ready"
    | "error";
  message: string;
  account: Account | null;
  lastSync?: number;
  pending: boolean;
};
let status: SyncStatus = {
  phase: authConfigured ? "signed-out" : "unconfigured",
  message: authConfigured
    ? "Sign in to sync your progress."
    : "Cloud sync isn’t connected. Your progress stays on this device.",
  account: null,
  pending: false,
};
const listeners = new Set<() => void>();
export const getSyncStatus = () => status;
export const subscribeSync = (callback: () => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};
function report(change: Partial<SyncStatus>) {
  status = { ...status, ...change };
  listeners.forEach((f) => f());
}
let account: Account | null = null,
  generation = 0;
let running: Promise<void> | null = null;
let transportFactory = createTransport;
export function setSyncTransportForTests(factory: typeof createTransport) {
  transportFactory = factory;
}
export async function localSyncState(): Promise<SyncState> {
  return db.transaction("rw", db.syncState, async () => {
    let state = await db.syncState.get("local");
    if (!state) {
      state = { id: "local", deviceId: crypto.randomUUID(), enabled: false };
      await db.syncState.add(state);
    }
    return state;
  });
}
async function snapshot(): Promise<LearningSnapshot> {
  return db.transaction("r", db.tables, async () => {
    const state = await db.syncState.get("local");
    const data = emptySnapshot();
    for (const kind of kinds)
      if (!personalKinds.has(kind) || state?.includeText)
        (data[kind] as unknown[]) = await db.table(kind).toArray();
    const profile = await db.profiles.get("local");
    if (profile)
      data.profile = cloudProfile({
        ...profile,
        updatedAt: profile.updatedAt ?? 0,
        updatedBy: profile.updatedBy ?? "legacy",
      });
    return data;
  });
}
async function fingerprint(data: LearningSnapshot) {
  const bytes = new TextEncoder().encode(canonical(rowsOf(data)));
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
}
export async function acceptAccount(next: Account | null) {
  const token = ++generation;
  account = next;
  const state = await localSyncState();
  if (token !== generation) return;
  report({
    account: next,
    lastSync: state.lastSync,
    pending: state.pending ?? false,
  });
  if (!next) {
    report({
      phase: authConfigured ? "signed-out" : "unconfigured",
      message:
        "Your progress is saved on this device. Sign in when cloud sync is available.",
    });
    return;
  }
  if (state.ownerId && state.ownerId !== next.id) {
    report({
      phase: "account-mismatch",
      message:
        "This device contains another account’s progress. Sign back into that account, or export a backup and remove the local data before syncing this account.",
    });
    return;
  }
  if (!state.ownerId) {
    if (state.consentDeclinedFor === next.id) {
      report({
        phase: "paused",
        message: "Cloud sync is paused. Local learning still works.",
      });
      return;
    }
    report({
      phase: "consent",
      message: "Add this device’s progress to your account?",
    });
    return;
  } else if (!state.enabled) {
    report({
      phase: "paused",
      message: "Cloud sync is paused. Local learning still works.",
    });
    return;
  }
  report({ phase: "ready", message: "Ready to sync." });
}
export async function allowDeviceProgress() {
  if (!account) return;
  const state = await localSyncState();
  if (state.ownerId && state.ownerId !== account.id)
    throw new Error("Local data belongs to a different account.");
  await db.syncState.update("local", {
    ownerId: account.id,
    enabled: true,
    pending: true,
    consentDeclinedFor: undefined,
  });
  report({ phase: "ready", message: "Sync enabled.", pending: true });
  await syncNow(true);
}
export async function pauseSync() {
  generation++;
  await db.syncState.update("local", {
    enabled: false,
    consentDeclinedFor: account?.id,
  });
  report({
    phase: "paused",
    message:
      "Kept on this device. Nothing will be uploaded until you enable sync.",
  });
}
export async function detachSync() {
  generation++;
  account = null;
  report({
    account: null,
    phase: "signed-out",
    message: "Signed out. Local progress is kept.",
  });
  if (running) await running.catch(() => undefined);
}
function assertSession(token: number, userId: string) {
  if (token !== generation || account?.id !== userId)
    throw new Error("Account or sync preference changed. Sync stopped.");
}
async function withSyncLock(task: () => Promise<void>) {
  if (typeof navigator !== "undefined" && navigator.locks)
    await navigator.locks.request("shiori-cloud-sync", task);
  else await task();
}
export async function syncNow(resume = false): Promise<void> {
  if (running) return running;
  running = withSyncLock(() => performSync(resume)).finally(() => {
    running = null;
  });
  return running;
}
async function performSync(resume: boolean) {
  const user = account,
    token = generation;
  if (!user) return;
  let state = await localSyncState();
  if (state.ownerId !== user.id || !state.enabled) return;
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    await db.syncState.update("local", { pending: true });
    report({
      phase: "offline",
      pending: true,
      message:
        "Offline. Changes are saved here and will sync when you reconnect.",
    });
    return;
  }
  report({ phase: "syncing", message: "Syncing your progress…" });
  const transport: SyncTransport = transportFactory(user.id);
  try {
    for (let retry = 0; retry < 3; retry++) {
      try {
        const clean =
          (await fingerprint(await snapshot())) === state.acknowledged;
        const remote = await transport.pull(clean ? state.revision : undefined);
        assertSession(token, user.id);
        if (remote.schema_version !== SYNC_SCHEMA)
          throw new Error(
            "Cloud data needs a newer Shiori version. Local progress is safe.",
          );
        if (
          (remote.deleted || (state.epoch && state.epoch !== remote.epoch)) &&
          !resume
        ) {
          await db.syncState.update("local", {
            enabled: false,
            epoch: remote.epoch,
            lastSync: undefined,
          });
          report({
            phase: "paused",
            lastSync: undefined,
            message:
              "Cloud data was deleted. Sync is paused to prevent restoring it without your permission.",
          });
          return;
        }
        if (remote.unchanged) {
          const pending =
            (await fingerprint(await snapshot())) !== state.acknowledged;
          const lastSync = Date.now();
          await db.syncState.update("local", { lastSync, pending });
          report({
            phase: "ready",
            lastSync,
            pending,
            message: pending
              ? "New changes are waiting for the next sync."
              : "Your progress is synced.",
          });
          return;
        }
        const merged = mergeSnapshots(
          snapshotOf(rowsOf(await snapshot())),
          snapshotOf(
            remote.rows.filter(
              (r) => !personalKinds.has(r.kind) || state.includeText,
            ),
          ),
        );
        const old = new Map(
          remote.rows.map((r) => [`${r.kind}:${r.id}`, canonical(r.payload)]),
        );
        const changed = rowsOf(merged).filter(
          (r) => old.get(`${r.kind}:${r.id}`) !== canonical(r.payload),
        );
        let cloud = remote;
        for (
          let i = 0;
          i < changed.length || (i === 0 && resume && remote.deleted);
          i += 200
        ) {
          assertSession(token, user.id);
          const current = await localSyncState();
          if (!current.enabled || current.ownerId !== user.id)
            throw new Error("Sync paused on this device.");
          cloud = {
            ...cloud,
            ...(await transport.push(cloud, changed.slice(i, i + 200), resume)),
          };
        }
        assertSession(token, user.id);
        const acknowledged = await fingerprint(merged);
        await db.transaction("rw", db.tables, async (tx) => {
          (tx as typeof tx & { fromCloud?: boolean }).fromCloud = true;
          assertSession(token, user.id);
          const freshState = await db.syncState.get("local");
          if (freshState?.ownerId !== user.id || !freshState.enabled)
            throw new Error("Sync stopped because local ownership changed.");
          const fresh = mergeSnapshots(
            snapshotOf(rowsOf(await snapshot())),
            merged,
          );
          for (const kind of kinds)
            if (!personalKinds.has(kind) || freshState.includeText)
              await db.table(kind).bulkPut(fresh[kind]);
          await db.memories.clear();
          await db.memories.bulkPut(fresh.memories);
          if (fresh.profile)
            await db.profiles.put({
              ...((await db.profiles.get("local")) ?? fresh.profile),
              ...fresh.profile,
            });
          const pending =
            canonical(rowsOf(fresh)) !== canonical(rowsOf(merged));
          await db.syncState.update("local", {
            epoch: cloud.epoch,
            revision: cloud.revision,
            acknowledged,
            lastSync: Date.now(),
            pending,
          });
        });
        state = await localSyncState();
        report({
          phase: "ready",
          lastSync: state.lastSync,
          pending: state.pending ?? false,
          message: state.pending
            ? "New changes are waiting for the next sync."
            : "Your progress is synced.",
        });
        return;
      } catch (error) {
        if (error instanceof SyncConflict && retry < 2) continue;
        throw error;
      }
    }
  } catch (error) {
    if (token !== generation) return;
    await db.syncState.update("local", { pending: true });
    report({
      phase: "error",
      pending: true,
      message:
        error instanceof Error
          ? error.message
          : "Sync could not finish. Your local progress is safe.",
    });
  }
}
export async function deleteCloudData() {
  const user = account;
  if (!user) throw new Error("Sign in before deleting cloud data.");
  await pauseSync();
  if (running) await running;
  await withSyncLock(async () => {
    if (account?.id !== user.id)
      throw new Error("Account changed. Deletion stopped.");
    const cloud = await transportFactory(user.id).remove();
    await db.syncState.update("local", {
      enabled: false,
      epoch: cloud.epoch,
      lastSync: undefined,
      acknowledged: undefined,
      pending: true,
    });
  });
  report({
    phase: "paused",
    lastSync: undefined,
    pending: true,
    message:
      "Cloud learning data deleted. Local progress is kept; sync is paused on this device.",
  });
}
export async function setPersonalText(enabled: boolean) {
  generation++;
  await localSyncState();
  await db.syncState.update("local", {
    includeText: enabled,
    acknowledged: undefined,
    pending: true,
  });
  report({
    message: enabled
      ? "Personal text will sync while progress sync is enabled."
      : "Personal text stays on this device. Previously uploaded text remains in the cloud until cloud data is deleted.",
  });
}
export function startSync() {
  let stopped = false;
  let unsubscribeAuth: (() => void) | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => void syncNow(), 1500);
  };
  const changes = liveQuery(snapshot).subscribe({
    next: async (data) => {
      if (stopped) return;
      const state = await localSyncState();
      const pending = (await fingerprint(data)) !== state.acknowledged;
      if (pending !== state.pending)
        await db.syncState.update("local", { pending });
      if (!stopped) {
        report({ pending });
        if (pending) schedule();
      }
    },
    error: () =>
      report({
        phase: "error",
        message:
          "Could not read local data for sync. Export a backup and reload.",
      }),
  });
  const online = () => void syncNow();
  const offline = () => {
    if (account)
      report({
        phase: "offline",
        message: "Offline. Your changes stay safely on this device.",
      });
  };
  window.addEventListener("online", online);
  window.addEventListener("offline", offline);
  const periodic = setInterval(() => void syncNow(), 30000);
  if (authConfigured)
    void (async () => {
      const client = await supabase();
      if (stopped) return;
      const { data } = client.auth.onAuthStateChange((event) => {
        if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event))
          return;
        // Leave the auth callback before asking the SDK for its session again.
        setTimeout(() => {
          if (!stopped)
            void currentAccount()
              .then(async (a) => {
                if (!stopped) {
                  if (a?.id !== account?.id || event === "USER_UPDATED")
                    await acceptAccount(a);
                  if (!stopped) await syncNow();
                }
              })
              .catch(() => {
                if (!stopped)
                  report({
                    phase: "error",
                    message:
                      "Sign-in could not be checked. Try signing in again.",
                  });
              });
        }, 0);
      });
      unsubscribeAuth = () => data.subscription.unsubscribe();
      const initial = await currentAccount();
      if (stopped) return;
      await acceptAccount(initial);
      if (!stopped) await syncNow();
    })().catch(() => {
      if (!stopped)
        report({
          phase: "error",
          message:
            "Sign-in could not be checked. Local learning is still available.",
        });
    });
  return () => {
    stopped = true;
    clearTimeout(timer);
    clearInterval(periodic);
    changes.unsubscribe();
    unsubscribeAuth?.();
    window.removeEventListener("online", online);
    window.removeEventListener("offline", offline);
  };
}
