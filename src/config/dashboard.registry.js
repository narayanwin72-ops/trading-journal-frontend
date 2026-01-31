// src/config/dashboard.registry.js

export const DASHBOARD_REGISTRY = {
  OPTIONS_INTRADAY: {
    label: "Options Intraday",

    filters: [
      "DATE",
      "STRATEGY",
      "POSITION",
      "CONFIDENCE",
      "BROKER",
      "TIMEFRAME",
      "UNDERLYING",
      "EXPIRY",
      "STRIKE",
    ],

    kpiSections: [
      {
        id: "KPI_OVERVIEW",
        title: "KPI Overview",
      },
      {
        id: "WIN_LOSS_DAY",
        title: "Win / Loss Days",
      },
      {
        id: "TRADE_QUALITY",
        title: "Trade Quality",
      },
      {
        id: "RISK_STRATEGY",
        title: "Risk & Strategy",
      },
      {
        id: "ENTRY_EXIT",
        title: "Entry / Exit & Confidence",
      },
      {
        id: "TIME_OPTIONS",
        title: "Time & Options KPI",
      },
      {
        id: "UNDERLYING_PERF",
        title: "Underlying Performance",
      },
    ],

    chartSections: [
      {
        id: "OPTION_OVERVIEW",
        title: "Option Overview Charts",
      },
      {
        id: "PHASE1_BASIC",
        title: "Phase 1 – Basic Charts",
      },
      {
        id: "PHASE2_STRATEGY",
        title: "Phase 2 – Strategy Charts",
      },
      {
        id: "PHASE3_TIMERANGE",
        title: "Phase 3 – Time Range Charts",
      },
      {
        id: "CUMULATIVE_PNL",
        title: "Cumulative PnL",
      },
    ],
  },
};
