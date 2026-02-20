'use client';

import { GraduationCap, Code, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EneoHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 overflow-hidden">
      {/* Motif de fond animé */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
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
          className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"
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
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GraduationCap className="w-5 h-5 text-cyan-300" />
            <span className="text-cyan-100 font-semibold">Centre de formation professionnelle</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
              Eneo Academy
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Votre parcours vers l'excellence en informatique
          </motion.p>
          
          <motion.p 
            className="text-lg text-white/70 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Centre de formation professionnelle basé à Brazzaville, 
            spécialisé dans les technologies de l'information et à l'origine de la plateforme ZURY.
          </motion.p>

          {/* Mini stats avec animation stagger */}
          <motion.div 
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { icon: Code, number: '5+', label: 'Formations' },
              { icon: Award, number: '10+', label: 'Étudiants' },
              { icon: GraduationCap, number: '95%', label: 'Satisfaction' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="w-8 h-8 text-cyan-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stat.number}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}