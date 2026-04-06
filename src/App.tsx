import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";

// Lazy load UI overlays - not needed for first paint
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

// Retry wrapper for lazy imports — retries up to 3 times on network failures
const lazyRetry = (fn: () => Promise<any>, retries = 3): Promise<any> =>
  fn().catch((err: any) => {
    if (retries > 0) {
      return new Promise(resolve => setTimeout(resolve, 500)).then(() => lazyRetry(fn, retries - 1));
    }
    // Force reload if all retries fail (stale chunk after deploy)
    window.location.reload();
    throw err;
  });

// Lazy load secondary pages with retry
const NotFound = lazy(() => lazyRetry(() => import("./pages/NotFound")));
const PublicOffer = lazy(() => lazyRetry(() => import("./pages/PublicOffer")));
const PrivacyPolicy = lazy(() => lazyRetry(() => import("./pages/PrivacyPolicy")));
const LinkInBio = lazy(() => lazyRetry(() => import("./pages/LinkInBio")));
const PricePage = lazy(() => lazyRetry(() => import("./pages/PricePage")));
const FAQPage = lazy(() => lazyRetry(() => import("./pages/FAQPage")));
const FabricPrintPage = lazy(() => lazyRetry(() => import("./pages/FabricPrintPage")));
const MugPrintPage = lazy(() => lazyRetry(() => import("./pages/MugPrintPage")));

const PageLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    <p className="text-sm text-muted-foreground animate-pulse">Загрузка...</p>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={null}>
      <Toaster />
      <Sonner />
    </Suspense>
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/public-offer" element={<PublicOffer />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/card" element={<LinkInBio />} />
          <Route path="/price" element={<PricePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/fabric-print" element={<FabricPrintPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
