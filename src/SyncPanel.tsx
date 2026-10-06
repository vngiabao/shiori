import { useState, useSyncExternalStore } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "./components";
import {
  authConfigured,
  emailConfigured,
  oauthConfigured,
  sendEmailCode,
  verifyEmailCode,
  signInWith,
  signOut,
  currentAccount,
} from "./auth";
import {
  getSyncStatus,
  subscribeSync,
  acceptAccount,
  allowDeviceProgress,
  pauseSync,
  detachSync,
  syncNow,
  setPersonalText,
  deleteCloudData,
} from "./sync";
import { db } from "./db";
import { GoogleLogo } from "@phosphor-icons/react";
export function SyncPanel({ entry = false }: { entry?: boolean }) {
  const status = useSyncExternalStore(
    subscribeSync,
    getSyncStatus,
    getSyncStatus,
  );
  const settings = useLiveQuery(() => db.syncState.get("local"), []);
  const [email, setEmail] = useState(""),
    [code, setCode] = useState(""),
    [sent, setSent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const action = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };
  if (!authConfigured && !entry)
    return (
      <p>
        Local guest mode is active. No cloud connection is configured. Backups
        remain available above.
      </p>
    );
  return (
    <div className={`sync-panel${entry ? " sync-entry" : ""}`}>
      {(!entry || status.account) && <p role="status">{status.message}</p>}
      {error && <p role="alert">{error}</p>}
      {!status.account ? (
        <>
          {emailConfigured && (
            <>
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <Button
                disabled={busy || !email.includes("@")}
                onClick={() =>
                  void action(async () => {
                    await sendEmailCode(email);
                    setSent(true);
                  })
                }
              >
                Send sign-in email
              </Button>
              {sent && (
                <>
                  <p role="status">
                    Open the sign-in link from your email in this browser. If
                    the email includes a code, you can enter it below.
                  </p>
                  <label>
                    Email code
                    <input
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </label>
                  <Button
                    disabled={busy || !code.trim()}
                    onClick={() =>
                      void action(async () => {
                        await verifyEmailCode(email, code);
                        await acceptAccount(await currentAccount());
                      })
                    }
                  >
                    Verify code
                  </Button>
                </>
              )}
            </>
          )}
          <Button
            secondary={!entry}
            disabled={busy || !oauthConfigured("google")}
            onClick={() => void action(() => signInWith("google"))}
          >
            <GoogleLogo aria-hidden="true" />
            {busy ? "Connecting to Google…" : "Continue with Google"}
          </Button>
          {!emailConfigured && (
            <p className="muted">
              Private sync · Google account gbao.n.vo@gmail.com only.
            </p>
          )}
          {!oauthConfigured("google") && (
            <p className="muted">Google sign-in is not configured yet.</p>
          )}
        </>
      ) : (
        <>
          <p>Signed in as {status.account.email}</p>
          {status.phase !== "account-mismatch" && (
            <>
              <p>
                Progress sync combines this device’s learning history with your
                account. Audio, recordings and video files stay on this device.
              </p>
              <div>
                <Button
                  disabled={busy || status.phase === "syncing"}
                  onClick={() =>
                    void action(() =>
                      settings?.enabled ? syncNow() : allowDeviceProgress(),
                    )
                  }
                >
                  {settings?.enabled
                    ? "Sync now"
                    : "Add this device’s progress"}
                </Button>
                <Button
                  secondary
                  disabled={busy}
                  onClick={() => void action(pauseSync)}
                >
                  Keep on this device
                </Button>
              </div>
              <label>
                <input
                  type="checkbox"
                  checked={settings?.includeText ?? false}
                  disabled={busy || status.phase === "syncing"}
                  onChange={(e) =>
                    void action(() => setPersonalText(e.target.checked))
                  }
                />{" "}
                Also sync personal text: saved passages, translations, subtitle
                lines and study notes
              </label>
              <p className="muted">
                Off by default. Turning this off stops future text transfers; it
                does not erase text already uploaded. Unsaved drafts and letter
                replies remain local.
              </p>
              {status.lastSync && (
                <p>Last sync: {new Date(status.lastSync).toLocaleString()}</p>
              )}
              <p>
                {status.pending
                  ? "Local changes are waiting to sync."
                  : "No queued local changes."}
              </p>
              <Button
                secondary
                disabled={busy}
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this account’s cloud learning data? Local progress will remain.",
                    )
                  )
                    void action(deleteCloudData);
                }}
              >
                Delete cloud learning data
              </Button>
            </>
          )}
          <Button
            secondary
            disabled={busy}
            onClick={() =>
              void action(async () => {
                await detachSync();
                await signOut();
              })
            }
          >
            Sign out
          </Button>
        </>
      )}
    </div>
  );
}
