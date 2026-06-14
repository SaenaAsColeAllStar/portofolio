export const COUNTRY_COORDS: Record<string, { lat: number; lng: number; name: string }> = {
  ID: { lat: -0.7893, lng: 113.9213, name: "Indonesia" },
  US: { lat: 37.0902, lng: -95.7129, name: "United States" },
  SG: { lat: 1.3521, lng: 103.8198, name: "Singapore" },
  GB: { lat: 55.3781, lng: -3.4360, name: "United Kingdom" },
  JP: { lat: 36.2048, lng: 138.2529, name: "Japan" },
  AU: { lat: -25.2744, lng: 133.7751, name: "Australia" },
  DE: { lat: 51.1657, lng: 10.4515, name: "Germany" },
  FR: { lat: 46.2276, lng: 2.2137, name: "France" },
  CN: { lat: 35.8617, lng: 104.1954, name: "China" },
  IN: { lat: 20.5937, lng: 78.9629, name: "India" },
  BR: { lat: -14.2350, lng: -51.9253, name: "Brazil" },
  RU: { lat: 61.5240, lng: 105.3188, name: "Russia" },
  ZA: { lat: -30.5595, lng: 22.9375, name: "South Africa" },
  CA: { lat: 56.1304, lng: -106.3468, name: "Canada" },
  NL: { lat: 52.1326, lng: 5.2913, name: "Netherlands" },
  KR: { lat: 35.9078, lng: 127.7669, name: "South Korea" },
  MY: { lat: 4.2105, lng: 101.9758, name: "Malaysia" },
  TH: { lat: 15.8700, lng: 100.9925, name: "Thailand" },
  VN: { lat: 14.0583, lng: 108.2772, name: "Vietnam" },
  PH: { lat: 12.8797, lng: 121.7740, name: "Philippines" },
};

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// Convert Lat/Lng to 3D Cartesian coordinates
export function latLngToVector3(lat: number, lng: number, r: number): Vector3D {
  const phi = (lat * Math.PI) / 180;
  const theta = (lng * Math.PI) / 180;
  return {
    x: r * Math.cos(phi) * Math.sin(theta),
    y: -r * Math.sin(phi),
    z: r * Math.cos(phi) * Math.cos(theta)
  };
}

// Rotate vector in 3D space
export function rotateVector(v: Vector3D, angleX: number, angleY: number): Vector3D {
  // Rotate around Y-axis (Yaw)
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const x1 = v.x * cosY + v.z * sinY;
  const z1 = -v.x * sinY + v.z * cosY;
  const y1 = v.y;

  // Rotate around X-axis (Pitch)
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const y2 = y1 * cosX - z1 * sinX;
  const z2 = y1 * sinX + z1 * cosX;
  const x2 = x1;

  return { x: x2, y: y2, z: z2 };
}

// Generate deterministic coordinates for any country code using simple hashing
export function getCountryCoords(code: string): { lat: number; lng: number; name: string } {
  const normalized = code.toUpperCase();
  if (COUNTRY_COORDS[normalized]) return COUNTRY_COORDS[normalized];
  
  let h1 = 0, h2 = 0;
  for (let i = 0; i < normalized.length; i++) {
    h1 = (h1 * 31 + normalized.charCodeAt(i)) % 180;
    h2 = (h2 * 37 + normalized.charCodeAt(i)) % 360;
  }
  const lat = h1 - 90;
  const lng = h2 - 180;
  return { lat, lng, name: `Node (${normalized})` };
}

// Helper for relative time formatting
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
