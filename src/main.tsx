import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.tsx";
import { forceLoadAllSections } from "./hooks/useLazySection";
import { normalizePath, preloadRoute } from "./routes";
import "./index.css";

// Register service worker (only in production, not in iframes)
const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

if ("serviceWorker" in navigator && !isInIframe && !isPreviewHost) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (reg) => console.log("SW registered:", reg.scope),
      (err) => console.warn("SW registration failed:", err)
    );
  });
} else if (isPreviewHost || isInIframe) {
  // Unregister any existing SW in preview
  navigator.serviceWorker?.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  });
}

const tree = (
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

async function start() {
  const container = document.getElementById("root")!;
  const prerendered = container.getAttribute("data-prerendered-route");
  const current = normalizePath(window.location.pathname);

  if (prerendered && prerendered === current) {
    // Markup was prerendered for exactly this route: load its chunk first so
    // Suspense does not swap the server HTML for the PageLoader, then hydrate.
    try {
      // Lazy sections were rendered on the server: show them from the first render too
      forceLoadAllSections();
      await preloadRoute(current);
      hydrateRoot(container, tree);
      return;
    } catch {
      // fall through to a clean client render
    }
  }

  // No prerendered markup for this URL (e.g. server still serves the home HTML
  // for every path, or an unknown route): drop it and render on the client.
  container.replaceChildren();
  container.removeAttribute("data-prerendered-route");
  createRoot(container).render(tree);
}

void start();
