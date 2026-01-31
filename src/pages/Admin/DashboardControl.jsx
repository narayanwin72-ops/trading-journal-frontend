import { useState, useEffect } from "react";
import { usePlanStore } from "../../store/plan.store";
import { useDashboardFeatureStore } from "../../store/dashboardFeature.store";
import { DASHBOARD_CONFIG } from "../../config/dashboard.config";

/*
  ADMIN – DASHBOARD CONTROL (FINAL – BUG FREE)
  ==========================================
  ✔ Proper feature registration
  ✔ Tick save works
  ✔ Refresh safe
  ✔ User-end reflect ready
*/

export default function DashboardControl() {
  const plans = usePlanStore((s) => s.plans);

  const {
    features,
    registerFeature,        // ✅ REQUIRED
    updateAllowedPlans,
  } = useDashboardFeatureStore();

  const [activeSegment, setActiveSegment] =
    useState("OPTIONS_INTRADAY");

  const config = DASHBOARD_CONFIG[activeSegment];

  /* ================= AUTO REGISTER FEATURES ================= */
  useEffect(() => {
    if (!config) return;

    const allFeatures = [
      `${activeSegment}_FILTER_DATE`,
      ...config.filters.map(
        (f) => `${activeSegment}_FILTER_${f}`
      ),
      ...config.kpis.map(
        (k) => `${activeSegment}_KPI_${k}`
      ),
      ...config.charts.map(
        (c) => `${activeSegment}_CHART_${c}`
      ),
    ];

    allFeatures.forEach((fid) => {
      registerFeature(fid); // 🔥 REAL FIX
    });
  }, [activeSegment, registerFeature, config]);

  /* ================= TOGGLE ================= */
  function toggle(featureId, planId) {
    const feature = features.find(
      (f) => f.featureId === featureId
    );

    const allowed = feature?.allowedPlans || [];

    const updated = allowed.includes(planId)
      ? allowed.filter((p) => p !== planId)
      : [...allowed, planId];

    updateAllowedPlans(featureId, updated);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>
        Dashboard Control
      </h2>

      {/* ================= SEGMENT TABS ================= */}
      <div style={tabs}>
        {Object.keys(DASHBOARD_CONFIG).map(
          (seg) => (
            <button
              key={seg}
              onClick={() =>
                setActiveSegment(seg)
              }
              style={{
                ...tabBtn,
                ...(activeSegment === seg
                  ? tabActive
                  : {}),
              }}
            >
              {seg
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (l) =>
                  l.toUpperCase()
                )}
            </button>
          )
        )}
      </div>

      {/* ================= FILTER CONTROL ================= */}
      <FeatureTable
        title="Filter Control"
        items={[
          `${activeSegment}_FILTER_DATE`,
          ...config.filters.map(
            (f) =>
              `${activeSegment}_FILTER_${f}`
          ),
        ]}
        plans={plans}
        features={features}
        toggle={toggle}
      />

      {/* ================= KPI CONTROL ================= */}
      <FeatureTable
        title="KPI Sections"
        items={config.kpis.map(
          (k) =>
            `${activeSegment}_KPI_${k}`
        )}
        plans={plans}
        features={features}
        toggle={toggle}
      />

      {/* ================= CHART CONTROL ================= */}
      <FeatureTable
        title="Chart Sections"
        items={config.charts.map(
          (c) =>
            `${activeSegment}_CHART_${c}`
        )}
        plans={plans}
        features={features}
        toggle={toggle}
      />
    </div>
  );
}

/* ================= TABLE ================= */

function FeatureTable({
  title,
  items,
  plans,
  features,
  toggle,
}) {
  return (
    <div style={card}>
      <h3 style={{ marginBottom: 12 }}>
        {title}
      </h3>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Feature</th>
            {plans.map((p) => (
              <th key={p.id} style={th}>
                {p.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {items.map((fid) => {
            const feature = features.find(
              (f) => f.featureId === fid
            );

            return (
              <tr key={fid}>
                <td style={td}>
                  {formatLabel(fid)}
                </td>

                {plans.map((p) => (
                  <td
                    key={p.id}
                    style={tdCenter}
                  >
                    <input
                      type="checkbox"
                      checked={
                        feature?.allowedPlans.includes(
                          p.id
                        ) || false
                      }
                      onChange={() =>
                        toggle(fid, p.id)
                      }
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ================= HELPERS ================= */

function formatLabel(fid) {
  if (fid.includes("_FILTER_DATE")) {
    return "Date Range (From / To)";
  }

  return fid
    .replace(/_/g, " ")
    .replace(
      /OPTIONS INTRADAY |EQUITY INTRADAY |FUTURES INTRADAY /,
      ""
    )
    .replace("FILTER ", "Filter: ")
    .replace("KPI ", "KPI: ")
    .replace("CHART ", "Chart: ");
}

/* ================= STYLES ================= */

const tabs = {
  display: "flex",
  gap: 8,
  marginBottom: 20,
};

const tabBtn = {
  padding: "8px 16px",
  borderRadius: 20,
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: 500,
};

const tabActive = {
  background: "#e0e7ff",
  fontWeight: 700,
};

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 24,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  border: "1px solid #cbd5e1",
  padding: 10,
  background: "#f1f5f9",
  textAlign: "left",
  fontSize: 14,
};

const td = {
  border: "1px solid #cbd5e1",
  padding: 10,
  fontSize: 14,
};

const tdCenter = {
  ...td,
  textAlign: "center",
};
