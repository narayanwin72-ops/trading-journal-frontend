import { useState } from "react";

/* =====================================================
   DASHBOARD CONTROL – MAIN PAGE
   (CLEAR UI SEPARATION VERSION)
===================================================== */

const SEGMENTS = [
  { key: "OPTIONS_INTRADAY", label: "Options Intraday" },
  { key: "EQUITY_INTRADAY", label: "Equity Intraday" },
  { key: "FUTURES_INTRADAY", label: "Futures Intraday" },
  { key: "OPTIONS_POSITIONAL", label: "Options Positional" },
  { key: "FUTURES_POSITIONAL", label: "Futures Positional" },
  { key: "SWING", label: "Swing Trading" },
];

export default function DashboardControl() {
  /* ================= STATE ================= */
  const [activeSegment, setActiveSegment] = useState("OPTIONS_INTRADAY");
  const [activeSubTab, setActiveSubTab] = useState("KPI"); // KPI | CHART

  return (
    <div style={page}>
      <h2 style={title}>Dashboard Control</h2>

      {/* ================= SECTION 1: DASHBOARD TYPE ================= */}
      <div style={sectionCard}>
        <div style={sectionHeader}>
          📂 Dashboard Type
        </div>

        <div style={segmentBar}>
          {SEGMENTS.map((seg) => (
            <button
              key={seg.key}
              onClick={() => {
                setActiveSegment(seg.key);
                setActiveSubTab("KPI");
              }}
              style={segmentBtn(activeSegment === seg.key)}
            >
              {seg.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= SECTION 2: CONTROL TYPE ================= */}
      <div style={sectionCard}>
        <div style={sectionHeader}>
          ⚙️ Control Type
        </div>

        <div style={controlTypeBar}>
          <button
            onClick={() => setActiveSubTab("KPI")}
            style={controlBtn(activeSubTab === "KPI")}
          >
            📊 KPI Control
          </button>

          <button
            onClick={() => setActiveSubTab("CHART")}
            style={controlBtn(activeSubTab === "CHART")}
          >
            📈 Chart Control
          </button>
        </div>
      </div>

      {/* ================= SECTION 3: CONTROL CONTENT ================= */}
      <div style={card}>
        <h3 style={sectionTitle}>
          {SEGMENTS.find((s) => s.key === activeSegment)?.label}
        </h3>

        <div style={subTitle}>
          {activeSubTab === "KPI"
            ? "Manage KPI visibility for this dashboard"
            : "Manage Chart visibility for this dashboard"}
        </div>

        <div style={placeholder}>
          🚧 Here you will be able to
          <strong>
            {activeSubTab === "KPI" ? " enable / disable KPIs" : " enable / disable Charts"}
          </strong>
          <br />
          for <strong>{activeSegment}</strong> dashboard.
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: "20px",
  background: "#f8fafc",
};

const title = {
  fontSize: "22px",
  fontWeight: 700,
  marginBottom: "20px",
};

/* ===== SECTION CARD ===== */
const sectionCard = {
  background: "#ffffff",
  padding: "16px",
  borderRadius: "14px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  marginBottom: "18px",
};

const sectionHeader = {
  fontSize: "14px",
  fontWeight: 700,
  marginBottom: "12px",
  color: "#374151",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

/* ===== DASHBOARD TYPE ===== */
const segmentBar = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const segmentBtn = (active) => ({
  padding: "12px 22px",
  fontSize: "14px",
  fontWeight: 700,
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: active ? "#111827" : "#e5e7eb",
  color: active ? "#ffffff" : "#111827",
});

/* ===== CONTROL TYPE ===== */
const controlTypeBar = {
  display: "flex",
  gap: "12px",
};

const controlBtn = (active) => ({
  padding: "10px 22px",
  fontSize: "14px",
  fontWeight: 700,
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  cursor: "pointer",
  background: active ? "#0f172a" : "#ffffff",
  color: active ? "#ffffff" : "#111827",
});

/* ===== CONTENT ===== */
const card = {
  background: "#ffffff",
  padding: "22px",
  borderRadius: "14px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
};

const sectionTitle = {
  fontSize: "17px",
  fontWeight: 700,
  marginBottom: "4px",
};

const subTitle = {
  fontSize: "13px",
  color: "#6b7280",
  marginBottom: "14px",
};

const placeholder = {
  padding: "18px",
  background: "#f1f5f9",
  borderRadius: "10px",
  color: "#334155",
  fontSize: "14px",
};
