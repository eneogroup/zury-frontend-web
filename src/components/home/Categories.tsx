'use client';

import { UtensilsCrossed, Wine, Hotel, Cake } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  { 
    name: 'Hôtel', 
    icon: Hotel, 
    slug: 'hotel', 
    gradient: 'from-accent to-accent/10',
    image: 'https://media-cdn.tripadvisor.com/media/photo-s/2e/3b/29/4b/caption.jpg'
  },
  { 
    name: 'Restaurant', 
    icon: UtensilsCrossed, 
    slug: 'restaurant', 
    gradient: 'from-primary to-primary/10',
    image: 'https://www.olympic-palace-hotel.net/assets/img/oph_oriental1.jpg'
  },
  { 
    name: 'Bar/Lounge', 
    icon: Wine, 
    slug: 'bar', 
    gradient: 'from-gold to-gold/10',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/07/b2/3b/vue-d-ensemble-du-pichichi.jpg?w=1200&h=-1&s=1'
  },
  { 
    name: 'Patisserie', 
    icon: Cake, 
    slug: 'lounge', 
    gradient: 'from-dark to-dark/10',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/1c/3d/82/photo0jpg.jpg?w=900&h=500&s=1'
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Categories() {
  return (
    <section className="py-16 mt-20 bg-dark/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-white mb-10"
        >
          Catégories
        </motion.h2>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.slug}
                variants={item}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/explorer`}
                  className="group block"
                >
                  <div className="relative rounded-2xl p-8 md:p-10 text-center overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-48">
                    {/* Image de fond */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{ backgroundImage: `url(${category.image})` }}
                    />
                    
                    {/* Overlay dégradé */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} group-hover:opacity-90 transition-opacity duration-300`} />
                    
                    {/* Effet de brillance au hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    
                    {/* Contenu */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                      <Icon className="w-14 h-14 md:w-16 md:h-16 mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                      <h3 className="text-lg md:text-xl font-bold drop-shadow-md">{category.name}</h3>
                    </div>

                    {/* Decorations */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}