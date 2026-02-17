import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";

const SocialContext = createContext(null);

const STORAGE_KEYS = {
  reviews: "localwell_reviews",
  favorites: "localwell_favorites",
  posts: "localwell_posts",
};

function loadFromStorage(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // storage full — silently fail
  }
}

export function SocialProvider({ children }) {
  const { user, profile } = useAuth();

  const [reviews, setReviews] = useState(() =>
    loadFromStorage(STORAGE_KEYS.reviews)
  );
  const [favorites, setFavorites] = useState(() =>
    loadFromStorage(STORAGE_KEYS.favorites)
  );
  const [posts, setPosts] = useState(() =>
    loadFromStorage(STORAGE_KEYS.posts)
  );

  // Persist on change
  useEffect(() => saveToStorage(STORAGE_KEYS.reviews, reviews), [reviews]);
  useEffect(() => saveToStorage(STORAGE_KEYS.favorites, favorites), [favorites]);
  useEffect(() => saveToStorage(STORAGE_KEYS.posts, posts), [posts]);

  // ── Reviews ────────────────────────────────────────────────
  const addReview = useCallback(
    ({ spotId, spotName, rating, text }) => {
      if (!user) return;
      const displayName = profile?.full_name || profile?.username || "User";
      const initials = displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      const review = {
        id: `r_${Date.now()}`,
        userId: user.id,
        userName: displayName,
        userHandle: profile?.username ? `@${profile.username}` : "",
        userInitials: initials,
        spotId,
        spotName,
        rating,
        text,
        createdAt: new Date().toISOString(),
        likes: 0,
      };

      setReviews((prev) => [review, ...prev]);

      // Auto-generate a feed post for the review
      const post = {
        id: `p_${Date.now()}`,
        type: "review",
        userId: user.id,
        user: displayName,
        handle: review.userHandle,
        avatar: initials,
        color: "#16A34A",
        time: new Date().toISOString(),
        content: `Rated ${spotName} ${rating}/5: "${text}"`,
        spot: spotName,
        img: null,
        likes: 0,
        comments: 0,
        trend: null,
        rating,
      };
      setPosts((prev) => [post, ...prev]);

      return review;
    },
    [user, profile]
  );

  const getSpotReviews = useCallback(
    (spotId) => reviews.filter((r) => r.spotId === spotId),
    [reviews]
  );

  const getUserReviews = useCallback(
    (userId) => reviews.filter((r) => r.userId === (userId || user?.id)),
    [reviews, user]
  );

  // ── Favorites ──────────────────────────────────────────────
  const toggleFavorite = useCallback(
    (spot) => {
      if (!user) return;
      setFavorites((prev) => {
        const exists = prev.some(
          (f) => f.spotId === spot.id && f.userId === user.id
        );
        if (exists) {
          return prev.filter(
            (f) => !(f.spotId === spot.id && f.userId === user.id)
          );
        }

        const displayName = profile?.full_name || profile?.username || "User";
        const initials = displayName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        const fav = {
          id: `f_${Date.now()}`,
          userId: user.id,
          spotId: spot.id,
          spotName: spot.name,
          spotType: spot.type,
          spotImg: spot.img,
          spotRating: spot.rating,
          spotPrice: spot.price,
          createdAt: new Date().toISOString(),
        };

        // Auto-generate feed post for new favorite
        const post = {
          id: `p_${Date.now()}_fav`,
          type: "favorite",
          userId: user.id,
          user: displayName,
          handle: profile?.username ? `@${profile.username}` : "",
          avatar: initials,
          color: "#16A34A",
          time: new Date().toISOString(),
          content: `Saved ${spot.name} to favorites! "${spot.desc || ""}"`.slice(0, 200),
          spot: spot.name,
          img: spot.img,
          likes: 0,
          comments: 0,
          trend: null,
        };
        setPosts((prev) => [post, ...prev]);

        return [...prev, fav];
      });
    },
    [user, profile]
  );

  const isFavorited = useCallback(
    (spotId) =>
      user ? favorites.some((f) => f.spotId === spotId && f.userId === user.id) : false,
    [favorites, user]
  );

  const getUserFavorites = useCallback(
    (userId) => favorites.filter((f) => f.userId === (userId || user?.id)),
    [favorites, user]
  );

  // ── Posts / Feed ───────────────────────────────────────────
  const addPost = useCallback(
    ({ content, spotName, img, trend }) => {
      if (!user) return;
      const displayName = profile?.full_name || profile?.username || "User";
      const initials = displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      const post = {
        id: `p_${Date.now()}_post`,
        type: "post",
        userId: user.id,
        user: displayName,
        handle: profile?.username ? `@${profile.username}` : "",
        avatar: initials,
        color: "#16A34A",
        time: new Date().toISOString(),
        content,
        spot: spotName || null,
        img: img || null,
        likes: 0,
        comments: 0,
        trend: trend || null,
      };
      setPosts((prev) => [post, ...prev]);
      return post;
    },
    [user, profile]
  );

  const togglePostLike = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: p.likes + (p._liked ? -1 : 1), _liked: !p._liked }
          : p
      )
    );
  }, []);

  return (
    <SocialContext.Provider
      value={{
        reviews,
        addReview,
        getSpotReviews,
        getUserReviews,
        favorites,
        toggleFavorite,
        isFavorited,
        getUserFavorites,
        posts,
        addPost,
        togglePostLike,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSocial() {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error("useSocial must be used within SocialProvider");
  return ctx;
}
