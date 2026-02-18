'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, BarChart3, Rocket, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const benefits = [
  {
    icon: Users,
    text: 'Des milliers d\'utilisateurs',
  },
  {
    icon: TrendingUp,
    text: 'Augmentez votre visibilité',
  },
  {
    icon: BarChart3,
    text: 'Statistiques en temps réel',
  },
  {
    icon: Rocket,
    text: 'Inscription gratuite',
  },
];

export default function JoinZuryCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-dark"></div>
      
      {/* Motifs décoratifs */}
      <motion.div 
        className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Rocket className="w-4 h-4 text-gold" />
              <span className="text-white/90 font-semibold text-sm">Pour les professionnels</span>
            </motion.div>

            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Vous êtes propriétaire d'un établissement ?
            </motion.h2>

            <motion.p 
              className="text-xl text-white/90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Rejoignez ZURY et développez votre visibilité auprès de milliers de clients potentiels à Brazzaville et Pointe-Noire !
            </motion.p>

            {/* Avantages en grille */}
            <motion.div 
              className="grid grid-cols-2 gap-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium text-sm">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/rejoindre-zury" className="flex-1">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-white text-primary hover:bg-white/90 shadow-2xl"
                >
                  Rejoindre ZURY
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/rejoindre-zury" className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-white text-white hover:bg-white hover:text-primary"
                >
                  En savoir plus
                </Button>
              </Link>
            </motion.div>

            {/* Badge gratuit */}
            <motion.div 
              className="mt-6 inline-flex items-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.span 
                className="w-2 h-2 bg-accent rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white/80 text-sm">100% Gratuit • Inscription en 2 minutes</span>
            </motion.div>
          </motion.div>

          {/* Visuel illustratif */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Cards flottantes avec stats */}
              <motion.div 
                className="absolute top-0 right-0 bg-white rounded-2xl p-6 shadow-2xl w-64"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark">1200+</p>
                    <p className="text-sm text-gray">Utilisateurs actifs</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute top-32 left-0 bg-white rounded-2xl p-6 shadow-2xl w-64"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark">+250%</p>
                    <p className="text-sm text-gray">Visibilité moyenne</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute bottom-0 right-12 bg-white rounded-2xl p-6 shadow-2xl w-64"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark">5000+</p>
                    <p className="text-sm text-gray">Vues par mois</p>
                  </div>
                </div>
              </motion.div>

              {/* Élément central décoratif */}
              <motion.div 
                className="relative z-10 w-80 h-80 mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full backdrop-blur-sm"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}