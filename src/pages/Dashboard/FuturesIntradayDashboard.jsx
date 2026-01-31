import { useMemo, useState } from "react";
import { useTrades } from "../../store/trade.store";

/* ===== FILTER LOGIC ===== */
import useFuturesIntradayFilters from "../../features/dashboard/futuresIntraday/useFuturesIntradayFilters";

/* ===== FILTER UI ===== */
import FuturesFilterPanel from "../../components/dashboard/FuturesFilterPanel";

/* ===== KPI SECTION ===== */
import FuturesKPIOverviewSection from "../../components/dashboard/futuresIntraday/KPI/FuturesKPIOverviewSection";

/* =====================================================
   FUTURES INTRADAY DASHBOARD
===================================================== */

export default function FuturesIntradayDashboard() {
  const { trades } = useTrades();

  /* ================= TAB STATE ================= */
  const [activeTab, setActiveTab] = useState("KPI");

  /* ================= ONLY FUTURES INTRADAY ================= */
  const futuresTrades = useMemo(
    () => trades.filter((t) => t.tradeType === "FUTURES_INTRADAY"),
    [trades]
  );

  /* ================= FILTER LOGIC ================= */
  const {
    filters,
    setFilter,
    clearAllFilters,
    OPTIONS,
    filteredTrades,
  } = useFuturesIntradayFilters(futuresTrades);

  /* ================= UI ================= */
  return (
    <div style={{ padding: "20px", background: "#f8fafc" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
        Futures Intraday Dashboard
      </h2>

      {/* ================= FILTER PANEL ================= */}
      <FuturesFilterPanel
        filters={filters}
        setFilter={setFilter}
        clearAllFilters={clearAllFilters}
        OPTIONS={OPTIONS}
      />

      {/* ================= KPI / CHART TABS ================= */}
      <div style={{ display: "flex", gap: "14px", margin: "20px 0" }}>
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
          {/* 
            FIRST KPI : OVERVIEW
            - Total Trades
            - Net P&L
            - Win / Loss %
            - Avg P&L
            - Profit Factor
            - Drawdown
            (Logic + UI inside component)
          */}
          <FuturesKPIOverviewSection trades={filteredTrades} />

          {/* 
            NEXT KPIs (ADD LATER BELOW)
            --------------------------------
            <FuturesWinLossSection />
            <FuturesPositionWiseSection />
            <FuturesChargesSection />
            <FuturesTimeAnalysisSection />
          */}
        </div>
      )}

      {/* ================= CHART TAB ================= */}
      {activeTab === "CHART" && (
        <div style={card}>
          {/* 
            FUTURE CHARTS WILL COME HERE
            --------------------------------
            - PNL Curve
            - Day-wise PNL
            - Symbol-wise Performance
          */}
          Charts will be added step by step
        </div>
      )}

      {/* ================= DEBUG ================= */}
      <div style={{ marginTop: "12px", fontSize: "13px", color: "#6b7280" }}>
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
});

const card = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
};
