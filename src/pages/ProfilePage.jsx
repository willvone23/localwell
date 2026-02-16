import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useApi } from "../hooks/useApi";
import { Avatar, StarRating } from "../components/ui";

const DEFAULT_STACK = [
  ["Lion's Mane", "Morning", "\ud83d\udc8a"],
  ["Zone 2 Cardio", "3x Week", "\ud83c\udfc3"],
  ["Cold Plunge", "Daily", "\uD83E\uDDCA"],
  ["Reformer Pilates", "2x Week", "\ud83e\uddd8"],
  ["No Seed Oils", "Strict", "\ud83e\udd69"],
];

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const { data: spots } = useApi("/spots");
  const navigate = useNavigate();

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
                ["0", "Following"],
                ["0", "Followers"],
                ["0", "Reviews"],
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

      <div className="grid grid--2">
        <div className="card">
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
