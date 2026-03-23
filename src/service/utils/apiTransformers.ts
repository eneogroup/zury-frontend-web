type EstablishmentCategory = 'restaurant' | 'bar' | 'hotel' | 'lounge'

export function transformEstablishment(item: any) {
  const categoryName = (item.categorie_nom || item.categorie || '').toLowerCase()
  let category: EstablishmentCategory = 'restaurant'
  if (categoryName.includes('bar')) category = 'bar'
  else if (categoryName.includes('hôtel') || categoryName.includes('hotel')) category = 'hotel'
  else if (categoryName.includes('lounge') || categoryName.includes('club')) category = 'lounge'

  return {
    id: item.id,
    name: item.nom,
    category,
    address: item.adresse,
    neighborhood: item.quartier_nom || item.quartier || '',
    rating: parseFloat(item.note_moyenne) || 0,
    reviewCount: item.nombre_avis || 0,
    imageUrl: item.image_principale || (Array.isArray(item.medias) ? item.medias.find((m: any) => m.type === 'IMAGE' && m.url)?.url : null) || '/placeholder.jpg',
    latitude: item.latitude ? parseFloat(String(item.latitude)) : undefined,
    longitude: item.longitude ? parseFloat(String(item.longitude)) : undefined,
    isPremium: item.est_featured || false,
    isOpen: item.est_ouvert,
  }
}

export function transformEstablishmentDetail(item: any) {
  const base = transformEstablishment(item)
  const images: string[] = []
  if (Array.isArray(item.medias)) {
    item.medias.forEach((m: any) => { if (m.type === 'IMAGE' && m.url) images.push(m.url) })
  }
  if (item.image_principale && !images.includes(item.image_principale)) {
    images.unshift(item.image_principale)
  }
  if (images.length === 0) images.push('/placeholder.jpg')

  return {
    ...base,
    images,
    description: item.description || '',
    phone: item.telephone,
    email: item.email,
    website: item.site_web,
    facebook: item.facebook,
    instagram: item.instagram,
    tags: item.tags || [],
    horaires: item.horaires,
  }
}

export function transformEvent(event: any) {
  const dateDebut = new Date(event.date_debut)
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
  const date = `${days[dateDebut.getDay()]} ${dateDebut.getDate()} ${months[dateDebut.getMonth()]}`
  const time = `${String(dateDebut.getHours()).padStart(2, '0')}h${String(dateDebut.getMinutes()).padStart(2, '0')}`

  return {
    id: event.id,
    title: event.titre,
    category: event.type_event_display || event.type_event || 'Événement',
    date,
    time,
    telephone: event.telephone,
    establishment: event.etablissement_nom || event.etablissement?.nom || '',
    establishmentId: event.etablissement_id || event.etablissement?.id,
    establishmentPhone: event.etablissement?.telephone || '',
    price: event.est_gratuit ? 'Gratuit' : `${parseInt(event.prix || '0')} FCFA`,
    availablePlaces: event.places_disponibles || 0,
    totalPlaces: event.nb_places_total || 0,
    imageUrl: event.affiche_complete || event.affiche_url || '/placeholder-event.jpg',
    description: event.description || '',
    dateDebut: event.date_debut,
    dateFin: event.date_fin,
    isComplete: event.est_complet || false,
  }
}
