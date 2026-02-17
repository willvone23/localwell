import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";
import { useSocial } from "../contexts/SocialContext";
import { Avatar } from "../components/ui";

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NewPostModal({ onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [spotName, setSpotName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({ content: content.trim(), spotName: spotName.trim() || null });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div className="new-post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="new-post-modal__header">
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            New Post
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "#6B7280",
            }}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            className="new-post-modal__textarea"
            placeholder="What's happening in your wellness journey?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            maxLength={500}
            autoFocus
          />
          <input
            className="new-post-modal__input"
            type="text"
            placeholder="Tag a spot (optional)"
            value={spotName}
            onChange={(e) => setSpotName(e.target.value)}
          />
          <div className="new-post-modal__footer">
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>
              {content.length}/500
            </span>
            <button
              type="submit"
              className={`btn-primary ${!content.trim() ? "btn-primary--disabled" : ""}`}
              disabled={!content.trim()}
              style={{ padding: "10px 24px", fontSize: 14 }}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const { user } = useAuth();
  const { posts: socialPosts, addPost, togglePostLike } = useSocial();
  const { data: embeddedPosts, loading, error } = useApi("/feed");
  const [liked, setLiked] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const navigate = useNavigate();

  // Merge social posts (real user data) with embedded posts
  const allPosts = useMemo(() => {
    const userPosts = socialPosts.map((p) => ({
      ...p,
      time: typeof p.time === "string" && p.time.includes("T")
        ? formatTimeAgo(p.time)
        : p.time,
      isUserPost: true,
    }));

    const embedded = (embeddedPosts || []).map((p) => ({
      ...p,
      isUserPost: false,
    }));

    return [...userPosts, ...embedded];
  }, [socialPosts, embeddedPosts]);

  const toggleLike = (id, isUserPost) => {
    if (isUserPost) {
      togglePostLike(id);
    } else {
      setLiked((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    }
  };

  const handleNewPost = ({ content, spotName }) => {
    addPost({ content, spotName });
  };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <h2 className="page-title">Community Feed</h2>
          <p className="page-subtitle">
            What the LocalWell community is discovering
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() =>
            user ? setShowNewPost(true) : navigate("/login")
          }
          style={{ padding: "10px 20px", fontSize: 14 }}
        >
          + New Post
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading feed...</div>
      ) : error ? (
        <div className="error-state">
          <p>Failed to load feed. Please try again later.</p>
        </div>
      ) : allPosts.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 40, marginBottom: 12 }}>&#x1F4AC;</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No posts yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Be the first to share!
          </div>
        </div>
      ) : (
        <div className="feed-layout">
          <div>
            {allPosts.map((post) => (
              <article key={post.id} className="feed-post">
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <Avatar
                    initials={post.avatar}
                    color={post.color}
                    size={42}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <span className="post-user">{post.user}</span>
                        <span className="post-handle">{post.handle}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {post.type === "review" && (
                          <span className="feed-badge feed-badge--review">Review</span>
                        )}
                        {post.type === "favorite" && (
                          <span className="feed-badge feed-badge--fav">Saved</span>
                        )}
                        <time className="post-time">{post.time}</time>
                      </div>
                    </div>
                    {post.trend && (
                      <span className="trend-tag">{post.trend}</span>
                    )}
                    {post.rating && (
                      <span className="review-rating-inline">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            style={{
                              color: i < post.rating ? "#F59E0B" : "#E5E7EB",
                            }}
                          >
                            {"\u2605"}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
                <p className="post-content">{post.content}</p>
                {post.img && (
                  <img
                    src={post.img}
                    alt=""
                    loading="lazy"
                    className="post-img"
                  />
                )}
                <div className="post-actions">
                  <div style={{ display: "flex", gap: 16 }}>
                    <button
                      onClick={() => toggleLike(post.id, post.isUserPost)}
                      className="action-btn"
                      style={{
                        color:
                          (post.isUserPost ? post._liked : liked.includes(post.id))
                            ? "#EF4444"
                            : "#6B7280",
                      }}
                    >
                      {(post.isUserPost ? post._liked : liked.includes(post.id))
                        ? "\u2764\uFE0F"
                        : "\uD83E\uDD0D"}{" "}
                      {post.likes +
                        (!post.isUserPost && liked.includes(post.id) ? 1 : 0)}
                    </button>
                    <button className="action-btn">
                      {post.comments} comments
                    </button>
                    <button className="action-btn">Share</button>
                  </div>
                  {post.spot && (
                    <span className="post-spot">{post.spot}</span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sidebar-card">
              <h3 className="sidebar-title">Trending Tags</h3>
              {[
                "#coldplunge",
                "#noSeedOils",
                "#zone2cardio",
                "#lionsmane",
                "#reformerpilates",
                "#organicEats",
              ].map((tag) => (
                <div key={tag} className="sidebar-row">
                  <span className="tag-link">{tag}</span>
                </div>
              ))}
            </div>

            <div className="sidebar-card">
              <h3 className="sidebar-title">Who to Follow</h3>
              {[
                { n: "Alex Chen", h: "@alexoptimized", c: "#FF7043" },
                { n: "Dr. Sarah K.", h: "@dramindmatter", c: "#9C27B0" },
                { n: "Fit Dad Jim", h: "@jimfunctional", c: "#1976D2" },
              ].map((u) => (
                <div key={u.h} className="follow-row">
                  <Avatar
                    initials={u.n
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                    color={u.c}
                    size={36}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="follow-name">{u.n}</div>
                    <div className="follow-handle">{u.h}</div>
                  </div>
                  <button className="btn-outline-sm">Follow</button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}

      {showNewPost && (
        <NewPostModal
          onClose={() => setShowNewPost(false)}
          onSubmit={handleNewPost}
        />
      )}
    </div>
  );
}
