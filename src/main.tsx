import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.tsx";
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

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="ms-theme">
      <App />
    </ThemeProvider>
  </HelmetProvider>
);
