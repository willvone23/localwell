import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

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
 * Persists filter state in URL search params when syncUrl is true.
 *
 * @param {Array} spots - array of spot objects
 * @param {Object} options
 * @param {string} options.sortBy - "trending" | "rating"
 * @param {boolean} options.syncUrl - persist filters in URL params (default false)
 * @returns filter state, setters, filtered results
 */
export function useSpotFilters(spots, { sortBy = "trending", syncUrl = false } = {}) {
  // Always call the hook (Rules of Hooks) — just ignore it when syncUrl is false
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params when syncUrl is enabled
  const initFromParams = (key, fallback) => {
    if (!syncUrl) return fallback;
    const val = searchParams.get(key);
    return val !== null ? val : fallback;
  };

  const initArrayFromParams = (key) => {
    if (!syncUrl) return [];
    const val = searchParams.get(key);
    return val ? val.split(",") : [];
  };

  const [search, setSearch] = useState(() => initFromParams("q", ""));
  const [debouncedSearch, setDebouncedSearch] = useState(() => initFromParams("q", ""));
  const [activeType, setActiveType] = useState(() => initFromParams("type", "All"));
  const [activePrices, setActivePrices] = useState(() => initArrayFromParams("price"));
  const [activeTags, setActiveTags] = useState(() => initArrayFromParams("tags"));

  // Sync state to URL params
  const syncToUrl = useCallback(() => {
    if (!syncUrl) return;
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (activeType !== "All") params.set("type", activeType);
    if (activePrices.length > 0) params.set("price", activePrices.join(","));
    if (activeTags.length > 0) params.set("tags", activeTags.join(","));
    setSearchParams(params, { replace: true });
  }, [syncUrl, debouncedSearch, activeType, activePrices, activeTags, setSearchParams]);

  useEffect(() => {
    syncToUrl();
  }, [syncToUrl]);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
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
        // Search applies after filters (partial match on name, type, tags, desc, address)
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          const matchName = s.name.toLowerCase().includes(q);
          const matchType = s.type.toLowerCase().includes(q);
          const matchTags = s.tags.some((t) => t.toLowerCase().includes(q));
          const matchDesc = s.desc && s.desc.toLowerCase().includes(q);
          const matchAddr = s.address && s.address.toLowerCase().includes(q);
          if (!matchName && !matchType && !matchTags && !matchDesc && !matchAddr) return false;
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
