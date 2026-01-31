import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AppRoutes from "../routes/AppRoutes";
import AdminRoutes from "../routes/adminRoutes";

/* USER AUTH */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* 🔥 TRIAL EXPIRY ENGINE */
import { checkAndHandleTrialExpiry } from "../utils/trialExpiryEngine";

/* 🔑 USER LOG → PLAN WIRING */
import { useUserLogStore } from "../store/userLog.store";
import {
  useUserPlanStore,
  FREE_PLAN_ID,
} from "../store/userPlan.store";

export default function App() {
  const setActivePlanId =
    useUserPlanStore((s) => s.setActivePlanId);

  const activePlanId =
    useUserPlanStore((s) => s.activePlanId);

  /* ✅ CHECK TRIAL EXPIRY ON APP LOAD */
  useEffect(() => {
    checkAndHandleTrialExpiry();
  }, []);

  /* ✅ INITIAL PLAN RESOLVE */
  useEffect(() => {
    const userId =
      localStorage.getItem("LOGGED_IN_USER_ID");

    // 🔑 Not logged in → no plan context
    if (!userId) {
      setActivePlanId(null);
      return;
    }

    const planId =
      useUserLogStore
        .getState()
        .getUserActivePlanId(userId);

    // ✅ Logged-in user always has a plan
    setActivePlanId(planId || FREE_PLAN_ID);
  }, [setActivePlanId]);

  /* 🔥 REAL-TIME PLAN SYNC (ADMIN → USER, NO REFRESH) */
  useEffect(() => {
    let lastUpdate =
      localStorage.getItem("USER_PLAN_UPDATED_AT");

    const interval = setInterval(() => {
      const currentUpdate =
        localStorage.getItem(
          "USER_PLAN_UPDATED_AT"
        );

      if (currentUpdate !== lastUpdate) {
        lastUpdate = currentUpdate;

        const userId =
          localStorage.getItem(
            "LOGGED_IN_USER_ID"
          );

        if (!userId) {
          setActivePlanId(null);
          return;
        }

        const planId =
          useUserLogStore
            .getState()
            .getUserActivePlanId(userId);

        setActivePlanId(planId || FREE_PLAN_ID);

        console.log(
          "🔄 PLAN AUTO UPDATED →",
          planId || FREE_PLAN_ID
        );
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [setActivePlanId]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ================= USER AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= USER APP ================= */}
        <Route
          path="/*"
          element={
            <MainLayout userPlan={activePlanId}>
              <AppRoutes
                userPlan={activePlanId}
              />
            </MainLayout>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin/*"
          element={<AdminRoutes />}
        />
      </Routes>
    </BrowserRouter>
  );
}
