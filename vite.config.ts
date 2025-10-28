import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
            '@radix-ui/react-select'
          ],
          'supabase': ['@supabase/supabase-js'],
          'utils': ['class-variance-authority', 'clsx', 'tailwind-merge'],
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: false, // Disable source maps in production for smaller bundles
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 4096, // Inline assets < 4kb as base64
  },
}));
