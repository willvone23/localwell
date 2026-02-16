import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { spots, trends, feedPosts } from "../data/embedded";

const EMBEDDED = {
  "/spots": spots,
  "/trends": trends,
  "/feed": feedPosts,
};

// Map API paths to Supabase table names and transforms
const TABLE_MAP = {
  "/spots": {
    table: "spots",
    transform: (row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      address: row.address,
      rating: Number(row.rating),
      reviews: row.reviews_count,
      price: row.price,
      tags: row.tags || [],
      trending: row.trending,
      img: row.img,
      lat: row.lat ? Number(row.lat) : null,
      lng: row.lng ? Number(row.lng) : null,
      verified: row.verified,
      hours: row.hours,
      desc: row.description,
    }),
  },
  "/trends": {
    table: "trends",
    transform: (row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      rating: Number(row.rating),
      spots: row.spots_count,
      badge: row.badge,
      hot: row.hot,
      img: row.img,
      desc: row.description,
      rise: row.rise,
      difficulty: row.difficulty,
      cost: row.cost,
    }),
  },
  "/feed": {
    table: "feed_posts",
    select: "*, profiles(full_name, username, avatar_url)",
    transform: (row) => ({
      id: row.id,
      user: row.profiles?.full_name || "Anonymous",
      handle: row.profiles?.username ? `@${row.profiles.username}` : "",
      avatar: (row.profiles?.full_name || "A")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2),
      color: "#4CAF50",
      time: formatTimeAgo(row.created_at),
      content: row.content,
      spot: row.spot_name,
      img: row.img,
      likes: row.likes_count,
      comments: row.comments_count,
      trend: row.trend,
    }),
  },
};

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function useApi(path) {
  const mapping = TABLE_MAP[path];
  const usesSupabase = Boolean(supabase && mapping);

  const [state, setState] = useState(() => {
    if (!usesSupabase) {
      return { data: EMBEDDED[path] || null, loading: false, error: null };
    }
    return { data: null, loading: true, error: null };
  });

  useEffect(() => {
    if (!usesSupabase) return;

    let cancelled = false;

    supabase
      .from(mapping.table)
      .select(mapping.select || "*")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setState({
            data: EMBEDDED[path] || null,
            loading: false,
            error: null,
          });
        } else {
          setState({
            data: data.map(mapping.transform),
            loading: false,
            error: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path, mapping, usesSupabase]);

  return state;
}
