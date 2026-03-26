export class EventEntity {
  id!: string
  etablissement_id?: string
  etablissement_nom?: string
  titre: string = ''
  description: string = ''
  date_debut: string = ''
  date_fin?: string
  adresse_propre?: string
  prix: string = '0'
  telephone?: string
  est_gratuit: boolean = false
  nb_places_total: number = 0
  nb_places_reservees: number = 0
  places_disponibles: number = 0
  est_complet: boolean = false
  affiche_url: string = ''
  type_event: string = ''
  type_event_display: string = ''
  est_featured: boolean = false
  statut: string = ''
  statut_display: string = ''
}
