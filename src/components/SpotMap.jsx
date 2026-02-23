import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Custom green marker icon
const spotIcon = new L.DivIcon({
  className: "spot-marker",
  html: `<div class="spot-marker__pin"></div>`,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
});

const activeIcon = new L.DivIcon({
  className: "spot-marker spot-marker--active",
  html: `<div class="spot-marker__pin spot-marker__pin--active"></div>`,
  iconSize: [34, 42],
  iconAnchor: [17, 42],
  popupAnchor: [0, -42],
});

function FitBounds({ spots }) {
  const map = useMap();
  const prevLen = useRef(spots.length);

  useEffect(() => {
    if (spots.length === 0) return;
    if (spots.length !== prevLen.current || prevLen.current === spots.length) {
      const bounds = L.latLngBounds(
        spots.filter((s) => s.lat && s.lng).map((s) => [s.lat, s.lng])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }
    prevLen.current = spots.length;
  }, [spots, map]);

  return null;
}

export default function SpotMap({ spots, selectedSpot, onSpotClick }) {
  const center = [33.749, -84.388]; // Birmingham, AL area default

  return (
    <div className="spot-map-container">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: 16 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds spots={spots} />
        {spots
          .filter((s) => s.lat && s.lng)
          .map((spot) => (
            <Marker
              key={spot.id}
              position={[spot.lat, spot.lng]}
              icon={
                selectedSpot && selectedSpot.id === spot.id
                  ? activeIcon
                  : spotIcon
              }
              eventHandlers={{
                click: () => onSpotClick(spot),
              }}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{spot.name}</strong>
                  <div className="map-popup__meta">
                    {spot.type} &middot; {spot.price}
                  </div>
                  <div className="map-popup__rating">
                    {"\u2605"} {spot.rating} ({spot.reviews})
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
