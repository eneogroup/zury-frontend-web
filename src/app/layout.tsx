import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/lib/metadata";
import { OrganizationJsonLd, SearchActionJsonLd } from '@/components/seo/JsonLd';
// import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
// import PrefetchController from '@/components/PrefetchController';
import Script from 'next/script';

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  // ... metadata existante
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://zury-backend-production.up.railway.app" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Preconnect */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://zury-backend-production.up.railway.app" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <OrganizationJsonLd />
        <SearchActionJsonLd />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        {/* Google Maps Script */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker`}
          strategy="beforeInteractive"
        />
        
        {/* <GoogleAnalytics />
        <PrefetchController /> */}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}