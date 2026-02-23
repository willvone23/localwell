import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
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

// Blue "you are here" dot
const userIcon = new L.DivIcon({
  className: "user-marker",
  html: `<div class="user-marker__dot"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FitBounds({ spots, userLocation }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    const points = spots
      .filter((s) => s.lat && s.lng)
      .map((s) => [s.lat, s.lng]);

    if (userLocation) {
      points.push(userLocation);
    }

    if (points.length === 0) return;
    if (fitted.current) return;

    const bounds = L.latLngBounds(points);
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      fitted.current = true;
    }
  }, [spots, userLocation, map]);

  // Re-fit when filtered spots change
  useEffect(() => {
    const points = spots
      .filter((s) => s.lat && s.lng)
      .map((s) => [s.lat, s.lng]);

    if (userLocation) {
      points.push(userLocation);
    }

    if (points.length === 0) return;

    const bounds = L.latLngBounds(points);
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [spots.length, map]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

function UserLocationTracker({ onLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        // Geolocation denied or unavailable — no action needed
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, [map, onLocation]);

  return null;
}

export default function SpotMap({ spots, selectedSpot, onSpotClick }) {
  const [userLocation, setUserLocation] = useState(null);
  const center = [33.749, -84.388]; // fallback center

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
        <UserLocationTracker onLocation={setUserLocation} />
        <FitBounds spots={spots} userLocation={userLocation} />

        {/* User location marker */}
        {userLocation && (
          <>
            <Circle
              center={userLocation}
              radius={200}
              pathOptions={{
                color: "#3B82F6",
                fillColor: "#3B82F6",
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div className="map-popup">
                  <strong>You are here</strong>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Spot markers */}
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
