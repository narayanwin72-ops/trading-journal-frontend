import { useMemo } from "react";

/* =====================================================
   EQUITY INTRADAY – KPI OVERVIEW
   (LOGIC + CALCULATION + UI IN ONE FILE)
===================================================== */

export default function EquityKPIOverviewSection({ trades }) {

  /* ================= KPI CALCULATION ================= */
  const kpis = useMemo(() => {
    const closedTrades = trades.filter(
      (t) => t.entry && t.exitPrice
    );

    const totalTrades = closedTrades.length;

    if (!totalTrades) {
      return {
        totalTrades: 0,
        netPNL: 0,
        winRate: 0,
        lossRate: 0,
        avgPNL: 0,
        profitFactor: 0,
        expectancy: 0,
        maxDrawdown: 0,
        maxDDPercent: 0,
      };
    }

    let wins = 0;
    let losses = 0;
    let profitSum = 0;
    let lossSum = 0;
    let runningPNL = 0;
    let peak = 0;
    let maxDD = 0;

    closedTrades.forEach((t) => {
      const entry = Number(t.entry);
      const exit = Number(t.exitPrice);
      const qty = Number(t.qty || 1);
      const charges = Number(t.charges || 0);

      const pnl = (exit - entry) * qty - charges;

      runningPNL += pnl;

      if (runningPNL > peak) peak = runningPNL;
      const dd = peak - runningPNL;
      if (dd > maxDD) maxDD = dd;

      if (pnl > 0) {
        wins++;
        profitSum += pnl;
      } else if (pnl < 0) {
        losses++;
        lossSum += Math.abs(pnl);
      }
    });

    const netPNL = profitSum - lossSum;
    const winRate = ((wins / totalTrades) * 100).toFixed(1);
    const lossRate = ((losses / totalTrades) * 100).toFixed(1);
    const avgPNL = (netPNL / totalTrades).toFixed(2);
    const profitFactor = lossSum ? (profitSum / lossSum).toFixed(2) : "∞";
    const expectancy = avgPNL;
    const maxDDPercent = peak ? ((maxDD / peak) * 100).toFixed(1) : 0;

    return {
      totalTrades,
      netPNL: netPNL.toFixed(2),
      winRate,
      lossRate,
      avgPNL,
      profitFactor,
      expectancy,
      maxDrawdown: maxDD.toFixed(2),
      maxDDPercent,
    };
  }, [trades]);

  /* ================= UI ================= */
  return (
    <div style={section}>
      <h3 style={title}>Equity Intraday – Overview KPIs</h3>

      <div style={grid}>
        <KPIBox label="Total Trades" value={kpis.totalTrades} />

        <KPIBox
          label="Net P&L"
          value={`₹${kpis.netPNL}`}
          green={kpis.netPNL > 0}
          red={kpis.netPNL < 0}
        />

        <KPIBox label="Win Rate" value={`${kpis.winRate}%`} />
        <KPIBox label="Loss Rate" value={`${kpis.lossRate}%`} />

        <KPIBox
          label="Avg P&L / Trade"
          value={`₹${kpis.avgPNL}`}
          green={kpis.avgPNL > 0}
          red={kpis.avgPNL < 0}
        />

        <KPIBox label="Profit Factor" value={kpis.profitFactor} />

        <KPIBox
          label="Expectancy"
          value={`₹${kpis.expectancy}`}
          green={kpis.expectancy > 0}
          red={kpis.expectancy < 0}
        />

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
