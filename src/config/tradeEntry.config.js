/*
  STEP-1 (Corrected)
  Trade Entry Config
  Option Intraday – FULL MIRROR
*/

export const TRADE_ENTRY_TABS = [
  {
    tabId: "OPTION_INTRADAY",
    label: "Option Intraday",
    segment: "OPTIONS",

    fields: [
      "DATE",
      "TIME",
      "TIME_RANGE",
      "UNDERLYING",
      "EXPIRY",

      "STRIKE",
      "OPTION_TYPE",
      "POSITION",

      "ENTRY_PRICE",
      "STOP_LOSS",
      "TARGET",
      "QUANTITY",

      "STRATEGY",
      "TIMEFRAME",
      "ENTRY_REASON",
      "CONFIDENCE",

      "EXIT_PRICE",
      "EXIT_TIME",
      "EXIT_REASON",

      "BROKERAGE",
      "REMARKS",
      "CHART_IMAGE",

      "BROKER",
      "CAPITAL",
    ],
  },
];
