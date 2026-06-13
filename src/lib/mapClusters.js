/**
 * Agrupa marcadores cercanos para el mapa (sin dependencias externas).
 */
export function clusterMarkers(markers, threshold = 0.012) {
  const clusters = [];
  const used = new Set();

  markers.forEach((marker, i) => {
    if (used.has(i)) return;

    const group = [marker];
    used.add(i);

    markers.forEach((other, j) => {
      if (used.has(j) || i === j) return;
      const dLat = Math.abs(marker.lat - other.lat);
      const dLng = Math.abs(marker.lng - other.lng);
      if (dLat < threshold && dLng < threshold) {
        group.push(other);
        used.add(j);
      }
    });

    if (group.length === 1) {
      clusters.push({ type: "single", ...marker });
    } else {
      const lat = group.reduce((sum, m) => sum + m.lat, 0) / group.length;
      const lng = group.reduce((sum, m) => sum + m.lng, 0) / group.length;
      clusters.push({
        type: "cluster",
        id: `cluster-${group.map((m) => m.id).join("-")}`,
        lat,
        lng,
        count: group.length,
        markers: group,
        label: `${group.length} inmuebles`,
        color: group[0].color,
      });
    }
  });

  return clusters;
}
