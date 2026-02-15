import { useEffect } from "react";
import { Tag } from "./ui";

export default function SpotModal({ spot, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={spot.name}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ position: "relative", height: 260 }}>
          <img
            src={spot.img}
            alt={spot.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "20px 20px 0 0",
            }}
          />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            &times;
          </button>
        </div>
        <div style={{ padding: "24px 28px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {spot.name}
              </h2>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#6B7280",
                  fontSize: 14,
                }}
              >
                {spot.type} &middot; {spot.address}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{ fontSize: 22, fontWeight: 800, color: "#F59E0B" }}
              >
                &starf; {spot.rating}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>
                {spot.reviews} reviews
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <span
              style={{
                background: "#F3F4F6",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 13,
                color: "#374151",
              }}
            >
              {spot.hours}
            </span>
            <span
              style={{
                background: "#F3F4F6",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 13,
                color: "#374151",
              }}
            >
              {spot.price}
            </span>
          </div>
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 14,
              color: "#374151",
              lineHeight: 1.7,
            }}
          >
            {spot.desc}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 20,
            }}
          >
            {spot.tags.map((t) => (
              <Tag key={t} text={t} />
            ))}
          </div>
          <div
            style={{
              background: "#F0FDF4",
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}
            >
              Location
            </div>
            <div
              style={{
                background: "#D1FAE5",
                borderRadius: 8,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#16A34A",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Map View &middot; {spot.address}
            </div>
          </div>
          <button
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #16A34A, #4CAF50)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}
