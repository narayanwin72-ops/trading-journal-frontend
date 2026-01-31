import { useState, useMemo } from "react";

/* =====================================================
   TIME BASED + OPTIONS KPIs
   (TimeRange + TimeFrame + Expiry FROM TRADE LOG)
===================================================== */

export default function TimeAndOptionsKPISection({ trades }) {
  const [open, setOpen] = useState(true);

  const pct = (w, t) => (t ? ((w / t) * 100).toFixed(1) : "0");

  const data = useMemo(() => {
    if (!trades || !trades.length) return null;

    const pnlCalc = (t) => {
      const e = Number(t.entry);
      const x = Number(t.exitPrice);
      const q = Number(t.qty || 1);
      if (!e || !x) return 0;

      return t.position === "SHORT"
        ? (e - x) * q
        : (x - e) * q;
    };

    const timeRangeMap = {};
    const timeframeMap = {};
    const weekdayMap = {};
    const strikeMap = {};
    const dateCount = {};

    let weeklyPNL = 0;
    let monthlyPNL = 0;

    let longPNL = 0,
      shortPNL = 0,
      longTrades = 0,
      shortTrades = 0,
      longWins = 0,
      shortWins = 0;

    trades.forEach((t) => {
      const pnl = pnlCalc(t);

      /* ================= TIME RANGE ================= */
      if (t.timeRange) {
        if (!timeRangeMap[t.timeRange]) {
          timeRangeMap[t.timeRange] = { pnl: 0, trades: 0, wins: 0 };
        }
        timeRangeMap[t.timeRange].pnl += pnl;
        timeRangeMap[t.timeRange].trades++;
        if (pnl > 0) timeRangeMap[t.timeRange].wins++;
      }

      /* ================= TIME FRAME ================= */
      if (t.timeframe) {
        if (!timeframeMap[t.timeframe]) {
          timeframeMap[t.timeframe] = { pnl: 0, trades: 0, wins: 0 };
        }
        timeframeMap[t.timeframe].pnl += pnl;
        timeframeMap[t.timeframe].trades++;
        if (pnl > 0) timeframeMap[t.timeframe].wins++;
      }

      /* ================= WEEKDAY ================= */
      if (t.date) {
        const day = new Date(t.date).toLocaleDateString("en-US", {
          weekday: "long",
        });

        if (!weekdayMap[day]) {
          weekdayMap[day] = { pnl: 0, trades: 0, wins: 0 };
        }
        weekdayMap[day].pnl += pnl;
        weekdayMap[day].trades++;
        if (pnl > 0) weekdayMap[day].wins++;
      }

      /* ================= STRIKE ================= */
      if (t.strike) {
        if (!strikeMap[t.strike]) {
          strikeMap[t.strike] = { pnl: 0, trades: 0, wins: 0 };
        }
        strikeMap[t.strike].pnl += pnl;
        strikeMap[t.strike].trades++;
        if (pnl > 0) strikeMap[t.strike].wins++;
      }

      /* ================= LONG / SHORT ================= */
      if (t.position === "LONG") {
        longTrades++;
        longPNL += pnl;
        if (pnl > 0) longWins++;
      }

      if (t.position === "SHORT") {
        shortTrades++;
        shortPNL += pnl;
        if (pnl > 0) shortWins++;
      }

      /* ================= WEEKLY / MONTHLY (FROM LOG) ================= */
      if (t.expiry === "Weekly") weeklyPNL += pnl;
      if (t.expiry === "Monthly") monthlyPNL += pnl;

      /* ================= TRADE COUNT PER DAY ================= */
      if (t.date) dateCount[t.date] = (dateCount[t.date] || 0) + 1;
    });

    const bestWorst = (obj) => {
      let best = null;
      let worst = null;
      Object.entries(obj).forEach(([k, v]) => {
        if (!best || v.pnl > obj[best].pnl) best = k;
        if (!worst || v.pnl < obj[worst].pnl) worst = k;
      });
      return { best, worst };
    };

    return {
      timeRangeMap,
      timeframeMap,
      weekdayMap,
      strikeMap,

      timeRangeBW: bestWorst(timeRangeMap),
      timeframeBW: bestWorst(timeframeMap),
      weekdayBW: bestWorst(weekdayMap),
      strikeBW: bestWorst(strikeMap),

      avgTradesPerDay: Object.keys(dateCount).length
        ? (trades.length / Object.keys(dateCount).length).toFixed(1)
        : "0",

      maxTradesPerDay: Math.max(...Object.values(dateCount), 0),

      longPNL: longPNL.toFixed(0),
      shortPNL: shortPNL.toFixed(0),
      longWinPct: pct(longWins, longTrades),
      shortWinPct: pct(shortWins, shortTrades),

      weeklyPNL: weeklyPNL.toFixed(0),
      monthlyPNL: monthlyPNL.toFixed(0),
    };
  }, [trades]);

  if (!data) return null;

  return (
    <div style={wrapper}>
      <div style={header} onClick={() => setOpen(!open)}>
        <h3 style={title}>Time Based & Options KPIs</h3>
        <span style={toggle}>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <div style={grid}>
          {/* ================= TIME ================= */}
          <div style={sectionBox}>
            <h4 style={sectionTitle}>🟦 Time Based KPIs</h4>

            <KPI
              label="Best Time Range"
              value={`${data.timeRangeBW.best || "—"} | ₹${
                data.timeRangeMap[data.timeRangeBW.best]?.pnl || 0
              } | ${pct(
                data.timeRangeMap[data.timeRangeBW.best]?.wins,
                data.timeRangeMap[data.timeRangeBW.best]?.trades
              )}%`}
              green
            />

            <KPI
              label="Worst Time Range"
              value={`${data.timeRangeBW.worst || "—"} | ₹${
                data.timeRangeMap[data.timeRangeBW.worst]?.pnl || 0
              } | ${pct(
                data.timeRangeMap[data.timeRangeBW.worst]?.wins,
                data.timeRangeMap[data.timeRangeBW.worst]?.trades
              )}%`}
              red
            />

            <KPI
              label="Best Timeframe"
              value={`${data.timeframeBW.best || "—"} | ₹${
                data.timeframeMap[data.timeframeBW.best]?.pnl || 0
              } | ${pct(
                data.timeframeMap[data.timeframeBW.best]?.wins,
                data.timeframeMap[data.timeframeBW.best]?.trades
              )}%`}
              green
            />

            <KPI
              label="Worst Timeframe"
              value={`${data.timeframeBW.worst || "—"} | ₹${
                data.timeframeMap[data.timeframeBW.worst]?.pnl || 0
              } | ${pct(
                data.timeframeMap[data.timeframeBW.worst]?.wins,
                data.timeframeMap[data.timeframeBW.worst]?.trades
              )}%`}
              red
            />

            <KPI
              label="Best Weekday"
              value={`${data.weekdayBW.best || "—"} | ₹${
                data.weekdayMap[data.weekdayBW.best]?.pnl || 0
              } | ${pct(
                data.weekdayMap[data.weekdayBW.best]?.wins,
                data.weekdayMap[data.weekdayBW.best]?.trades
              )}%`}
              green
            />

            <KPI
              label="Worst Weekday"
              value={`${data.weekdayBW.worst || "—"} | ₹${
                data.weekdayMap[data.weekdayBW.worst]?.pnl || 0
              } | ${pct(
                data.weekdayMap[data.weekdayBW.worst]?.wins,
                data.weekdayMap[data.weekdayBW.worst]?.trades
              )}%`}
              red
            />

            <KPI label="Avg Trades / Day" value={data.avgTradesPerDay} />
            <KPI label="Max Trades / Day" value={data.maxTradesPerDay} />
          </div>

          {/* ================= OPTIONS ================= */}
          <div style={sectionBox}>
            <h4 style={sectionTitle}>🟧 Options & Others</h4>

            <KPI label="Long PNL" value={`₹${data.longPNL}`} green />
            <KPI label="Short PNL" value={`₹${data.shortPNL}`} red />
            <KPI label="Long Win %" value={`${data.longWinPct}%`} />
            <KPI label="Short Win %" value={`${data.shortWinPct}%`} />

            <KPI
              label="Best Strike"
              value={`${data.strikeBW.best || "—"} | ₹${
                data.strikeMap[data.strikeBW.best]?.pnl || 0
              } | ${pct(
                data.strikeMap[data.strikeBW.best]?.wins,
                data.strikeMap[data.strikeBW.best]?.trades
              )}%`}
              green
            />

            <KPI
              label="Worst Strike"
              value={`${data.strikeBW.worst || "—"} | ₹${
                data.strikeMap[data.strikeBW.worst]?.pnl || 0
              } | ${pct(
                data.strikeMap[data.strikeBW.worst]?.wins,
                data.strikeMap[data.strikeBW.worst]?.trades
              )}%`}
              red
            />

            <KPI label="Weekly Expiry PNL" value={`₹${data.weeklyPNL}`} />
            <KPI label="Monthly Expiry PNL" value={`₹${data.monthlyPNL}`} />
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
