import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

const pinIcon = new L.DivIcon({
  className: "spot-marker",
  html: `<div class="spot-marker__pin"></div>`,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
});

export default function SpotLocationMap({ lat, lng, name }) {
  if (!lat || !lng) return null;

  return (
    <div className="spot-location-map">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%", borderRadius: 8 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={pinIcon} />
      </MapContainer>
      <div className="spot-location-map__label">{name}</div>
    </div>
  );
}
