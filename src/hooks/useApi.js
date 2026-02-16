import { useState, useEffect, useCallback } from "react";
import { spots, trends, feedPosts } from "../data/embedded";

const EMBEDDED = {
  "/spots": spots,
  "/trends": trends,
  "/feed": feedPosts,
};

const BASE_URL = import.meta.env.VITE_API_URL;

export function useApi(path) {
  const [state, setState] = useState(() => {
    if (!BASE_URL) {
      return { data: EMBEDDED[path] || null, loading: false, error: null };
    }
    return { data: null, loading: true, error: null };
  });

  const fetchData = useCallback(() => {
    if (!BASE_URL) return;

    let cancelled = false;

    fetch(`${BASE_URL}${path}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            data: EMBEDDED[path] || null,
            loading: false,
            error: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  useEffect(() => {
    return fetchData();
  }, [fetchData]);

  return state;
}
