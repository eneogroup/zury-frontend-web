'use client';

import { Lightbulb, Rocket, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EneoStory() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 font-semibold text-sm">Notre Histoire</span>
            </motion.div>

            <h2 className="text-4xl font-bold text-dark mb-6">
              À l'origine de ZURY
            </h2>
            
            <div className="space-y-4 text-gray leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <strong className="text-dark">Eneo Academy</strong> est bien plus qu'un simple centre de formation. 
                Nous sommes une équipe passionnée de formateurs et développeurs qui croient en la transformation 
                digitale du Congo.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                C'est dans nos locaux, lors d'un projet de formation pratique, que <strong className="text-dark">ZURY</strong> a 
                vu le jour. Nos étudiants en développement web ont identifié un besoin réel : faciliter la découverte 
                des établissements HoReCa à Brazzaville et Pointe-Noire.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Aujourd'hui, <strong className="text-dark">ZURY</strong> est devenu une plateforme utilisée par des milliers 
                de personnes, démontrant que l'excellence technique combinée à une vision locale peut créer des solutions 
                qui transforment notre quotidien.
              </motion.p>
            </div>

            <motion.div 
              className="mt-8 grid grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-1">Notre Mission</h3>
                  <p className="text-sm text-gray">Former les talents tech de demain</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-1">Notre Vision</h3>
                  <p className="text-sm text-gray">Digitaliser le Congo</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image / Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center p-8">
                <motion.div 
                  className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                    EA
                  </span>
                </motion.div>
                <h3 className="text-2xl font-bold text-dark mb-2">Eneo Academy</h3>
                <p className="text-gray">Excellence • Innovation • Impact</p>
              </div>
            </motion.div>
            
            {/* Badge decoratif */}
            <motion.div 
              className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0, rotate: -45 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="text-3xl font-bold">2020</div>
              <div className="text-sm opacity-90">Année de création</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}