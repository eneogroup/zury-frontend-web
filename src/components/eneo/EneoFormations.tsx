import { Code, Smartphone, Database, Globe, Palette, TrendingUp } from 'lucide-react';

const formations = [
  {
    icon: Globe,
    title: 'Développement Web',
    description: 'HTML, CSS, JavaScript, React, Next.js, Node.js',
    duration: '6 mois',
    level: 'Débutant à Avancé',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Smartphone,
    title: 'Développement Mobile',
    description: 'React Native, Flutter, iOS & Android',
    duration: '5 mois',
    level: 'Intermédiaire',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Database,
    title: 'Data Science & IA',
    description: 'Python, Machine Learning, Data Analysis',
    duration: '6 mois',
    level: 'Intermédiaire à Avancé',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Code,
    title: 'Programmation Python',
    description: 'Fondamentaux, Django, Flask, Automatisation',
    duration: '4 mois',
    level: 'Débutant',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Figma, Adobe XD, Design Thinking',
    duration: '4 mois',
    level: 'Débutant à Intermédiaire',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: TrendingUp,
    title: 'Marketing Digital',
    description: 'SEO, Social Media, Analytics, Publicité',
    duration: '3 mois',
    level: 'Débutant',
    color: 'from-indigo-500 to-blue-500',
  },
];

export default function EneoFormations() {
  return (
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark mb-4">
            Nos Formations Populaires
          </h2>
          <p className="text-xl text-gray max-w-3xl mx-auto">
            Des programmes complets, orientés pratique, avec des projets réels comme ZURY
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formations.map((formation, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${formation.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <formation.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-dark mb-3">
                {formation.title}
              </h3>

              <p className="text-gray mb-6 leading-relaxed">
                {formation.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray uppercase font-semibold mb-1">Durée</div>
                  <div className="text-sm font-bold text-dark">{formation.duration}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray uppercase font-semibold mb-1">Niveau</div>
                  <div className="text-sm font-bold text-dark">{formation.level}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray mb-4">
            Toutes nos formations incluent des projets pratiques, un suivi personnalisé et un certificat de fin de formation.
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-6 py-3">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-blue-800 font-semibold">Inscriptions ouvertes toute l'année</span>
          </div>
        </div>
      </div>
    </section>
  );
}