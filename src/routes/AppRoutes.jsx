import { Routes, Route, Navigate } from "react-router-dom";

/* ===== USER AUTH ===== */
import Login from "../pages/auth/Login";

/* ===== PAGES ===== */
import Dashboard from "../pages/Dashboard/Dashboard";
import TradeLog from "../pages/TradeLog/TradeLog";
import TradeEntry from "../pages/TradeEntry/TradeEntry";
import Settings from "../pages/Settings/Settings";
import BrokerCapital from "../pages/BrokerCapital/BrokerCapital";
import DashboardControl from "../pages/DashboardControl/DashboardControl";
import MySymbols from "../pages/settings/MySymbols";

/* ===== UPGRADE ===== */
import UpgradePlan from "../pages/UpgradePlan";
import PaymentSuccess from "../pages/PaymentSuccess";


export default function AppRoutes({ userPlan }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ================= DASHBOARD ================= */}
      <Route
        path="/dashboard"
        element={<Dashboard userPlan={userPlan} />}
      />

      {/* ================= DASHBOARD CONTROL ================= */}
      <Route
        path="/dashboard-control"
        element={<DashboardControl />}
      />

      {/* ================= TRADE LOG ================= */}
      <Route
        path="/trade-log"
        element={<TradeLog userPlan={userPlan} />}
      />

      {/* ================= TRADE ENTRY ================= */}
      <Route
        path="/trade-entry"
        element={<TradeEntry />}
      />

      {/* ================= SETTINGS ================= */}
      <Route
        path="/settings"
        element={<Settings />}
      />

      {/* ================= BROKER CAPITAL ================= */}
      <Route
        path="/broker-capital"
        element={<BrokerCapital />}
      />

      {/* ================= MY SYMBOLS ================= */}
      <Route
        path="/settings/my-symbols"
        element={<MySymbols />}
      />

      {/* ================= UPGRADE PLAN ================= */}
      <Route
        path="/upgrade"
        element={<UpgradePlan />}
      />
      <Route
  path="/payment-success"
  element={<PaymentSuccess />}
/>


      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={
          <div style={{ padding: "24px" }}>
            Page Not Found
          </div>
        }
      />
    </Routes>
  );
}
