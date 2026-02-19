export default function EneoLocation() {
  return (
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-dark mb-4">
            Où nous trouver
          </h2>
          <p className="text-xl text-gray">
            Venez nous rendre visite à Brazzaville
          </p>
        </div>

        {/* Google Maps Placeholder */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-2xl font-bold text-dark mb-2">Carte Google Maps</h3>
              <p className="text-gray">
                Intégration de la carte à venir
              </p>
              <p className="text-sm text-gray mt-4">
                115 bis avenue Boueta Mbongo, Moungali, <br />
                Brazzaville, République du Congo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}