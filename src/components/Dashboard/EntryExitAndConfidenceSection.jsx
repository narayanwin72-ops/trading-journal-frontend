import { useState, useMemo } from "react";

/* =====================================================
   ENTRY / EXIT BEHAVIOUR + CONFIDENCE
   (BALANCED UI | LOGIC UNCHANGED)
===================================================== */

export default function EntryExitAndConfidenceSection({ trades }) {
  const [open, setOpen] = useState(true);

  const data = useMemo(() => {
    if (!trades || !trades.length) return null;

    const entryStats = {};
    const exitStats = {};

    let prematureExit = 0;
    let slBeforeExit = 0;
    let slJumpExit = 0;

    const confidence = {};

    const calcPNL = (t) => {
      const e = Number(t.entry);
      const x = Number(t.exitPrice || t.exit);
      const q = Number(t.qty || 1);
      if (!e || !x) return 0;
      return t.position === "SHORT" ? (e - x) * q : (x - e) * q;
    };

    trades.forEach((t) => {
      const entry = Number(t.entry);
      const exit = Number(t.exitPrice || t.exit);
      const sl = Number(t.sl || t.stopLoss);
      const target = Number(t.target);

      if (!entry || !exit) return;

      const pnl = calcPNL(t);
      const win = pnl > 0;

      /* ENTRY / EXIT */
      if (t.reason) {
        entryStats[t.reason] ??= { pnl: 0, trades: 0, wins: 0 };
        entryStats[t.reason].pnl += pnl;
        entryStats[t.reason].trades++;
        if (win) entryStats[t.reason].wins++;
      }

      if (t.exitReason) {
        exitStats[t.exitReason] ??= { pnl: 0, trades: 0, wins: 0 };
        exitStats[t.exitReason].pnl += pnl;
        exitStats[t.exitReason].trades++;
        if (win) exitStats[t.exitReason].wins++;
      }

      /* EXIT TYPES */
      if (target) {
        if (
          (t.position === "LONG" && exit < target) ||
          (t.position === "SHORT" && exit > target)
        ) prematureExit++;
      }

      if (sl) {
        if (
          (t.position === "LONG" && exit > sl && exit < entry) ||
          (t.position === "SHORT" && exit < sl && exit > entry)
        ) slBeforeExit++;

        const tolerance = entry * 0.0015;
        if (
          (t.position === "LONG" && exit < sl - tolerance) ||
          (t.position === "SHORT" && exit > sl + tolerance)
        ) slJumpExit++;
      }

      /* CONFIDENCE */
      if (!t.confidence || !sl) return;

      const risk = Math.abs(entry - sl);
      if (risk <= 0) return;

      const actualRR = Math.abs(exit - entry) / risk;

      confidence[t.confidence] ??= {
        trades: 0,
        wins: 0,
        pnl: 0,
        rr: [],
      };

      const c = confidence[t.confidence];
      c.trades++;
      c.pnl += pnl;
      if (win) c.wins++;
      c.rr.push(actualRR);
    });

    const bw = (obj) => {
      let best = null,
        worst = null;
      Object.entries(obj).forEach(([k, v]) => {
        if (!best || v.pnl > obj[best].pnl) best = k;
        if (!worst || v.pnl < obj[worst].pnl) worst = k;
      });
      return { best, worst };
    };

    return {
      entryBW: bw(entryStats),
      exitBW: bw(exitStats),
      prematureExitPct: ((prematureExit / trades.length) * 100).toFixed(1),
      slBeforeExitPct: ((slBeforeExit / trades.length) * 100).toFixed(1),
      slJumpExitPct: ((slJumpExit / trades.length) * 100).toFixed(1),
      confidence,
      totalTrades: trades.length,
    };
  }, [trades]);

  if (!data) return null;

  return (
    <div style={wrapper}>
      <div style={header} onClick={() => setOpen(!open)}>
        <h3 style={title}>Entry / Exit Behaviour & Confidence</h3>
        <span>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <div style={grid}>
          {/* ENTRY / EXIT */}
          <Section title="Entry & Exit Behaviour">
            <KPIGrid>
              <KPI label="Best Entry" value={data.entryBW.best || "—"} green />
              <KPI label="Worst Entry" value={data.entryBW.worst || "—"} red />
              <KPI label="Best Exit" value={data.exitBW.best || "—"} green />
              <KPI label="Worst Exit" value={data.exitBW.worst || "—"} red />
              <KPI label="Premature Exit %" value={`${data.prematureExitPct}%`} />
              <KPI label="SL Before Exit %" value={`${data.slBeforeExitPct}%`} />
              <KPI label="SL Jump Exit %" value={`${data.slJumpExitPct}%`} red />
            </KPIGrid>
          </Section>

          {/* CONFIDENCE (BALANCED) */}
          <Section title="Confidence Overview">
            <div style={confidenceGrid}>
              {Object.entries(data.confidence).map(([k, c]) => (
                <div key={k} style={confidenceBox}>
                  <div style={confidenceTitle}>{k}</div>

                  <KPIGrid small>
                    <KPI
                      label="Trades %"
                      value={`${((c.trades / data.totalTrades) * 100).toFixed(1)}%`}
                    />
                    <KPI
                      label="Win %"
                      value={`${((c.wins / c.trades) * 100).toFixed(1)}%`}
                    />
                    <KPI
                      label="Avg RR"
                      value={
                        c.rr.length
                          ? (
                              c.rr.reduce((a, b) => a + b, 0) / c.rr.length
                            ).toFixed(2)
                          : "0"
                      }
                    />
                    <KPI
                      label="PNL"
                      value={`₹${c.pnl.toFixed(0)}`}
                      green={c.pnl > 0}
                      red={c.pnl < 0}
                    />
                  </KPIGrid>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

/* ================= UI ================= */

function Section({ title, children }) {
  return (
    <div style={section}>
      <h4 style={sectionTitle}>{title}</h4>
      {children}
    </div>
  );
}

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

function KPIGrid({ children, small }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: small
          ? "repeat(2,1fr)"
          : "repeat(auto-fit,minmax(200px,1fr))",
        gap: "12px",
      }}
    >
      {children}
    </div>
  );
}

/* ================= STYLES ================= */

const wrapper = {
  background: "#fff",
  borderRadius: "14px",
  marginTop: "24px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
};

const header = {
  padding: "14px 18px",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  borderBottom: "1px solid #e5e7eb",
};

const title = { fontSize: "16px", fontWeight: 700 };

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  padding: "16px",
};

const section = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "14px",
};

const sectionTitle = { fontSize: "15px", fontWeight: 700, marginBottom: "12px" };

const kpiBox = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "10px",
};

const kpiLabel = { fontSize: "12px", color: "#6b7280" };
const kpiValue = { fontSize: "16px", fontWeight: 700 };

const confidenceGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "14px",
};

const confidenceBox = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "12px",
};

const confidenceTitle = {
  fontSize: "14px",
  fontWeight: 700,
  marginBottom: "10px",
};
