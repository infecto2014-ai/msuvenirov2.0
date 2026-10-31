import { lazy, type ComponentType, type LazyExoticComponent } from "react";

type Loader = () => Promise<{ default: ComponentType<any> }>;

// Retry wrapper for lazy imports — retries up to 3 times on network failures
export const lazyRetry = (fn: Loader, retries = 3): Promise<{ default: ComponentType<any> }> =>
  fn().catch((err: any) => {
    if (retries > 0) {
      return new Promise((resolve) => setTimeout(resolve, 500)).then(() => lazyRetry(fn, retries - 1));
    }
    // Force reload if all retries fail (stale chunk after deploy) — browser only
    if (typeof window !== "undefined") window.location.reload();
    throw err;
  });

export interface RouteDef {
  path: string;
  load: Loader;
  Component: LazyExoticComponent<ComponentType<any>>;
}

const def = (path: string, load: Loader): RouteDef => ({
  path,
  load,
  Component: lazy(() => lazyRetry(load)),
});

// Single route table shared by the client (BrowserRouter) and the prerenderer (StaticRouter).
export const routeDefs: RouteDef[] = [
  def("/", () => import("./pages/Index")),
  def("/public-offer", () => import("./pages/PublicOffer")),
  def("/privacy-policy", () => import("./pages/PrivacyPolicy")),
  def("/card", () => import("./pages/LinkInBio")),
  def("/price", () => import("./pages/PricePage")),
  def("/faq", () => import("./pages/FAQPage")),
  def("/pechat_na_tkani", () => import("./pages/FabricPrintPage")),
  def("/mug-print", () => import("./pages/MugPrintPage")),
];

export const notFoundDef: RouteDef = def("*", () => import("./pages/NotFound"));

export const normalizePath = (p: string): string => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";

/** Start loading the chunk for a pathname (resolves once the module is available). */
export const preloadRoute = async (pathname: string): Promise<void> => {
  const target = normalizePath(pathname);
  const match = routeDefs.find((r) => r.path === target) ?? notFoundDef;
  const mod = (await match.load()) as { preload?: () => Promise<void> };
  // optional: route module may preload its own lazy sections; not awaited so hydration is not delayed
  // (React 18 keeps the server HTML of suspended boundaries until their chunks arrive)
  void mod.preload?.().catch(() => {});
};
