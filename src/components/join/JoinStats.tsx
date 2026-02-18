export default function JoinStats() {
  const stats = [
    { number: '50+', label: 'Établissements partenaires' },
    { number: '1200+', label: 'Utilisateurs actifs' },
    { number: '10+', label: 'Événements par mois' },
    { number: '5000+', label: 'Vues mensuelles' },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-white/80 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}