import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import styles from "./SidebarLayout.module.css";

const navItems = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/tasks", label: "Tasks", end: false },
  { to: "/calculator", label: "Calculator", end: false },
  { to: "/echo", label: "Echo", end: false },
];

export default function SidebarLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <p className={styles.sidebarEyebrow}>Workspace</p>
          <h2 className={styles.sidebarTitle}>Menu</h2>
        </div>

        <nav className={styles.nav} aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLink} ${styles.navLinkActive}`
                  : styles.navLink
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Sign out
        </button>
      </aside>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
