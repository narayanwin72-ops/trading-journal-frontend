import { useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "../../config/menu.config";

export default function Sidebar({ userPlan }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "#ffffff",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ marginBottom: "24px" }}>
        📊 Trading Journal
      </h3>

      {/* ✅ DASHBOARD – SINGLE SOURCE */}
      <div
        onClick={() => navigate("/dashboard")}
        style={menuStyle}
      >
        Dashboard
      </div>

      {/* ✅ OTHER MENUS (EXCLUDING DASHBOARD) */}
      {MENU_ITEMS
        .filter((item) => item.path !== "/dashboard")
        .map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={menuStyle}
          >
            {item.label}
          </div>
        ))}
    </div>
  );
}

/* ================= STYLES ================= */

const menuStyle = {
  padding: "10px 12px",
  marginBottom: "8px",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#1e293b",
};
