import { MetadataRoute } from 'next';

const BASE_URL = 'https://zury-web.vercel.app';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production';

  // En développement/staging, bloquer tous les robots
  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${BASE_URL}/sitemap.xml`,
    };
  }

  // En production, configuration optimisée
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/*.json$',        // Bloquer les fichiers JSON
          '/*?*sort=*',      // Bloquer les URLs avec paramètres de tri
          '/*?*page=*&*',    // Bloquer les URLs paginées avec multiples params
        ],
        crawlDelay: 1,       // Délai entre les requêtes (optionnel)
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
        crawlDelay: 0,       // Pas de délai pour Google
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
        crawlDelay: 1,
      },
      // Bloquer les crawlers IA
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
      // Bloquer les scrapers connus
      {
        userAgent: 'SemrushBot',
        crawlDelay: 10,
      },
      {
        userAgent: 'AhrefsBot',
        crawlDelay: 10,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}