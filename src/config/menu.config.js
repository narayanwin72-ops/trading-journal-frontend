// src/config/menu.config.js

export const MENU_ITEMS = [
  {
    label: "Dashboard",
    feature: "dashboard",
    path: "/dashboard",
  },

  {
    label: "Dashboard Control",   // 🆕 NEW
    feature: "dashboardControl",  // 🆕 NEW FEATURE KEY
    path: "/dashboard-control",
  },

  {
    label: "Trade Entry",
    feature: "tradeEntry",
    path: "/trade-entry",
  },
  {
    label: "Trade Log",
    feature: "tradeLog",
    path: "/trade-log",
  },
  {
    label: "Psychology",
    feature: "psychology",
    path: "/psychology",
  },
  {
    label: "Strategy Analytics",
    feature: "strategyAnalytics",
    path: "/strategy",
  },
  {
    label: "Settings",
    feature: "settings",
    path: "/settings",
  },
  {
    label: "Broker Capital",
    feature: "brokerCapital",
    path: "/broker-capital",
  },
];
