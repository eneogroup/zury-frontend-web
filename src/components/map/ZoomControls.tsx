'use client';

import { Plus, Minus } from 'lucide-react';

interface ZoomControlsProps {
  map: google.maps.Map;
}

export default function ZoomControls({ map }: ZoomControlsProps) {
  const handleZoomIn = () => {
    const currentZoom = map.getZoom() || 13;
    map.setZoom(currentZoom + 1);
  };

  const handleZoomOut = () => {
    const currentZoom = map.getZoom() || 13;
    map.setZoom(currentZoom - 1);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="bg-white hover:bg-gray-50 text-dark p-2 rounded-lg shadow-lg transition-all"
        aria-label="Zoom avant"
      >
        <Plus className="w-5 h-5" />
      </button>
      <button
        onClick={handleZoomOut}
        className="bg-white hover:bg-gray-50 text-dark p-2 rounded-lg shadow-lg transition-all"
        aria-label="Zoom arrière"
      >
        <Minus className="w-5 h-5" />
      </button>
    </div>
  );
}