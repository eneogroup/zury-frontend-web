import { Eye, TrendingUp, Calendar, BarChart3, Star, Users } from 'lucide-react';

const benefits = [
  {
    icon: Eye,
    title: 'Visibilité maximale',
    description: 'Touchez des milliers d\'utilisateurs qui recherchent activement des établissements comme le vôtre.',
    color: 'text-primary',
  },
  {
    icon: TrendingUp,
    title: 'Augmentez votre fréquentation',
    description: 'Attirez de nouveaux clients et fidélisez votre clientèle grâce à une présence en ligne professionnelle.',
    color: 'text-accent',
  },
  {
    icon: Calendar,
    title: 'Gérez vos événements',
    description: 'Publiez et promouvez vos événements spéciaux, soirées thématiques et offres exclusives.',
    color: 'text-gold',
  },
  {
    icon: BarChart3,
    title: 'Statistiques en temps réel',
    description: 'Suivez les vues de votre profil, l\'engagement et l\'intérêt pour votre établissement.',
    color: 'text-primary',
  },
  {
    icon: Star,
    title: 'Avis et notations',
    description: 'Collectez des avis authentiques et construisez votre réputation en ligne.',
    color: 'text-gold',
  },
  {
    icon: Users,
    title: 'Communauté active',
    description: 'Rejoignez un réseau de professionnels de l\'HoReCa et partagez vos meilleures pratiques.',
    color: 'text-accent',
  },
];

export default function WhyJoinZury() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark mb-4">
            Pourquoi rejoindre ZURY ?
          </h2>
          <p className="text-xl text-gray max-w-3xl mx-auto">
            Une plateforme complète pour développer votre présence en ligne 
            et attirer plus de clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-light rounded-2xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${benefit.color.replace('text-', '')}/10 to-${benefit.color.replace('text-', '')}/5 flex items-center justify-center mb-6`}>
                <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}