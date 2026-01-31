import { useState, useMemo } from "react";

/* =====================================================
   RISK PROFILE + STRATEGY PERFORMANCE SECTION
===================================================== */

export default function RiskAndStrategySection({ trades }) {
  const [open, setOpen] = useState(true);

  const data = useMemo(() => {
    if (!trades || !trades.length) return null;

    /* ================= SORT BY DATE ================= */
    const sorted = [...trades].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let risks = [];
    let equity = 0;
    let peak = 0;
    let maxDD = 0;

    let ddStartDate = null;
    let ddEndDate = null;

    const strategyMap = {};

    /* ================= MAIN LOOP ================= */
    sorted.forEach((t) => {
      const entry = Number(t.entry);
      const exit = Number(t.exitPrice);
      const sl = Number(t.sl || t.stopLoss);
      const qty = Number(t.qty || 1);

      if (!entry || !exit || !sl) return;

      const risk = Math.abs(entry - sl) * qty;
      risks.push(risk);

      const pnl =
        t.position === "SHORT"
          ? (entry - exit) * qty
          : (exit - entry) * qty;

      /* ===== EQUITY & DRAWDOWN ===== */
      equity += pnl;
      if (equity > peak) {
        peak = equity;
        ddStartDate = null;
      } else {
        const dd = equity - peak;
        if (dd < maxDD) {
          maxDD = dd;
          if (!ddStartDate) ddStartDate = new Date(t.date);
          ddEndDate = new Date(t.date);
        }
      }

      /* ===== STRATEGY MAP ===== */
      if (t.strategy) {
        if (!strategyMap[t.strategy]) {
          strategyMap[t.strategy] = {
            pnl: 0,
            wins: 0,
            losses: 0,
            winAmt: 0,
            lossAmt: 0,
            rrs: [],
            equity: 0,
            peak: 0,
            maxDD: 0,
          };
        }

        const s = strategyMap[t.strategy];
        s.pnl += pnl;

        if (pnl > 0) {
          s.wins++;
          s.winAmt += pnl;
        } else if (pnl < 0) {
          s.losses++;
          s.lossAmt += Math.abs(pnl);
        }

        const reward =
          t.position === "SHORT"
            ? entry - exit
            : exit - entry;

        if (risk > 0) {
          s.rrs.push(reward / (risk / qty));
        }

        /* ===== STRATEGY DRAWDOWN ===== */
        s.equity += pnl;
        s.peak = Math.max(s.peak, s.equity);
        s.maxDD = Math.min(s.maxDD, s.equity - s.peak);
      }
    });

    /* ================= RISK PROFILE ================= */
    const avgRisk =
      risks.reduce((a, b) => a + b, 0) / risks.length || 0;

    const maxRisk = Math.max(...risks);

    const recoveryDays =
      ddStartDate && ddEndDate
        ? Math.ceil(
            (ddEndDate - ddStartDate) / (1000 * 60 * 60 * 24)
          )
        : 0;

    const recoveryFactor =
      maxDD !== 0 ? (equity / Math.abs(maxDD)).toFixed(2) : "0";

    /* ================= STRATEGY ANALYSIS ================= */
    const strategies = Object.entries(strategyMap);

    const bestStrategy = strategies
      .slice()
      .sort((a, b) => b[1].pnl - a[1].pnl)[0];

    const worstStrategy = strategies
      .slice()
      .sort((a, b) => a[1].pnl - b[1].pnl)[0];

    const consistentStrategy = strategies
      .slice()
      .sort(
        (a, b) => Math.abs(a[1].maxDD) - Math.abs(b[1].maxDD)
      )[0];

    const best = bestStrategy?.[1];

    const winPct =
      best && best.wins + best.losses
        ? (best.wins / (best.wins + best.losses)) * 100
        : 0;

    const avgRR =
      best && best.rrs.length
        ? best.rrs.reduce((a, b) => a + b, 0) / best.rrs.length
        : 0;

    const expectancy =
      winPct / 100 * (best?.winAmt / best?.wins || 0) -
      (1 - winPct / 100) *
        (best?.lossAmt / best?.losses || 0);

    return {
      avgRisk: avgRisk.toFixed(0),
      maxRisk: maxRisk.toFixed(0),
      maxDD: maxDD.toFixed(0),
      recoveryFactor,
      recoveryDays,

      /* ===== BEST STRATEGY ===== */
      bestStrategy: bestStrategy?.[0] || "-",
      bestPnL: best?.pnl?.toFixed(0) || "0",
      bestWinPct: winPct.toFixed(1),
      bestAvgRR: avgRR.toFixed(2),
      bestExpectancy: expectancy.toFixed(0),

      /* ===== WORST STRATEGY ===== */
      worstStrategy: worstStrategy?.[0] || "-",
      worstPnL: worstStrategy?.[1]?.pnl?.toFixed(0) || "0",
      worstLossPct:
        worstStrategy &&
        worstStrategy[1].wins + worstStrategy[1].losses
          ? (
              (worstStrategy[1].losses /
                (worstStrategy[1].wins +
                  worstStrategy[1].losses)) *
              100
            ).toFixed(1)
          : "0",

      /* ===== CONSISTENT STRATEGY ===== */
      consistentStrategy: consistentStrategy?.[0] || "-",
      consistentPnL:
        consistentStrategy?.[1]?.pnl?.toFixed(0) || "0",
      consistentDD:
        consistentStrategy?.[1]?.maxDD?.toFixed(0) || "0",
      consistentWinPct:
        consistentStrategy &&
        consistentStrategy[1].wins +
          consistentStrategy[1].losses
          ? (
              (consistentStrategy[1].wins /
                (consistentStrategy[1].wins +
                  consistentStrategy[1].losses)) *
              100
            ).toFixed(1)
          : "0",
    };
  }, [trades]);

  if (!data) return null;

  return (
    <div style={wrapper}>
      <div style={header} onClick={() => setOpen(!open)}>
        <h3 style={title}>
          Risk Profile & Strategy Performance
        </h3>
        <span style={toggle}>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <div style={grid}>
          {/* ================= RISK PROFILE ================= */}
          <div style={sectionBox}>
            <h4 style={sectionTitle}>🟦 Risk Profile</h4>
            <KPIGrid>
              <KPI
                label="Avg Risk / Trade"
                value={`₹${data.avgRisk}`}
              />
              <KPI
                label="Max Risk Taken"
                value={`₹${data.maxRisk}`}
              />
              <KPI
                label="Max Drawdown"
                value={`₹${data.maxDD}`}
                red
              />
              <KPI
                label="Recovery Factor"
                value={data.recoveryFactor}
              />
              <KPI
                label="Time to Recover DD (Days)"
                value={data.recoveryDays}
              />
            </KPIGrid>
          </div>

          {/* ================= STRATEGY PERFORMANCE ================= */}
          <div style={sectionBox}>
            <h4 style={sectionTitle}>🧠 Strategy Performance</h4>

            <KPIGrid>
              {/* ===== BEST STRATEGY ===== */}
              <KPI label="Best Strategy" value={data.bestStrategy} />
              <KPI
                label="Best Strategy PnL"
                value={`₹${data.bestPnL}`}
              />
              <KPI
                label="Best Strategy Win %"
                value={`${data.bestWinPct}%`}
              />
              <KPI
                label="Best Strategy Avg RR"
                value={data.bestAvgRR}
              />
              <KPI
                label="Best Strategy Expectancy"
                value={`₹${data.bestExpectancy}`}
              />

              {/* ===== WORST STRATEGY ===== */}
              <KPI
                label="Worst Strategy"
                value={data.worstStrategy}
                red
              />
              <KPI
                label="Worst Strategy PnL"
                value={`₹${data.worstPnL}`}
                red
              />
              <KPI
                label="Worst Strategy Loss %"
                value={`${data.worstLossPct}%`}
                red
              />

              {/* ===== CONSISTENT STRATEGY ===== */}
              <KPI
                label="Most Consistent Strategy"
                value={data.consistentStrategy}
              />
              <KPI
                label="Consistent Strategy PnL"
                value={`₹${data.consistentPnL}`}
              />
              <KPI
                label="Consistent Strategy Max DD"
                value={`₹${data.consistentDD}`}
                red
              />
              <KPI
                label="Consistent Strategy Win %"
                value={`${data.consistentWinPct}%`}
              />
            </KPIGrid>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= UI HELPERS ================= */

function KPI({ label, value, red }) {
  return (
    <div style={kpiBox}>
      <div style={kpiLabel}>{label}</div>
      <div
        style={{
          ...kpiValue,
          color: red ? "#dc2626" : "#111827",
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
        gridTemplateColumns:
          "repeat(auto-fit,minmax(200px,1fr))",
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
