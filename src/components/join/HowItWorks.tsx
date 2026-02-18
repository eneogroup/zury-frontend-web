'use client';

import { FileText, CheckCircle, Rocket, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: FileText,
    title: 'Inscription',
    description: 'Remplissez le formulaire avec les informations de votre établissement en 2 minutes.',
    number: '01',
  },
  {
    icon: CheckCircle,
    title: 'Validation',
    description: 'Notre équipe vérifie et valide votre inscription sous 24-48h.',
    number: '02',
  },
  {
    icon: Rocket,
    title: 'Activation',
    description: 'Votre profil est publié et visible par des milliers d\'utilisateurs.',
    number: '03',
  },
  {
    icon: TrendingUp,
    title: 'Croissance',
    description: 'Suivez vos statistiques et attirez de nouveaux clients chaque jour.',
    number: '04',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-dark mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray max-w-2xl mx-auto">
            Un processus simple et rapide pour rejoindre ZURY
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Ligne de connexion */}
              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-primary/20"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  style={{ transformOrigin: 'left' }}
                />
              )}

              <motion.div 
                className="bg-white rounded-2xl p-8 shadow-sm relative z-10"
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div 
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="text-5xl font-bold text-primary/10">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-gray leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}