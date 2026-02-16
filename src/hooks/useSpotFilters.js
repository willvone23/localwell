import { useState, useEffect, useMemo } from "react";

/**
 * Formats a kebab-case tag into a display label.
 * "keto-friendly" → "Keto Friendly", "no-seed-oils" → "No Seed Oils"
 */
export function formatTagLabel(tag) {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Reusable hook for filtering and searching spots.
 *
 * @param {Array} spots - array of spot objects
 * @param {Object} options
 * @param {string} options.sortBy - "trending" | "rating"
 * @returns filter state, setters, filtered results
 */
export function useSpotFilters(spots, { sortBy = "trending" } = {}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activePrices, setActivePrices] = useState([]);
  const [activeTags, setActiveTags] = useState([]);

  // Debounce search input (250ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Derive unique tags that actually exist in the data
  const availableTags = useMemo(() => {
    if (!spots) return [];
    const tagSet = new Set();
    spots.forEach((s) => s.tags.forEach((t) => tagSet.add(t)));
    return [...tagSet].sort();
  }, [spots]);

  // Toggle helpers
  const togglePrice = (p) =>
    setActivePrices((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );

  const toggleTag = (t) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  // Core filtering: filters first, then search
  const filteredSpots = useMemo(() => {
    return (spots || [])
      .filter((s) => {
        // Type filter
        if (activeType !== "All" && s.type !== activeType) return false;
        // Price filter (OR within prices)
        if (activePrices.length > 0 && !activePrices.includes(s.price))
          return false;
        // Tag filter (OR — match any selected tag)
        if (
          activeTags.length > 0 &&
          !activeTags.some((tag) => s.tags.includes(tag))
        )
          return false;
        // Search applies after filters (partial match on name, type, tags)
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          const matchName = s.name.toLowerCase().includes(q);
          const matchType = s.type.toLowerCase().includes(q);
          const matchTags = s.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchType && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) =>
        sortBy === "trending"
          ? b.trending - a.trending
          : b.rating - a.rating
      );
  }, [spots, activeType, activePrices, activeTags, debouncedSearch, sortBy]);

  const hasActiveFilters =
    activeType !== "All" ||
    activePrices.length > 0 ||
    activeTags.length > 0 ||
    search !== "";

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setActiveType("All");
    setActivePrices([]);
    setActiveTags([]);
  };

  return {
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
    resultCount: filteredSpots.length,
  };
}
