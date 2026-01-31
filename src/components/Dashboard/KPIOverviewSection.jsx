/* =====================================================
   KPI OVERVIEW SECTION (UI ONLY)
===================================================== */

export default function KPIOverviewSection({ kpis }) {
  return (
    <div style={section}>
      <h3 style={title}>Overview KPIs</h3>

      <div style={grid}>
        <KPIBox label="Total Trades" value={kpis.totalTrades} />
        <KPIBox
          label="Total PNL"
          value={`₹${kpis.netPNL}`}
          green={kpis.netPNL > 0}
          red={kpis.netPNL < 0}
        />
        <KPIBox label="Win Rate" value={`${kpis.winRate}%`} />
        <KPIBox label="Loss Rate" value={`${kpis.lossRate}%`} />
        <KPIBox label="Avg PNL / Trade" value={`₹${kpis.avgPNL}`} />
        <KPIBox label="Profit Factor" value={kpis.profitFactor} />
        <KPIBox label="Expectancy" value={`₹${kpis.expectancy}`} />
        <KPIBox
          label="Max Drawdown"
          value={`₹${kpis.maxDrawdown} (${kpis.maxDDPercent}%)`}
          red
        />
      </div>
    </div>
  );
}

/* ================= SMALL UI ================= */

function KPIBox({ label, value, green, red }) {
  return (
    <div style={box}>
      <div style={labelStyle}>{label}</div>
      <div
        style={{
          ...valueStyle,
          color: green ? "#16a34a" : red ? "#dc2626" : "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const section = {
  background: "#ffffff",
  padding: "16px",
  borderRadius: "12px",
  marginTop: "20px",
};

const title = {
  fontSize: "16px",
  fontWeight: 700,
  marginBottom: "14px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "14px",
};

const box = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "14px",
};

const labelStyle = {
  fontSize: "13px",
  color: "#6b7280",
};

const valueStyle = {
  fontSize: "20px",
  fontWeight: 700,
};
