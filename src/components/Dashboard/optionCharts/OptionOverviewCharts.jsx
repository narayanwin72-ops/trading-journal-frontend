import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";

/* =====================================================
   OPTION OVERVIEW CHARTS
   (Cumulative PNL | Daily PNL | Win vs Loss)
===================================================== */

export default function OptionOverviewCharts({ trades }) {
  const chartData = useMemo(() => {
    if (!trades || !trades.length) return null;

    let cumulative = 0;
    const dailyMap = {};
    let win = 0;
    let loss = 0;

    const calcPNL = (t) => {
      const e = Number(t.entry);
      const x = Number(t.exitPrice);
      const q = Number(t.qty || 1);
      if (!e || !x) return 0;
      return t.position === "SHORT"
        ? (e - x) * q
        : (x - e) * q;
    };

    trades
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((t) => {
        const pnl = calcPNL(t);
        const date = t.date;

        cumulative += pnl;

        if (!dailyMap[date]) {
          dailyMap[date] = { date, pnl: 0 };
        }
        dailyMap[date].pnl += pnl;

        if (pnl > 0) win++;
        if (pnl < 0) loss++;
      });

    const equityCurve = Object.values(dailyMap).map((d) => {
      cumulative = (cumulative || 0);
      return {
        date: d.date,
        pnl: d.pnl,
      };
    });

    let running = 0;
    const cumulativeData = Object.values(dailyMap).map((d) => {
      running += d.pnl;
      return {
        date: d.date,
        cumulative: running,
      };
    });

    return {
      dailyPNL: Object.values(dailyMap),
      cumulativePNL: cumulativeData,
      winLoss: [
        { name: "Winning Trades", value: win },
        { name: "Losing Trades", value: loss },
      ],
    };
  }, [trades]);

  if (!chartData) return null;

  return (
    <div style={grid}>
      {/* ================= CUMULATIVE PNL ================= */}
      <ChartBox title="Cumulative PNL (Equity Curve)">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData.cumulativePNL}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>

      {/* ================= DAILY PNL ================= */}
      <ChartBox title="Daily PNL">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData.dailyPNL}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="pnl"
              fill="#16a34a"
              shape={(props) => {
                const color =
                  props.payload.pnl >= 0 ? "#16a34a" : "#dc2626";
                return <rect {...props} fill={color} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>

      {/* ================= WIN vs LOSS ================= */}
      <ChartBox title="Win vs Loss Trades">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData.winLoss}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              <Cell fill="#16a34a" />
              <Cell fill="#dc2626" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function ChartBox({ title, children }) {
  return (
    <div style={box}>
      <h4 style={boxTitle}>{title}</h4>
      {children}
    </div>
  );
}

/* ================= STYLES ================= */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const box = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "16px",
  border: "1px solid #e5e7eb",
};

const boxTitle = {
  fontSize: "15px",
  fontWeight: 700,
  marginBottom: "10px",
};
