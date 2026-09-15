import { useState } from 'react';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

// Malawi's approximate center — used when no location has been picked yet
const DEFAULT_CENTER = [-13.9626, 33.7741];

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ lat, lng, onChange }) {
  const [locating, setLocating] = useState(false);
  const hasPosition = lat !== undefined && lat !== null && lng !== undefined && lng !== null && !(lat === 0 && lng === 0);
  const center = hasPosition ? [lat, lng] : DEFAULT_CENTER;

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div>
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1.5px solid #e8eaed', height: 260 }}>
        <MapContainer center={center} zoom={hasPosition ? 15 : 6} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={onChange} />
          {hasPosition && (
            <Marker
              position={center}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const pos = e.target.getLatLng();
                  onChange(pos.lat, pos.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, gap: 8, flexWrap: 'wrap' }}>
        <p style={{ fontSize: '0.72rem', color: '#6b7280', margin: 0 }}>
          {hasPosition
            ? `Pinned at ${lat.toFixed(5)}, ${lng.toFixed(5)} — tap the map or drag the pin to adjust`
            : 'Tap the map to pin your property’s exact location'}
        </p>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
            padding: '0.4rem 0.8rem', borderRadius: 8, border: '1.5px solid #e8eaed',
            background: '#f7f8fa', color: '#0f1923', fontWeight: 700, fontSize: '0.75rem',
            cursor: locating ? 'not-allowed' : 'pointer',
          }}
        >
          <FaLocationCrosshairs /> {locating ? 'Locating…' : 'Use my location'}
        </button>
      </div>
    </div>
  );
}
