import { currentAccount, supabase } from "./auth";
import type { SyncRow } from "./sync-model";

export type CloudState = {
  revision: number;
  epoch: string;
  deleted: boolean;
  schema_version: number;
};
export type CloudSnapshot = CloudState & {
  rows: SyncRow[];
  unchanged?: boolean;
};
export interface SyncTransport {
  pull(knownRevision?: number): Promise<CloudSnapshot>;
  push(
    state: CloudState,
    rows: SyncRow[],
    resume: boolean,
  ): Promise<CloudState>;
  remove(): Promise<CloudState>;
}
export class SyncConflict extends Error {}
export function createTransport(userId: string): SyncTransport {
  async function call(name: string, params = {}) {
    if ((await currentAccount())?.id !== userId)
      throw new Error("Account changed. Sync stopped.");
    const { data, error } = await (
      await supabase()
    )
      .rpc(name, params)
      .abortSignal(AbortSignal.timeout(20000));
    if (error) {
      if (error.message.includes("sync_conflict"))
        throw new SyncConflict("Another device synced. Retrying safely.");
      throw new Error(
        "Cloud sync could not finish. Your progress is safe on this device. Check the connection and cloud setup, then try again.",
      );
    }
    return data;
  }
  return {
    async pull(knownRevision) {
      let state: CloudState | undefined,
        after = "";
      const rows: SyncRow[] = [];
      for (;;) {
        const page = (await call("shiori_sync_pull", {
          p_after: after,
          p_known_revision: knownRevision ?? null,
        })) as CloudSnapshot & { next: string | null };
        if (page.unchanged && !after) return page;
        if (
          state &&
          (page.revision !== state.revision || page.epoch !== state.epoch)
        )
          throw new SyncConflict("Cloud changed during download.");
        state = page;
        rows.push(...page.rows);
        if (!page.next) return { ...state, rows };
        after = page.next;
      }
    },
    push: (state, rows, resume) =>
      call("shiori_sync_push", {
        p_revision: state.revision,
        p_epoch: state.epoch,
        p_rows: rows,
        p_resume: resume,
      }),
    remove: () => call("shiori_sync_delete"),
  };
}
