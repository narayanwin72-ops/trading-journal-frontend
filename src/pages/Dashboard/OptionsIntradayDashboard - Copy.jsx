import { useMemo, useState } from "react";
import { useTrades } from "../../store/trade.store";

import useOptionIntradayFilters from "../../features/dashboard/optionsIntraday/useOptionIntradayFilters";
import useOptionIntradayKPIs from "../../features/dashboard/optionsIntraday/useOptionIntradayKPIs";
import useOptionIntradayWinLossDays from "../../features/dashboard/optionsIntraday/useOptionIntradayWinLossDays";

import FilterPanel from "../../components/dashboard/FilterPanel";
import KPIOverviewSection from "../../components/dashboard/KPIOverviewSection";
import WinLossDaySection from "../../components/dashboard/WinLossDaySection";
import TradeQualityAndOptionsSection from "../../components/dashboard/TradeQualityAndOptionsSection";
import RiskAndStrategySection from "../../components/dashboard/RiskAndStrategySection";
import EntryExitAndConfidenceSection from "../../components/dashboard/EntryExitAndConfidenceSection";
import TimeAndOptionsKPISection from "../../components/dashboard/TimeAndOptionsKPISection";
import UnderlyingPerformanceSection from "../../components/dashboard/UnderlyingPerformanceSection";

/* ===== CHARTS ===== */
import OptionOverviewCharts from "../../components/dashboard/optionCharts/OptionOverviewCharts";
import Phase1BasicCharts from "../../components/dashboard/optionCharts/Phase1BasicCharts";
import Phase2StrategyCharts from "../../components/dashboard/optionCharts/Phase2StrategyCharts";
import Phase3TimeRangeCharts from "../../components/dashboard/optionCharts/Phase3TimeRangeCharts";
import CumulativePNLSection from "../../components/dashboard/optionCharts/CumulativePNLSection";

/* =====================================================
   OPTIONS INTRADAY DASHBOARD (KPI + CHART TABS)
===================================================== */

export default function OptionsIntradayDashboard() {
  const { trades } = useTrades();

  /* ================= TAB STATE ================= */
  const [activeTab, setActiveTab] = useState("KPI");

  /* ================= ONLY OPTIONS TRADES ================= */
  const optionTrades = useMemo(
    () => trades.filter((t) => t.tradeType === "OPTIONS"),
    [trades]
  );

  /* ================= FILTER LOGIC ================= */
  const {
    filters,
    setFilter,
    clearAllFilters,
    OPTIONS,
    filteredTrades,
  } = useOptionIntradayFilters(optionTrades);

  /* ================= KPI CALCULATION ================= */
  const kpis = useOptionIntradayKPIs(filteredTrades);

  /* ================= WIN / LOSS DAY KPI ================= */
  const winLossDayData =
    useOptionIntradayWinLossDays(filteredTrades);

  /* ================= UI ================= */
  return (
    <div style={{ padding: "20px", background: "#f8fafc" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
        Options Intraday Dashboard
      </h2>

      {/* ================= FILTER PANEL ================= */}
      <FilterPanel
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
          style={{
            padding: "12px 26px",
            fontSize: "16px",
            fontWeight: 700,
            background: activeTab === "KPI" ? "#111827" : "#e5e7eb",
            color: activeTab === "KPI" ? "#ffffff" : "#111827",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            minWidth: "140px",
          }}
        >
          📊 KPIs
        </button>

        <button
          onClick={() => setActiveTab("CHART")}
          style={{
            padding: "12px 26px",
            fontSize: "16px",
            fontWeight: 700,
            background: activeTab === "CHART" ? "#111827" : "#e5e7eb",
            color: activeTab === "CHART" ? "#ffffff" : "#111827",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            minWidth: "140px",
          }}
        >
          📈 Charts
        </button>
      </div>

      {/* ================= KPI TAB ================= */}
      {activeTab === "KPI" && (
        <>
          <KPIOverviewSection kpis={kpis} />

          <WinLossDaySection data={winLossDayData} />

          <TradeQualityAndOptionsSection trades={filteredTrades} />

          <RiskAndStrategySection trades={filteredTrades} />

          <EntryExitAndConfidenceSection trades={filteredTrades} />

          <TimeAndOptionsKPISection trades={filteredTrades} />

          <UnderlyingPerformanceSection trades={filteredTrades} />
        </>
      )}

      {/* ================= CHART TAB ================= */}
      {activeTab === "CHART" && (
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "14px",
            marginTop: "16px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
          }}
        >
          {/* ===== OPTIONAL OVERVIEW CHART ===== */}
          <OptionOverviewCharts trades={filteredTrades} />

          {/* ===== PHASE 1 BASIC CHARTS ===== */}
          <Phase1BasicCharts trades={filteredTrades} />
          {/* ===== PHASE 2 BASIC CHARTS ===== */}
          <Phase2StrategyCharts trades={filteredTrades} />
          {/* ===== PHASE 3 BASIC CHARTS ===== */}
          <Phase3TimeRangeCharts trades={filteredTrades} />
          {/* ===== PHASE 3 BASIC CHARTS ===== */}
          <CumulativePNLSection trades={filteredTrades} />
          

        </div>
      )}

      {/* ================= DEBUG INFO ================= */}
      <div
        style={{
          marginTop: "16px",
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
        Filtered Trades: {filteredTrades.length}
      </div>
    </div>
  );
}
