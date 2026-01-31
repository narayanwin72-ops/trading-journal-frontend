import { useState } from "react";
import { usePlanStore } from "../../store/plan.store";
import { useTradeEntryFeatureStore } from "../../store/tradeEntryFeature.store";

/* ================= FEATURE IDS ================= */

/* OPTION */
const OPTION_TAB_FEATURE_ID = "OPTION_INTRADAY_TAB";

/* EQUITY */
const EQUITY_TAB_FEATURE_ID = "EQUITY_INTRADAY_TAB";

/* FUTURES */
const FUTURES_TAB_FEATURE_ID = "FUTURES_INTRADAY_TAB";

/* OPTION FIELDS */
const OPTION_FIELDS = [
  "DATE",
  "TIME",
  "TIMERANGE",
  "UNDERLYING",
  "EXPIRY",
  "STRIKE",
  "OPTIONTYPE",
  "POSITION",
  "ENTRY",
  "SL",
  "TARGET",
  "QTY",
  "STRATEGY",
  "TIMEFRAME",
  "REASON",
  "CONFIDENCE",
  "EXITPRICE",
  "EXITTIME",
  "EXITREASON",
  "CHARGES",
  "REMARKS",
  "CHARTIMAGE",
  "BROKER",
  "CAPITAL",
];

/* EQUITY FIELDS */
const EQUITY_FIELDS = [
  "DATE",
  "TIME",
  "TIMERANGE",
  "SYMBOL",
  "POSITION",
  "ENTRY",
  "SL",
  "TARGET",
  "QTY",
  "STRATEGY",
  "TIMEFRAME",
  "REASON",
  "CONFIDENCE",
  "EXITPRICE",
  "EXITTIME",
  "EXITREASON",
  "CHARGES",
  "REMARKS",
  "CHARTIMAGE",
  "BROKER",
  "CAPITAL",
];

/* FUTURES FIELDS */
const FUTURES_FIELDS = [
  "DATE",
  "TIME",
  "TIMERANGE",
  "SYMBOL",
  "EXPIRY",
  "POSITION",
  "ENTRY",
  "SL",
  "TARGET",
  "QTY",
  "STRATEGY",
  "TIMEFRAME",
  "REASON",
  "CONFIDENCE",
  "EXITPRICE",
  "EXITTIME",
  "EXITREASON",
  "CHARGES",
  "REMARKS",
  "CHARTIMAGE",
  "BROKER",
  "CAPITAL",
];

export default function TradeEntryControl() {
  const plans = usePlanStore((s) => s.plans);
  const { features, updateAllowedPlans } =
    useTradeEntryFeatureStore();

  const [activeTab, setActiveTab] = useState("OPTIONS");

  /* ================= HELPERS ================= */

  function getFeature(featureId) {
    return features.find((f) => f.featureId === featureId);
  }

  function togglePlan(featureId, planId) {
    const feature = getFeature(featureId);
    const allowed = feature?.allowedPlans || [];

    const updated = allowed.includes(planId)
      ? allowed.filter((p) => p !== planId)
      : [...allowed, planId];

    updateAllowedPlans(featureId, updated);
  }

  /* ================= UI ================= */

  return (
    <div style={{ padding: 20 }}>
      <h2>Trade Entry Control</h2>

      {/* ================= TOP TABS ================= */}
      <div style={tabs}>
        <button
          style={{
            ...tabBtn,
            ...(activeTab === "OPTIONS" ? tabActive : {}),
          }}
          onClick={() => setActiveTab("OPTIONS")}
        >
          Options
        </button>

        <button
          style={{
            ...tabBtn,
            ...(activeTab === "EQUITY" ? tabActive : {}),
          }}
          onClick={() => setActiveTab("EQUITY")}
        >
          Equity Intraday
        </button>

        <button
          style={{
            ...tabBtn,
            ...(activeTab === "FUTURES" ? tabActive : {}),
          }}
          onClick={() => setActiveTab("FUTURES")}
        >
          Intraday Futures
        </button>
      </div>

      {/* =================================================
         OPTIONS TAB
      ================================================= */}
      {activeTab === "OPTIONS" && (
        <FeatureTable
          title="Option Intraday Entry Tab"
          tabFeatureId={OPTION_TAB_FEATURE_ID}
          fieldPrefix="OPTIONS"
          fields={OPTION_FIELDS}
          plans={plans}
          getFeature={getFeature}
          togglePlan={togglePlan}
        />
      )}

      {/* =================================================
         EQUITY TAB
      ================================================= */}
      {activeTab === "EQUITY" && (
        <FeatureTable
          title="Equity Intraday Entry Tab"
          tabFeatureId={EQUITY_TAB_FEATURE_ID}
          fieldPrefix="EQUITY"
          fields={EQUITY_FIELDS}
          plans={plans}
          getFeature={getFeature}
          togglePlan={togglePlan}
        />
      )}

      {/* =================================================
         FUTURES TAB
      ================================================= */}
      {activeTab === "FUTURES" && (
        <FeatureTable
          title="Intraday Futures Entry Tab"
          tabFeatureId={FUTURES_TAB_FEATURE_ID}
          fieldPrefix="FUTURES"
          fields={FUTURES_FIELDS}
          plans={plans}
          getFeature={getFeature}
          togglePlan={togglePlan}
        />
      )}
    </div>
  );
}

/* ================= REUSABLE TABLE ================= */

function FeatureTable({
  title,
  tabFeatureId,
  fieldPrefix,
  fields,
  plans,
  getFeature,
  togglePlan,
}) {
  const tabFeature = getFeature(tabFeatureId);

  return (
    <table style={table}>
      <thead>
        <tr>
          <th style={th}>Feature</th>
          {plans.map((plan) => (
            <th key={plan.id} style={th}>
              {plan.name}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {/* ===== TAB ACCESS ===== */}
        <tr>
          <td style={{ ...td, fontWeight: 700 }}>
            {title}
          </td>

          {plans.map((plan) => (
            <td key={plan.id} style={tdCenter}>
              <input
                type="checkbox"
                checked={
                  tabFeature?.allowedPlans.includes(
                    plan.id
                  ) || false
                }
                onChange={() =>
                  togglePlan(tabFeatureId, plan.id)
                }
              />
            </td>
          ))}
        </tr>

        {/* ===== FIELD LEVEL ===== */}
        {fields.map((field) => {
          const featureId = `${fieldPrefix}_${field}`;
          const feature = getFeature(featureId);

          return (
            <tr key={featureId}>
              <td style={td}>{featureId}</td>

              {plans.map((plan) => (
                <td key={plan.id} style={tdCenter}>
                  <input
                    type="checkbox"
                    checked={
                      feature?.allowedPlans.includes(
                        plan.id
                      ) || false
                    }
                    onChange={() =>
                      togglePlan(featureId, plan.id)
                    }
                  />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ================= STYLES ================= */

const tabs = {
  display: "flex",
  gap: 8,
  marginBottom: 16,
};

const tabBtn = {
  padding: "8px 14px",
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  cursor: "pointer",
  borderRadius: 6,
};

const tabActive = {
  background: "#e0e7ff",
  fontWeight: 600,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  border: "1px solid #cbd5e1",
  padding: 8,
  background: "#f1f5f9",
};

const td = {
  border: "1px solid #cbd5e1",
  padding: 8,
};

const tdCenter = {
  ...td,
  textAlign: "center",
};
