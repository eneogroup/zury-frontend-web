import EneoHero from '@/components/eneo/EneoHero';
import EneoStory from '@/components/eneo/EneoStory';
import EneoFormations from '@/components/eneo/EneoFormations';
import EneoContact from '@/components/eneo/EneoContact';
import EneoLocation from '@/components/eneo/EneoLocation';

export const metadata = {
  title: 'Eneo Academy - Centre de formation en Informatique',
  description: 'Eneo Academy est un centre de formation professionnelle en informatique basé à Brazzaville, à l\'origine de la plateforme ZURY.',
};

export default function EneoAcademyPage() {
  return (
    <div className="min-h-screen bg-light">
      <EneoHero />
      <EneoStory />
      <EneoFormations />
      <EneoContact />
      <EneoLocation />
    </div>
  );
}