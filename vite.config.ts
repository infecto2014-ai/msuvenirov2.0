import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import deferCss from "./vite-plugin-defer-css";
import sitemapLastmod from "./vite-plugin-sitemap-lastmod";

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), deferCss(), sitemapLastmod()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // SSR bundle (used only by scripts/prerender.mjs) must not copy public/ again
    copyPublicDir: !isSsrBuild,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild ? undefined : (id: string) => {
          // React core — small, cached long-term
          if (id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }
          // Swiper is heavy — isolate for lazy-loaded sections only
          if (id.includes('swiper')) {
            return 'swiper';
          }
          // Supabase — only needed by reviews & order form
          if (id.includes('@supabase')) {
            return 'supabase';
          }
          // Let radix components split naturally with their consuming chunks
          // instead of forcing them into one big bundle
        },
      },
    },
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: mode === 'development',
  },
  ssr: {
    // CJS-only package: Node 18 (production server) can't resolve its named ESM exports,
    // so bundle it into the SSR build instead of importing it at runtime
    noExternal: ['react-helmet-async'],
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'swiper'],
  },
}));
