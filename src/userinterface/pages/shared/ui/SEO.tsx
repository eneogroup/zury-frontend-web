import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description?: string
  keywords?: string
  image?: string
  url?: string
}

export default function SEO({ 
  title, 
  description = 'Découvrez les meilleurs restaurants, bars, hôtels et événements de Brazzaville et Pointe-Noire avec Zury Congo.',
  keywords = 'Zury, Zury Congo, Sortir à Brazzaville, Sortir à Pointe-Noire',
  image = 'https://zury-web.vercel.app/logo.png',
  url = 'https://zury-web.vercel.app'
}: SEOProps) {
  return (
    <Helmet>
      {/* Standard */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  )
}
