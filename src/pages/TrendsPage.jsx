import { useState } from "react";
import { useApi } from "../hooks/useApi";
import { CATEGORIES } from "../data/constants";
import TrendCard from "../components/TrendCard";

export default function TrendsPage() {
  const [category, setCategory] = useState("All");
  const [filter, setFilter] = useState("");
  const { data: trends, loading, error } = useApi("/trends");

  const filtered = (trends || []).filter((t) => {
    const matchCat =
      category === "All" ||
      t.category.toLowerCase() === category.toLowerCase();
    const matchFilter =
      !filter ||
      filter === "all" ||
      (filter === "science" && t.badge === "Science-backed") ||
      (filter === "hot" && t.hot);
    return matchCat && matchFilter;
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 className="page-title">Health Trends</h2>
        <p className="page-subtitle">
          Ranked, reviewed, and science-checked by the community
        </p>
      </div>

      {/* Search + Filter Row */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Search trends..."
          value={filter === "science" || filter === "hot" ? "" : filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
          style={{ flex: 1, minWidth: 200 }}
          aria-label="Search trends"
        />
        <button
          onClick={() => setFilter(filter === "science" ? "" : "science")}
          className={`toggle-btn${filter === "science" ? " toggle-btn--green" : ""}`}
        >
          Science-Backed
        </button>
        <button
          onClick={() => setFilter(filter === "hot" ? "" : "hot")}
          className={`toggle-btn${filter === "hot" ? " toggle-btn--hot" : ""}`}
        >
          Hot Now
        </button>
      </div>

      {/* Category Tabs */}
      <div className="filter-row" style={{ marginBottom: 24 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`pill-btn pill-btn--dark${category === c ? " pill-btn--dark-active" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Hot Right Now Banner */}
      <div className="hot-banner">
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>
            Hot Right Now
          </div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>
            These trends are surging in Birmingham this week
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading trends...</div>
      ) : error ? (
        <div className="error-state">
          <p>Failed to load trends. Please try again later.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 40, marginBottom: 12 }}>&#x1F4C8;</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No trends found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Try adjusting your filters
          </div>
        </div>
      ) : (
        <div className="grid grid--3">
          {filtered.map((t) => (
            <TrendCard key={t.id} trend={t} />
          ))}
        </div>
      )}
    </div>
  );
}
