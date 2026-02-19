import { Metadata } from 'next';

const siteConfig = {
  name: 'ZURY',
  description: 'Découvrez les meilleurs restaurants, bars, hôtels et événements à Brazzaville et Pointe-Noire',
  url: 'https://zury-web.vercel.app', // Mettre l'URL de production
  ogImage: '/og-image.jpg', // Image par défaut pour partage social
  keywords: [
    'restaurants Brazzaville',
    'bars Brazzaville',
    'hôtels Brazzaville',
    'événements Brazzaville',
    'sorties Brazzaville',
    'HoReCa Congo',
    'restaurants Pointe-Noire',
    'vie nocturne Congo',
  ],
};

export function generateSiteMetadata({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaKeywords = keywords || siteConfig.keywords;
  const metaOgImage = ogImage || `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords.join(', '),
    authors: [{ name: 'Eneo Academy' }],
    creator: 'Eneo Academy',
    publisher: 'ZURY',
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      type: ogType,
      locale: 'fr_FR',
      url: siteConfig.url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaOgImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaOgImage],
      creator: '@zury_cg',
    },
    alternates: {
      canonical: siteConfig.url,
    },
  };
}

export { siteConfig };