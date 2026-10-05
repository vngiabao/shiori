import { describe, it, expect, vi, beforeEach } from "vitest";
import { backupDue } from "../src/backup";

const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => store.set(k, v),
});
beforeEach(() => store.clear());

describe("Backup reminder", () => {
  it("waits until there is real progress to lose", () =>
    expect(backupDue(5)).toBe(false));
  it("asks when there has never been a backup", () =>
    expect(backupDue(40)).toBe(true));
  it("stays quiet for a week after a backup", () => {
    const now = 1_800_000_000_000;
    store.set("shiori-last-backup", String(now - 3 * 86400000));
    expect(backupDue(40, now)).toBe(false);
    store.set("shiori-last-backup", String(now - 8 * 86400000));
    expect(backupDue(40, now)).toBe(true);
  });
});
