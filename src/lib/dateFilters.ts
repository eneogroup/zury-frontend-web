/**
 * Helper pour filtrer les événements par période
 */

export function filterEventsByPeriod(events: any[], period?: string) {
  if (!period || period === 'all') {
    return events;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return events.filter(event => {
    const eventDate = new Date(event.dateDebut || event.date_debut);
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    switch (period) {
      case 'today':
        // Événements aujourd'hui
        return eventDateOnly.getTime() === today.getTime();
      
      case 'weekend':
        // Événements ce weekend (samedi et dimanche prochain)
        const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
        const nextSaturday = new Date(today);
        nextSaturday.setDate(today.getDate() + daysUntilSaturday);
        
        const nextSunday = new Date(nextSaturday);
        nextSunday.setDate(nextSaturday.getDate() + 1);
        
        return eventDateOnly.getTime() === nextSaturday.getTime() || 
               eventDateOnly.getTime() === nextSunday.getTime();
      
      case 'week':
        // Événements dans les 7 prochains jours
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        return eventDateOnly >= today && eventDateOnly <= nextWeek;
      
      case 'month':
        // Événements ce mois-ci
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        return eventDateOnly >= firstDayOfMonth && eventDateOnly <= lastDayOfMonth;
      
      default:
        return true;
    }
  });
}