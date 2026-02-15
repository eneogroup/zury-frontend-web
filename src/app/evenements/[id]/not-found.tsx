import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dark mb-4">404</h1>
        <p className="text-xl text-gray mb-8">Événement non trouvé</p>
        <Link href="/evenements">
          <Button variant="primary">Retour aux événements</Button>
        </Link>
      </div>
    </div>
  );
}