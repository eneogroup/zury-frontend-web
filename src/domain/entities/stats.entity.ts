export class StatsEntity {
  etablissements: { total: number; featured: number } = { total: 0, featured: 0 }
  events: { total_a_venir: number; cette_semaine: number } = { total_a_venir: 0, cette_semaine: 0 }
  utilisateurs: { total_installations: number } = { total_installations: 0 }
}
