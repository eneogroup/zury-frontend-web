import { Establishment, EstablishmentListItem, Event } from '@/types';

// Transformer les données API vers le format utilisé dans l'app
export function transformEstablishmentList(item: EstablishmentListItem | any) {
  // Normaliser la catégorie
  const categoryName = item.categorie_nom?.toLowerCase() || 'restaurant';
  let category: 'restaurant' | 'bar' | 'hotel' | 'lounge' = 'restaurant';
  
  if (categoryName.includes('bar')) category = 'bar';
  else if (categoryName.includes('hôtel') || categoryName.includes('hotel')) category = 'hotel';
  else if (categoryName.includes('lounge') || categoryName.includes('club')) category = 'lounge';

  return {
    id: item.id,
    name: item.nom,
    category,
    address: item.adresse,
    neighborhood: item.quartier_nom,
    rating: parseFloat(item.note_moyenne) || 0,
    reviewCount: item.nombre_avis || 0,
    imageUrl: item.image_principale || '/images/placeholder.jpg',
    latitude: item.latitude ? parseFloat(item.latitude) : undefined,
    longitude: item.longitude ? parseFloat(item.longitude) : undefined,
    isPremium: item.est_featured || false,
  };
}

export function transformEstablishmentDetail(item: Establishment | any) {
  const categoryName = item.categorie_nom?.toLowerCase() || 'restaurant';
  let category: 'restaurant' | 'bar' | 'hotel' | 'lounge' = 'restaurant';
  
  if (categoryName.includes('bar')) category = 'bar';
  else if (categoryName.includes('hôtel') || categoryName.includes('hotel')) category = 'hotel';
  else if (categoryName.includes('lounge') || categoryName.includes('club')) category = 'lounge';

  return {
    id: item.id,
    name: item.nom,
    category,
    address: item.adresse,
    neighborhood: item.quartier_nom,
    rating: parseFloat(item.note_moyenne) || 0,
    reviewCount: item.nombre_avis || 0,
    imageUrl: item.image_principale || '/images/placeholder.jpg',
    images: item.medias ? [item.image_principale || '/images/placeholder.jpg'] : [],
    phone: item.telephone,
    hours: formatHoraires(item.horaires),
    isOpen: checkIfOpen(item.horaires),
    isPremium: item.est_featured || false,
    description: item.description,
    latitude: item.latitude ? parseFloat(item.latitude) : undefined,
    longitude: item.longitude ? parseFloat(item.longitude) : undefined,
    email: item.email,
    website: item.site_web,
    facebook: item.facebook,
    instagram: item.instagram,
    tags: item.tags,
  };
}

export function transformEvent(event: Event | any) {
  const dateDebut = new Date(event.date_debut);
  const dateFin = new Date(event.date_fin);

  return {
    id: event.id,
    title: event.titre,
    category: event.type_event_display || event.type_event || 'Événement',
    date: formatDate(dateDebut),
    time: formatTime(dateDebut),
    establishment: event.etablissement?.nom || '',
    establishmentId: event.etablissement?.id,
    price: event.est_gratuit ? 'Gratuit' : `${parseInt(event.prix || '0')} FCFA`,
    availablePlaces: event.places_disponibles || 0,
    totalPlaces: event.nb_places_total || 0,
    imageUrl: event.affiche_url || '/images/placeholder-event.jpg',
    description: event.description,
    dateDebut: event.date_debut,
    dateFin: event.date_fin,
    isComplete: event.est_complet || false,
  };
}

// Helpers
function formatHoraires(horaires: any): string {
  if (!horaires) return '';
  // Format : "Lun-Sam: 08h-23h"
  return 'Lun-Sam: 08h-23h · Dim: 10h-22h';
}

function checkIfOpen(horaires: any): boolean {
  // Logique pour vérifier si ouvert maintenant
  const now = new Date();
  const currentHour = now.getHours();
  return currentHour >= 8 && currentHour < 23;
}

function formatDate(date: Date): string {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function formatTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;
}