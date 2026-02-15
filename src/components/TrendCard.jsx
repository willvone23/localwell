import { StarRating, Badge } from "./ui";

export default function TrendCard({ trend }) {
  return (
    <article
      style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        border: "1px solid #F3F4F6",
      }}
    >
      <div style={{ position: "relative", height: 200 }}>
        <img
          src={trend.img}
          alt={trend.name}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            gap: 6,
          }}
        >
          <span
            style={{
              background: "#fff",
              color: "#374151",
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {trend.category}
          </span>
          {trend.hot && (
            <span
              style={{
                background: "#FF4500",
                color: "#fff",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              Hot
            </span>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 14,
            right: 14,
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            {trend.name}
          </h3>
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 13,
            color: "#6B7280",
            lineHeight: 1.5,
          }}
        >
          {trend.desc.substring(0, 100)}...
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <StarRating rating={trend.rating} />
            <span style={{ fontSize: 12, color: "#6B7280" }}>
              &middot; {trend.spots}+ spots
            </span>
          </div>
          <Badge
            text={trend.badge}
            color={
              trend.badge === "Science-backed"
                ? "#16A34A"
                : trend.badge === "Controversial"
                  ? "#DC2626"
                  : "#D97706"
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid #F3F4F6",
          }}
        >
          <span
            style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}
          >
            {trend.rise} searches
          </span>
          <span style={{ fontSize: 12, color: "#6B7280" }}>
            Difficulty: {trend.difficulty}
          </span>
          <span style={{ fontSize: 12, color: "#6B7280" }}>
            Cost: {trend.cost}
          </span>
        </div>
      </div>
    </article>
  );
}
