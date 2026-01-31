import { useState, useEffect } from "react";
import OptionsIntradayDashboard from "./OptionsIntradayDashboard";
import EquityIntradayDashboard from "./EquityIntradayDashboard";
import FuturesIntradayDashboard from "./FuturesIntradayDashboard";
import OptionsPositionalDashboard from "./OptionsPositionalDashboard";
import FuturesPositionalDashboard from "./FuturesPositionalDashboard";
import SwingDashboard from "./SwingDashboard";

/* =====================================================
   MAIN DASHBOARD (ALL SEGMENTS TABS) – USER WISE
===================================================== */

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("auth_user"));

  const storageKey = user
    ? `user_dashboard_tab_${user.user_id}`
    : null;

  const [activeTab, setActiveTab] = useState("OPTIONS_INTRADAY");

  /* ================= LOAD USER TAB ================= */
  useEffect(() => {
    if (!storageKey) return;

    const savedTab = localStorage.getItem(storageKey);
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, [storageKey]);

  /* ================= SAVE USER TAB ================= */
  function handleTabChange(tab) {
    setActiveTab(tab);
    if (storageKey) {
      localStorage.setItem(storageKey, tab);
    }
  }

  const tabStyle = (key) => ({
    padding: "14px 26px",
    fontSize: "15px",
    fontWeight: 700,
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    background: activeTab === key ? "#111827" : "#e5e7eb",
    color: activeTab === key ? "#ffffff" : "#111827",
    transition: "all 0.2s ease",
    minWidth: "160px",
  });

  return (
    <div style={{ padding: "16px", background: "#f8fafc" }}>
      {/* ================= MAIN SEGMENT TABS ================= */}
      <div
        style={{
          display: "flex",
          gap: "14px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          style={tabStyle("OPTIONS_INTRADAY")}
          onClick={() => handleTabChange("OPTIONS_INTRADAY")}
        >
          Options Intraday
        </button>

        <button
          style={tabStyle("EQUITY_INTRADAY")}
          onClick={() => handleTabChange("EQUITY_INTRADAY")}
        >
          Equity Intraday
        </button>

        <button
          style={tabStyle("FUTURES_INTRADAY")}
          onClick={() => handleTabChange("FUTURES_INTRADAY")}
        >
          Futures Intraday
        </button>

        <button
          style={tabStyle("OPTIONS_POSITIONAL")}
          onClick={() => handleTabChange("OPTIONS_POSITIONAL")}
        >
          Options Positional
        </button>

        <button
          style={tabStyle("FUTURES_POSITIONAL")}
          onClick={() => handleTabChange("FUTURES_POSITIONAL")}
        >
          Futures Positional
        </button>

        <button
          style={tabStyle("SWING")}
          onClick={() => handleTabChange("SWING")}
        >
          Swing Trading
        </button>
      </div>

      {/* ================= DASHBOARD RENDER ================= */}
      {activeTab === "OPTIONS_INTRADAY" && <OptionsIntradayDashboard />}
      {activeTab === "EQUITY_INTRADAY" && <EquityIntradayDashboard />}
      {activeTab === "FUTURES_INTRADAY" && <FuturesIntradayDashboard />}
      {activeTab === "OPTIONS_POSITIONAL" && <OptionsPositionalDashboard />}
      {activeTab === "FUTURES_POSITIONAL" && <FuturesPositionalDashboard />}
      {activeTab === "SWING" && <SwingDashboard />}
    </div>
  );
}
