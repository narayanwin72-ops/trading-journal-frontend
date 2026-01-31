import { useMemo } from "react";

/* =====================================================
   SWING – OVERVIEW KPI
   (SAFE | NO ZERO BUG | HOLDING DURATION INCLUDED)
===================================================== */

export default function SwingKPIOverviewSection({ trades = [] }) {

  const kpis = useMemo(() => {
    const totalTrades = trades.length;

    /* ===== EMPTY SAFE ===== */
    if (!totalTrades) {
      return {
        totalTrades: 0,
        netPNL: 0,
        winRate: 0,
        lossRate: 0,
        avgPNL: 0,
        profitFactor: 0,
        expectancy: 0,
        avgHoldingDays: 0,
        maxDrawdown: 0,
        maxDDPercent: 0,
      };
    }

    let wins = 0;
    let losses = 0;
    let profitSum = 0;
    let lossSum = 0;

    let runningPNL = 0;
    let peakPNL = 0;
    let maxDrawdown = 0;

    let holdingDaysSum = 0;
    let holdingCount = 0;

    trades.forEach((t) => {
      const pnl = Number(t.pnl ?? 0);

      /* ===== WIN / LOSS ===== */
      if (pnl > 0) {
        wins++;
        profitSum += pnl;
      } else if (pnl < 0) {
        losses++;
        lossSum += Math.abs(pnl);
      }

      /* ===== DRAWDOWN ===== */
      runningPNL += pnl;
      if (runningPNL > peakPNL) peakPNL = runningPNL;
      const dd = peakPNL - runningPNL;
      if (dd > maxDrawdown) maxDrawdown = dd;

      /* ===== HOLDING DAYS ===== */
      const entryDate = t.entryDate || t.date || t.tradeDate;
      const exitDate = t.exitDate;

      if (entryDate && exitDate) {
        const d1 = new Date(entryDate);
        const d2 = new Date(exitDate);
        const days = (d2 - d1) / (1000 * 60 * 60 * 24);

        if (!isNaN(days) && days >= 0) {
          holdingDaysSum += days;
          holdingCount++;
        }
      }
    });

    const netPNL = profitSum - lossSum;
    const winRate = ((wins / totalTrades) * 100).toFixed(1);
    const lossRate = ((losses / totalTrades) * 100).toFixed(1);
    const avgPNL = (netPNL / totalTrades).toFixed(2);
    const profitFactor = lossSum
      ? (profitSum / lossSum).toFixed(2)
      : "∞";

    const expectancy = avgPNL;

    const avgHoldingDays = holdingCount
      ? (holdingDaysSum / holdingCount).toFixed(1)
      : 0;

    const maxDDPercent = peakPNL
      ? ((maxDrawdown / peakPNL) * 100).toFixed(1)
      : 0;

    return {
      totalTrades,
      netPNL: netPNL.toFixed(2),
      winRate,
      lossRate,
      avgPNL,
      profitFactor,
      expectancy,
      avgHoldingDays,
      maxDrawdown: maxDrawdown.toFixed(2),
      maxDDPercent,
    };
  }, [trades]);

  /* ================= UI ================= */

  return (
    <div style={section}>
      <h3 style={title}>Swing – Overview KPIs</h3>

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
          label="Avg Holding (Days)"
          value={kpis.avgHoldingDays}
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

/* ================= STYLES (SAME AS OTHERS) ================= */

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
