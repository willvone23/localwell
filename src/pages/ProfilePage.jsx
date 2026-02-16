import { useApi } from "../hooks/useApi";
import { Avatar, StarRating } from "../components/ui";

export default function ProfilePage() {
  const { data: spots } = useApi("/spots");

  return (
    <div>
      <section className="profile-header">
        <div className="profile-header-inner">
          <Avatar initials="W" color="#16A34A" size={72} />
          <div>
            <h2 className="profile-name-lg">Will vonEschenbach</h2>
            <p className="profile-handle">@will &middot; Birmingham, AL</p>
            <div className="profile-stats">
              {[
                ["127", "Following"],
                ["84", "Followers"],
                ["23", "Reviews"],
                ["8", "Itineraries"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="profile-stat-num">{n}</div>
                  <div className="profile-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="btn-ghost" style={{ marginLeft: "auto" }}>
            Edit Profile
          </button>
        </div>
      </section>

      <div className="grid grid--2">
        <div className="card">
          <h3 className="card-title">My Health Stack</h3>
          {[
            ["Lion's Mane", "Morning", "\ud83d\udc8a"],
            ["Zone 2 Cardio", "3x Week", "\ud83c\udfc3"],
            ["Cold Plunge", "Daily", "\uD83E\uDDCA"],
            ["Reformer Pilates", "2x Week", "\ud83e\uddd8"],
            ["No Seed Oils", "Strict", "\ud83e\udd69"],
          ].map(([item, freq, emoji]) => (
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

        <div className="card">
          <h3 className="card-title">My Reviews</h3>
          {(spots || []).slice(0, 4).map((s) => (
            <div key={s.id} className="stack-row">
              <span style={{ fontSize: 13, color: "#374151" }}>
                {s.name}
              </span>
              <StarRating rating={s.rating} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
