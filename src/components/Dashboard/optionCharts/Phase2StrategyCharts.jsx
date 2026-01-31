import { useState, useMemo } from "react";
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
   PHASE 2 – STRATEGY WISE CHARTS
===================================================== */

export default function Phase2StrategyCharts({ trades }) {
  const [openA, setOpenA] = useState(true);
  const [openB, setOpenB] = useState(true);

  const data = useMemo(() => {
    if (!trades || !trades.length) return null;

    const map = {};

    const pnlCalc = (t) => {
      const e = Number(t.entry);
      const x = Number(t.exitPrice || t.exit);
      const q = Number(t.qty || 1);
      if (!e || !x) return 0;
      return t.position === "SHORT" ? (e - x) * q : (x - e) * q;
    };

    trades.forEach((t) => {
      if (!t.strategy) return;

      if (!map[t.strategy]) {
        map[t.strategy] = {
          trades: 0,
          wins: 0,
          pnl: 0,
          plannedRR: [],
          actualRR: [],
        };
      }

      const pnl = pnlCalc(t);
      map[t.strategy].trades++;
      map[t.strategy].pnl += pnl;
      if (pnl > 0) map[t.strategy].wins++;

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
            map[t.strategy].plannedRR.push(pr);
          }

          const ar =
            t.position === "SHORT"
              ? (entry - exit) / risk
              : (exit - entry) / risk;
          map[t.strategy].actualRR.push(ar);
        }
      }
    });

    const strategies = Object.keys(map);

    const pnlData = strategies.map((s) => ({
      strategy: s,
      pnl: Math.round(map[s].pnl),
    }));

    const winPctData = strategies.map((s) => ({
      strategy: s,
      winPct: Number(
        ((map[s].wins / map[s].trades) * 100).toFixed(1)
      ),
    }));

    const rrData = strategies.map((s) => ({
      strategy: s,
      plannedRR: map[s].plannedRR.length
        ? Number(
            (
              map[s].plannedRR.reduce((a, b) => a + b, 0) /
              map[s].plannedRR.length
            ).toFixed(2)
          )
        : 0,
      actualRR: map[s].actualRR.length
        ? Number(
            (
              map[s].actualRR.reduce((a, b) => a + b, 0) /
              map[s].actualRR.length
            ).toFixed(2)
          )
        : 0,
    }));

    const tradePie = strategies.map((s) => ({
      name: s,
      value: map[s].trades,
    }));

    return { pnlData, winPctData, rrData, tradePie };
  }, [trades]);

  if (!data) return null;

  return (
    <div style={wrapper}>
      <h3 style={title}>📊 Strategy Wise Analysis</h3>

      {/* ================= SECTION A ================= */}
      <Expandable
        title="Strategy Performance"
        open={openA}
        setOpen={setOpenA}
      >
        <div style={grid}>
          <BarBlock
            title="Strategy Wise PNL"
            data={data.pnlData}
            dataKey="pnl"
            unit="₹"
          />

          <BarBlock
            title="Strategy Wise Win %"
            data={data.winPctData}
            dataKey="winPct"
            unit="%"
          />
        </div>
      </Expandable>

      {/* ================= SECTION B ================= */}
      <Expandable
        title="Risk–Reward & Distribution"
        open={openB}
        setOpen={setOpenB}
      >
        <div style={grid}>
          {/* ===== RR COMPARISON ===== */}
          <div style={card}>
            <h4 style={cardTitle}>Planned RR vs Actual RR</h4>

            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={data.rrData}
                margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
              >
                <XAxis dataKey="strategy" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar
                  dataKey="plannedRR"
                  fill="#2563eb"
                  name="Planned RR"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="actualRR"
                  fill="#16a34a"
                  name="Actual RR"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===== PIE ===== */}
          <div style={card}>
            <h4 style={cardTitle}>Trade % by Strategy</h4>

            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={data.tradePie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {data.tradePie.map((_, i) => (
                    <Cell
                      key={i}
                      fill={[
                        "#2563eb",
                        "#16a34a",
                        "#f59e0b",
                        "#dc2626",
                        "#7c3aed",
                      ][i % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Expandable>
    </div>
  );
}

/* =====================================================
   SMALL COMPONENTS
===================================================== */

function Expandable({ title, open, setOpen, children }) {
  return (
    <div style={section}>
      <div style={sectionHeader} onClick={() => setOpen(!open)}>
        <h4 style={sectionTitle}>{title}</h4>
        <span style={{ fontSize: "20px", fontWeight: 700 }}>
          {open ? "−" : "+"}
        </span>
      </div>
      {open && <div style={{ paddingTop: "14px" }}>{children}</div>}
    </div>
  );
}

function BarBlock({ title, data, dataKey, unit }) {
  return (
    <div style={card}>
      <h4 style={cardTitle}>{title}</h4>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
        >
          <XAxis dataKey="strategy" />
          <YAxis />
          <Tooltip
            formatter={(v) => `${unit}${v}`}
            cursor={{ fill: "transparent" }}
          />
          <Legend />

          <Bar
            dataKey={dataKey}
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
          >
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={d[dataKey] >= 0 ? "#16a34a" : "#dc2626"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
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

const title = {
  fontSize: "18px",
  fontWeight: 700,
  marginBottom: "16px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
  gap: "16px",
};

const section = {
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "14px",
  marginBottom: "20px",
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
};

const sectionTitle = {
  fontSize: "15px",
  fontWeight: 700,
};

const card = {
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "14px",
};

const cardTitle = {
  fontSize: "14px",
  fontWeight: 700,
  marginBottom: "12px",
};
