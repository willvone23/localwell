import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "./ui";
import ReviewForm from "./ReviewForm";
import SpotLocationMap from "./SpotLocationMap";
import { useAuth } from "../contexts/AuthContext";
import { useSocial } from "../contexts/SocialContext";

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function SpotModal({ spot, onClose }) {
  const { user } = useAuth();
  const { addReview, getSpotReviews, isFavorited, toggleFavorite } = useSocial();
  const navigate = useNavigate();

  const spotReviews = getSpotReviews(spot.id);
  const favorited = isFavorited(spot.id);

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

  const avgRating =
    spotReviews.length > 0
      ? (
          spotReviews.reduce((sum, r) => sum + r.rating, 0) / spotReviews.length
        ).toFixed(1)
      : spot.rating;

  const totalReviews = spot.reviews + spotReviews.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={spot.name}
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-container"
      >
        <div className="modal-img-wrap">
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
            className="modal-close-btn"
          >
            &times;
          </button>
          <button
            onClick={() => (user ? toggleFavorite(spot) : navigate("/login"))}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            className={`spot-fav-btn ${favorited ? "spot-fav-btn--active" : ""}`}
            style={{
              position: "absolute",
              top: 16,
              right: 60,
            }}
          >
            {favorited ? "\u2764\uFE0F" : "\uD83E\uDD0D"}
          </button>
        </div>
        <div className="modal-body">
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
                {"\u2605"} {avgRating}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>
                {totalReviews} reviews
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

          {/* Reviews Section */}
          <div className="spot-reviews-section">
            <h3 className="spot-reviews-title">
              Reviews ({spotReviews.length})
            </h3>

            {user ? (
              <ReviewForm
                spotId={spot.id}
                spotName={spot.name}
                onSubmit={addReview}
              />
            ) : (
              <div className="review-login-prompt">
                <p>
                  <button
                    className="auth-toggle-btn"
                    onClick={() => {
                      onClose();
                      navigate("/login");
                    }}
                  >
                    Sign in
                  </button>{" "}
                  to leave a review
                </p>
              </div>
            )}

            {spotReviews.length > 0 && (
              <div className="spot-reviews-list">
                {spotReviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-item__header">
                      <div
                        className="review-item__avatar"
                        style={{ background: "#16A34A" }}
                      >
                        {review.userInitials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="review-item__name">
                          {review.userName}
                        </div>
                        <div className="review-item__meta">
                          <span className="review-item__stars">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span
                                key={i}
                                style={{
                                  color:
                                    i < review.rating ? "#F59E0B" : "#E5E7EB",
                                }}
                              >
                                {"\u2605"}
                              </span>
                            ))}
                          </span>
                          <span className="review-item__time">
                            {formatTimeAgo(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="review-item__text">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
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
            {spot.lat && spot.lng ? (
              <SpotLocationMap
                lat={spot.lat}
                lng={spot.lng}
                name={spot.address}
              />
            ) : (
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
                {spot.address || "Location unavailable"}
              </div>
            )}
          </div>
          <a
            href={
              spot.lat && spot.lng
                ? `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.address || spot.name)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              width: "100%",
              background: "linear-gradient(135deg, #16A34A, #4CAF50)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              textAlign: "center",
              textDecoration: "none",
              boxSizing: "border-box",
            }}
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}
