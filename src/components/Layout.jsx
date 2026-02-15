import { NavLink, Outlet } from "react-router-dom";
import { Avatar } from "./ui";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: "\ud83c\udfe0" },
  { to: "/explore", label: "Explore", icon: "\ud83d\udd0d" },
  { to: "/itinerary", label: "Itinerary", icon: "\u2728" },
  { to: "/trends", label: "Trends", icon: "\ud83d\udcc8" },
  { to: "/feed", label: "Feed", icon: "\ud83d\udc65" },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <NavLink to="/" className="logo-link" style={{ textDecoration: "none" }}>
            <div className="logo-icon">&zwnj;</div>
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
              \ud83d\udd14
            </button>
            <NavLink
              to="/profile"
              className="profile-btn"
              style={{ textDecoration: "none" }}
            >
              <Avatar initials="W" color="#16A34A" size={26} />
              <span className="profile-name">Will</span>
            </NavLink>
          </div>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
