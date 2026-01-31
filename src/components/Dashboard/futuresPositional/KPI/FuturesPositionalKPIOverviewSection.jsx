import { useMemo } from "react";

/* =====================================================
   FUTURES POSITIONAL – OVERVIEW KPI
   (LOGIC + CALCULATION + UI)
===================================================== */

export default function FuturesPositionalKPIOverviewSection({ trades }) {

  /* ================= KPI CALCULATION ================= */
  const kpis = useMemo(() => {
    const totalTrades = trades.length;

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
        avgHoldingDays: 0,
      };
    }

    let wins = 0;
    let losses = 0;
    let profitSum = 0;
    let lossSum = 0;

    let runningPNL = 0;
    let peakPNL = 0;
    let maxDrawdown = 0;

    let totalHoldingDays = 0;
    let holdingCount = 0;

    trades.forEach((t) => {
      const entry = Number(t.entry);
      const exit = Number(t.exitPrice);
      const qty = Number(t.qty);
      const charges = Number(t.charges || 0);

      if (!entry || !exit || !qty) return;

      /* ===== FUTURES PNL LOGIC ===== */
      let pnl = 0;
      if (t.position === "LONG") {
        pnl = (exit - entry) * qty - charges;
      } else if (t.position === "SHORT") {
        pnl = (entry - exit) * qty - charges;
      }

      runningPNL += pnl;

      if (runningPNL > peakPNL) peakPNL = runningPNL;
      const dd = peakPNL - runningPNL;
      if (dd > maxDrawdown) maxDrawdown = dd;

      if (pnl > 0) {
        wins++;
        profitSum += pnl;
      } else if (pnl < 0) {
        losses++;
        lossSum += Math.abs(pnl);
      }

      /* ===== HOLDING DURATION ===== */
      if (t.entryDate && t.exitDate) {
        const d1 = new Date(t.entryDate);
        const d2 = new Date(t.exitDate);
        const days = (d2 - d1) / (1000 * 60 * 60 * 24);
        if (days >= 0) {
          totalHoldingDays += days;
          holdingCount++;
        }
      }
    });

    const netPNL = profitSum - lossSum;
    const winRate = ((wins / totalTrades) * 100).toFixed(1);
    const lossRate = ((losses / totalTrades) * 100).toFixed(1);
    const avgPNL = (netPNL / totalTrades).toFixed(2);
    const profitFactor = lossSum ? (profitSum / lossSum).toFixed(2) : "∞";
    const expectancy = avgPNL;
    const maxDDPercent = peakPNL
      ? ((maxDrawdown / peakPNL) * 100).toFixed(1)
      : 0;

    const avgHoldingDays = holdingCount
      ? (totalHoldingDays / holdingCount).toFixed(1)
      : 0;

    return {
      totalTrades,
      netPNL: netPNL.toFixed(2),
      winRate,
      lossRate,
      avgPNL,
      profitFactor,
      expectancy,
      maxDrawdown: maxDrawdown.toFixed(2),
      maxDDPercent,
      avgHoldingDays,
    };
  }, [trades]);

  /* ================= UI ================= */
  return (
    <div style={section}>
      <h3 style={title}>Futures Positional – Overview KPIs</h3>

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

        <KPIBox
          label="Avg Holding (Days)"
          value={kpis.avgHoldingDays}
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
