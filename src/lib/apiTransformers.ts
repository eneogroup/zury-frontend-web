// Transformer les données API vers le format utilisé dans l'app

export function transformEstablishmentList(item: any) {
  // Normaliser la catégorie - gérer nom ou ID
  const categoryName = item.categorie_nom?.toLowerCase() || 
                       item.categorie?.toLowerCase() || 
                       'restaurant';
  
  let category: 'restaurant' | 'bar' | 'hotel' | 'lounge' = 'restaurant';
  
  if (categoryName.includes('bar')) category = 'bar';
  else if (categoryName.includes('hôtel') || categoryName.includes('hotel')) category = 'hotel';
  else if (categoryName.includes('lounge') || categoryName.includes('club') || categoryName.includes('discothèque')) category = 'lounge';

  return {
    id: item.id,
    name: item.nom,
    category,
    address: item.adresse,
    neighborhood: item.quartier_nom || item.quartier || '',
    rating: parseFloat(item.note_moyenne) || 0,
    reviewCount: item.nombre_avis || 0,
    imageUrl: item.image_principale || '/images/placeholder.jpg',
    latitude: item.latitude ? parseFloat(item.latitude.toString()) : undefined,
    longitude: item.longitude ? parseFloat(item.longitude.toString()) : undefined,
    isPremium: item.est_featured || false,
  };
}

export function transformEstablishmentDetail(item: any) {
  const categoryName = item.categorie?.nom?.toLowerCase() || item.categorie?.toLowerCase() || 'restaurant';
  let category: 'restaurant' | 'bar' | 'hotel' | 'lounge' = 'restaurant';
  
  if (categoryName.includes('bar')) category = 'bar';
  else if (categoryName.includes('hôtel') || categoryName.includes('hotel')) category = 'hotel';
  else if (categoryName.includes('lounge') || categoryName.includes('club') || categoryName.includes('discothèque')) category = 'lounge';

  // Extraire les images depuis medias
  const images: string[] = [];
  if (item.medias && Array.isArray(item.medias)) {
    item.medias.forEach((media: any) => {
      if (media.type === 'IMAGE' && media.url) {
        images.push(media.url);
      }
    });
  }
  
  // Ajouter l'image principale si pas déjà présente
  if (item.image_principale && !images.includes(item.image_principale)) {
    images.unshift(item.image_principale);
  }

  // S'assurer qu'il y a au moins une image
  if (images.length === 0) {
    images.push('/images/placeholder.jpg');
  }

  return {
    id: item.id,
    name: item.nom,
    category,
    address: item.adresse,
    neighborhood: item.quartier?.nom || item.quartier,
    rating: parseFloat(item.note_moyenne) || 0,
    reviewCount: item.nombre_avis || 0,
    imageUrl: item.image_principale || '/images/placeholder.jpg',
    images,
    phone: item.telephone,
    hours: formatHoraires(item.horaires),
    isOpen: false, // Sera mis à jour par l'API statut_ouverture
    isPremium: item.est_featured || false,
    description: item.description,
    latitude: item.latitude ? parseFloat(item.latitude.toString()) : undefined,
    longitude: item.longitude ? parseFloat(item.longitude.toString()) : undefined,
    email: item.email,
    website: item.site_web,
    facebook: item.facebook,
    instagram: item.instagram,
    tags: item.tags || [],
  };
}

export function transformEvent(event: any) {
  const dateDebut = new Date(event.date_debut);
  const dateFin = new Date(event.date_fin);

  return {
    id: event.id,
    title: event.titre,
    category: event.type_event_display || event.type_event || 'Événement',
    date: formatDate(dateDebut),
    time: formatTime(dateDebut),
    establishment: event.etablissement_nom || event.etablissement?.nom || '',
    establishmentId: event.etablissement_id || event.etablissement?.id,
    price: event.est_gratuit ? 'Gratuit' : `${parseInt(event.prix || '0')} FCFA`,
    availablePlaces: event.places_disponibles || 0,
    totalPlaces: event.nb_places_total || 0,
    imageUrl: event.affiche_complete || '/images/placeholder-event.jpg',
    description: event.description,
    dateDebut: event.date_debut,
    dateFin: event.date_fin,
    isComplete: event.est_complet || false,
  };
}

// Helpers
function formatHoraires(horaires: any): string {
  if (!horaires) return '';
  
  // L'API retourne un objet type: { "lundi-vendredi": "12:00-15:00, 19:00-23:00" }
  if (typeof horaires === 'object') {
    const entries = Object.entries(horaires);
    if (entries.length === 0) return '';
    
    // Prendre la première entrée
    const [jours, heures] = entries[0];
    return `${jours}: ${heures}`;
  }
  
  return horaires.toString();
}

function formatDate(date: Date): string {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function formatTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;
}