import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dark mb-4">404</h1>
        <p className="text-xl text-gray mb-8">Établissement non trouvé</p>
        <Link href="/explorer">
          <Button variant="primary">Retour à l'exploration</Button>
        </Link>
      </div>
    </div>
  );
}