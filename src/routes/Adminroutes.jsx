import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/Admin/adminlogin";
import SymbolMaster from "../pages/Admin/SymbolMaster";
import AdminPlans from "../pages/Admin/AdminPlans";
import AdminPlanVariants from "../pages/Admin/AdminPlanVariants";
import AdminUserLog from "../pages/Admin/AdminUserLog";
import AdminTrialManagement from "../pages/Admin/AdminTrialManagement";
import TradeEntryControl from "../pages/Admin/TradeEntryControl";
import AdminTradeLogControl from "../pages/Admin/AdminTradeLogControl";
import DashboardControl from "../pages/Admin/DashboardControl";



/* ================= AUTH GUARD (12 HOURS) ================= */
function AdminProtectedRoute({ children }) {
  const isAdminLoggedIn = localStorage.getItem("admin_logged_in");
  const loginTime = localStorage.getItem("admin_login_time");

  const TWELVE_HOURS = 12 * 60 * 60 * 1000;

  // ❌ Never logged in
  if (!isAdminLoggedIn || !loginTime) {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_login_time");
    return <Navigate to="/admin/login" replace />;
  }

  const currentTime = Date.now();
  const diff = currentTime - Number(loginTime);

  // ❌ Session expired
  if (diff > TWELVE_HOURS) {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_login_time");
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Session valid
  return children;
}

/* Temporary dummy pages */
function AdminDashboard() {
  return <h2>Admin Dashboard</h2>;
}

function AdminUsers() {
  return <h2>User Management</h2>;
}

function AdminSettings() {
  return <h2>Admin Settings</h2>;
}

export default function AdminRoutes() {
  return (
    <Routes>
      {/* ================= ADMIN LOGIN ================= */}
      <Route path="/login" element={<AdminLogin />} />

      {/* ================= ADMIN PANEL (PROTECTED) ================= */}
      <Route
        path="/"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        {/* DEFAULT REDIRECT */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />

        {/* SYMBOL MASTER */}
        <Route path="symbol-master" element={<SymbolMaster />} />

        {/* PLANS */}
        <Route path="plans" element={<AdminPlans />} />
        <Route path="plan-variants" element={<AdminPlanVariants />} />

        {/* USER LOG */}
        <Route path="user-log" element={<AdminUserLog />} />

        {/* ✅ TRADE ENTRY CONTROL */}
        <Route
          path="trade-entry-control"
          element={<TradeEntryControl />}
        />
        {/* ✅ TRADE LOG CONTROL */}
<Route
  path="trade-log-control"
  element={<AdminTradeLogControl />}
/>
{/* ✅ DASHBOARD CONTROL */}
<Route
  path="dashboard-control"
  element={<DashboardControl />}
/>



        {/* TRIAL MANAGEMENT */}
        <Route
          path="trial-management"
          element={<AdminTrialManagement />}
        />

        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}


