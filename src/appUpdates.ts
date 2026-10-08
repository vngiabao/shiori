import { useSyncExternalStore } from "react";

let ready = false;
let requested = false;
let registration: ServiceWorkerRegistration | undefined;
const listeners = new Set<() => void>();
function publish() {
  ready = true;
  listeners.forEach((listener) => listener());
}
export function useAppUpdate() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => ready,
    () => false,
  );
}
export function applyAppUpdate() {
  requested = true;
  if (registration?.waiting)
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
  else location.reload();
}
/** One production registration. Updates wait for an explicit, safe refresh.
 * Never clear IndexedDB, local preferences or the downloaded audio cache. */
export function startAppUpdates() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  let previousController = navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    const next = navigator.serviceWorker.controller;
    if (previousController && next !== previousController) {
      if (requested) location.reload();
      else publish();
    }
    previousController = next;
  });
  void navigator.serviceWorker
    .register("/sw.js", { updateViaCache: "none" })
    .then((reg) => {
      registration = reg;
      const installed = () => {
        if (reg.waiting && navigator.serviceWorker.controller) publish();
      };
      installed();
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        worker?.addEventListener("statechange", installed);
      });
      const check = () => {
        if (
          navigator.onLine &&
          document.visibilityState === "visible" &&
          !reg.installing
        )
          void reg.update().catch(() => undefined);
      };
      window.addEventListener("online", check);
      document.addEventListener("visibilitychange", check);
      window.setInterval(check, 5 * 60 * 1000);
    })
    .catch(() => undefined); // Offline startup must continue using the installed app.
}
