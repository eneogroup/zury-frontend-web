export class EstablishmentEntity {
  id!: string
  nom: string = ''
  description: string = ''
  categorie_id: string = ''
  categorie_nom: string = ''
  quartier_id: string = ''
  quartier_nom: string = ''
  ville_nom: string = ''
  adresse: string = ''
  telephone: string = ''
  email: string = ''
  site_web: string = ''
  facebook: string = ''
  instagram: string = ''
  latitude: string | number | null = null
  longitude: string | number | null = null
  horaires: any = null
  tags: string[] = []
  medias: any = null
  note_moyenne: string = '0'
  nombre_avis: number = 0
  nombre_vues: number = 0
  est_featured: boolean = false
  image_principale: string = ''
  created_at: string = ''
  updated_at: string = ''
}
