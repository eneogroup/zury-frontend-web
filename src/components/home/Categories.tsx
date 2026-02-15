'use client';

import { UtensilsCrossed, Wine, Hotel, Sofa } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Restaurant', icon: UtensilsCrossed, slug: 'restaurant', color: 'bg-primary' },
  { name: 'Bar', icon: Wine, slug: 'bar', color: 'bg-gold' },
  { name: 'Hôtel', icon: Hotel, slug: 'hotel', color: 'bg-accent' },
  { name: 'Lounge', icon: Sofa, slug: 'lounge', color: 'bg-dark' },
];

export default function Categories() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-dark mb-8">Catégories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/explorer?category=${category.slug}`}
                className="group"
              >
                <div className={`${category.color} text-white rounded-lg p-6 text-center hover:scale-105 transition-transform duration-300 shadow-md`}>
                  <Icon className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}