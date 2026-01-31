import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* =====================================================
   PHASE 3 – TIME RANGE CHARTS
   EXPANDABLE | LOGIC UNCHANGED
===================================================== */

export default function Phase3TimeRangeCharts({ trades }) {
  const [open, setOpen] = useState(true);

  const data = useMemo(() => {
    if (!trades || !trades.length) return null;

    const map = {};
    let totalTrades = 0;

    const pnlCalc = (t) => {
      const e = Number(t.entry);
      const x = Number(t.exitPrice || t.exit);
      const q = Number(t.qty || 1);
      if (!e || !x) return 0;
      return t.position === "SHORT" ? (e - x) * q : (x - e) * q;
    };

    trades.forEach((t) => {
      if (!t.timeRange) return;
      totalTrades++;

      if (!map[t.timeRange]) {
        map[t.timeRange] = {
          pnl: 0,
          trades: 0,
          wins: 0,
          plannedRR: [],
          actualRR: [],
        };
      }

      const pnl = pnlCalc(t);
      map[t.timeRange].pnl += pnl;
      map[t.timeRange].trades++;
      if (pnl > 0) map[t.timeRange].wins++;

      const entry = Number(t.entry);
      const exit = Number(t.exitPrice || t.exit);
      const sl = Number(t.sl || t.stopLoss);
      const target = Number(t.target);

      if (entry && sl) {
        const risk = Math.abs(entry - sl);
        if (risk > 0) {
          if (target) {
            const pr =
              t.position === "SHORT"
                ? (entry - target) / risk
                : (target - entry) / risk;
            map[t.timeRange].plannedRR.push(pr);
          }

          const ar =
            t.position === "SHORT"
              ? (entry - exit) / risk
              : (exit - entry) / risk;
          map[t.timeRange].actualRR.push(ar);
        }
      }
    });

    const keys = Object.keys(map);

    return {
      pnlData: keys.map((k) => ({
        time: k,
        pnl: Math.round(map[k].pnl),
      })),

      winPctData: keys.map((k) => ({
        time: k,
        winPct: Number(
          ((map[k].wins / map[k].trades) * 100).toFixed(1)
        ),
      })),

      rrData: keys.map((k) => ({
        time: k,
        plannedRR: map[k].plannedRR.length
          ? Number(
              (
                map[k].plannedRR.reduce((a, b) => a + b, 0) /
                map[k].plannedRR.length
              ).toFixed(2)
            )
          : 0,
        actualRR: map[k].actualRR.length
          ? Number(
              (
                map[k].actualRR.reduce((a, b) => a + b, 0) /
                map[k].actualRR.length
              ).toFixed(2)
            )
          : 0,
      })),

      tradePctData: keys.map((k) => ({
        name: k,
        value: map[k].trades,
        pct: ((map[k].trades / totalTrades) * 100).toFixed(1),
      })),
    };
  }, [trades]);

  if (!data) return null;

  return (
    <div style={wrapper}>
      {/* ===== HEADER (EXPANDABLE) ===== */}
      <div style={header} onClick={() => setOpen(!open)}>
        <h3 style={title}>⏱ Time Range Analysis</h3>
        <span style={toggle}>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <div style={mainGrid}>
          {/* ===== LEFT MAIN SECTION ===== */}
          <div style={mainSection}>
            <SubSection title="Time Range PNL">
              <BarBlock data={data.pnlData} dataKey="pnl" unit="₹" />
            </SubSection>

            <SubSection title="Time Range Win %">
              <BarBlock data={data.winPctData} dataKey="winPct" unit="%" />
            </SubSection>
          </div>

          {/* ===== RIGHT MAIN SECTION ===== */}
          <div style={mainSection}>
            <SubSection title="Planned RR vs Actual RR">
              <RRBar data={data.rrData} />
            </SubSection>

            <SubSection title="Trade % Distribution">
              <TradePie data={data.tradePctData} />
            </SubSection>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function SubSection({ title, children }) {
  return (
    <div style={subSection}>
      <h4 style={subTitle}>{title}</h4>
      {children}
    </div>
  );
}

function BarBlock({ data, dataKey, unit }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ bottom: 70 }}>
        <XAxis dataKey="time" angle={-20} textAnchor="end" height={80} />
        <YAxis />
        <Tooltip formatter={(v) => `${unit}${v}`} />
        <Legend />
        <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d[dataKey] >= 0 ? "#16a34a" : "#dc2626"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function RRBar({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ bottom: 70 }}>
        <XAxis dataKey="time" angle={-20} textAnchor="end" height={80} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="plannedRR" fill="#2563eb" name="Planned RR" />
        <Bar dataKey="actualRR" fill="#16a34a" name="Actual RR" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TradePie({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
          label={(d) => `${d.name} ${d.pct}%`}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={["#2563eb", "#16a34a", "#f59e0b", "#dc2626"][i % 4]}
            />
          ))}
        </Pie>
        <Tooltip formatter={(v, _, p) => [`${p.payload.pct}%`, "Trades"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ================= STYLES ================= */

const wrapper = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "14px",
  marginTop: "20px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  marginBottom: "12px",
};

const title = {
  fontSize: "18px",
  fontWeight: 700,
};

const toggle = {
  fontSize: "20px",
  fontWeight: 700,
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const mainSection = {
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const subSection = {
  border: "1px dashed #e5e7eb",
  borderRadius: "10px",
  padding: "12px",
};

const subTitle = {
  fontSize: "14px",
  fontWeight: 700,
  marginBottom: "10px",
};
