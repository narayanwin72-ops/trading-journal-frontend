import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("admin_logged_in");
    navigate("/admin/login");
  }

  return (
    <div style={container}>
      {/* SIDEBAR */}
      <aside style={sidebar}>
        {/* LOGO */}
        <h2 style={logo}>Trading Journal</h2>

        {/* NAV */}
        <nav style={nav}>
          <NavLink to="/admin/dashboard" style={navLink}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" style={navLink}>
            Users
          </NavLink>

          {/* USER LOG */}
          <NavLink to="/admin/user-log" style={navLink}>
            User Log
          </NavLink>

          {/* SYMBOL MASTER */}
          <NavLink to="/admin/symbol-master" style={navLink}>
            Symbol Master
          </NavLink>

          {/* PLANS */}
          <NavLink to="/admin/plans" style={navLink}>
            Plans
          </NavLink>

          {/* PLAN VARIANTS */}
          <NavLink to="/admin/plan-variants" style={navLink}>
            Plan Variants
          </NavLink>
          {/* ✅ DASHBOARD CONTROL */}
<NavLink
  to="/admin/dashboard-control"
  style={navLink}
>
  Dashboard Control
</NavLink>


          {/* ✅ TRADE ENTRY CONTROL */}
          <NavLink
            to="/admin/trade-entry-control"
            style={navLink}
          >
            Trade Entry Control
          </NavLink>
          {/* ✅ TRADE LOG CONTROL */}
         <NavLink
          to="/admin/trade-log-control"
         style={navLink}
        >
        Trade Log Control
        </NavLink>


          {/* TRIAL MANAGEMENT */}
          <NavLink
            to="/admin/trial-management"
            style={navLink}
          >
            Trial Management
          </NavLink>

          <NavLink to="/admin/settings" style={navLink}>
            Settings
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main style={content}>
        <Outlet />
      </main>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  display: "flex",
  minHeight: "100vh",
  background: "#f4f6f8",
};

/* SIDEBAR */
const sidebar = {
  width: "240px",
  background: "#0f172a",
  color: "#e5e7eb",
  padding: "20px 16px",
  display: "flex",
  flexDirection: "column",
};

/* LOGO */
const logo = {
  margin: "0 0 18px 0",
  fontSize: "20px",
  fontWeight: "600",
  color: "#ffffff",
};

/* NAV */
const nav = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

/* ACTIVE / INACTIVE */
const navLink = ({ isActive }) => ({
  padding: "10px 12px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: isActive ? "600" : "500",
  color: isActive ? "#0f172a" : "#e5e7eb",
  background: isActive ? "#e0e7ff" : "transparent",
});

/* LOGOUT */
const logoutBtn = {
  marginTop: "auto",
  padding: "10px",
  fontSize: "14px",
  fontWeight: "500",
  background: "transparent",
  color: "#cbd5f5",
  border: "1px solid #1e293b",
  borderRadius: "6px",
  cursor: "pointer",
};

/* CONTENT */
const content = {
  flex: 1,
  padding: "24px",
  background: "#f8fafc",
};
