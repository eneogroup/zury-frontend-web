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

    const miniInfoWindowCard = `
      <div style="
        width: 360px;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <!-- Image bannière -->
        <div style="
          width: 100%;
          height: 160px;
          background: linear-gradient(135deg, #E63946 0%, #d62828 100%);
          overflow: hidden;
          position: relative;
        ">
          ${establishment.imageUrl ? `
            <img src="${establishment.imageUrl}" alt="${establishment.nom}" style="
              width: 100%;
              height: 100%;
              object-fit: cover;
            " />
          ` : `
            <div style="
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 48px;
            ">
              ${establishment.categorie === 'Restaurant' ? '🍽️' : 
                establishment.categorie === 'Bar' ? '🍹' : 
                establishment.categorie === 'Hotel' || establishment.categorie === 'Hôtel' ? '🏨' : 
                establishment.categorie === 'Lounge' ? '🛋️' : 
                establishment.categorie === 'Maquis' ? '🎉' : '📍'}
            </div>
          `}
        </div>

        <!-- Corps de la card -->
        <div style="padding: 20px;">
          <!-- Nom et catégorie -->
          <div style="margin-bottom: 16px;">
            <h3 style="
              margin: 0 0 8px 0;
              font-size: 18px;
              font-weight: 700;
              color: #1f2937;
              letter-spacing: -0.5px;
            ">
              ${establishment.nom}
            </h3>
            <span style="
              display: inline-block;
              padding: 6px 12px;
              background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
              color: #DC2626;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              ${establishment.categorie_nom || establishment.categorie || 'Restaurant'}
            </span>
          </div>

          <!-- Séparateur -->
          <div style="height: 1px; background: #e5e7eb; margin-bottom: 16px;"></div>

          <!-- Infos essentielles -->
          <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px;">
            
            <!-- Localisation -->
            ${establishment.quartier_nom || establishment.quartier ? `
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="font-size: 20px; flex-shrink: 0;">📍</span>
                <div style="flex: 1; min-width: 0;">
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Localisation</p>
                  <p style="margin: 4px 0 0 0; font-size: 14px; color: #1f2937; font-weight: 500;">
                    ${establishment.quartier_nom || establishment.quartier}
                  </p>
                </div>
              </div>
            ` : ''}

            <!-- Téléphone -->
            ${establishment.telephone ? `
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="font-size: 20px; flex-shrink: 0;">📞</span>
                <div style="flex: 1; min-width: 0;">
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Contact</p>
                  <a href="tel:${establishment.telephone}" style="
                    margin: 4px 0 0 0;
                    display: inline-block;
                    font-size: 14px;
                    color: #E63946;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s;
                  ">
                    ${establishment.telephone}
                  </a>
                </div>
              </div>
            ` : ''}

            <!-- Horaires -->
            ${establishment.horaires ? `
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="font-size: 20px; flex-shrink: 0;">🕐</span>
                <div style="flex: 1; min-width: 0;">
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Horaires</p>
                  <p style="margin: 4px 0 0 0; font-size: 14px; color: #1f2937; font-weight: 500;">
                    ${establishment.horaires}
                  </p>
                </div>
              </div>
            ` : ''}

            <!-- Email -->
            ${establishment.email ? `
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="font-size: 20px; flex-shrink: 0;">✉️</span>
                <div style="flex: 1; min-width: 0;">
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                  <a href="mailto:${establishment.email}" style="
                    margin: 4px 0 0 0;
                    display: inline-block;
                    font-size: 14px;
                    color: #E63946;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s;
                    word-break: break-word;
                  ">
                    ${establishment.email}
                  </a>
                </div>
              </div>
            ` : ''}

            <!-- Site web -->
            ${establishment.website ? `
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="font-size: 20px; flex-shrink: 0;">🌐</span>
                <div style="flex: 1; min-width: 0;">
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Site web</p>
                  <a href="${establishment.website}" target="_blank" style="
                    margin: 4px 0 0 0;
                    display: inline-block;
                    font-size: 14px;
                    color: #E63946;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s;
                  ">
                    Visiter
                  </a>
                </div>
              </div>
            ` : ''}

            <!-- Note/Rating -->
            ${establishment.rating ? `
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="font-size: 20px; flex-shrink: 0;">⭐</span>
                <div style="flex: 1; min-width: 0;">
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Évaluation</p>
                  <p style="margin: 4px 0 0 0; font-size: 14px; color: #1f2937; font-weight: 600;">
                    ${establishment.rating}/5 ${establishment.reviews_count ? `(${establishment.reviews_count} avis)` : ''}
                  </p>
                </div>
              </div>
            ` : ''}

            <!-- Description courte -->
            ${establishment.description ? `
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="font-size: 20px; flex-shrink: 0;">ℹ️</span>
                <div style="flex: 1; min-width: 0;">
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">À propos</p>
                  <p style="margin: 4px 0 0 0; font-size: 13px; color: #4b5563; line-height: 1.4;">
                    ${establishment.description.substring(0, 100)}${establishment.description.length > 100 ? '...' : ''}
                  </p>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Bouton CTA -->
          <a 
            href="/establishments/${establishment.id}" 
            style="
              display: block;
              width: 100%;
              padding: 12px 16px;
              background: linear-gradient(135deg, #E63946 0%, #d62828 100%);
              color: white;
              text-align: center;
              border-radius: 10px;
              text-decoration: none;
              font-weight: 700;
              font-size: 14px;
              letter-spacing: 0.5px;
              border: none;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 12px rgba(230, 57, 70, 0.3);
            "
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(230, 57, 70, 0.4)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(230, 57, 70, 0.3)';"
          >
            Voir plus de détails →
          </a>
        </div>
      </div>
    `;
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
      infoWindowRef.current = new google.maps.InfoWindow();
      
      // Gérer la fermeture
      google.maps.event.addListener(infoWindowRef.current, 'closeclick', () => {
        console.log('🚪 InfoWindow closed');
        onClose();
      });
    }

    // Contenu HTML moderne avec design premium
    const content = miniInfoWindowCard;

    // Mettre à jour le contenu
    infoWindowRef.current.setContent(content);
    
    // Ouvrir l'InfoWindow à la position du marker
    infoWindowRef.current.setPosition({ lat, lng });
    infoWindowRef.current.open(map);

    // Centrer la carte sur le marker
    map.panTo({ lat, lng });
    
    console.log('✅ InfoWindow should be visible now');

  }, [map, establishment, onClose]);

  return null;
}