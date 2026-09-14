import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: icon2x,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function PropertyMap({ lat, lng, name, address }) {
  const hasPosition = typeof lat === 'number' && typeof lng === 'number' && !(lat === 0 && lng === 0);
  // Stable array reference so react-leaflet doesn't re-center/reset the map
  // (visible as flicker) on every parent re-render when lat/lng haven't
  // actually changed value.
  const position = useMemo(() => [lat, lng], [lat, lng]);

  if (!hasPosition) return null;

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div>
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1.5px solid #e2ede9', height: 260 }}>
        <MapContainer center={position} zoom={15} style={{ width: '100%', height: '100%' }} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>{name || address}</Popup>
          </Marker>
        </MapContainer>
      </div>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
          fontSize: '0.85rem', fontWeight: 700, color: '#1a5c52', textDecoration: 'none',
        }}
      >
        <i className="fa fa-map-location-dot" /> Open in Google Maps
      </a>
    </div>
  );
}
