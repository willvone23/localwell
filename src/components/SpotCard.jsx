import { Tag, TrendingBadge, StarRating } from "./ui";

export default function SpotCard({ spot, onClick }) {
  return (
    <article
      className="spot-card"
      onClick={() => onClick(spot)}
      style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        border: "1px solid #F3F4F6",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
      }}
    >
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        <img
          src={spot.img}
          alt={spot.name}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <TrendingBadge pct={spot.trending} />
        </div>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span
            style={{
              background: "#1A1A2E",
              color: "#fff",
              borderRadius: 8,
              padding: "3px 8px",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {spot.price}
          </span>
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 10 }}>
          <span
            style={{
              background: "rgba(255,255,255,0.92)",
              color: "#374151",
              borderRadius: 8,
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {spot.type}
          </span>
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 4,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {spot.name}
          </h3>
          <StarRating rating={spot.rating} />
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "#6B7280" }}>
          {spot.address} &middot; ({spot.reviews} reviews)
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {spot.tags.slice(0, 3).map((t) => (
            <Tag key={t} text={t} />
          ))}
        </div>
      </div>
    </article>
  );
}
