import { useState } from "react";
import OptionsTradeLogControl from "./trade-log-control/OptionsTradeLogControl";
import EquityTradeLogControl from "./trade-log-control/EquityTradeLogControl";
import FuturesTradeLogControl from "./trade-log-control/FuturesTradeLogControl";

export default function AdminTradeLogControl() {
  const [activeTab, setActiveTab] = useState("OPTIONS");

  const tabs = [
    { label: "Options", value: "OPTIONS" },
    { label: "Equity Intraday", value: "EQUITY" },
    { label: "Futures Intraday", value: "FUTURES" },
  ];

  return (
    <div>
      <h2>Trade Log Control</h2>

      {/* ===== TOP TABS ===== */}
      <div
        style={{
          display: "flex",
          gap: 8,
          borderBottom: "2px solid #e5e7eb",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              padding: "10px 18px",
              cursor: "pointer",
              fontWeight: 600,
              borderRadius: "8px 8px 0 0",
              background:
                activeTab === tab.value
                  ? "#ffffff"
                  : "#f1f5f9",
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
      {activeTab === "OPTIONS" && <OptionsTradeLogControl />}

      {activeTab === "EQUITY" && <EquityTradeLogControl />}

      {activeTab === "FUTURES" && <FuturesTradeLogControl />}
    </div>
  );
}
