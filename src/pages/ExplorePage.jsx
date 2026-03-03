import { useState } from "react";
import { useApi } from "../hooks/useApi";
import { useSpotFilters } from "../hooks/useSpotFilters";
import FiltersBar from "../components/FiltersBar";
import SpotCard from "../components/SpotCard";
import SpotModal from "../components/SpotModal";
import SpotMap from "../components/SpotMap";

export default function ExplorePage() {
  const [sortBy, setSortBy] = useState("trending");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [viewMode, setViewMode] = useState("split"); // "split" | "list" | "map"

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
    hasActiveFilters,
    clearFilters,
    resultCount,
  } = useSpotFilters(spots, { sortBy, syncUrl: true });

  const showMap = viewMode === "split" || viewMode === "map";
  const showList = viewMode === "split" || viewMode === "list";

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
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
        resultCount={resultCount}
      />

      {/* Sort + View Mode controls */}
      <div className="explore-controls">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select-control"
          aria-label="Sort by"
        >
          <option value="trending">Most Trending</option>
          <option value="rating">Highest Rated</option>
        </select>
        <div className="view-toggle">
          <button
            onClick={() => setViewMode("split")}
            className={`view-toggle__btn${viewMode === "split" ? " view-toggle__btn--active" : ""}`}
            aria-label="Split view"
            title="Split view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="18" rx="2" />
              <rect x="14" y="3" width="7" height="18" rx="2" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`view-toggle__btn${viewMode === "list" ? " view-toggle__btn--active" : ""}`}
            aria-label="List view"
            title="List view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`view-toggle__btn${viewMode === "map" ? " view-toggle__btn--active" : ""}`}
            aria-label="Map view"
            title="Map view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
          </button>
        </div>
      </div>

      {/* Split layout: map + list side by side on desktop */}
      <div className={`explore-layout explore-layout--${viewMode}`}>
        {/* Map panel */}
        {showMap && (
          <div className="explore-layout__map">
            <SpotMap
              spots={filteredSpots}
              selectedSpot={selectedSpot}
              onSpotClick={setSelectedSpot}
            />
          </div>
        )}

        {/* List panel */}
        {showList && (
          <div className="explore-layout__list">
            {loading ? (
              <div className="loading-state">Loading spots...</div>
            ) : error ? (
              <div className="error-state">
                <p>Failed to load spots. Please try again later.</p>
              </div>
            ) : filteredSpots.length === 0 ? (
              <div className="empty-state empty-state--explore">
                <svg className="empty-state__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                <div className="empty-state__title">No spots match your search</div>
                <div className="empty-state__subtitle">
                  Try broadening your filters or searching for something different
                </div>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn-outline-sm" style={{ marginTop: 12 }}>
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === "split" ? "grid grid--2" : "grid grid--4"}>
                {filteredSpots.map((s) => (
                  <SpotCard key={s.id} spot={s} onClick={setSelectedSpot} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedSpot && (
        <SpotModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
        />
      )}
    </div>
  );
}
