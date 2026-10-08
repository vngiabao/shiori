import { ArrowClockwise } from "@phosphor-icons/react";
import { useState } from "react";
import { applyAppUpdate, useAppUpdate } from "./appUpdates";

export function AppUpdateNotice({ studying }: { studying: boolean }) {
  const ready = useAppUpdate();
  const [applying, setApplying] = useState(false);
  if (!ready || studying) return null;
  return (
    <aside
      className="app-update-notice"
      role="status"
      aria-label="Shiori update"
    >
      <p>A Shiori update is ready. Your saved progress stays here.</p>
      <button
        className="text-button"
        disabled={applying}
        onClick={() => {
          setApplying(true);
          applyAppUpdate();
        }}
      >
        <ArrowClockwise size={18} aria-hidden="true" />
        {applying ? "Updating Shiori…" : "Update Shiori"}
      </button>
    </aside>
  );
}
