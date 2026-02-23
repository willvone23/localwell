import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Avatar } from "./ui";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: "\ud83c\udfe0" },
  { to: "/explore", label: "Explore", icon: "\ud83d\udd0d" },
  { to: "/itinerary", label: "Itinerary", icon: "\u2728" },
  { to: "/trends", label: "Trends", icon: "\ud83d\udcc8" },
  { to: "/feed", label: "Feed", icon: "\ud83d\udc65" },
];

export default function Layout() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const displayName = profile?.full_name || profile?.username || "Guest";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <NavLink to="/" className="logo-link" style={{ textDecoration: "none" }}>
            <div className="logo-icon" />
            <span className="logo-text">LocalWell</span>
          </NavLink>

          <nav className="main-nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `nav-link${isActive ? " nav-link--active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span> {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <button className="icon-btn" aria-label="Notifications">
              {"\uD83D\uDD14"}
            </button>
            {user ? (
              <NavLink
                to="/profile"
                className="profile-btn"
                style={{ textDecoration: "none" }}
              >
                <Avatar initials={initials} color="#16A34A" size={26} />
                <span className="profile-name">{displayName.split(" ")[0]}</span>
              </NavLink>
            ) : (
              <button
                className="btn-outline-sm"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `mobile-nav__item${isActive ? " mobile-nav__item--active" : ""}`
            }
          >
            <span className="mobile-nav__icon">{item.icon}</span>
            <span className="mobile-nav__label">{item.label}</span>
          </NavLink>
        ))}
        {user ? (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `mobile-nav__item${isActive ? " mobile-nav__item--active" : ""}`
            }
          >
            <span className="mobile-nav__icon">{"\uD83D\uDC64"}</span>
            <span className="mobile-nav__label">Profile</span>
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className="mobile-nav__item"
          >
            <span className="mobile-nav__icon">{"\uD83D\uDC64"}</span>
            <span className="mobile-nav__label">Sign In</span>
          </NavLink>
        )}
      </nav>
    </div>
  );
}
