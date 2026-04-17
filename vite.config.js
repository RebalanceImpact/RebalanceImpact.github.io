import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap';
import { articles } from './src/data/articleContent.js';


// 1. Map through your data file to get all the article slugs
const articleRoutes = articles.map(article => `/insights/${article.slug}`);

const coreRoutes = [
  '/',
  '/about-us',
  '/esg-services',
  '/sustainable-reporting',
  '/data-kpis',
  '/news-media',
  '/new-to-esg-reporting'
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    Sitemap({
      hostname: 'https://www.rebalanceimpact.com',
      dynamicRoutes: [...coreRoutes, ...articleRoutes], // Combine core routes with article routes
      outDir: 'dist',
      generateRobotsTxt: true,
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
