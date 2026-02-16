export function StarRating({ rating }) {
  return (
    <span style={{ color: "#F59E0B", fontSize: 13, fontWeight: 600 }}>
      {"\u2605"} {rating}
    </span>
  );
}

export function Badge({ text, color = "#4CAF50" }) {
  return (
    <span
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        borderRadius: 20,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
    >
      {text}
    </span>
  );
}

export function Tag({ text }) {
  return (
    <span
      style={{
        background: "#F0FDF4",
        color: "#16A34A",
        border: "1px solid #BBF7D0",
        borderRadius: 20,
        padding: "2px 9px",
        fontSize: 11,
        fontWeight: 500,
      }}
    >
      #{text}
    </span>
  );
}

export function TrendingBadge({ pct }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FF6B35, #FF4500)",
        borderRadius: 20,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 700,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <span>{"\u2191"}</span> Trending +{pct}%
    </div>
  );
}

export function Avatar({ initials, color, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.35,
        flexShrink: 0,
      }}
      aria-label={initials}
    >
      {initials}
    </div>
  );
}
