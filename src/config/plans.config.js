// src/config/plans.config.js

export const PLANS = {
  free: {
    name: "Free",
    features: [
      "dashboard",
    ],
  },

  pro: {
    name: "Pro",
    features: [
      "dashboard",
      "tradeEntry",
      "tradeLog",
    ],
  },

  elite: {
    name: "Elite",
    features: [
      "dashboard",
      "dashboardControl", // 🆕 Dashboard Control feature
      "tradeEntry",
      "tradeLog",
      "psychology",
      "strategyAnalytics",
      "settings",
      "brokerCapital",
    ],
  },
};

