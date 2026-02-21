import { transformEstablishmentList } from "@/lib/apiTransformers";
import { cachedEstablishmentService } from "@/lib/cached-api";
import { Link, Sparkles } from "lucide-react";
import EstablishmentCard from "../ui/EstablishmentCard";


export default async function EstablishmentSimilarSection({
    params,
}:{ 
  params: Promise<{ id: string }> 
}){
    const { id } = await params;
    let similarEstablishments: any[] = [];
    try {
        const response = await cachedEstablishmentService.getSimilar(id);
        const establishments = Array.isArray((response as any)?.similaires) ? (response as any).similaires : [];
        similarEstablishments = establishments
            .map(transformEstablishmentList)
            .slice(0, 4);
    } catch (error) {
        console.error('Error loading similar establishments:', error);
    }

    // Ne rien afficher si aucun établissement similaire
    if (similarEstablishments.length === 0) {
        return null;
    }
    return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-4xl font-bold text-white">
                Établissements similaires
              </h2>
            </div>
            <p className="text-lg text-white">
                Découvrez d'autres adresses qui pourraient vous plaire
            </p>
          </div>
        </div>

        {/* Grille d'établissements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarEstablishments.map((establishment: any, index: number) => (
            <div key={establishment.id} className="relative">

              <EstablishmentCard 
                establishment={establishment} 
                index={index}
              />
            </div>
          ))}
        </div>


        {/* Message si peu d'établissements */}
        {similarEstablishments.length > 0 && similarEstablishments.length < 8 && (
          <p className="text-center text-white mt-8">
            {similarEstablishments.length === 1 
              ? "1 établissement similaire" 
              : `${similarEstablishments.length} établissements similaires`}
          </p>
        )}
      </div>
    </section>
  );
}