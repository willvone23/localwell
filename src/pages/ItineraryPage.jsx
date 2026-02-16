import { useState } from "react";
import { ITINERARY_PREFS } from "../data/constants";

const ITINERARY = [
  { time: "7:00 AM", title: "Morning Movement", spot: "Zone Fitness Academy", type: "Zone 2 Cardio (45 min)", icon: "\ud83c\udfc3", color: "#3B82F6" },
  { time: "8:30 AM", title: "Post-Workout Fuel", spot: "The Nut Lab", type: "Macadamia latte + protein bowl", icon: "\u2615", color: "#F59E0B" },
  { time: "10:00 AM", title: "Recovery Session", spot: "Recovery Lab", type: "Cold plunge (4 min) + Red light (20 min)", icon: "\uD83E\uDDCA", color: "#06B6D4" },
  { time: "12:30 PM", title: "Lunch", spot: "Green Soul Kitchen", type: "Organic farm bowl, no seed oils", icon: "\ud83e\udd57", color: "#16A34A" },
  { time: "2:00 PM", title: "Supplement Stop", spot: "Functional Roots", type: "Lion's mane + magnesium glycinate", icon: "\ud83d\udc8a", color: "#8B5CF6" },
  { time: "4:30 PM", title: "Afternoon Class", spot: "Elevate Pilates", type: "Reformer class (55 min)", icon: "\ud83e\uddd8", color: "#EC4899" },
  { time: "7:00 PM", title: "Dinner", spot: "Keto Kitchen Lab", type: "Grass-fed ribeye + seasonal veg", icon: "\ud83e\udd69", color: "#EF4444" },
];

export default function ItineraryPage() {
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePref = (id) =>
    setSelectedPrefs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const generate = () => {
    if (selectedPrefs.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1500);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 className="page-title">Wellness Itinerary Builder</h2>
        <p className="page-subtitle">
          Tell us your goals and we&apos;ll build your perfect health day in
          Birmingham
        </p>
      </div>

      {!generated ? (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3
              style={{
                margin: "0 0 16px",
                fontSize: 16,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              What are your wellness priorities today?
            </h3>
            <div className="pref-grid">
              {ITINERARY_PREFS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePref(p.id)}
                  className={`pref-btn${selectedPrefs.includes(p.id) ? " pref-btn--active" : ""}`}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>
                    {p.emoji}
                  </div>
                  <div className="pref-label">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid--3" style={{ marginBottom: 20 }}>
            {[
              ["When?", "Today"],
              ["Duration?", "Full Day"],
              ["Area?", "Birmingham, AL"],
            ].map(([label, val]) => (
              <div key={label} className="info-card">
                <div className="info-label">{label}</div>
                <div className="info-value">{val}</div>
              </div>
            ))}
          </div>

          <button
            onClick={generate}
            disabled={selectedPrefs.length === 0}
            className={`btn-primary btn-full${selectedPrefs.length === 0 ? " btn-primary--disabled" : ""}`}
          >
            {loading
              ? "Building your itinerary..."
              : "Generate My Wellness Day"}
          </button>
          {selectedPrefs.length === 0 && (
            <p className="helper-text">Select at least one preference</p>
          )}
        </div>
      ) : (
        <div>
          <div className="itinerary-header">
            <div>
              <div className="itinerary-header-label">YOUR WELLNESS DAY</div>
              <div className="itinerary-header-title">
                Optimized for {selectedPrefs.length} Goals
              </div>
              <div className="itinerary-header-sub">
                Birmingham, AL &middot; Today &middot; 7 stops
              </div>
            </div>
            <button
              onClick={() => setGenerated(false)}
              className="btn-ghost"
            >
              &larr; Rebuild
            </button>
          </div>

          <div style={{ position: "relative" }}>
            {ITINERARY.map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 16, marginBottom: 20 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: item.color + "22",
                      border: `2px solid ${item.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  {i < ITINERARY.length - 1 && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        background: "#E5E7EB",
                        marginTop: 6,
                        minHeight: 20,
                      }}
                    />
                  )}
                </div>
                <div className="itinerary-item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div className="itinerary-time">{item.time}</div>
                      <div className="itinerary-title">{item.title}</div>
                      <div
                        className="itinerary-spot"
                        style={{ color: item.color }}
                      >
                        {item.spot}
                      </div>
                      <div className="itinerary-type">{item.type}</div>
                    </div>
                    <button className="btn-outline-sm">Book &rarr;</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-primary" style={{ flex: 1 }}>
              Share Itinerary
            </button>
            <button className="btn-secondary" style={{ flex: 1 }}>
              Save to Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
