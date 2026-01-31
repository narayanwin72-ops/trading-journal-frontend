// src/config/dashboardColors.js

/*
  CENTRAL DASHBOARD COLOR SYSTEM
  -------------------------------
  Used by:
  - KPI Cards
  - Charts
  - Tabs
  - Profit / Loss indicators
*/

/* ================= BASE COLORS ================= */

export const COLORS = {
  primary: "#2563EB",      // Blue
  secondary: "#9333EA",    // Purple
  success: "#16A34A",      // Green
  danger: "#DC2626",       // Red
  warning: "#F59E0B",      // Yellow
  info: "#0EA5E9",         // Sky
  dark: "#0F172A",
  light: "#F8FAFC",
};

/* ================= PROFIT / LOSS ================= */

export const PNL_COLORS = {
  profit: "#22C55E",       // Bright Green
  loss: "#EF4444",         // Bright Red
  neutral: "#64748B",
};

/* ================= KPI GRADIENTS ================= */

export const KPI_GRADIENTS = {
  totalPNL: {
    bg: "linear-gradient(135deg, #22C55E, #16A34A)",
    text: "#ffffff",
  },

  winRate: {
    bg: "linear-gradient(135deg, #38BDF8, #2563EB)",
    text: "#ffffff",
  },

  expectancy: {
    bg: "linear-gradient(135deg, #A855F7, #7C3AED)",
    text: "#ffffff",
  },

  drawdown: {
    bg: "linear-gradient(135deg, #F97316, #EA580C)",
    text: "#ffffff",
  },

  trades: {
    bg: "linear-gradient(135deg, #64748B, #334155)",
    text: "#ffffff",
  },
};

/* ================= DONUT CHART ================= */

export const DONUT_COLORS = [
  "#22C55E",   // Win
  "#EF4444",   // Loss
];

/* ================= BAR CHART ================= */

export const BAR_COLORS = {
  profit: "#22C55E",
  loss: "#EF4444",
};

/* ================= LINE CHART ================= */

export const LINE_COLORS = {
  pnl: "#2563EB",
  cumulative: "#9333EA",
};

/* ================= WEEKDAY COLORS ================= */

export const WEEKDAY_COLORS = {
  Mon: "#0EA5E9",
  Tue: "#6366F1",
  Wed: "#8B5CF6",
  Thu: "#EC4899",
  Fri: "#F59E0B",
};

/* ================= CALL PUT ================= */

export const CALL_PUT_COLORS = {
  CALL: "#22C55E",
  PUT: "#EF4444",
};

/* ================= TIMEFRAME ================= */

export const TIMEFRAME_COLORS = [
  "#0EA5E9",
  "#22C55E",
  "#F97316",
  "#A855F7",
  "#EF4444",
];

/* ================= STRATEGY ================= */

export const STRATEGY_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#0EA5E9",
  "#16A34A",
  "#F59E0B",
  "#EF4444",
];

/* ================= TAB COLORS ================= */

export const TAB_COLORS = {
  activeBg: "#ffffff",
  activeBorder: "#2563EB",
  activeText: "#2563EB",

  inactiveBg: "#F1F5F9",
  inactiveText: "#475569",
};

/* ================= CHART CARD ================= */

export const CHART_CARD_STYLE = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
};

/* ================= KPI CARD ================= */

export const KPI_CARD_STYLE = {
  borderRadius: "16px",
  padding: "18px",
  minWidth: "220px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
};

/* ================= UTIL ================= */

export function getPNLColor(value) {
  if (value > 0) return PNL_COLORS.profit;
  if (value < 0) return PNL_COLORS.loss;
  return PNL_COLORS.neutral;
}
