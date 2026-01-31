import { useMemo, useState } from "react";
import { useTrades } from "../../store/trade.store";

/* ===== FILTER LOGIC ===== */
import useOptionsPositionalFilters
  from "../../features/dashboard/optionsPositional/useOptionsPositionalFilters";

/* ===== FILTER UI ===== */
import OptionsPositionalFilterPanel
  from "../../components/dashboard/OptionsPositionalFilterPanel";

/* ===== KPI UI ===== */
import OptionsPositionalKPIOverviewSection
  from "../../components/dashboard/optionsPositional/KPI/OptionsPositionalKPIOverviewSection";

/* =====================================================
   OPTIONS POSITIONAL DASHBOARD
===================================================== */

export default function OptionsPositionalDashboard() {
  const { trades } = useTrades();

  /* ================= TAB STATE ================= */
  const [activeTab, setActiveTab] = useState("KPI");

  /* ================= ONLY OPTIONS POSITIONAL ================= */
  const positionalOptionTrades = useMemo(
    () =>
      Array.isArray(trades)
        ? trades.filter((t) => t.tradeType === "OPTIONS_POSITIONAL")
        : [],
    [trades]
  );

  /* ================= FILTER LOGIC ================= */
  const {
    filters,
    setFilter,
    clearAllFilters,
    OPTIONS,
    filteredTrades,
  } = useOptionsPositionalFilters(positionalOptionTrades);

  /* ================= UI ================= */
  return (
    <div style={{ padding: "20px", background: "#f8fafc" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
        Options Positional Dashboard
      </h2>

      {/* ================= FILTER PANEL ================= */}
      <OptionsPositionalFilterPanel
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
          {/*
            KPI SECTIONS – STEP BY STEP
            ----------------------------
            1. Overview KPI ✅
            2. Win / Loss KPI
            3. Strategy KPI
            4. Drawdown KPI
            5. Holding Duration KPI
          */}

          <OptionsPositionalKPIOverviewSection
            trades={filteredTrades}
          />
        </div>
      )}

      {/* ================= CHART TAB ================= */}
      {activeTab === "CHART" && (
        <div style={card}>
          {/*
            CHARTS WILL BE ADDED LATER
            --------------------------------
            - Cumulative P&L
            - Strategy-wise P&L
            - Underlying-wise performance
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
