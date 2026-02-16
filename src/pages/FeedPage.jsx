import { useState } from "react";
import { useApi } from "../hooks/useApi";
import { Avatar } from "../components/ui";

export default function FeedPage() {
  const [liked, setLiked] = useState([]);
  const { data: posts, loading, error } = useApi("/feed");

  const toggleLike = (id) =>
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <h2 className="page-title">Community Feed</h2>
          <p className="page-subtitle">
            What the LocalWell community is discovering
          </p>
        </div>
        <button className="btn-primary">+ New Post</button>
      </div>

      {loading ? (
        <div className="loading-state">Loading feed...</div>
      ) : error ? (
        <div className="error-state">
          <p>Failed to load feed. Please try again later.</p>
        </div>
      ) : !posts || posts.length === 0 ? (
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
            {posts.map((post) => (
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
                      <time className="post-time">{post.time}</time>
                    </div>
                    {post.trend && (
                      <span className="trend-tag">{post.trend}</span>
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
                      onClick={() => toggleLike(post.id)}
                      className="action-btn"
                      style={{
                        color: liked.includes(post.id)
                          ? "#EF4444"
                          : "#6B7280",
                      }}
                    >
                      {liked.includes(post.id) ? "\u2764\uFE0F" : "\uD83E\uDD0D"}{" "}
                      {post.likes + (liked.includes(post.id) ? 1 : 0)}
                    </button>
                    <button className="action-btn">
                      {post.comments} comments
                    </button>
                    <button className="action-btn">Share</button>
                  </div>
                  <span className="post-spot">{post.spot}</span>
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
    </div>
  );
}
