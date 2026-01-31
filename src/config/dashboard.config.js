export const DASHBOARD_CONFIG = {
  OPTIONS_INTRADAY: {
    filters: [
      "STRATEGY",
      "CALL_PUT",
      "POSITION",
      "CONFIDENCE",
      "ENTRY_REASON",
      "EXIT_REASON",
      "BROKER",
      "TIMEFRAME",
      "TIME_RANGE",
      "UNDERLYING",
      "EXPIRY",
      "STRIKE",
    ],

    kpis: [
      "KPI_OVERVIEW",
      "WIN_LOSS_DAY",
      "TRADE_QUALITY",
      "RISK_STRATEGY",
      "ENTRY_EXIT_CONFIDENCE",
      "TIME_OPTIONS_KPI",
      "UNDERLYING_PERFORMANCE",
    ],

    charts: [
      "OVERVIEW",
      "PHASE1_BASIC",
      "PHASE2_STRATEGY",
      "PHASE3_TIMERANGE",
      "CUMULATIVE_PNL",
    ],
  },
};
