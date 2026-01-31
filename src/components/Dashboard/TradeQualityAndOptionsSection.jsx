import { useState, useMemo } from "react";

/* =====================================================
   TRADE QUALITY + OPTIONS KPI SECTION
   (RR FIXED | PLANNED vs ACTUAL | QTY FIXED)
===================================================== */

export default function TradeQualityAndOptionsSection({ trades }) {
  const [open, setOpen] = useState(true);

  const data = useMemo(() => {
    let winSum = 0;
    let lossSum = 0;
    let winCount = 0;
    let lossCount = 0;

    let plannedRRs = [];
    let actualRRs = [];
    let rrSlippages = [];

    let rr1 = 0;
    let rr2 = 0;
    let rr3 = 0;

    let targetHit = 0;
    let slHit = 0;

    let callTrades = 0;
    let putTrades = 0;
    let callPNL = 0;
    let putPNL = 0;
    let callWins = 0;
    let putWins = 0;

    trades.forEach((t) => {
      const entry = Number(t.entry);
      const exit = Number(t.exitPrice);
      const sl = Number(t.sl || t.stopLoss);
      const target = Number(t.target);
      const qty = Number(t.qty || 1);

      if (!entry || !exit || !sl) return;

      /* ================= PNL (QTY INCLUDED) ================= */
      const rawPnL =
        t.position === "SHORT"
          ? entry - exit
          : exit - entry;

      const pnl = rawPnL * qty;

      /* ================= WIN / LOSS ================= */
      if (pnl > 0) {
        winSum += pnl;
        winCount++;
      } else if (pnl < 0) {
        lossSum += Math.abs(pnl);
        lossCount++;
      }

      /* ================= RISK (PER UNIT) ================= */
      const riskPerUnit =
        t.position === "SHORT"
          ? Math.abs(sl - entry)
          : Math.abs(entry - sl);

      if (riskPerUnit <= 0) return;

      /* ================= PLANNED RR ================= */
      if (target) {
        const plannedRewardPerUnit =
          t.position === "SHORT"
            ? entry - target
            : target - entry;

        const plannedRR = plannedRewardPerUnit / riskPerUnit;
        plannedRRs.push(plannedRR);
      }

      /* ================= ACTUAL RR ================= */
      const actualRewardPerUnit =
        t.position === "SHORT"
          ? entry - exit
          : exit - entry;

      const actualRR = actualRewardPerUnit / riskPerUnit;
      actualRRs.push(actualRR);

      /* ================= RR SLIPPAGE ================= */
      if (target) {
        const plannedRewardPerUnit =
          t.position === "SHORT"
            ? entry - target
            : target - entry;

        const plannedRR = plannedRewardPerUnit / riskPerUnit;
        rrSlippages.push(actualRR - plannedRR);
      }

      /* ================= RR ACHIEVEMENT ================= */
      if (actualRR >= 1) rr1++;
      if (actualRR >= 2) rr2++;
      if (actualRR >= 3) rr3++;

      /* ================= TARGET / SL HIT ================= */
      if (actualRR > 0) targetHit++;
      if (actualRR <= 0) slHit++;

      /* ================= CALL / PUT (QTY FIXED) ================= */
      if (t.optionType === "CALL") {
        callTrades++;
        callPNL += pnl;
        if (pnl > 0) callWins++;
      }

      if (t.optionType === "PUT") {
        putTrades++;
        putPNL += pnl;
        if (pnl > 0) putWins++;
      }
    });

    const total = trades.length || 1;

    return {
      avgPlannedRR: plannedRRs.length
        ? (plannedRRs.reduce((a, b) => a + b, 0) / plannedRRs.length).toFixed(2)
        : "0",

      avgActualRR: actualRRs.length
        ? (actualRRs.reduce((a, b) => a + b, 0) / actualRRs.length).toFixed(2)
        : "0",

      avgRRSlippage: rrSlippages.length
        ? (rrSlippages.reduce((a, b) => a + b, 0) / rrSlippages.length).toFixed(2)
        : "0",

      rr1Pct: ((rr1 / total) * 100).toFixed(1),
      rr2Pct: ((rr2 / total) * 100).toFixed(1),
      rr3Pct: ((rr3 / total) * 100).toFixed(1),

      targetHitPct: ((targetHit / total) * 100).toFixed(1),
      slHitPct: ((slHit / total) * 100).toFixed(1),

      callTrades,
      putTrades,
      callPNL: callPNL.toFixed(0),
      putPNL: putPNL.toFixed(0),

      callWinRate: callTrades
        ? ((callWins / callTrades) * 100).toFixed(1)
        : "0",

      putWinRate: putTrades
        ? ((putWins / putTrades) * 100).toFixed(1)
        : "0",
    };
  }, [trades]);

  if (!trades.length) return null;

  return (
    <div style={wrapper}>
      <div style={header} onClick={() => setOpen(!open)}>
        <h3 style={title}>Trade Quality & RR Analysis</h3>
        <span style={toggle}>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <div style={grid}>
          <div style={sectionBox}>
            <h4 style={sectionTitle}>🟪 Trade Quality (RR)</h4>
            <KPIGrid>
              <KPI label="Avg Planned RR" value={data.avgPlannedRR} />
              <KPI label="Avg Actual RR" value={data.avgActualRR} />
              <KPI label="Avg RR Slippage" value={data.avgRRSlippage} />
              <KPI label="RR ≥ 1 Achieved %" value={`${data.rr1Pct}%`} />
              <KPI label="RR ≥ 2 Achieved %" value={`${data.rr2Pct}%`} />
              <KPI label="RR ≥ 3 Achieved %" value={`${data.rr3Pct}%`} />
              <KPI label="Target Hit %" value={`${data.targetHitPct}%`} />
              <KPI label="SL Hit %" value={`${data.slHitPct}%`} />
            </KPIGrid>
          </div>

          <div style={sectionBox}>
            <h4 style={sectionTitle}>🟧 Options Specific</h4>
            <KPIGrid>
              <KPI label="CALL Trades" value={data.callTrades} />
              <KPI label="PUT Trades" value={data.putTrades} />
              <KPI label="CALL PNL" value={`₹${data.callPNL}`} green />
              <KPI label="PUT PNL" value={`₹${data.putPNL}`} red />
              <KPI label="CALL Win %" value={`${data.callWinRate}%`} />
              <KPI label="PUT Win %" value={`${data.putWinRate}%`} />
            </KPIGrid>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= UI (UNCHANGED) ================= */

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
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: "14px",
      }}
    >
      {children}
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

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

const title = { fontSize: "16px", fontWeight: 700 };
const toggle = { fontSize: "20px", fontWeight: 700 };

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

const sectionTitle = {
  fontSize: "15px",
  fontWeight: 700,
  marginBottom: "12px",
};

const kpiBox = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "12px",
};

const kpiLabel = { fontSize: "13px", color: "#6b7280" };
const kpiValue = { fontSize: "18px", fontWeight: 700 };
