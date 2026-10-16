import React, { Component, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/500.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/noto-serif-jp/400.css";
import "@fontsource/courier-prime/400.css";
import "./styles.css";
import "./violet-theme.css";
import App from "./App";
import "./study-layout.css";
import { startAppUpdates } from "./appUpdates";
import { unlockSfx } from "./sfx";
import { startPlayful } from "./playful";
startAppUpdates();
startPlayful();
// Browsers start audio only from a gesture: unlock on the first press.
window.addEventListener("pointerdown", unlockSfx, {
  once: true,
  capture: true,
});
window.addEventListener("keydown", unlockSfx, { once: true, capture: true });
// iOS 16.4+: lesson audio is the point of a lesson, so it plays even with
// the ringer switch on silent, like a music or podcast app.
const session = (navigator as Navigator & { audioSession?: { type: string } })
  .audioSession;
if (session) session.type = "playback";
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="completion">
        <h1>We couldn’t open your desk.</h1>
        <p>
          Your saved data has not been deleted. Reload to try again; if the
          problem persists, check that your browser allows storage for this
          site.
        </p>
        <button className="button" onClick={() => location.reload()}>
          Reload Shiori
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
