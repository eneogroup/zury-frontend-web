export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZURY',
    description: 'Plateforme HoReCa pour Brazzaville et Pointe-Noire',
    url: 'https://zury-web.vercel.app',
    logo: 'https://zury-web.vercel.app/logo.png',
    foundingDate: '2024',
    founders: [
      {
        '@type': 'Organization',
        name: 'Eneo Academy',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CG',
      addressLocality: 'Brazzaville',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@zury.cg',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function RestaurantJsonLd({ establishment }: { establishment: any }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: establishment.nom,
    description: establishment.description,
    image: establishment.imageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: establishment.adresse,
      addressLocality: establishment.quartier || 'Brazzaville',
      addressCountry: 'CG',
    },
    telephone: establishment.telephone,
    servesCuisine: establishment.categorie,
    aggregateRating: establishment.note ? {
      '@type': 'AggregateRating',
      ratingValue: establishment.note,
      ratingCount: establishment.nombreAvis || 1,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function EventJsonLd({ event }: { event: any }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.titre,
    description: event.description,
    image: event.imageUrl,
    startDate: event.dateDebut,
    endDate: event.dateFin,
    location: {
      '@type': 'Place',
      name: event.lieu,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Brazzaville',
        addressCountry: 'CG',
      },
    },
    offers: event.prix ? {
      '@type': 'Offer',
      price: event.prix,
      priceCurrency: 'XAF',
      availability: 'https://schema.org/InStock',
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}