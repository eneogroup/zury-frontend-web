import JoinZuryHero from '@/components/join/JoinZuryHero';
import WhyJoinZury from '@/components/join/WhyJoinZury';
import HowItWorks from '@/components/join/HowItWorks';
import JoinStats from '@/components/join/JoinStats';
import JoinCTA from '@/components/join/JoinCTA';

export const metadata = {
  title: 'Rejoignez ZURY - Développez votre visibilité',
  description: 'Inscrivez votre établissement sur ZURY et touchez des milliers de clients potentiels à Brazzaville et Pointe-Noire.',
};

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