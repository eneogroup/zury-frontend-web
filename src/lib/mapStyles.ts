// Styles personnalisés pour Google Maps
export const ZURY_MAP_STYLES: google.maps.MapTypeStyle[] = [
  {
    featureType: 'poi.business',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text',
    stylers: [{ visibility: 'on' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9e8f7' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#4f7a8b' }],
  },
];

// Style nuit (optionnel)
export const ZURY_NIGHT_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
];