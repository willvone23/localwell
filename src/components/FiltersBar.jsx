import { SPOT_TYPES, HEALTH_FILTER_GROUPS } from "../data/constants";

const PRICES = ["$", "$$", "$$$", "$$$$"];

/**
 * Reusable filter bar for spot listings.
 *
 * Props:
 *  - search, onSearchChange        — search input
 *  - activeType, onTypeChange       — category type filter
 *  - activePrices, onPriceToggle    — price filter (multi-select)
 *  - activeTags, onTagToggle        — tag chips (multi-select)
 *  - hasActiveFilters, onClear      — clear state
 *  - resultCount                    — number of results
 *  - compact                        — if true, hide category row (for HomePage)
 */
export default function FiltersBar({
  search,
  onSearchChange,
  activeType,
  onTypeChange,
  activePrices,
  onPriceToggle,
  activeTags,
  onTagToggle,
  hasActiveFilters,
  onClear,
  resultCount,
  compact = false,
}) {
  return (
    <div className="filters-bar">
      {/* Search */}
      <div className="search-wrapper">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search spots, tags, or wellness goals..."
          className="search-input"
          aria-label="Search spots"
        />
      </div>

      {/* Category type tabs (hidden in compact mode) */}
      {!compact && (
        <div className="filter-row">
          {SPOT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => onTypeChange(t)}
              className={`pill-btn pill-btn--dark${activeType === t ? " pill-btn--dark-active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Price + Grouped Health Filters */}
      <div className="filter-panel">
        {/* Price row */}
        <div className="filters-bar__section">
          <span className="filter-panel-label">Price</span>
          <div className="filters-bar__chips">
            {PRICES.map((p) => (
              <button
                key={p}
                onClick={() => onPriceToggle(p)}
                className={`pill-btn${activePrices.includes(p) ? " pill-btn--active" : ""}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped health filters (Dietary, Fitness, Wellness) */}
        {HEALTH_FILTER_GROUPS.map((group) => (
          <div key={group.label} className="filters-bar__section">
            <span className="filter-panel-label">{group.label}</span>
            <div className="filters-bar__chips">
              {group.filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onTagToggle(f.id)}
                  className={`pill-btn${activeTags.includes(f.id) ? " pill-btn--active" : ""}`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Meta row: result count + clear */}
      <div className="filters-bar__meta">
        <span className="filters-bar__count">
          {resultCount} {resultCount === 1 ? "spot" : "spots"} found
        </span>
        {hasActiveFilters && (
          <button onClick={onClear} className="filters-bar__clear">
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
