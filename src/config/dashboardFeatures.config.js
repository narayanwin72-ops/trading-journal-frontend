// src/config/dashboardFeatures.config.js

export const DASHBOARD_SEGMENTS = {
  OPTIONS_INTRADAY: {
    label: "Options Intraday",
    filters: [
      "DATE",
      "STRATEGY",
      "POSITION",
      "CONFIDENCE",
      "BROKER",
    ],
    kpis: [
      "TOTAL_TRADES",
      "WIN_RATE",
      "NET_PNL",
      "AVG_RR",
    ],
    charts: [
      "PNL_CURVE",
      "STRATEGY_PNL",
      "TIME_RANGE_PNL",
    ],
  },

  EQUITY_INTRADAY: {
    label: "Equity Intraday",
    filters: ["DATE", "SYMBOL", "STRATEGY"],
    kpis: ["TOTAL_TRADES", "NET_PNL"],
    charts: ["PNL_CURVE"],
  },

  FUTURES_INTRADAY: {
    label: "Futures Intraday",
    filters: ["DATE", "SYMBOL"],
    kpis: ["TOTAL_TRADES", "WIN_RATE"],
    charts: ["PNL_CURVE"],
  },
};
