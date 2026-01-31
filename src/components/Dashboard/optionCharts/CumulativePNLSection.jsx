import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* =====================================================
   CUMULATIVE PNL – SIMPLE LINE CHART
   ✔ Single Blue Line
   ✔ Month shown only once
   ✔ Datewise calc (sorted)
===================================================== */

export default function CumulativePNLSection({ trades }) {
  const [open, setOpen] = useState(true);

  const data = useMemo(() => {
    if (!trades || !trades.length) return [];

    const calcPNL = (t) => {
      const e = Number(t.entry);
      const x = Number(t.exitPrice || t.exit);
      const q = Number(t.qty || 1);
      if (!e || !x) return 0;
      return t.position === "SHORT"
        ? (e - x) * q
        : (x - e) * q;
    };

    // sort by date (random entry safe)
    const sorted = [...trades]
      .filter((t) => t.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    let cumulative = 0;
    let lastMonth = "";

    return sorted.map((t) => {
      cumulative += calcPNL(t);

      const d = new Date(t.date);
      const monthLabel = d.toLocaleString("en-US", {
        month: "short",
        year: "2-digit",
      });

      const showMonth = monthLabel !== lastMonth;
      lastMonth = monthLabel;

      return {
        date: d.toLocaleDateString("en-GB"),
        xLabel: showMonth ? monthLabel : "",
        pnl: Number(cumulative.toFixed(0)),
      };
    });
  }, [trades]);

  if (!data.length) return null;

  return (
    <div style={wrapper}>
      {/* HEADER */}
      <div style={header} onClick={() => setOpen(!open)}>
        <h3 style={title}>📈 Cumulative PNL</h3>
        <span style={toggle}>{open ? "−" : "+"}</span>
      </div>

      {open && (
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="xLabel"
              interval={0}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tickFormatter={(v) => `₹${v}`}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              formatter={(v) => [`₹${v}`, "Cumulative PNL"]}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.date || ""
              }
            />

            {/* SINGLE BLUE LINE */}
            <Line
              type="monotone"
              dataKey="pnl"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
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
