import { useMemo, useState } from "react";
import { useTrades } from "../../store/trade.store";

/* ===== FILTER LOGIC ===== */
import useSwingFilters from "../../features/dashboard/swing/useSwingFilters";

/* ===== FILTER PANEL ===== */
import SwingFilterPanel from "../../components/dashboard/SwingFilterPanel";

/* ===== KPI ===== */
import SwingKPIOverviewSection
  from "../../components/dashboard/swing/KPI/SwingKPIOverviewSection";

/* =====================================================
   SWING DASHBOARD
===================================================== */

export default function SwingDashboard() {
  const tradeStore = useTrades();

  /* ===== SAFETY ===== */
  const allTrades = Array.isArray(tradeStore.trades)
    ? tradeStore.trades
    : [];

  /* ================= TAB STATE ================= */
  const [activeTab, setActiveTab] = useState("KPI");

  /* ================= ONLY SWING TRADES ================= */
  const swingTrades = useMemo(
    () => allTrades.filter((t) => t.tradeType === "SWING"),
    [allTrades]
  );

  /* ================= FILTER ================= */
  const {
    filters,
    setFilter,
    clearAllFilters,
    OPTIONS,
    filteredTrades,
  } = useSwingFilters(swingTrades);

  /* ================= UI ================= */
  return (
    <div style={{ padding: "20px", background: "#f8fafc" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
        Swing Trading Dashboard
      </h2>

      {/* ===== FILTER PANEL ===== */}
      <SwingFilterPanel
        filters={filters}
        setFilter={setFilter}
        clearAllFilters={clearAllFilters}
        OPTIONS={OPTIONS}
      />

      {/* ===== KPI / CHART TABS ===== */}
      <div
        style={{
          display: "flex",
          gap: "14px",
          margin: "20px 0",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveTab("KPI")}
          style={tabBtn(activeTab === "KPI")}
        >
          📊 KPIs
        </button>

        <button
          onClick={() => setActiveTab("CHART")}
          style={tabBtn(activeTab === "CHART")}
        >
          📈 Charts
        </button>
      </div>

      {/* ===== KPI TAB ===== */}
      {activeTab === "KPI" && (
        <div style={card}>
          <SwingKPIOverviewSection trades={filteredTrades} />
        </div>
      )}

      {/* ===== CHART TAB ===== */}
      {activeTab === "CHART" && (
        <div style={card}>
          Charts will be added step by step
        </div>
      )}

      {/* ===== DEBUG ===== */}
      <div
        style={{
          marginTop: "14px",
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
        Filtered Trades: {filteredTrades.length}
      </div>
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const tabBtn = (active) => ({
  padding: "12px 26px",
  fontSize: "16px",
  fontWeight: 700,
  background: active ? "#111827" : "#e5e7eb",
  color: active ? "#ffffff" : "#111827",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  minWidth: "140px",
});

const card = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
};
