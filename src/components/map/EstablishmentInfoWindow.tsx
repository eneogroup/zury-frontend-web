'use client';

import { useEffect, useRef } from 'react';

interface EstablishmentInfoWindowProps {
  map: google.maps.Map;
  establishment: any;
  onClose: () => void;
}

export default function EstablishmentInfoWindow({
  map,
  establishment,
  onClose,
}: EstablishmentInfoWindowProps) {
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!establishment) {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      return;
    }

    console.log('📍 Opening InfoWindow for:', establishment.nom);

    const lat = parseFloat(establishment.latitude);
    const lng = parseFloat(establishment.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.error('❌ Invalid coordinates:', { lat, lng });
      return;
    }

    // Créer l'InfoWindow si elle n'existe pas
    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow({
        maxWidth: 380, // Augmenter la largeur max
      });
      
      google.maps.event.addListener(infoWindowRef.current, 'closeclick', () => {
        console.log('🚪 InfoWindow closed');
        onClose();
      });
    }

    // Contenu HTML amélioré
    const content = `
      <div style="font-family: system-ui, -apple-system, sans-serif; width: 100%; min-width: 320px;">
        <!-- Image -->
        ${establishment.image_principale || establishment.imageUrl ? `
          <div style="width: 100%; height: 180px; margin: -16px -16px 16px -16px; border-radius: 12px 12px 0 0; overflow: hidden; position: relative;">
            <img 
              src="${establishment.image_principale || establishment.imageUrl}" 
              alt="${establishment.nom}"
              style="width: 100%; height: 100%; object-fit: cover;"
              onerror="this.parentElement.style.display='none'"
            />
            <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%);"></div>
          </div>
        ` : ''}
        
        <!-- Contenu -->
        <div style="padding: 0 4px;">
          <!-- Titre et catégorie -->
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #1a1a1a; line-height: 1.3;">
              ${establishment.nom}
            </h3>
            <span style="display: inline-block; padding: 6px 14px; background: linear-gradient(135deg, #E63946 0%, #F77F00 100%); color: white; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(230, 57, 70, 0.3);">
              ${establishment.categorie_nom || establishment.categorie || 'Restaurant'}
            </span>
          </div>

          <!-- Note -->
          ${establishment.note_moyenne || establishment.note ? `
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px; padding: 8px 12px; background: #FEF3C7; border-radius: 10px; width: fit-content;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span style="font-weight: 700; font-size: 16px; color: #92400E;">
                ${establishment.note_moyenne || establishment.note}
              </span>
              ${establishment.nombre_avis ? `
                <span style="color: #92400E; font-size: 13px; font-weight: 500;">
                  (${establishment.nombre_avis} avis)
                </span>
              ` : ''}
            </div>
          ` : ''}

          <!-- Localisation -->
          ${establishment.quartier_nom || establishment.quartier || establishment.adresse ? `
            <div style="display: flex; align-items: start; gap: 10px; margin-bottom: 12px; padding: 10px 12px; background: #F3F4F6; border-radius: 10px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E63946" stroke-width="2" style="flex-shrink: 0; margin-top: 1px;">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div style="flex: 1;">
                ${establishment.quartier_nom || establishment.quartier ? `
                  <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px; color: #1F2937;">
                    ${establishment.quartier_nom || establishment.quartier}
                  </p>
                ` : ''}
                ${establishment.adresse ? `
                  <p style="margin: 0; font-size: 13px; color: #6B7280; line-height: 1.4;">
                    ${establishment.adresse}
                  </p>
                ` : ''}
              </div>
            </div>
          ` : ''}

          <!-- Téléphone -->
          ${establishment.telephone ? `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 12px; background: #DBEAFE; border-radius: 10px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <a href="tel:${establishment.telephone}" style="color: #0EA5E9; text-decoration: none; font-weight: 600; font-size: 15px;">
                ${establishment.telephone}
              </a>
            </div>
          ` : ''}

          <!-- Site web -->
          ${establishment.site_web || establishment.siteWeb ? `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; padding: 10px 12px; background: #F3F4F6; border-radius: 10px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <a href="${establishment.site_web || establishment.siteWeb}" target="_blank" rel="noopener noreferrer" style="color: #8B5CF6; text-decoration: none; font-weight: 600; font-size: 14px;">
                Visiter le site
              </a>
            </div>
          ` : ''}

          <!-- Boutons d'action -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px;">
            ${establishment.telephone ? `
              <a 
                href="tel:${establishment.telephone}"
                style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 16px; background: #06B6D4; color: white; text-align: center; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);"
                onmouseover="this.style.background='#0891B2'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(6, 182, 212, 0.4)';"
                onmouseout="this.style.background='#06B6D4'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(6, 182, 212, 0.3)';"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Appeler
              </a>
            ` : ''}
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}"
              target="_blank"
              rel="noopener noreferrer"
              style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 16px; background: #8B5CF6; color: white; text-align: center; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);"
              onmouseover="this.style.background='#7C3AED'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(139, 92, 246, 0.4)';"
              onmouseout="this.style.background='#8B5CF6'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(139, 92, 246, 0.3)';"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Itinéraire
            </a>
          </div>

          <!-- Bouton Voir détails -->
          <a 
            href="/establishments/${establishment.id}" 
            style="display: block; width: 100%; padding: 14px 20px; background: linear-gradient(135deg, #E63946 0%, #F77F00 100%); color: white; text-align: center; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; margin-top: 12px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(230, 57, 70, 0.3);"
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(230, 57, 70, 0.4)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(230, 57, 70, 0.3)';"
          >
            📍 Voir tous les détails
          </a>
        </div>
      </div>
    `;

    // Mettre à jour le contenu
    infoWindowRef.current.setContent(content);
    
    // Ouvrir l'InfoWindow à la position du marker
    infoWindowRef.current.setPosition({ lat, lng });
    infoWindowRef.current.open(map);

    // Centrer la carte sur le marker
    map.panTo({ lat, lng });
    
    console.log('✅ InfoWindow opened');

  }, [map, establishment, onClose]);

  return null;
}