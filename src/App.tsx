import { lazy, Suspense, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { routeDefs, notFoundDef } from "./routes";

// Lazy load UI overlays - not needed for first paint
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="drop-loader" aria-label="Загрузка" role="status" />
  </div>
);

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  });

const queryClient = createQueryClient();

/** Router-agnostic app body, shared by the browser entry and the prerender entry. */
export const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {routeDefs.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<notFoundDef.Component />} />
      </Routes>
    </Suspense>
  </>
);

export const AppProviders = ({ client, children }: { client: QueryClient; children: ReactNode }) => (
  <QueryClientProvider client={client}>
    <Suspense fallback={null}>
      <Toaster />
      <Sonner />
    </Suspense>
    {children}
  </QueryClientProvider>
);

const App = () => (
  <AppProviders client={queryClient}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AppProviders>
);

export default App;
