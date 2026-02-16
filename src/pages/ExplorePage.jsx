import { useState } from "react";
import { useApi } from "../hooks/useApi";
import { useSpotFilters } from "../hooks/useSpotFilters";
import FiltersBar from "../components/FiltersBar";
import SpotCard from "../components/SpotCard";
import SpotModal from "../components/SpotModal";

export default function ExplorePage() {
  const [sortBy, setSortBy] = useState("trending");
  const [showMap, setShowMap] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const { data: spots, loading, error } = useApi("/spots");

  const {
    filteredSpots,
    search,
    setSearch,
    activeType,
    setActiveType,
    activePrices,
    togglePrice,
    activeTags,
    toggleTag,
    availableTags,
    hasActiveFilters,
    clearFilters,
    resultCount,
  } = useSpotFilters(spots, { sortBy });

  return (
    <div>
      <h2 className="page-title">Explore Near You</h2>

      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        activeType={activeType}
        onTypeChange={setActiveType}
        activePrices={activePrices}
        onPriceToggle={togglePrice}
        activeTags={activeTags}
        onTagToggle={toggleTag}
        availableTags={availableTags}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
        resultCount={resultCount}
      />

      {/* Sort + Map controls */}
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
            {resultCount} healthy spots plotted near Birmingham, AL
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
            {filteredSpots.slice(0, 4).map((s) => (
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
      ) : filteredSpots.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 40, marginBottom: 12 }}>&#x1F50D;</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No results</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Try clearing filters.
          </div>
        </div>
      ) : (
        <div className="grid grid--4">
          {filteredSpots.map((s) => (
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
