'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Clock, Calendar, Image as ImageIcon, Video, Info, Share2, Heart, Navigation } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import ShareButton from '@/components/ui/ShareButton';
import { cn } from '@/lib/utils';

interface Establishment {
  id: string;
  name: string;
  category: 'restaurant' | 'bar' | 'hotel' | 'lounge';
  address: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  phone?: string;
  hours?: string;
  isOpen?: boolean;
  isPremium?: boolean;
  description?: string;
  latitude?: number;
  longitude?: number;
}

interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  establishment: string;
  price: string;
  availablePlaces: number;
  totalPlaces: number;
  imageUrl: string;
}

interface EstablishmentDetailTabsProps {
  establishment: Establishment;
  images: string[];
  events: Event[];
}

type TabType = 'tout' | 'apropos' | 'photos' | 'videos' | 'evenements';

export default function EstablishmentDetailTabs({ 
  establishment, 
  images,
  events 
}: EstablishmentDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('tout');
  const [isFavorite, setIsFavorite] = useState(false);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'tout', label: 'Tout' },
    { id: 'apropos', label: 'À propos' },
    { id: 'photos', label: 'Photos' },
    { id: 'videos', label: 'Vidéos' },
    { id: 'evenements', label: 'Événements' },
  ];

  const handleCall = () => {
    if (establishment.phone) {
      window.location.href = `tel:${establishment.phone}`;
    }
  };

  const handleDirections = () => {
    if (establishment.latitude && establishment.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${establishment.latitude},${establishment.longitude}`,
        '_blank'
      );
    }
  };

  return (
    <div className="bg-white">
      {/* Image de couverture */}
      <div className="relative h-96 w-full">
        <ImageWithFallback
          src={establishment.imageUrl}
          alt={establishment.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Contenu principal */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec infos et boutons */}
        <div className="relative -mt-20 mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  {/* Logo/Avatar */}
                  <div className="w-24 h-24 rounded-full bg-dark flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg">
                    {establishment.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-dark mb-2">
                      {establishment.name}
                    </h1>
                    <p className="text-gray text-sm mb-2">
                      {establishment.reviewCount > 1000 ? `${(establishment.reviewCount / 1000).toFixed(1)}K` : establishment.reviewCount} vues
                    </p>
                    <Badge variant={establishment.category} className="uppercase">
                      {establishment.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-gray">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{establishment.address}, {establishment.neighborhood}</span>
                  </div>
                  {establishment.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{establishment.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleCall}
                  className="flex-1 md:flex-none"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler
                </Button>
                
                {/* <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all border-2",
                    isFavorite
                      ? "bg-red-50 border-red-500 text-red-500"
                      : "bg-gray-100 border-gray-200 text-gray-700 hover:border-primary"
                  )}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                </button> */}

                <ShareButton establishmentId={establishment.id} variant="outline" size="md" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation onglets style Facebook */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3 font-semibold transition-all whitespace-nowrap relative",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-sm"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="pb-12">
          {/* ONGLET TOUT */}
          {activeTab === 'tout' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sidebar gauche */}
              <div className="lg:col-span-1 space-y-6">
                {/* Détails */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-dark text-lg mb-4">Détails</h3>
                  
                  <div className="space-y-4">
                    {/* Note */}
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-gold" />
                      <div>
                        <p className="text-sm text-gray">Note</p>
                        <p className="font-semibold text-dark">
                          {establishment.rating}/5 · {establishment.reviewCount} avis
                        </p>
                      </div>
                    </div>

                    {/* Horaires */}
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray">Horaires</p>
                        <p className="font-semibold text-dark">
                          {establishment.hours || 'Lun-Sam: 08h-23h'}
                        </p>
                        {establishment.isOpen !== undefined && (
                          <p className={`text-sm font-semibold ${establishment.isOpen ? 'text-accent' : 'text-red-500'}`}>
                            {establishment.isOpen ? 'Ouvert' : 'Fermé'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Catégorie */}
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray">Catégorie</p>
                        <p className="font-semibold text-dark capitalize">{establishment.category}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coordonnées */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-dark text-lg mb-4">Coordonnées</h3>
                  
                  <div className="space-y-3">
                    {establishment.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <span className="text-dark">{establishment.phone}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-dark">{establishment.address}</p>
                        <p className="text-gray text-sm">{establishment.neighborhood}</p>
                      </div>
                    </div>
                  </div>

                  {establishment.latitude && establishment.longitude && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={handleDirections}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Itinéraire
                    </Button>
                  )}
                </div>

                {/* Photos aperçu */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-dark text-lg">Photos</h3>
                    <button 
                      onClick={() => setActiveTab('photos')}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Voir tout
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {images.slice(0, 6).map((image, index) => (
                      <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={image}
                          alt={`Photo ${index + 1}`}
                          fill
                          className="object-cover hover:scale-110 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contenu principal (À la une) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-dark text-lg mb-4">À propos</h3>
                  <p className="text-gray leading-relaxed">
                    {establishment.description || 
                      `Bienvenue chez ${establishment.name}, votre destination pour une expérience culinaire exceptionnelle à ${establishment.neighborhood}. Nous vous proposons un cadre chaleureux et convivial pour vos moments de détente.`
                    }
                  </p>
                </div>

                {/* Événements */}
                {events.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-dark text-lg">Événements à venir</h3>
                      <button 
                        onClick={() => setActiveTab('evenements')}
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        Voir tout
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {events.slice(0, 2).map((event) => (
                        <div key={event.id} className="border border-gray-200 rounded-xl p-4 hover:border-primary/30 transition-colors">
                          <h4 className="font-semibold text-dark mb-2">{event.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{event.date}</span>
                            </div>
                            <Badge variant="premium">{event.category}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-primary font-bold">{event.price}</span>
                            <Button size="sm" variant="primary">Réserver</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ONGLET À PROPOS */}
          {activeTab === 'apropos' && (
            <div className="max-w-3xl">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-dark mb-6">À propos de {establishment.name}</h2>
                <p className="text-gray leading-relaxed text-lg mb-6">
                  {establishment.description || 
                    `Bienvenue chez ${establishment.name}, votre destination pour une expérience culinaire exceptionnelle à ${establishment.neighborhood}. Nous vous proposons un cadre chaleureux et convivial pour vos moments de détente.`
                  }
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h3 className="font-semibold text-dark mb-2">Adresse</h3>
                    <p className="text-gray">{establishment.address}</p>
                    <p className="text-gray">{establishment.neighborhood}, Brazzaville</p>
                  </div>

                  {establishment.phone && (
                    <div>
                      <h3 className="font-semibold text-dark mb-2">Téléphone</h3>
                      <p className="text-gray">{establishment.phone}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-dark mb-2">Horaires</h3>
                    <p className="text-gray">{establishment.hours || 'Lun-Sam: 08h-23h · Dim: 10h-22h'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-dark mb-2">Note</h3>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-gold text-gold" />
                      <span className="text-dark font-semibold">{establishment.rating}/5</span>
                      <span className="text-gray">({establishment.reviewCount} avis)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET PHOTOS */}
          {activeTab === 'photos' && (
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative h-64 rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                    <ImageWithFallback
                      src={image}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ONGLET VIDÉOS */}
          {activeTab === 'videos' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Video className="w-16 h-16 text-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">Aucune vidéo disponible</h3>
              <p className="text-gray">Les vidéos seront bientôt disponibles.</p>
            </div>
          )}

          {/* ONGLET ÉVÉNEMENTS */}
          {activeTab === 'evenements' && (
            <div>
              {events.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold text-dark mb-6">Événements à venir</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold text-dark mb-3">{event.title}</h3>
                        <Badge variant="premium" className="mb-4">{event.category}</Badge>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date} · {event.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">{event.price}</span>
                            <span className="text-sm text-gray">
                              {event.availablePlaces}/{event.totalPlaces} places
                            </span>
                          </div>
                        </div>

                        <Button variant="primary" className="w-full">
                          Réserver maintenant
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-dark mb-2">Aucun événement</h3>
                  <p className="text-gray">Aucun événement prévu pour le moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}