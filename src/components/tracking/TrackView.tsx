'use client';

import { useEffect } from 'react';
import { trackingService } from '@/lib/api';

interface TrackViewProps {
  establishmentId?: string;
  eventId?: string;
  source?: string;
}

export default function TrackView({ establishmentId, eventId, source = 'direct' }: TrackViewProps) {
  useEffect(() => {
    const startTime = Date.now();

    // Générer un device_id simple pour le web (basé sur le localStorage)
    let deviceId = 'web-user';
    if (typeof window !== 'undefined') {
      deviceId = localStorage.getItem('zury_device_id') || `web-${Date.now()}-${Math.random()}`;
      localStorage.setItem('zury_device_id', deviceId);
    }

    // Track la vue à l'ouverture
    if (establishmentId) {
      trackingService.trackVue({
        etablissement: establishmentId,
        device_id: deviceId,
        source,
      });
    } else if (eventId) {
      trackingService.trackEventVue({
        event: eventId,
        device_id: deviceId,
        source,
      });
    }

    // Track la durée de consultation à la fermeture
    return () => {
      if (establishmentId) {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        trackingService.trackVue({
          etablissement: establishmentId,
          device_id: deviceId,
          duree_consultation: duration,
          source,
        });
      }
    };
  }, [establishmentId, eventId, source]);

  return null; // Ce composant ne rend rien visuellement
}