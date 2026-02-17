import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSocial } from "../contexts/SocialContext";
import { Avatar, StarRating } from "../components/ui";
import SpotModal from "../components/SpotModal";

const DEFAULT_STACK = [
  ["Lion's Mane", "Morning", "\ud83d\udc8a"],
  ["Zone 2 Cardio", "3x Week", "\ud83c\udfc3"],
  ["Cold Plunge", "Daily", "\uD83E\uDDCA"],
  ["Reformer Pilates", "2x Week", "\ud83e\uddd8"],
  ["No Seed Oils", "Strict", "\ud83e\udd69"],
];

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

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const { getUserReviews, getUserFavorites } = useSocial();
  const navigate = useNavigate();
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [activeTab, setActiveTab] = useState("reviews");

  const displayName = profile?.full_name || profile?.username || "Guest";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const handle = profile?.username ? `@${profile.username}` : "";
  const city = profile?.city || "Birmingham, AL";

  const healthStack =
    profile?.health_stack && profile.health_stack.length > 0
      ? profile.health_stack
      : DEFAULT_STACK;

  const userReviews = user ? getUserReviews() : [];
  const userFavorites = user ? getUserFavorites() : [];

  if (!user) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: 40, marginBottom: 12 }}>&#x1F464;</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Not signed in</div>
        <div style={{ fontSize: 13, marginTop: 4, marginBottom: 16 }}>
          Sign in to see your profile
        </div>
        <button className="btn-primary" onClick={() => navigate("/login")}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <section className="profile-header">
        <div className="profile-header-inner">
          <Avatar initials={initials} color="#16A34A" size={72} />
          <div>
            <h2 className="profile-name-lg">{displayName}</h2>
            <p className="profile-handle">
              {handle} {handle && <>&middot;</>} {city}
            </p>
            <div className="profile-stats">
              {[
                [String(userFavorites.length), "Saved"],
                ["0", "Followers"],
                [String(userReviews.length), "Reviews"],
                ["0", "Itineraries"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="profile-stat-num">{n}</div>
                  <div className="profile-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button className="btn-ghost">Edit Profile</button>
            <button
              className="btn-ghost"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="profile-tabs">
        {[
          ["reviews", `Reviews (${userReviews.length})`],
          ["saved", `Saved Spots (${userFavorites.length})`],
          ["stack", "Health Stack"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`profile-tab ${activeTab === key ? "profile-tab--active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div>
          {userReviews.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>&#x1F4DD;</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>
                No reviews yet
              </div>
              <div style={{ fontSize: 13, marginTop: 4, color: "#9CA3AF" }}>
                Visit a spot and share your experience!
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: 16, padding: "10px 20px", fontSize: 14 }}
                onClick={() => navigate("/explore")}
              >
                Explore Spots
              </button>
            </div>
          ) : (
            <div className="profile-reviews-grid">
              {userReviews.map((r) => (
                <div key={r.id} className="profile-review-card">
                  <div className="profile-review-card__header">
                    <h4 className="profile-review-card__spot">{r.spotName}</h4>
                    <span className="profile-review-card__time">
                      {formatTimeAgo(r.createdAt)}
                    </span>
                  </div>
                  <div className="profile-review-card__stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        style={{
                          color: i < r.rating ? "#F59E0B" : "#E5E7EB",
                          fontSize: 16,
                        }}
                      >
                        {"\u2605"}
                      </span>
                    ))}
                  </div>
                  <p className="profile-review-card__text">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Spots Tab */}
      {activeTab === "saved" && (
        <div>
          {userFavorites.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>&#x1F499;</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>
                No saved spots
              </div>
              <div style={{ fontSize: 13, marginTop: 4, color: "#9CA3AF" }}>
                Tap the heart on any spot to save it here.
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: 16, padding: "10px 20px", fontSize: 14 }}
                onClick={() => navigate("/explore")}
              >
                Explore Spots
              </button>
            </div>
          ) : (
            <div className="grid grid--3">
              {userFavorites.map((fav) => (
                <div
                  key={fav.id}
                  className="saved-spot-card"
                  onClick={() =>
                    setSelectedSpot({
                      id: fav.spotId,
                      name: fav.spotName,
                      type: fav.spotType,
                      img: fav.spotImg,
                      rating: fav.spotRating,
                      price: fav.spotPrice,
                      address: "",
                      reviews: 0,
                      tags: [],
                      trending: 0,
                      hours: "",
                      desc: "",
                    })
                  }
                >
                  <div className="saved-spot-card__img-wrap">
                    <img
                      src={fav.spotImg}
                      alt={fav.spotName}
                      loading="lazy"
                      className="saved-spot-card__img"
                    />
                  </div>
                  <div className="saved-spot-card__body">
                    <h4 className="saved-spot-card__name">{fav.spotName}</h4>
                    <div className="saved-spot-card__meta">
                      <span>{fav.spotType}</span>
                      <StarRating rating={fav.spotRating} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Health Stack Tab */}
      {activeTab === "stack" && (
        <div className="card" style={{ maxWidth: 500 }}>
          <h3 className="card-title">My Health Stack</h3>
          {healthStack.map(([item, freq, emoji]) => (
            <div key={item} className="stack-row">
              <span style={{ fontSize: 13, color: "#374151" }}>
                {emoji} {item}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "#16A34A",
                  fontWeight: 600,
                }}
              >
                {freq}
              </span>
            </div>
          ))}
        </div>
      )}

      {selectedSpot && (
        <SpotModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
        />
      )}
    </div>
  );
}
