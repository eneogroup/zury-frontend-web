import { establishmentService } from '@/lib/api';

const BASE_URL = 'https://zury-web.vercel.app';

export async function GET() {
  try {
    const response = await establishmentService.getAll({ 
      page: 1, 
      page_size: 1000 
    });
    
    const establishments = response.results || response || [];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${establishments.map((establishment: any) => `
        <url>
          <loc>${BASE_URL}/establishments/${establishment.id}</loc>
          <lastmod>${establishment.date_modification 
            ? new Date(establishment.date_modification).toISOString() 
            : new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating establishments sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}