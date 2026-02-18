import { GraduationCap, Code, Award } from 'lucide-react';

export default function EneoHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 overflow-hidden">
      {/* Motif de fond */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <GraduationCap className="w-5 h-5 text-cyan-300" />
            <span className="text-cyan-100 font-semibold">Centre de formation professionnelle</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
              Eneo Academy
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-4">
            Votre parcours vers l'excellence en informatique
          </p>
          
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            Centre de formation professionnelle basé à Brazzaville, 
            spécialisé dans les technologies de l'information et à l'origine de la plateforme ZURY.
          </p>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Code className="w-8 h-8 text-cyan-300 mx-auto mb-2" />
              <div className="text-2xl font-bold">5+</div>
              <div className="text-sm text-white/70">Formations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Award className="w-8 h-8 text-cyan-300 mx-auto mb-2" />
              <div className="text-2xl font-bold">200+</div>
              <div className="text-sm text-white/70">Étudiants</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <GraduationCap className="w-8 h-8 text-cyan-300 mx-auto mb-2" />
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-white/70">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}