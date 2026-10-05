import { exportBackup } from "./db";

const key = "shiori-last-backup";
/** When this device last exported a backup (a per-device reminder, not data). */
export function lastBackup(): number | null {
  try {
    const v = Number(localStorage.getItem(key));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}
/** Exports every learning record as a JSON file the learner keeps. */
export async function downloadBackup() {
  const data = await exportBackup();
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `shiori-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  try {
    localStorage.setItem(key, String(Date.now()));
  } catch {
    // The reminder is a convenience; the export itself has already happened.
  }
}
/** Remind weekly once there is real progress to lose. */
export const backupDue = (attempts: number, now = Date.now()) => {
  const last = lastBackup();
  return attempts >= 20 && (last === null || now - last > 7 * 86400000);
};
