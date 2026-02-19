import JoinZuryHero from '@/components/join/JoinZuryHero';
import WhyJoinZury from '@/components/join/WhyJoinZury';
import HowItWorks from '@/components/join/HowItWorks';
import JoinStats from '@/components/join/JoinStats';
import JoinCTA from '@/components/join/JoinCTA';
import { Metadata, Viewport } from 'next';
import { generateSiteMetadata } from '@/lib/metadata';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = generateSiteMetadata({
  title: 'Rejoignez ZURY - Développez votre visibilité',
  description: 'Inscrivez votre restaurant, bar ou hôtel sur ZURY et touchez des milliers de clients potentiels à Brazzaville et Pointe-Noire. Inscription 100% gratuite.',
  keywords: [
    'inscription restaurant Brazzaville',
    'référencer mon établissement',
    'partenaire ZURY',
    'visibilité restaurant Congo',
    'marketing restaurant Brazzaville',
  ],
});

export default function RejoindreZuryPage() {
  return (
    <div className="min-h-screen bg-light">
      <JoinZuryHero />
      <WhyJoinZury />
      <JoinStats />
      <HowItWorks />
      <JoinCTA />
    </div>
  );
}