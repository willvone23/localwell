import { useState } from "react";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const SPOTS = [
  { id: 1, name: "Vitality Juice Co", type: "Juice Bar", address: "123 Health Blvd", rating: 4.7, reviews: 312, price: "$$", tags: ["keto-friendly", "no-seed-oils", "organic", "nut-milk-coffee"], trending: 91, img: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80", lat: 33.749, lng: -84.388, verified: true, hours: "7am–8pm", desc: "Cold-pressed juices, nut milk lattes, and superfood bowls made with 100% organic ingredients. No seed oils ever." },
  { id: 2, name: "Recovery Lab", type: "Wellness Center", address: "321 Performance Dr", rating: 4.7, reviews: 76, price: "$$$$", tags: ["cold-plunge", "red-light", "sauna", "recovery"], trending: 88, img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80", lat: 33.752, lng: -84.392, verified: true, hours: "6am–10pm", desc: "Premier recovery facility featuring cold plunge pools, infrared saunas, red light therapy, and float tanks." },
  { id: 3, name: "Green Soul Kitchen", type: "Restaurant", address: "245 Wellness Ave", rating: 4.8, reviews: 234, price: "$$$", tags: ["plant-based", "organic", "no-seed-oils", "gluten-free"], trending: 85, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", lat: 33.746, lng: -84.385, verified: true, hours: "11am–9pm", desc: "Farm-to-table plant-based cuisine. Everything made in-house with organic produce from local farms." },
  { id: 4, name: "Keto Kitchen Lab", type: "Restaurant", address: "789 Protein Pl", rating: 4.4, reviews: 167, price: "$$", tags: ["keto-friendly", "carnivore", "no-seed-oils", "high-protein"], trending: 82, img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80", lat: 33.755, lng: -84.379, verified: true, hours: "10am–9pm", desc: "Strict keto meals, grass-fed meats, zero seed oils. Full macros listed on every item." },
  { id: 5, name: "Elevate Pilates", type: "Fitness Studio", address: "512 Core St", rating: 4.9, reviews: 445, price: "$$$", tags: ["pilates", "reformer", "barre", "low-impact"], trending: 79, img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80", lat: 33.743, lng: -84.391, verified: true, hours: "6am–8pm", desc: "Top-rated reformer pilates studio. 12 instructors, 40+ weekly classes. Beginner to advanced." },
  { id: 6, name: "Functional Roots", type: "Health Store", address: "88 Supplement Blvd", rating: 4.5, reviews: 189, price: "$$", tags: ["supplements", "adaptogens", "organic", "biohacking"], trending: 74, img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80", lat: 33.758, lng: -84.382, verified: true, hours: "9am–7pm", desc: "Curated supplements, adaptogens, and functional foods. Staff are all certified nutritionists." },
  { id: 7, name: "The Nut Lab", type: "Café", address: "44 Barista Lane", rating: 4.6, reviews: 203, price: "$$", tags: ["nut-milk-coffee", "organic", "plant-based", "gluten-free"], trending: 71, img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80", lat: 33.751, lng: -84.395, verified: true, hours: "7am–6pm", desc: "House-made oat, macadamia, and pistachio milk lattes. Speciality coffee sourced from regenerative farms." },
  { id: 8, name: "Zone Fitness Academy", type: "Gym", address: "200 Zone 2 Way", rating: 4.5, reviews: 312, price: "$$", tags: ["zone-2-cardio", "strength", "crossfit", "hiit"], trending: 68, img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80", lat: 33.744, lng: -84.387, verified: true, hours: "5am–11pm", desc: "Specialized programming built around Zone 2 cardio principles with strength integration." },
];

const TRENDS = [
  { id: 1, name: "Cold Plunge Therapy", category: "recovery", rating: 4.3, spots: 15, badge: "Science-backed", hot: true, img: "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&q=80", desc: "Deliberate cold exposure through ice baths or cold plunges to boost dopamine, reduce inflammation, and improve recovery. The most-searched wellness trend of 2025.", rise: "+240%", difficulty: "Moderate", cost: "$$" },
  { id: 2, name: "Adaptogenic Mushrooms", category: "supplements", rating: 4.5, spots: 18, badge: "Science-backed", hot: true, img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80", desc: "Functional mushrooms like lion's mane, reishi, cordyceps, and chaga used for cognitive enhancement, stress reduction, and immune support.", rise: "+185%", difficulty: "Easy", cost: "$" },
  { id: 3, name: "Zone 2 Cardio", category: "fitness", rating: 4.4, spots: 22, badge: "Science-backed", hot: true, img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80", desc: "Low-intensity steady-state cardio at 60-70% max heart rate. Builds mitochondrial density and metabolic efficiency without cortisol spike.", rise: "+162%", difficulty: "Easy", cost: "$" },
  { id: 4, name: "Red Light Therapy", category: "biohacking", rating: 4.2, spots: 14, badge: "Science-backed", hot: true, img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80", desc: "Red and near-infrared wavelengths to promote cellular regeneration, collagen production, and reduce inflammation.", rise: "+145%", difficulty: "Easy", cost: "$$$" },
  { id: 5, name: "Seed Cycling", category: "nutrition", rating: 4.1, spots: 8, badge: "Emerging", hot: true, img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80", desc: "Rotating seed consumption (flax, pumpkin, sesame, sunflower) to naturally support hormonal balance throughout the month.", rise: "+128%", difficulty: "Easy", cost: "$" },
  { id: 6, name: "No Seed Oil Diet", category: "nutrition", rating: 4.6, spots: 31, badge: "Trending", hot: false, img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80", desc: "Eliminating industrial seed oils (canola, soybean, corn) in favor of traditional fats like beef tallow, butter, and olive oil.", rise: "+310%", difficulty: "Moderate", cost: "$$" },
  { id: 7, name: "Carnivore Diet", category: "nutrition", rating: 4.0, spots: 12, badge: "Controversial", hot: false, img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80", desc: "Animal-only diet consisting primarily of red meat, organs, and animal fats. Proponents report reduced inflammation and mental clarity.", rise: "+195%", difficulty: "Hard", cost: "$$$" },
  { id: 8, name: "Reformer Pilates", category: "fitness", rating: 4.8, spots: 27, badge: "Mainstream", hot: false, img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80", desc: "Spring-resistance machine pilates that builds core strength, flexibility, and postural alignment. Exploded in popularity in 2024–2025.", rise: "+220%", difficulty: "Moderate", cost: "$$$" },
];

const FEED_POSTS = [
  { id: 1, user: "Sofia M.", handle: "@sofiawellness", avatar: "SM", color: "#4CAF50", time: "2h ago", content: "Just finished a 4-minute cold plunge at Recovery Lab 🧊 My dopamine is through the roof. If you haven't tried cold therapy yet, what are you waiting for?", spot: "Recovery Lab", img: "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&q=80", likes: 142, comments: 23, trend: "Cold Plunge" },
  { id: 2, user: "Marcus T.", handle: "@marcusfuels", avatar: "MT", color: "#FF7043", time: "4h ago", content: "Green Soul Kitchen's new seasonal bowl is unreal 🥗 Zero seed oils, all organic, and it actually tastes like food made by humans. This is what healthy eating should be.", spot: "Green Soul Kitchen", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", likes: 89, comments: 11, trend: null },
  { id: 3, user: "Priya K.", handle: "@priyabiohacks", avatar: "PK", color: "#9C27B0", time: "6h ago", content: "Day 30 of lion's mane and I genuinely cannot believe the difference in my focus. Picked up mine from Functional Roots — they carry the best brands.", spot: "Functional Roots", img: null, likes: 234, comments: 45, trend: "Adaptogenic Mushrooms" },
  { id: 4, user: "Jake R.", handle: "@jakezone2", avatar: "JR", color: "#1976D2", time: "1d ago", content: "Zone 2 cardio is the most underrated longevity tool that nobody talks about. 45 min easy ride, heart rate under 145 the whole time. Feel incredible.", spot: "Zone Fitness Academy", img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80", likes: 178, comments: 32, trend: "Zone 2 Cardio" },
];

const FILTERS = ["All", "Keto-Friendly", "No Seed Oils", "Plant-Based", "Organic", "Nut-Milk Coffee", "Cold Plunge", "Pilates", "Adaptogens", "Zone 2", "Sauna", "Red Light", "Gluten-Free", "Carnivore", "High-Protein"];
const CATEGORIES = ["All", "Nutrition", "Fitness", "Mental Wellness", "Supplements", "Lifestyle", "Recovery", "Biohacking"];
const SPOT_TYPES = ["All", "Restaurant", "Café", "Juice Bar", "Gym", "Wellness Center", "Fitness Studio", "Health Store"];

const ITINERARY_PREFS = [
  { id: "keto", label: "Keto Eating", emoji: "🥩" },
  { id: "pilates", label: "Pilates / Barre", emoji: "🧘" },
  { id: "cold-plunge", label: "Cold Plunge", emoji: "🧊" },
  { id: "supplements", label: "Supplement Shop", emoji: "💊" },
  { id: "plant-based", label: "Plant-Based Meals", emoji: "🥗" },
  { id: "red-light", label: "Red Light Therapy", emoji: "🔴" },
  { id: "nut-milk-coffee", label: "Specialty Coffee", emoji: "☕" },
  { id: "zone-2", label: "Zone 2 Cardio", emoji: "🏃" },
  { id: "sauna", label: "Sauna", emoji: "🔥" },
  { id: "organic", label: "Organic Grocery", emoji: "🛒" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const StarRating = ({ rating }) => (
  <span style={{ color: "#F59E0B", fontSize: 13, fontWeight: 600 }}>★ {rating}</span>
);

const Badge = ({ text, color = "#4CAF50" }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.02em" }}>{text}</span>
);

const Tag = ({ text }) => (
  <span style={{ background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0", borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 500 }}>#{text}</span>
);

const TrendingBadge = ({ pct }) => (
  <div style={{ background: "linear-gradient(135deg, #FF6B35, #FF4500)", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
    <span>↑</span> Trending +{pct}%
  </div>
);

const Avatar = ({ initials, color, size = 36 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
    {initials}
  </div>
);

// ─── SPOT CARD ────────────────────────────────────────────────────────────────
const SpotCard = ({ spot, onClick }) => (
  <div onClick={() => onClick(spot)} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", border: "1px solid #F3F4F6" }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}>
    <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
      <img src={spot.img} alt={spot.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", top: 10, left: 10 }}><TrendingBadge pct={spot.trending} /></div>
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <span style={{ background: "#1A1A2E", color: "#fff", borderRadius: 8, padding: "3px 8px", fontSize: 12, fontWeight: 600 }}>{spot.price}</span>
      </div>
      <div style={{ position: "absolute", bottom: 10, left: 10 }}>
        <span style={{ background: "rgba(255,255,255,0.92)", color: "#374151", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{spot.type}</span>
      </div>
    </div>
    <div style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>{spot.name}</h3>
        <StarRating rating={spot.rating} />
      </div>
      <p style={{ margin: "0 0 8px", fontSize: 12, color: "#6B7280" }}>📍 {spot.address} · ({spot.reviews} reviews)</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {spot.tags.slice(0, 3).map(t => <Tag key={t} text={t} />)}
      </div>
    </div>
  </div>
);

// ─── TREND CARD ───────────────────────────────────────────────────────────────
const TrendCard = ({ trend }) => (
  <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #F3F4F6" }}>
    <div style={{ position: "relative", height: 200 }}>
      <img src={trend.img} alt={trend.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
      <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
        <span style={{ background: "#fff", color: "#374151", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{trend.category}</span>
        {trend.hot && <span style={{ background: "#FF4500", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>🔥 Hot</span>}
      </div>
      <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
        <h3 style={{ margin: 0, color: "#fff", fontSize: 18, fontWeight: 800 }}>{trend.name}</h3>
      </div>
    </div>
    <div style={{ padding: "14px 16px" }}>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>{trend.desc.substring(0, 100)}...</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <StarRating rating={trend.rating} />
          <span style={{ fontSize: 12, color: "#6B7280" }}>· {trend.spots}+ spots</span>
        </div>
        <Badge text={trend.badge} color={trend.badge === "Science-backed" ? "#16A34A" : trend.badge === "Controversial" ? "#DC2626" : "#D97706"} />
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 10, paddingTop: 10, borderTop: "1px solid #F3F4F6" }}>
        <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>📈 {trend.rise} searches</span>
        <span style={{ fontSize: 12, color: "#6B7280" }}>Difficulty: {trend.difficulty}</span>
        <span style={{ fontSize: 12, color: "#6B7280" }}>Cost: {trend.cost}</span>
      </div>
    </div>
  </div>
);

// ─── SPOT DETAIL MODAL ────────────────────────────────────────────────────────
const SpotModal = ({ spot, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto" }}>
      <div style={{ position: "relative", height: 260 }}>
        <img src={spot.img} alt={spot.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px 20px 0 0" }} />
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>×</button>
      </div>
      <div style={{ padding: "24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#111827" }}>{spot.name}</h2>
            <p style={{ margin: "4px 0 0", color: "#6B7280", fontSize: 14 }}>{spot.type} · {spot.address}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#F59E0B" }}>★ {spot.rating}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{spot.reviews} reviews</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <span style={{ background: "#F3F4F6", padding: "4px 12px", borderRadius: 20, fontSize: 13, color: "#374151" }}>⏰ {spot.hours}</span>
          <span style={{ background: "#F3F4F6", padding: "4px 12px", borderRadius: 20, fontSize: 13, color: "#374151" }}>{spot.price}</span>
        </div>
        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{spot.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
          {spot.tags.map(t => <Tag key={t} text={t} />)}
        </div>
        <div style={{ background: "#F0FDF4", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>📍 Location</div>
          <div style={{ background: "#D1FAE5", borderRadius: 8, height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A", fontWeight: 600, fontSize: 14 }}>
            🗺️ Map View · {spot.address}
          </div>
        </div>
        <button style={{ width: "100%", background: "linear-gradient(135deg, #16A34A, #4CAF50)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Get Directions
        </button>
      </div>
    </div>
  </div>
);

// ─── HOME VIEW ────────────────────────────────────────────────────────────────
const HomeView = ({ onSpotClick }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = activeFilter === "All" ? SPOTS : SPOTS.filter(s => s.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase().replace(" ", "-")));

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #166534 100%)", borderRadius: 20, padding: "32px 28px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 200, height: 200, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -20, right: 60, width: 140, height: 140, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>Welcome back, Will 👋</h1>
        <p style={{ margin: "0 0 20px", color: "#A7F3D0", fontSize: 15 }}>Birmingham, AL · 14 trending spots near you</p>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "12px 16px", flex: 1, backdropFilter: "blur(10px)" }}>
            <div style={{ color: "#A7F3D0", fontSize: 11, fontWeight: 600, marginBottom: 2 }}>LOCAL SPOTS</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>48</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "12px 16px", flex: 1, backdropFilter: "blur(10px)" }}>
            <div style={{ color: "#A7F3D0", fontSize: 11, fontWeight: 600, marginBottom: 2 }}>TRENDING NOW</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>8 🔥</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "12px 16px", flex: 1, backdropFilter: "blur(10px)" }}>
            <div style={{ color: "#A7F3D0", fontSize: 11, fontWeight: 600, marginBottom: 2 }}>FOLLOWING</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>127</div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 24 }}>
        {FILTERS.slice(0, 10).map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{ flexShrink: 0, background: activeFilter === f ? "#16A34A" : "#fff", color: activeFilter === f ? "#fff" : "#374151", border: `1px solid ${activeFilter === f ? "#16A34A" : "#E5E7EB"}`, borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
            {f}
          </button>
        ))}
      </div>

      {/* What's Hot */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>🔥 What's Hot Right Now</h2>
          <span style={{ color: "#16A34A", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>View All →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {TRENDS.filter(t => t.hot).slice(0, 3).map(t => (
            <div key={t.id} style={{ borderRadius: 14, overflow: "hidden", position: "relative", height: 200 }}>
              <img src={t.img} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", top: 10, left: 10 }}>
                <span style={{ background: "rgba(255,255,255,0.9)", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#374151" }}>{t.category}</span>
              </div>
              <div style={{ position: "absolute", top: 10, right: 10 }}>
                <span style={{ background: "#FF4500", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#fff" }}>↑ Hot</span>
              </div>
              <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{t.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#F59E0B", fontSize: 13 }}>★ {t.rating}</span>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{t.spots}+ spots</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Healthy Spots */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>Top Healthy Spots</h2>
            <p style={{ margin: "2px 0 0", color: "#6B7280", fontSize: 13 }}>Community favorites in your area</p>
          </div>
          <span style={{ color: "#16A34A", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>View All →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {filtered.map(s => <SpotCard key={s.id} spot={s} onClick={onSpotClick} />)}
        </div>
      </div>
    </div>
  );
};

// ─── EXPLORE VIEW ─────────────────────────────────────────────────────────────
const ExploreView = ({ onSpotClick }) => {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [activeType, setActiveType] = useState("All");
  const [sortBy, setSortBy] = useState("trending");
  const [showMap, setShowMap] = useState(false);

  const toggleFilter = (f) => setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const filtered = SPOTS.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.tags.some(t => t.includes(search.toLowerCase()));
    const matchType = activeType === "All" || s.type === activeType;
    const matchFilters = activeFilters.length === 0 || activeFilters.some(f => s.tags.some(t => t.toLowerCase() === f.toLowerCase().replace(" ", "-")));
    return matchSearch && matchType && matchFilters;
  }).sort((a, b) => sortBy === "trending" ? b.trending - a.trending : b.rating - a.rating);

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 24, fontWeight: 800, color: "#111827" }}>Explore Near You</h2>
      
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 18 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search spots, tags, or wellness goals..." style={{ width: "100%", padding: "14px 16px 14px 48px", borderRadius: 14, border: "1px solid #E5E7EB", fontSize: 14, background: "#fff", boxSizing: "border-box", outline: "none" }} />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", fontSize: 13, cursor: "pointer" }}>
          <option value="trending">Most Trending</option>
          <option value="rating">Highest Rated</option>
        </select>
        <button onClick={() => setShowMap(!showMap)} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #E5E7EB", background: showMap ? "#16A34A" : "#fff", color: showMap ? "#fff" : "#374151", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
          {showMap ? "📋 List" : "🗺️ Map"}
        </button>
        <div style={{ marginLeft: "auto", color: "#6B7280", fontSize: 13 }}>{filtered.length} spots found</div>
      </div>

      {/* Spot Type Tabs */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
        {SPOT_TYPES.map(t => (
          <button key={t} onClick={() => setActiveType(t)} style={{ flexShrink: 0, background: activeType === t ? "#111827" : "#fff", color: activeType === t ? "#fff" : "#6B7280", border: `1px solid ${activeType === t ? "#111827" : "#E5E7EB"}`, borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Deep Filters */}
      <div style={{ background: "#F9FAFB", borderRadius: 14, padding: "14px 16px", marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Filter by Preference</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FILTERS.filter(f => f !== "All").map(f => (
            <button key={f} onClick={() => toggleFilter(f)} style={{ background: activeFilters.includes(f) ? "#16A34A" : "#fff", color: activeFilters.includes(f) ? "#fff" : "#374151", border: `1px solid ${activeFilters.includes(f) ? "#16A34A" : "#E5E7EB"}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      {showMap && (
        <div style={{ background: "#E8F5E9", borderRadius: 16, height: 320, marginBottom: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #A7F3D0", position: "relative" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
          <div style={{ fontWeight: 700, color: "#166534", fontSize: 16, marginBottom: 4 }}>Interactive Map</div>
          <div style={{ color: "#16A34A", fontSize: 13 }}>{filtered.length} healthy spots plotted near Birmingham, AL</div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {filtered.slice(0, 4).map(s => (
              <div key={s.id} onClick={() => onSpotClick(s)} style={{ background: "#fff", borderRadius: 10, padding: "8px 12px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontSize: 12, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, background: "#16A34A", borderRadius: "50%", display: "inline-block" }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {filtered.map(s => <SpotCard key={s.id} spot={s} onClick={onSpotClick} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No spots found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filters</div>
        </div>
      )}
    </div>
  );
};

// ─── TRENDS VIEW ──────────────────────────────────────────────────────────────
const TrendsView = () => {
  const [category, setCategory] = useState("All");
  const [filter, setFilter] = useState("");
  
  const filtered = TRENDS.filter(t => {
    const matchCat = category === "All" || t.category.toLowerCase() === category.toLowerCase();
    const matchFilter = !filter || filter === "all" || (filter === "science" && t.badge === "Science-backed") || (filter === "hot" && t.hot);
    return matchCat && matchFilter;
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#111827" }}>Health Trends</h2>
        <p style={{ margin: 0, color: "#6B7280", fontSize: 14 }}>Ranked, reviewed, and science-checked by the community</p>
      </div>

      {/* Search + Filter Row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input placeholder="Search trends..." value={filter === "science" || filter === "hot" ? "" : filter} onChange={e => setFilter(e.target.value)} style={{ flex: 1, padding: "10px 16px", borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 13, outline: "none" }} />
        <button onClick={() => setFilter("science")} style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid #E5E7EB", background: filter === "science" ? "#16A34A" : "#fff", color: filter === "science" ? "#fff" : "#374151", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>✅ Science-Backed</button>
        <button onClick={() => setFilter("hot")} style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid #E5E7EB", background: filter === "hot" ? "#FF4500" : "#fff", color: filter === "hot" ? "#fff" : "#374151", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>🔥 Hot Now</button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 24 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ flexShrink: 0, background: category === c ? "#111827" : "#fff", color: category === c ? "#fff" : "#6B7280", border: `1px solid ${category === c ? "#111827" : "#E5E7EB"}`, borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Hot Right Now Banner */}
      <div style={{ background: "linear-gradient(135deg, #FF6B35, #FF4500)", borderRadius: 14, padding: "12px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 24 }}>🔥</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Hot Right Now</div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>These trends are surging in Birmingham this week</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {filtered.map(t => <TrendCard key={t.id} trend={t} />)}
      </div>
    </div>
  );
};

// ─── ITINERARY VIEW ───────────────────────────────────────────────────────────
const ItineraryView = () => {
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePref = (id) => setSelectedPrefs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const generate = () => {
    if (selectedPrefs.length === 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 1500);
  };

  const itinerary = [
    { time: "7:00 AM", title: "Morning Movement", spot: "Zone Fitness Academy", type: "Zone 2 Cardio (45 min)", icon: "🏃", color: "#3B82F6" },
    { time: "8:30 AM", title: "Post-Workout Fuel", spot: "The Nut Lab", type: "Macadamia latte + protein bowl", icon: "☕", color: "#F59E0B" },
    { time: "10:00 AM", title: "Recovery Session", spot: "Recovery Lab", type: "Cold plunge (4 min) + Red light (20 min)", icon: "🧊", color: "#06B6D4" },
    { time: "12:30 PM", title: "Lunch", spot: "Green Soul Kitchen", type: "Organic farm bowl, no seed oils", icon: "🥗", color: "#16A34A" },
    { time: "2:00 PM", title: "Supplement Stop", spot: "Functional Roots", type: "Lion's mane + magnesium glycinate", icon: "💊", color: "#8B5CF6" },
    { time: "4:30 PM", title: "Afternoon Class", spot: "Elevate Pilates", type: "Reformer class (55 min)", icon: "🧘", color: "#EC4899" },
    { time: "7:00 PM", title: "Dinner", spot: "Keto Kitchen Lab", type: "Grass-fed ribeye + seasonal veg", icon: "🥩", color: "#EF4444" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#111827" }}>Wellness Itinerary Builder</h2>
        <p style={{ margin: 0, color: "#6B7280", fontSize: 14 }}>Tell us your goals and we'll build your perfect health day in Birmingham</p>
      </div>

      {!generated ? (
        <div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #E5E7EB", marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#111827" }}>What are your wellness priorities today?</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              {ITINERARY_PREFS.map(p => (
                <button key={p.id} onClick={() => togglePref(p.id)} style={{ background: selectedPrefs.includes(p.id) ? "#F0FDF4" : "#F9FAFB", border: `2px solid ${selectedPrefs.includes(p.id) ? "#16A34A" : "#E5E7EB"}`, borderRadius: 12, padding: "14px 10px", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{p.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: selectedPrefs.includes(p.id) ? "#16A34A" : "#374151" }}>{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[["📅 When?", "Today"], ["⏱ Duration?", "Full Day"], ["📍 Area?", "Birmingham, AL"]].map(([label, val]) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{val}</div>
              </div>
            ))}
          </div>

          <button onClick={generate} disabled={selectedPrefs.length === 0} style={{ width: "100%", background: selectedPrefs.length > 0 ? "linear-gradient(135deg, #16A34A, #4CAF50)" : "#E5E7EB", color: selectedPrefs.length > 0 ? "#fff" : "#9CA3AF", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 700, cursor: selectedPrefs.length > 0 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
            {loading ? "Building your itinerary..." : "✨ Generate My Wellness Day"}
          </button>
          {selectedPrefs.length === 0 && <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: 13, marginTop: 8 }}>Select at least one preference</p>}
        </div>
      ) : (
        <div>
          <div style={{ background: "linear-gradient(135deg, #064E3B, #065F46)", borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#A7F3D0", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>YOUR WELLNESS DAY</div>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>Optimized for {selectedPrefs.length} Goals</div>
              <div style={{ color: "#A7F3D0", fontSize: 13, marginTop: 2 }}>Birmingham, AL · Today · 7 stops</div>
            </div>
            <button onClick={() => setGenerated(false)} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
              ← Rebuild
            </button>
          </div>

          <div style={{ position: "relative" }}>
            {itinerary.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: item.color + "22", border: `2px solid ${item.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                  {i < itinerary.length - 1 && <div style={{ width: 2, flex: 1, background: "#E5E7EB", marginTop: 6, marginBottom: 0, minHeight: 20 }} />}
                </div>
                <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", flex: 1, marginBottom: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, marginBottom: 2 }}>{item.time}</div>
                      <div style={{ fontWeight: 700, color: "#111827", fontSize: 15, marginBottom: 2 }}>{item.title}</div>
                      <div style={{ fontWeight: 600, color: item.color, fontSize: 13, marginBottom: 2 }}>{item.spot}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{item.type}</div>
                    </div>
                    <button style={{ background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Book →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ flex: 1, background: "linear-gradient(135deg, #16A34A, #4CAF50)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>📤 Share Itinerary</button>
            <button style={{ flex: 1, background: "#fff", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>💾 Save to Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── FEED VIEW ────────────────────────────────────────────────────────────────
const FeedView = () => {
  const [liked, setLiked] = useState([]);
  const toggleLike = (id) => setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#111827" }}>Community Feed</h2>
          <p style={{ margin: 0, color: "#6B7280", fontSize: 14 }}>What the LocalWell community is discovering</p>
        </div>
        <button style={{ background: "linear-gradient(135deg, #16A34A, #4CAF50)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ New Post</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>
        <div>
          {FEED_POSTS.map(post => (
            <div key={post.id} style={{ background: "#fff", borderRadius: 16, padding: "20px", marginBottom: 16, border: "1px solid #E5E7EB" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <Avatar initials={post.avatar} color={post.color} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{post.user}</span>
                      <span style={{ color: "#9CA3AF", fontSize: 13, marginLeft: 6 }}>{post.handle}</span>
                    </div>
                    <span style={{ color: "#9CA3AF", fontSize: 12 }}>{post.time}</span>
                  </div>
                  {post.trend && <span style={{ background: "#FEF3C7", color: "#D97706", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, display: "inline-block", marginTop: 4 }}>🔥 {post.trend}</span>}
                </div>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{post.content}</p>
              {post.img && <img src={post.img} alt="" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12, marginBottom: 12 }} />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <button onClick={() => toggleLike(post.id)} style={{ background: "none", border: "none", cursor: "pointer", color: liked.includes(post.id) ? "#EF4444" : "#6B7280", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                    {liked.includes(post.id) ? "❤️" : "🤍"} {post.likes + (liked.includes(post.id) ? 1 : 0)}
                  </button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 500 }}>💬 {post.comments}</button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontWeight: 500 }}>↗ Share</button>
                </div>
                <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>📍 {post.spot}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "1px solid #E5E7EB", marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#111827" }}>Trending Tags</h3>
            {["#coldplunge", "#noSeedOils", "#zone2cardio", "#lionsmane", "#reformerpilates", "#organicEats"].map(tag => (
              <div key={tag} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ color: "#16A34A", fontSize: 13, fontWeight: 600 }}>{tag}</span>
                <span style={{ color: "#9CA3AF", fontSize: 12 }}>{Math.floor(Math.random() * 900 + 100)} posts</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "1px solid #E5E7EB" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#111827" }}>Who to Follow</h3>
            {[{ n: "Alex Chen", h: "@alexoptimized", c: "#FF7043" }, { n: "Dr. Sarah K.", h: "@dramindmatter", c: "#9C27B0" }, { n: "Fit Dad Jim", h: "@jimfunctional", c: "#1976D2" }].map(u => (
              <div key={u.h} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Avatar initials={u.n.split(" ").map(x => x[0]).join("")} color={u.c} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{u.n}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{u.h}</div>
                </div>
                <button style={{ background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0", borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Follow</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PROFILE VIEW ─────────────────────────────────────────────────────────────
const ProfileView = () => (
  <div>
    <div style={{ background: "linear-gradient(135deg, #064E3B, #065F46)", borderRadius: 20, padding: "28px", marginBottom: 24, position: "relative" }}>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
        <Avatar initials="W" color="#16A34A" size={72} />
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#fff" }}>Will vonEschenbach</h2>
          <p style={{ margin: "0 0 12px", color: "#A7F3D0", fontSize: 14 }}>@will · Birmingham, AL</p>
          <div style={{ display: "flex", gap: 16 }}>
            {[["127", "Following"], ["84", "Followers"], ["23", "Reviews"], ["8", "Itineraries"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{n}</div>
                <div style={{ color: "#A7F3D0", fontSize: 12 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <button style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "8px 18px", fontSize: 13, cursor: "pointer" }}>Edit Profile</button>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "1px solid #E5E7EB" }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#111827" }}>🏆 My Health Stack</h3>
        {[["Lion's Mane", "Morning", "💊"], ["Zone 2 Cardio", "3x Week", "🏃"], ["Cold Plunge", "Daily", "🧊"], ["Reformer Pilates", "2x Week", "🧘"], ["No Seed Oils", "Strict", "🥩"]].map(([item, freq, emoji]) => (
          <div key={item} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
            <span style={{ fontSize: 13, color: "#374151" }}>{emoji} {item}</span>
            <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>{freq}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "1px solid #E5E7EB" }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#111827" }}>⭐ My Reviews</h3>
        {SPOTS.slice(0, 4).map(s => (
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
            <span style={{ fontSize: 13, color: "#374151" }}>{s.name}</span>
            <StarRating rating={s.rating} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function LocalWell() {
  const [activeView, setActiveView] = useState("home");
  const [selectedSpot, setSelectedSpot] = useState(null);

  const NAV = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "explore", label: "Explore", icon: "🔍" },
    { id: "itinerary", label: "Itinerary", icon: "✨" },
    { id: "trends", label: "Trends", icon: "📈" },
    { id: "feed", label: "Feed", icon: "👥" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 40 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #16A34A, #4CAF50)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
            <span style={{ fontWeight: 900, fontSize: 18, color: "#111827", letterSpacing: "-0.5px" }}>LocalWell</span>
          </div>

          <nav style={{ display: "flex", gap: 4, flex: 1 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setActiveView(n.id)} style={{ background: activeView === n.id ? "#F0FDF4" : "transparent", color: activeView === n.id ? "#16A34A" : "#6B7280", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 14, fontWeight: activeView === n.id ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>{n.icon}</span> {n.label}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6B7280" }}>🔔</button>
            <button onClick={() => setActiveView("profile")} style={{ display: "flex", alignItems: "center", gap: 8, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 20, padding: "6px 14px 6px 6px", cursor: "pointer" }}>
              <Avatar initials="W" color="#16A34A" size={26} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Will</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {activeView === "home" && <HomeView onSpotClick={setSelectedSpot} />}
        {activeView === "explore" && <ExploreView onSpotClick={setSelectedSpot} />}
        {activeView === "trends" && <TrendsView />}
        {activeView === "itinerary" && <ItineraryView />}
        {activeView === "feed" && <FeedView />}
        {activeView === "profile" && <ProfileView />}
      </div>

      {selectedSpot && <SpotModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />}
    </div>
  );
}
