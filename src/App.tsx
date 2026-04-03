import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

// Lazy load UI overlays - not needed for first paint
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

// Lazy load secondary pages
const NotFound = lazy(() => import("./pages/NotFound"));
const PublicOffer = lazy(() => import("./pages/PublicOffer"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const LinkInBio = lazy(() => import("./pages/LinkInBio"));
const PricePage = lazy(() => import("./pages/PricePage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
