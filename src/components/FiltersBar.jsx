import { SPOT_TYPES } from "../data/constants";
import { formatTagLabel } from "../hooks/useSpotFilters";

const PRICES = ["$", "$$", "$$$", "$$$$"];

/**
 * Reusable filter bar for spot listings.
 *
 * Props:
 *  - search, onSearchChange        — search input
 *  - activeType, onTypeChange       — category type filter
 *  - activePrices, onPriceToggle    — price filter (multi-select)
 *  - activeTags, onTagToggle        — tag chips (multi-select)
 *  - availableTags                  — derived from data
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
  availableTags,
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

      {/* Price + Tag chips */}
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

        {/* Tag chips */}
        <div className="filters-bar__section">
          <span className="filter-panel-label">Health Filters</span>
          <div className="filters-bar__chips">
            {availableTags.map((t) => (
              <button
                key={t}
                onClick={() => onTagToggle(t)}
                className={`pill-btn${activeTags.includes(t) ? " pill-btn--active" : ""}`}
              >
                {formatTagLabel(t)}
              </button>
            ))}
          </div>
        </div>
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
