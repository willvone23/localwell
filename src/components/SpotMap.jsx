import { useEffect, useRef, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { formatTagLabel } from "../hooks/useSpotFilters";

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
  const prevLen = useRef(null);

  useEffect(() => {
    const points = spots
      .filter((s) => s.lat && s.lng)
      .map((s) => [s.lat, s.lng]);

    if (userLocation) {
      points.push(userLocation);
    }

    if (points.length === 0) return;

    // Only refit when spot count changes (filter applied) or first load
    if (prevLen.current === points.length) return;
    prevLen.current = points.length;

    const bounds = L.latLngBounds(points);
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [spots, userLocation, map]);

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
        // Geolocation denied or unavailable
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, [map, onLocation]);

  return null;
}

function SpotPopup({ spot, onView }) {
  return (
    <div className="map-popup">
      {spot.img && (
        <div className="map-popup__img-wrap">
          <img src={spot.img} alt={spot.name} className="map-popup__img" />
        </div>
      )}
      <div className="map-popup__body">
        <strong>{spot.name}</strong>
        <div className="map-popup__meta">
          {spot.type} &middot; {spot.price}
        </div>
        <div className="map-popup__rating">
          {"\u2605"} {spot.rating}
          <span className="map-popup__reviews">({spot.reviews})</span>
        </div>
        {spot.tags && spot.tags.length > 0 && (
          <div className="map-popup__tags">
            {spot.tags.slice(0, 3).map((t) => (
              <span key={t} className="map-popup__tag">
                {formatTagLabel(t)}
              </span>
            ))}
          </div>
        )}
        <button
          className="map-popup__view-btn"
          onClick={(e) => {
            e.stopPropagation();
            onView(spot);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default function SpotMap({ spots, selectedSpot, onSpotClick }) {
  const [userLocation, setUserLocation] = useState(null);
  const center = [33.749, -84.388]; // fallback center
  const handleLocation = useCallback((loc) => setUserLocation(loc), []);

  return (
    <div className="spot-map-container">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: 16 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <UserLocationTracker onLocation={handleLocation} />
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
                  <div className="map-popup__body">
                    <strong>You are here</strong>
                  </div>
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
                <SpotPopup spot={spot} onView={onSpotClick} />
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
