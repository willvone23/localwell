import { useState } from "react";
import { useApi } from "../hooks/useApi";
import { useSpotFilters } from "../hooks/useSpotFilters";
import FiltersBar from "../components/FiltersBar";
import SpotCard from "../components/SpotCard";
import SpotModal from "../components/SpotModal";

export default function HomePage() {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const { data: spots, loading: spotsLoading, error: spotsError } = useApi("/spots");
  const { data: trends, loading: trendsLoading } = useApi("/trends");

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
  } = useSpotFilters(spots);

  const hotTrends = trends ? trends.filter((t) => t.hot).slice(0, 3) : [];

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-circle hero-bg-circle--1" />
        <div className="hero-bg-circle hero-bg-circle--2" />
        <h1 className="hero-title">Welcome back, Will</h1>
        <p className="hero-subtitle">
          Birmingham, AL &middot; 14 trending spots near you
        </p>
        <div className="stat-row">
          <div className="stat-card">
            <div className="stat-label">LOCAL SPOTS</div>
            <div className="stat-value">48</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">TRENDING NOW</div>
            <div className="stat-value">8</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">FOLLOWING</div>
            <div className="stat-value">127</div>
          </div>
        </div>
      </section>

      {/* What's Hot */}
      <section style={{ marginBottom: 32 }}>
        <div className="section-header">
          <h2 className="section-title">What&apos;s Hot Right Now</h2>
        </div>
        {trendsLoading ? (
          <div className="loading-state">Loading trends...</div>
        ) : (
          <div className="grid grid--3">
            {hotTrends.map((t) => (
              <div
                key={t.id}
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  position: "relative",
                  height: 200,
                }}
              >
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)",
                  }}
                />
                <div style={{ position: "absolute", top: 10, left: 10 }}>
                  <span className="overlay-tag">{t.category}</span>
                </div>
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <span className="hot-tag">&uarr; Hot</span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 14,
                    right: 14,
                  }}
                >
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 16,
                      marginBottom: 4,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#F59E0B", fontSize: 13 }}>
                      {"\u2605"} {t.rating}
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 12,
                      }}
                    >
                      {t.spots}+ spots
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top Healthy Spots */}
      <section>
        <div className="section-header">
          <div>
            <h2 className="section-title">Top Healthy Spots</h2>
            <p className="section-subtitle">
              Community favorites in your area
            </p>
          </div>
        </div>

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
          compact
        />

        {spotsLoading ? (
          <div className="loading-state">Loading spots...</div>
        ) : spotsError ? (
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
      </section>

      {selectedSpot && (
        <SpotModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
        />
      )}
    </div>
  );
}
