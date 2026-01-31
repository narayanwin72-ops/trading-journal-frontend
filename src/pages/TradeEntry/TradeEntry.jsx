import { useState, useEffect } from "react";
import OptionsTradeForm from "./OptionsTradeForm";
import EquityIntradayTradeForm from "./EquityIntradayTradeForm";
import SwingTradeForm from "./SwingTradeForm";
import PositionalOptionTradeForm from "./PositionalOptionTradeForm";
import IntradayFuturesTradeForm from "./IntradayFuturesTradeForm";
import PositionalFuturesTradeForm from "./PositionalFuturesTradeForm";

import { useTrades } from "../../store/trade.store";
import { useUserSymbolStore } from "../../store/userSymbol.store";
import {
  useUserPlanStore,
  FREE_PLAN_ID,
} from "../../store/userPlan.store";

import TradeEntryFeatureGuard from "../../guards/TradeEntryFeatureGuard";

export default function TradeEntry() {
  const [activeTab, setActiveTab] = useState("OPTIONS");

  /* ✅ ONLY source of truth for edit */
  const { editTradeType, clearEditTradeId } = useTrades();

  /* 🔑 USER PLAN ID (FINAL SAFE NORMALIZATION) */
  const rawPlanId = useUserPlanStore((s) => s.activePlanId);

  // 🔥 FINAL GUARD: kill "FREE" forever
  const planId =
    rawPlanId === "FREE"
      ? FREE_PLAN_ID
      : rawPlanId;

  /* 🔹 LOAD USER SYMBOLS */
  useEffect(() => {
    useUserSymbolStore
      .getState()
      .loadUserSymbols();
  }, []);

  /* 🔁 AUTO TAB SWITCH ON EDIT */
  useEffect(() => {
    if (editTradeType) {
      setActiveTab(editTradeType);
    }
  }, [editTradeType]);

  const tabs = [
    { label: "Options Trading", value: "OPTIONS" },
    { label: "Equity Intraday", value: "EQ_INTRADAY" },
    { label: "Intraday Futures", value: "FUTURES_INTRADAY" },
    {
      label: "Positional Futures",
      value: "FUTURES_POSITIONAL",
    },
    { label: "Swing Trading", value: "SWING" },
    {
      label: "Positional Option Trading",
      value: "POSITIONAL",
    },
  ];

  /* ⏳ PLAN NOT READY (only when not logged in) */
  if (!planId) {
    return (
      <div
        style={{
          padding: "24px",
          textAlign: "center",
        }}
      >
        Loading your plan...
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      {/* ================= TOP TABS ================= */}
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
            onClick={() => {
              setActiveTab(tab.value);
              clearEditTradeId();
            }}
            style={{
              padding: "12px 20px",
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

      {/* ================= CONTENT ================= */}

      {/* 🔒 OPTION INTRADAY — PLAN CONTROLLED */}
      {activeTab === "OPTIONS" && (
        <TradeEntryFeatureGuard
          featureId="OPTION_INTRADAY_TAB"
          planId={planId}
        >
          <OptionsTradeForm />
        </TradeEntryFeatureGuard>
      )}

      {/* 🔒 EQUITY INTRADAY — PLAN CONTROLLED */}
      {activeTab === "EQ_INTRADAY" && (
        <TradeEntryFeatureGuard
          featureId="EQUITY_INTRADAY_TAB"
          planId={planId}
        >
          <EquityIntradayTradeForm />
        </TradeEntryFeatureGuard>
      )}

      {/* 🔒 FUTURES INTRADAY — PLAN CONTROLLED (🔥 FIXED) */}
      {activeTab === "FUTURES_INTRADAY" && (
        <TradeEntryFeatureGuard
          featureId="FUTURES_INTRADAY_TAB"
          planId={planId}
        >
          <IntradayFuturesTradeForm />
        </TradeEntryFeatureGuard>
      )}

      {/* 🔓 OTHER TABS — ALWAYS OPEN */}
      {activeTab === "FUTURES_POSITIONAL" && (
        <PositionalFuturesTradeForm />
      )}

      {activeTab === "SWING" && (
        <SwingTradeForm />
      )}

      {activeTab === "POSITIONAL" && (
        <PositionalOptionTradeForm />
      )}
    </div>
  );
}
