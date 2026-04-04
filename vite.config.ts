import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import deferCss from "./vite-plugin-defer-css";
import sitemapLastmod from "./vite-plugin-sitemap-lastmod";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), deferCss()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
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
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'swiper'],
  },
}));
