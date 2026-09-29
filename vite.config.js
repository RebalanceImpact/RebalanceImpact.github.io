import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { articles } from './src/data/articleContent.js';


const SITE_URL = 'https://www.rebalanceimpact.com';

const coreRoutes = [
  '/',
  '/about-us/',
  '/esg-services/',
  '/sustainable-reporting/',
  '/data-kpis/',
  '/news-media/',
  '/new-to-esg-reporting/',
];

// Article routes come from the data file so new articles are picked up automatically.
// URLs use trailing slashes to match the canonical tags and the prerendered folders.
const articleRoutes = articles.map(article => ({
  path: `/insights/${article.slug}/`,
  lastmod: article.datePublished,
}));

// Emits dist/sitemap.xml. Kept in-house (rather than vite-plugin-sitemap) so URLs
// match the canonical URLs exactly and /404 or duplicate entries never appear.
function sitemapPlugin() {
  return {
    name: 'rebalance-sitemap',
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const entries = [
        ...coreRoutes.map(path => ({ path, lastmod: today })),
        ...articleRoutes,
      ];
      const urls = entries
        .map(({ path, lastmod }) => [
          '  <url>',
          `    <loc>${SITE_URL}${path}</loc>`,
          `    <lastmod>${lastmod}</lastmod>`,
          '  </url>',
        ].join('\n'))
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          urls,
          '</urlset>',
          '',
        ].join('\n'),
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    sitemapPlugin(),
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
