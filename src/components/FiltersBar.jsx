import { useState } from "react";
import { SPOT_TYPES, HEALTH_FILTER_GROUPS } from "../data/constants";

const PRICES = ["$", "$$", "$$$", "$$$$"];

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount =
    activePrices.length + activeTags.length + (activeType !== "All" ? 1 : 0);

  return (
    <div className="filters-bar">
      {/* Search with icon */}
      <div className="search-wrapper">
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search restaurants, gyms, wellness..."
          className="search-input search-input--with-icon"
          aria-label="Search spots"
        />
        {search && (
          <button
            className="search-clear"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
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

      {/* Collapsible filter panel toggle */}
      <div className="filters-bar__toggle-row">
        <button
          className={`filters-bar__toggle${filtersOpen ? " filters-bar__toggle--open" : ""}${activeFilterCount > 0 ? " filters-bar__toggle--has-active" : ""}`}
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="filters-bar__badge">{activeFilterCount}</span>
          )}
          <svg
            className={`filters-bar__chevron${filtersOpen ? " filters-bar__chevron--open" : ""}`}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {hasActiveFilters && (
          <button onClick={onClear} className="filters-bar__clear">
            Clear all
          </button>
        )}
      </div>

      {/* Collapsible Price + Health Filters */}
      {filtersOpen && (
        <div className="filter-panel filter-panel--animated">
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
      )}

      {/* Meta row: result count */}
      <div className="filters-bar__meta">
        <span className="filters-bar__count">
          {resultCount} {resultCount === 1 ? "spot" : "spots"} found
        </span>
      </div>
    </div>
  );
}
