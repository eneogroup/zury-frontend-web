import { motion } from "framer-motion";
import {
  GraduationCap,
  Code,
  Award,
  Globe,
  Smartphone,
  Database,
  Palette,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const formations = [
  {
    icon: Globe,
    title: "Développement Web",
    description: "HTML, CSS, JavaScript, React, Next.js, Node.js",
    duration: "6 mois",
    level: "Débutant à Avancé",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Développement Mobile",
    description: "React Native, Flutter, iOS & Android",
    duration: "5 mois",
    level: "Intermédiaire",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Database,
    title: "Data Science & IA",
    description: "Python, Machine Learning, Data Analysis",
    duration: "6 mois",
    level: "Intermédiaire à Avancé",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Code,
    title: "Programmation Python",
    description: "Fondamentaux, Django, Flask, Automatisation",
    duration: "4 mois",
    level: "Débutant",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Figma, Adobe XD, Design Thinking",
    duration: "4 mois",
    level: "Débutant à Intermédiaire",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: TrendingUp,
    title: "Marketing Digital",
    description: "SEO, Social Media, Analytics, Publicité",
    duration: "3 mois",
    level: "Débutant",
    color: "from-indigo-500 to-blue-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const EneoAcademyPage = () => {
  return (
    <div className="min-h-screen bg-light">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GraduationCap className="w-5 h-5 text-cyan-300" />
              <span className="text-cyan-100 font-semibold">
                Centre de formation professionnelle
              </span>
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
              Centre de formation professionnelle basé à Brazzaville, spécialisé
              dans les technologies de l'information et à l'origine de la
              plateforme ZURY.
            </motion.p>

            <motion.div
              className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {[
                { icon: Code, number: "5+", label: "Formations" },
                { icon: Award, number: "10+", label: "Étudiants" },
                { icon: GraduationCap, number: "95%", label: "Satisfaction" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
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

      {/* Notre histoire */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-dark mb-6">
                Notre Histoire
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Eneo Academy est née d'une vision simple : rendre l'informatique
                accessible à tous les Congolais et former la prochaine
                génération de développeurs et de professionnels du numérique.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Fondée à Brazzaville, notre académie propose des formations
                pratiques, orientées vers les besoins réels du marché africain
                et international. Notre projet phare, ZURY, est un exemple
                concret de ce que nos étudiants construisent pendant leur
                formation.
              </p>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-dark">
                    ZURY — Notre projet vitrine
                  </p>
                  <p className="text-sm text-gray-500">
                    Créé par les étudiants d'Eneo Academy
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    title: "Formation pratique",
                    desc: "Projets réels, pas que de la théorie",
                  },
                  {
                    title: "Certifié",
                    desc: "Certificat reconnu à la fin de chaque formation",
                  },
                  {
                    title: "Emploi",
                    desc: "Accompagnement dans la recherche d'emploi",
                  },
                  {
                    title: "Communauté",
                    desc: "Réseau d'anciens étudiants actifs",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="bg-light rounded-2xl p-6"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Formations */}
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
              Nos Formations Populaires
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Des programmes complets, orientés pratique, avec des projets réels
              comme ZURY
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {formations.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all border border-gray-100 group"
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <f.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-dark mb-3">{f.title}</h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  {f.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-1">
                      Durée
                    </div>
                    <div className="text-sm font-bold text-dark">
                      {f.duration}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-1">
                      Niveau
                    </div>
                    <div className="text-sm font-bold text-dark">{f.level}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-gray-500 mb-4">
              Toutes nos formations incluent des projets pratiques, un suivi
              personnalisé et un certificat de fin de formation.
            </p>
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-6 py-3">
              <motion.span
                className="w-2 h-2 bg-blue-600 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-blue-800 font-semibold">
                Inscriptions ouvertes toute l'année
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-dark mb-4">
              Contactez-nous
            </h2>
            <p className="text-xl text-gray-500">
              Prêt à démarrer votre formation ? Contactez-nous !
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Phone,
                title: "Téléphone",
                value: "+242 06 123 45 67",
                href: "tel:+242061234567",
              },
              {
                icon: Mail,
                title: "Email",
                value: "contact@eneo-academy.cg",
                href: "mailto:contact@eneo-academy.cg",
              },
              {
                icon: MapPin,
                title: "Adresse",
                value: "Brazzaville, République du Congo",
                href: "#",
              },
            ].map(({ icon: Icon, title, value, href }, i) => (
              <motion.a
                key={i}
                href={href}
                className="flex flex-col items-center text-center p-8 bg-light rounded-2xl hover:shadow-lg transition-all group"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-dark mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
