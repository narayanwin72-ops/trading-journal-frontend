import { useState } from "react";
import OptionsTradeLog from "./OptionsTradeLog";
import EquityIntradayTradeLog from "./EquityIntradayTradeLog";
import IntradayFuturesTradeLog from "./IntradayFuturesTradeLog";
import SwingTradeLog from "./SwingTradeLog";
import PositionalFuturesTradeLog from "./PositionalFuturesTradeLog";
import PositionalOptionTradeLog from "./PositionalOptionTradeLog"; // ✅ NEW

export default function TradeLog() {
  const [activeTab, setActiveTab] = useState("OPTIONS");

  const tabs = [
    { label: "Options", value: "OPTIONS" },
    { label: "Equity Intraday", value: "EQUITY" },
    { label: "Intraday Futures", value: "FUTURES" },
    { label: "Swing", value: "SWING" },
    { label: "Positional Future", value: "POSITIONAL_FUTURES" },
    { label: "Positional Options", value: "POSITIONAL_OPTIONS" }, // ✅ NEW
  ];

  return (
    <div style={{ padding: "16px" }}>
      {/* ===== TOP TABS ===== */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "2px solid #e5e7eb",
          marginBottom: "20px",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              padding: "12px 20px",
              cursor: "pointer",
              fontWeight: 600,
              borderRadius: "8px 8px 0 0",
              background:
                activeTab === tab.value ? "#ffffff" : "#f1f5f9",
              border:
                activeTab === tab.value
                  ? "2px solid #2563eb"
                  : "2px solid transparent",
              borderBottom:
                activeTab === tab.value
                  ? "2px solid #ffffff"
                  : "2px solid transparent",
              color:
                activeTab === tab.value
                  ? "#2563eb"
                  : "#374151",
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* ===== TAB CONTENT ===== */}
      {activeTab === "OPTIONS" && <OptionsTradeLog />}

      {activeTab === "EQUITY" && <EquityIntradayTradeLog />}

      {activeTab === "FUTURES" && <IntradayFuturesTradeLog />}

      {activeTab === "SWING" && <SwingTradeLog />}

      {activeTab === "POSITIONAL_FUTURES" && (
        <PositionalFuturesTradeLog />
      )}

      {activeTab === "POSITIONAL_OPTIONS" && (
        <PositionalOptionTradeLog />
      )}
    </div>
  );
}
