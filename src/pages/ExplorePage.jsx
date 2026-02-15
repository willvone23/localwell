import { useState } from "react";
import { useApi } from "../hooks/useApi";
import { FILTERS, SPOT_TYPES } from "../data/constants";
import SpotCard from "../components/SpotCard";
import SpotModal from "../components/SpotModal";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [activeType, setActiveType] = useState("All");
  const [sortBy, setSortBy] = useState("trending");
  const [showMap, setShowMap] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const { data: spots, loading, error } = useApi("/spots");

  const toggleFilter = (f) =>
    setActiveFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  const filtered = (spots || [])
    .filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.includes(search.toLowerCase()));
      const matchType = activeType === "All" || s.type === activeType;
      const matchFilters =
        activeFilters.length === 0 ||
        activeFilters.some((f) =>
          s.tags.some(
            (t) => t.toLowerCase() === f.toLowerCase().replace(" ", "-")
          )
        );
      return matchSearch && matchType && matchFilters;
    })
    .sort((a, b) =>
      sortBy === "trending" ? b.trending - a.trending : b.rating - a.rating
    );

  return (
    <div>
      <h2 className="page-title">Explore Near You</h2>

      {/* Search */}
      <div className="search-wrapper">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search spots, tags, or wellness goals..."
          className="search-input"
          aria-label="Search spots"
        />
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select-control"
          aria-label="Sort by"
        >
          <option value="trending">Most Trending</option>
          <option value="rating">Highest Rated</option>
        </select>
        <button
          onClick={() => setShowMap(!showMap)}
          className={`toggle-btn${showMap ? " toggle-btn--active" : ""}`}
        >
          {showMap ? "List" : "Map"}
        </button>
        <div style={{ marginLeft: "auto", color: "#6B7280", fontSize: 13 }}>
          {filtered.length} spots found
        </div>
      </div>

      {/* Spot Type Tabs */}
      <div className="filter-row">
        {SPOT_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`pill-btn pill-btn--dark${activeType === t ? " pill-btn--dark-active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Deep Filters */}
      <div className="filter-panel">
        <div className="filter-panel-label">Filter by Preference</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FILTERS.filter((f) => f !== "All").map((f) => (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              className={`pill-btn${activeFilters.includes(f) ? " pill-btn--active" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      {showMap && (
        <div className="map-placeholder">
          <div style={{ fontSize: 40, marginBottom: 12 }}>&#x1F5FA;&#xFE0F;</div>
          <div
            style={{
              fontWeight: 700,
              color: "#166534",
              fontSize: 16,
              marginBottom: 4,
            }}
          >
            Interactive Map
          </div>
          <div style={{ color: "#16A34A", fontSize: 13 }}>
            {filtered.length} healthy spots plotted near Birmingham, AL
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
            {filtered.slice(0, 4).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSpot(s)}
                className="map-spot-chip"
              >
                <span className="map-spot-dot" />
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="loading-state">Loading spots...</div>
      ) : error ? (
        <div className="error-state">
          <p>Failed to load spots. Please try again later.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 40, marginBottom: 12 }}>&#x1F50D;</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No spots found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Try adjusting your filters
          </div>
        </div>
      ) : (
        <div className="grid grid--4">
          {filtered.map((s) => (
            <SpotCard key={s.id} spot={s} onClick={setSelectedSpot} />
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
