import { useState, useMemo } from "react";

/* =====================================================
   UNDERLYING PERFORMANCE SECTION
   (BOX UNDER BOX | CONFIDENCE STYLE)
===================================================== */

export default function UnderlyingPerformanceSection({ trades }) {
  const [open, setOpen] = useState(true);

  const data = useMemo(() => {
    if (!trades || !trades.length) return null;

    const underlyingMap = {};

    const calcPNL = (t) => {
      const e = Number(t.entry);
      const x = Number(t.exitPrice || t.exit);
      const q = Number(t.qty || 1);
      if (!e || !x) return 0;

      return t.position === "SHORT"
        ? (e - x) * q
        : (x - e) * q;
    };

    trades.forEach((t) => {
      if (!t.underlying) return;

      const entry = Number(t.entry);
      const exit = Number(t.exitPrice || t.exit);
      const sl = Number(t.sl || t.stopLoss);

      if (!entry || !exit) return;

      const pnl = calcPNL(t);
      const win = pnl > 0;

      let actualRR = null;
      if (sl) {
        const risk = Math.abs(entry - sl);
        if (risk > 0) {
          actualRR = Math.abs(exit - entry) / risk;
        }
      }

      if (!underlyingMap[t.underlying]) {
        underlyingMap[t.underlying] = {
          trades: 0,
          wins: 0,
          pnl: 0,
          rr: [],
        };
      }

      const u = underlyingMap[t.underlying];
      u.trades++;
      u.pnl += pnl;
      if (win) u.wins++;

      if (actualRR !== null) {
        u.rr.push(actualRR);
      }
    });

    Object.values(underlyingMap).forEach((u) => {
      u.winPct = u.trades
        ? ((u.wins / u.trades) * 100).toFixed(1)
        : "0";

      u.avgRR = u.rr.length
        ? (u.rr.reduce((a, b) => a + b, 0) / u.rr.length).toFixed(2)
        : "0";

      u.pnl = u.pnl.toFixed(0);
    });

    return underlyingMap;
  }, [trades]);

  if (!data) return null;

  return (
    <div style={wrapper}>
      {/* ===== HEADER ===== */}
      <div style={header} onClick={() => setOpen(!open)}>
        <h3 style={title}>Underlying Performance</h3>
        <span style={toggle}>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <div style={{ padding: "16px" }}>
          <div style={grid}>
            {Object.entries(data).map(([name, u]) => (
              <div key={name} style={underlyingBox}>
                <h4 style={underlyingTitle}>{name}</h4>

                <KPIGrid>
                  <KPI
                    label="PNL"
                    value={`₹${u.pnl}`}
                    green={Number(u.pnl) > 0}
                    red={Number(u.pnl) < 0}
                  />
                  <KPI label="Win %" value={`${u.winPct}%`} />
                  <KPI label="Avg RR" value={u.avgRR} />
                  <KPI label="Trades" value={u.trades} />
                </KPIGrid>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= UI ================= */

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
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "12px",
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
  padding: "14px 18px",
  display: "flex",
  justifyContent: "space-between",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "16px",
};

const underlyingBox = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "14px",
};

const underlyingTitle = {
  fontSize: "15px",
  fontWeight: 700,
  marginBottom: "12px",
};

const kpiBox = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "10px",
};

const kpiLabel = {
  fontSize: "12px",
  color: "#6b7280",
};

const kpiValue = {
  fontSize: "16px",
  fontWeight: 700,
};
