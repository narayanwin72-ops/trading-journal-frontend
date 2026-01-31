import { useMemo, useState } from "react";
import { useTrades } from "../../store/trade.store";

/* ===== FILTER HOOK ===== */
import useEquityIntradayFilters from "../../features/dashboard/equityIntraday/useEquityIntradayFilters";

/* ===== EQUITY FILTER PANEL ===== */
import EquityFilterPanel from "../../components/dashboard/EquityFilterPanel";

/* ===== EQUITY KPI (LOGIC + UI) ===== */
import EquityKPIOverviewSection from "../../components/dashboard/equityIntraday/KPI/EquityKPIOverviewSection";

/* =====================================================
   EQUITY INTRADAY DASHBOARD
===================================================== */

export default function EquityIntradayDashboard() {
  const { trades } = useTrades();

  /* ================= TAB STATE ================= */
  const [activeTab, setActiveTab] = useState("KPI");

  /* ================= ONLY EQUITY INTRADAY ================= */
  const equityTrades = useMemo(
    () => trades.filter((t) => t.tradeType === "EQUITY_INTRADAY"),
    [trades]
  );

  /* ================= FILTER LOGIC ================= */
  const {
    filters,
    setFilter,
    clearAllFilters,
    OPTIONS,
    filteredTrades,
  } = useEquityIntradayFilters(equityTrades);

  /* ================= UI ================= */
  return (
    <div style={{ padding: "20px", background: "#f8fafc" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
        Equity Intraday Dashboard
      </h2>

      {/* ================= EQUITY FILTER PANEL ================= */}
      <EquityFilterPanel
        filters={filters}
        setFilter={setFilter}
        clearAllFilters={clearAllFilters}
        OPTIONS={OPTIONS}
      />

      {/* ================= KPI / CHART TABS ================= */}
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

      {/* ================= KPI TAB ================= */}
      {activeTab === "KPI" && (
        <div style={card}>
          {/* 🔥 KPI LOGIC + UI INSIDE COMPONENT */}
          <EquityKPIOverviewSection trades={filteredTrades} />
        </div>
      )}

      {/* ================= CHART TAB ================= */}
      {activeTab === "CHART" && (
        <div style={card}>
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            📈 Charts will be added next step
          </div>
        </div>
      )}

      {/* ================= DEBUG ================= */}
      <div style={{ marginTop: "14px", fontSize: "13px", color: "#6b7280" }}>
        Filtered Trades: {filteredTrades.length}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

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
