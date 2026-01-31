import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

/* =====================================================
   PHASE 1 – BASIC OPTION CHARTS
   (FINAL PRO | NO CLICK | CLEAN LABELS)
===================================================== */

export default function Phase1BasicCharts({ trades }) {
  if (!trades || !trades.length) return null;

  /* ================= PNL CALC ================= */
  const calcPNL = (t) => {
    const e = Number(t.entry);
    const x = Number(t.exitPrice || t.exit);
    const q = Number(t.qty || 1);
    if (!e || !x) return 0;
    return t.position === "SHORT" ? (e - x) * q : (x - e) * q;
  };

  let win = 0,
    loss = 0,
    longPNL = 0,
    shortPNL = 0,
    callPNL = 0,
    putPNL = 0;

  trades.forEach((t) => {
    const pnl = calcPNL(t);
    if (pnl > 0) win++;
    if (pnl < 0) loss++;
    if (t.position === "LONG") longPNL += pnl;
    if (t.position === "SHORT") shortPNL += pnl;
    if (t.optionType === "CALL") callPNL += pnl;
    if (t.optionType === "PUT") putPNL += pnl;
  });

  const total = win + loss || 1;

  const winLossData = [
    {
      name: "Win",
      value: win,
      pct: ((win / total) * 100).toFixed(1),
    },
    {
      name: "Loss",
      value: loss,
      pct: ((loss / total) * 100).toFixed(1),
    },
  ];

  const longShortData = [
    { name: "LONG", value: Math.round(longPNL) },
    { name: "SHORT", value: Math.round(shortPNL) },
  ];

  const callPutData = [
    { name: "CALL", value: Math.round(callPNL) },
    { name: "PUT", value: Math.round(putPNL) },
  ];

  return (
    <div style={wrapper}>
      <h3 style={title}>📊 Phase-1 Performance Overview</h3>

      <div style={grid}>
        {/* ================= DONUT ================= */}
        <div style={card}>
          <h4 style={cardTitle}>Win % vs Loss %</h4>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={winLossData}
                dataKey="value"
                nameKey="name"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={4}
                isAnimationActive={false}
                activeIndex={-1}
                activeShape={null}
                onClick={() => {}}
                labelLine
                label={({ name, pct }) => `${name} ${pct}%`}
              >
                <Cell fill="#16a34a" />
                <Cell fill="#dc2626" />
              </Pie>

              <Tooltip
                formatter={(v, n) =>
                  `${n}: ${((v / total) * 100).toFixed(1)}%`
                }
                cursor={{ fill: "transparent" }}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ================= LONG vs SHORT ================= */}
        <BarBlock title="Long vs Short PNL" data={longShortData} />

        {/* ================= CALL vs PUT ================= */}
        <BarBlock title="CALL vs PUT PNL" data={callPutData} />
      </div>
    </div>
  );
}

/* =====================================================
   BAR BLOCK – VALUE LABEL + NO CLICK BUG
===================================================== */

function BarBlock({ title, data }) {
  return (
    <div style={card}>
      <h4 style={cardTitle}>{title}</h4>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          margin={{ top: 30, right: 20, left: 20, bottom: 30 }}
        >
          <XAxis dataKey="name" />
          <YAxis />

          <Tooltip
            formatter={(v) => `₹${v}`}
            cursor={{ fill: "transparent" }}
          />

          <Legend />

          <Bar
            dataKey="value"
            isAnimationActive={false}
            activeBar={false}
            onClick={() => {}}
            tabIndex={-1}
            style={{ outline: "none" }}
          >
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v) => `₹${v}`}
              style={{
                fontWeight: 700,
                fill: "#000",
              }}
            />

            {data.map((d) => (
              <Cell
                key={d.name}
                fill={d.value >= 0 ? "#16a34a" : "#dc2626"}
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
