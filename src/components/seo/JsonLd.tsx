export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZURY',
    alternateName: 'ZURY Congo',
    description: 'Plateforme HoReCa pour découvrir les meilleurs restaurants, bars, hôtels et événements à Brazzaville et Pointe-Noire',
    url: 'https://zury-web.vercel.app',
    logo: 'https://zury-web.vercel.app/logo.png',
    foundingDate: '2024',
    founders: [
      {
        '@type': 'Organization',
        name: 'Eneo Academy',
        url: 'https://eneogroup.cg',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CG',
      addressLocality: 'Brazzaville',
      addressRegion: 'Brazzaville',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@zury.cg',
      availableLanguage: ['French'],
    },
    sameAs: [
      // Ajouter tes réseaux sociaux ici
      // 'https://facebook.com/zury',
      // 'https://instagram.com/zury_cg',
      // 'https://twitter.com/zury_cg',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function RestaurantJsonLd({ establishment }: { establishment: any }) {
  // Déterminer le type Schema.org selon la catégorie
  let schemaType = 'Restaurant';
  
  if (establishment.categorie?.toLowerCase().includes('bar')) {
    schemaType = 'BarOrPub';
  } else if (establishment.categorie?.toLowerCase().includes('hôtel') || establishment.categorie?.toLowerCase().includes('hotel')) {
    schemaType = 'Hotel';
  } else if (establishment.categorie?.toLowerCase().includes('lounge')) {
    schemaType = 'NightClub';
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: establishment.nom,
    description: establishment.description,
    image: establishment.imageUrl || establishment.images?.[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: establishment.adresse,
      addressLocality: establishment.quartier || 'Brazzaville',
      addressRegion: 'Brazzaville',
      addressCountry: 'CG',
    },
    geo: establishment.latitude && establishment.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: establishment.latitude,
      longitude: establishment.longitude,
    } : undefined,
    telephone: establishment.telephone,
    email: establishment.email,
    url: establishment.siteWeb,
    priceRange: establishment.priceRange || '$$',
    servesCuisine: establishment.categorie,
    openingHoursSpecification: establishment.horaires?.map((horaire: any) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: horaire.jour,
      opens: horaire.ferme ? undefined : horaire.ouverture,
      closes: horaire.ferme ? undefined : horaire.fermeture,
    })),
    aggregateRating: establishment.note ? {
      '@type': 'AggregateRating',
      ratingValue: establishment.note,
      bestRating: 5,
      worstRating: 1,
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
    endDate: event.dateFin || event.dateDebut,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.lieu,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Brazzaville',
        addressRegion: 'Brazzaville',
        addressCountry: 'CG',
      },
    },
    organizer: event.etablissement ? {
      '@type': 'Organization',
      name: event.etablissement,
    } : {
      '@type': 'Organization',
      name: 'ZURY',
    },
    offers: event.prix ? {
      '@type': 'Offer',
      price: event.prix,
      priceCurrency: 'XAF',
      availability: event.placesDisponibles > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/SoldOut',
      validFrom: new Date().toISOString(),
    } : undefined,
    performer: event.artiste ? {
      '@type': 'PerformingGroup',
      name: event.artiste,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Nouveau : Breadcrumb JSON-LD
export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Nouveau : SearchAction JSON-LD pour la barre de recherche
export function SearchActionJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://zury-web.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://zury-web.vercel.app/explorer?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}