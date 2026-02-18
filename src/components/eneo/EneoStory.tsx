import { Lightbulb, Rocket, Target } from 'lucide-react';

export default function EneoStory() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-6">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 font-semibold text-sm">Notre Histoire</span>
            </div>

            <h2 className="text-4xl font-bold text-dark mb-6">
              À l'origine de ZURY
            </h2>
            
            <div className="space-y-4 text-gray leading-relaxed">
              <p>
                <strong className="text-dark">Eneo Academy</strong> est bien plus qu'un simple centre de formation. 
                Nous sommes une équipe passionnée de formateurs et développeurs qui croient en la transformation 
                digitale du Congo.
              </p>
              
              <p>
                C'est dans nos locaux, lors d'un projet de formation pratique, que <strong className="text-dark">ZURY</strong> a 
                vu le jour. Nos étudiants en développement web ont identifié un besoin réel : faciliter la découverte 
                des établissements à Brazzaville et Pointe-Noire.
              </p>
              
              <p>
                Aujourd'hui, <strong className="text-dark">ZURY</strong> est devenu une plateforme utilisée par des milliers 
                de personnes, démontrant que l'excellence technique combinée à une vision locale peut créer des solutions 
                qui transforment notre quotidien.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-1">Notre Mission</h3>
                  <p className="text-sm text-gray">Former les talents tech de demain</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-1">Notre Vision</h3>
                  <p className="text-sm text-gray">Digitaliser le Congo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image / Visual */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                    EA
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-dark mb-2">Eneo Academy</h3>
                <p className="text-gray">Excellence • Innovation • Impact</p>
              </div>
            </div>
            
            {/* Badge decoratif */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-6 shadow-2xl">
              <div className="text-3xl font-bold">2024</div>
              <div className="text-sm opacity-90">Année de création</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}