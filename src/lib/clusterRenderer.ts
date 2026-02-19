import { Cluster, ClusterStats, Renderer } from '@googlemaps/markerclusterer';

export class CustomRenderer implements Renderer {
  public render(cluster: Cluster, stats: ClusterStats): google.maps.Marker {
    const count = cluster.count;
    const position = cluster.position;

    // Taille et couleur selon le nombre
    let size = 40;
    let color = '#06B6D4'; // Cyan par défaut
    
    if (count > 50) {
      size = 60;
      color = '#E63946'; // Rouge
    } else if (count > 20) {
      size = 50;
      color = '#F77F00'; // Orange
    } else if (count > 10) {
      size = 45;
      color = '#8B5CF6'; // Violet
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
          </filter>
        </defs>
        <circle 
          cx="${size / 2}" 
          cy="${size / 2}" 
          r="${size / 2 - 3}" 
          fill="${color}" 
          stroke="white" 
          stroke-width="3"
          filter="url(#shadow)"
        />
        <text 
          x="${size / 2}" 
          y="${size / 2}" 
          text-anchor="middle" 
          dy="0.35em" 
          font-family="Arial, sans-serif" 
          font-size="${count > 99 ? '14' : '16'}" 
          font-weight="bold" 
          fill="white"
        >
          ${count > 99 ? '99+' : count}
        </text>
      </svg>
    `;

    return new google.maps.Marker({
      position,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(size / 2, size / 2),
      },
      zIndex: 1000 + count,
    });
  }
}