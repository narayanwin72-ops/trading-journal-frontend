import { useState } from "react";

/* =====================================================
   WIN / LOSS DAY KPI SECTION
   (Overview KPI Style + Expandable)
===================================================== */

export default function WinLossDaySection({ data }) {
  const [open, setOpen] = useState(true);

  if (!data) return null;

  return (
    <div style={wrapper}>
      {/* ===== HEADER ===== */}
      <div style={header} onClick={() => setOpen(!open)}>
        <h3 style={title}>Win / Loss Day Analysis</h3>
        <span style={toggle}>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <div style={grid}>
          {/* ================= WIN DAYS ================= */}
          <div style={sectionBox}>
            <h4 style={greenTitle}>🟢 Winning Days</h4>

            <KPIGrid>
              <KPI label="Winning Days" value={data.winDays} />

              <KPI
                label="Avg Profit / Win Day"
                value={`₹${data.avgWinDay}`}
                green
              />

              <KPI
                label="Max Profit Day"
                value={`₹${data.maxWinDay}`}
                green
              />

              {/* ✅ FIXED */}
              <KPI
                label="Consecutive Win Days"
                value={data.consecutiveWinDays}
              />

              {/* ✅ FIXED */}
              <KPI
                label="Consecutive Win Trades"
                value={data.consecutiveWinTrades}
              />
            </KPIGrid>
          </div>

          {/* ================= LOSS DAYS ================= */}
          <div style={sectionBox}>
            <h4 style={redTitle}>🔴 Losing Days</h4>

            <KPIGrid>
              <KPI label="Losing Days" value={data.lossDays} />

              <KPI
                label="Avg Loss / Loss Day"
                value={`₹${data.avgLossDay}`}
                red
              />

              <KPI
                label="Max Loss Day"
                value={`₹${data.maxLossDay}`}
                red
              />

              {/* ✅ FIXED */}
              <KPI
                label="Consecutive Loss Days"
                value={data.consecutiveLossDays}
              />

              {/* ✅ FIXED */}
              <KPI
                label="Consecutive Loss Trades"
                value={data.consecutiveLossTrades}
              />
            </KPIGrid>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SMALL KPI BOX ================= */

function KPI({ label, value, green, red }) {
  return (
    <div style={kpiBox}>
      <div style={kpiLabel}>{label}</div>
      <div
        style={{
          ...kpiValue,
          color: green ? "#16a34a" : red ? "#dc2626" : "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function KPIGrid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "14px",
      }}
    >
      {children}
    </div>
  );
}

/* ================= STYLES ================= */

const wrapper = {
  background: "#ffffff",
  borderRadius: "14px",
  marginTop: "24px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 18px",
  cursor: "pointer",
  borderBottom: "1px solid #e5e7eb",
};

const title = {
  fontSize: "16px",
  fontWeight: 700,
};

const toggle = {
  fontSize: "20px",
  fontWeight: 700,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  padding: "16px",
};

const sectionBox = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "14px",
};

const greenTitle = {
  fontSize: "15px",
  fontWeight: 700,
  marginBottom: "12px",
  color: "#16a34a",
};

const redTitle = {
  fontSize: "15px",
  fontWeight: 700,
  marginBottom: "12px",
  color: "#dc2626",
};

const kpiBox = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "12px",
};

const kpiLabel = {
  fontSize: "13px",
  color: "#6b7280",
};

const kpiValue = {
  fontSize: "18px",
  fontWeight: 700,
};
