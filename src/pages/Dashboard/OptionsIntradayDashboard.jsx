import { useMemo, useState } from "react";
import { useTrades } from "../../store/trade.store";
import { useUserPlanStore } from "../../store/userPlan.store";
import { useDashboardFeatureStore } from "../../store/dashboardFeature.store";
import { DASHBOARD_CONFIG } from "../../config/dashboard.config";

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

import OptionOverviewCharts from "../../components/dashboard/optionCharts/OptionOverviewCharts";
import Phase1BasicCharts from "../../components/dashboard/optionCharts/Phase1BasicCharts";
import Phase2StrategyCharts from "../../components/dashboard/optionCharts/Phase2StrategyCharts";
import Phase3TimeRangeCharts from "../../components/dashboard/optionCharts/Phase3TimeRangeCharts";
import CumulativePNLSection from "../../components/dashboard/optionCharts/CumulativePNLSection";

import SectionLock from "../../components/dashboard/SectionLock";

const SEGMENT = "OPTIONS_INTRADAY";

export default function OptionsIntradayDashboard() {
  const { trades } = useTrades();

  const planId = useUserPlanStore((s) => s.activePlanId);
  const canUse = useDashboardFeatureStore((s) => s.canUse);

  const [activeTab, setActiveTab] = useState("KPI");

  /* ================= DATA ================= */
  const optionTrades = useMemo(
    () => trades.filter((t) => t.tradeType === "OPTIONS"),
    [trades]
  );

  const {
    filters,
    setFilter,
    clearAllFilters,
    OPTIONS,
    filteredTrades,
  } = useOptionIntradayFilters(optionTrades);

  const kpis = useOptionIntradayKPIs(filteredTrades);
  const winLossDayData = useOptionIntradayWinLossDays(filteredTrades);

  const config = DASHBOARD_CONFIG[SEGMENT];

  /* ================= FILTER LOCK ================= */
  const filterFeatureId = `${SEGMENT}_FILTER_DATE`;
  const filtersLocked = !canUse(filterFeatureId, planId);

  return (
    <div style={{ padding: 20, background: "#f8fafc" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>
        Options Intraday Dashboard
      </h2>

      {/* ================= FILTER ================= */}
      <FilterPanel
        filters={filters}
        setFilter={setFilter}
        clearAllFilters={clearAllFilters}
        OPTIONS={OPTIONS}
        filtersLocked={filtersLocked}
        lockText={null} // 🔥 overlay handled by SectionLock logic
      />

      {/* ================= KPI / CHART TABS ================= */}
      <div style={{ display: "flex", gap: 14, margin: "20px 0" }}>
        <Tab active={activeTab === "KPI"} onClick={() => setActiveTab("KPI")}>
          📊 KPIs
        </Tab>
        <Tab active={activeTab === "CHART"} onClick={() => setActiveTab("CHART")}>
          📈 Charts
        </Tab>
      </div>

      {/* ================= KPI TAB ================= */}
      {activeTab === "KPI" &&
        config.kpis.map((k) => {
          const fid = `${SEGMENT}_KPI_${k}`;

          const sectionMap = {
            KPI_OVERVIEW: <KPIOverviewSection kpis={kpis} />,
            WIN_LOSS_DAY: <WinLossDaySection data={winLossDayData} />,
            TRADE_QUALITY: (
              <TradeQualityAndOptionsSection trades={filteredTrades} />
            ),
            RISK_STRATEGY: (
              <RiskAndStrategySection trades={filteredTrades} />
            ),
            ENTRY_EXIT_CONFIDENCE: (
              <EntryExitAndConfidenceSection trades={filteredTrades} />
            ),
            TIME_OPTIONS_KPI: (
              <TimeAndOptionsKPISection trades={filteredTrades} />
            ),
            UNDERLYING_PERFORMANCE: (
              <UnderlyingPerformanceSection trades={filteredTrades} />
            ),
          };

          return (
            <SectionLock
              key={fid}
              featureId={fid}
              title={k.replace(/_/g, " ")}
            >
              {sectionMap[k]}
            </SectionLock>
          );
        })}

      {/* ================= CHART TAB ================= */}
      {activeTab === "CHART" && (
        <div style={chartWrap}>
          {config.charts.map((c) => {
            const fid = `${SEGMENT}_CHART_${c}`;

            const chartMap = {
              OVERVIEW: (
                <OptionOverviewCharts trades={filteredTrades} />
              ),
              PHASE1_BASIC: (
                <Phase1BasicCharts trades={filteredTrades} />
              ),
              PHASE2_STRATEGY: (
                <Phase2StrategyCharts trades={filteredTrades} />
              ),
              PHASE3_TIMERANGE: (
                <Phase3TimeRangeCharts trades={filteredTrades} />
              ),
              CUMULATIVE_PNL: (
                <CumulativePNLSection trades={filteredTrades} />
              ),
            };

            return (
              <SectionLock
                key={fid}
                featureId={fid}
                title={c.replace(/_/g, " ")}
              >
                {chartMap[c]}
              </SectionLock>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================= SMALL ================= */

function Tab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 26px",
        fontSize: 16,
        fontWeight: 700,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        background: active ? "#111827" : "#e5e7eb",
        color: active ? "#fff" : "#111827",
      }}
    >
      {children}
    </button>
  );
}

const chartWrap = {
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
};
