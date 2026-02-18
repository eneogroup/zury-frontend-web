import { Metadata } from 'next';
import { generateSiteMetadata } from '@/lib/metadata';
import EneoHero from '@/components/eneo/EneoHero';
import EneoStory from '@/components/eneo/EneoStory';
import EneoFormations from '@/components/eneo/EneoFormations';
import EneoContact from '@/components/eneo/EneoContact';
import EneoLocation from '@/components/eneo/EneoLocation';

export const metadata: Metadata = generateSiteMetadata({
  title: 'Eneo Academy - Centre de formation en Informatique',
  description: 'Eneo Academy est un centre de formation professionnelle en informatique à Brazzaville. Formations en développement web, mobile, data science et plus.',
  keywords: [
    'formation informatique Brazzaville',
    'école développement web Congo',
    'Eneo Academy',
    'formation professionnelle Congo',
    'développeur web Brazzaville',
    'data science Congo',
  ],
});


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