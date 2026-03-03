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
 * Calculates a relevance score for a spot against a search query.
 * Higher scores = better match. Returns 0 if no match.
 */
function searchScore(spot, query) {
  const q = query.toLowerCase().trim();
  if (!q) return 1; // no query = everything matches equally

  const name = spot.name.toLowerCase();
  const type = spot.type.toLowerCase();
  const tags = spot.tags.map((t) => t.toLowerCase());
  const desc = (spot.desc || "").toLowerCase();
  const addr = (spot.address || "").toLowerCase();

  let score = 0;

  // Exact name match (highest)
  if (name === q) return 100;

  // Name starts with query
  if (name.startsWith(q)) score += 50;
  // Name contains query as a word boundary (e.g. "juice" matches "Vitality Juice Co")
  else if (name.includes(q)) score += 30;

  // Type match
  if (type === q) score += 25;
  else if (type.includes(q)) score += 15;

  // Tag exact match
  if (tags.some((t) => t === q || t.replace(/-/g, " ") === q)) score += 20;
  // Tag partial match
  else if (tags.some((t) => t.includes(q) || t.replace(/-/g, " ").includes(q)))
    score += 10;

  // Address match
  if (addr.includes(q)) score += 8;

  // Description match
  if (desc.includes(q)) score += 5;

  // Multi-word query: check if all words appear somewhere
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const haystack = `${name} ${type} ${tags.join(" ")} ${desc} ${addr}`;
    const allMatch = words.every((w) => haystack.includes(w));
    if (allMatch) score += 15;
  }

  return score;
}

/**
 * Reusable hook for filtering and searching spots.
 * Persists filter state in URL search params when syncUrl is true.
 */
export function useSpotFilters(spots, { sortBy = "trending", syncUrl = false } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Core filtering with relevance scoring
  const filteredSpots = useMemo(() => {
    const results = (spots || [])
      .map((s) => {
        // Type filter
        if (activeType !== "All" && s.type !== activeType) return null;
        // Price filter (OR within prices)
        if (activePrices.length > 0 && !activePrices.includes(s.price))
          return null;
        // Tag filter (OR — match any selected tag)
        if (
          activeTags.length > 0 &&
          !activeTags.some((tag) => s.tags.includes(tag))
        )
          return null;

        // Search with relevance scoring
        const score = searchScore(s, debouncedSearch);
        if (score === 0) return null;

        return { ...s, _searchScore: score };
      })
      .filter(Boolean);

    // Sort: if there's a search query, factor in relevance
    results.sort((a, b) => {
      if (debouncedSearch) {
        // Primary: relevance score, secondary: sortBy
        const scoreDiff = b._searchScore - a._searchScore;
        if (scoreDiff !== 0) return scoreDiff;
      }
      return sortBy === "trending"
        ? b.trending - a.trending
        : b.rating - a.rating;
    });

    return results;
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
