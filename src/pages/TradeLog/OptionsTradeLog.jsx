import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTrades } from "../../store/trade.store";
import { useUserPlanStore } from "../../store/userPlan.store";
import { useTradeLogFeatureStore } from "../../store/tradeLogFeature.store";
import { usePlanStore } from "../../store/plan.store";

/* ================= UTIL ================= */

function show(val) {
  if (val === undefined || val === null || val === "") return "-";
  return val;
}

/* ================= LOCK NOTE ================= */

function LockNote({ featureId }) {
  const planId = useUserPlanStore((s) => s.activePlanId);
  const { canUse, features } = useTradeLogFeatureStore();
  const plans = usePlanStore((s) => s.plans);

  if (canUse(featureId, planId)) return null;

  const feature = features.find((f) => f.featureId === featureId);
  const names =
    feature?.allowedPlans
      ?.map((pid) => plans.find((p) => p.id === pid)?.name)
      .filter(Boolean) || [];

  if (!names.length) return null;

  return (
    <div style={lockText}>
      🔓 Unlock with {names.join(" / ")}
    </div>
  );
}

/* ================= MAIN ================= */

export default function OptionsTradeLog() {
  const navigate = useNavigate();
  const { trades, deleteTrade, setEditTradeId } = useTrades();

  const planId = useUserPlanStore((s) => s.activePlanId);
  const canUse = useTradeLogFeatureStore((s) => s.canUse);

  const optionTrades = trades.filter(
    (t) => t.tradeType === "OPTIONS"
  );

  /* ================= FILTER STATES ================= */

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [symbol, setSymbol] = useState("");
  const [optionType, setOptionType] = useState("");
  const [position, setPosition] = useState("");
  const [expiry, setExpiry] = useState("");
  const [strike, setStrike] = useState("");
  const [strategy, setStrategy] = useState("");
  const [entryReason, setEntryReason] = useState("");
  const [exitReason, setExitReason] = useState("");
  const [confidence, setConfidence] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [broker, setBroker] = useState("");

  const [previewImg, setPreviewImg] = useState(null);
  const [previewRemarks, setPreviewRemarks] = useState(null);

  /* ================= UNIQUE ================= */

  const unique = (k) =>
    [...new Set(optionTrades.map((t) => t[k]).filter(Boolean))];

  const symbols = unique("underlying");
  const expiries = unique("expiry");
  const strikes = unique("strike");
  const strategies = unique("strategy");
  const entryReasons = unique("reason");
  const exitReasons = unique("exitReason");
  const confidences = unique("confidence");
  const timeframes = unique("timeframe");
  const brokers = unique("broker");

  /* ================= ENABLE FLAGS ================= */

  const F = {
    DATE: canUse("TRADELOG_OPTIONS_DATE", planId),
    SYMBOL: canUse("TRADELOG_OPTIONS_SYMBOL", planId),
    OPTIONTYPE: canUse("TRADELOG_OPTIONS_OPTIONTYPE", planId),
    POSITION: canUse("TRADELOG_OPTIONS_POSITION", planId),
    EXPIRY: canUse("TRADELOG_OPTIONS_EXPIRY", planId),
    STRIKE: canUse("TRADELOG_OPTIONS_STRIKE", planId),
    STRATEGY: canUse("TRADELOG_OPTIONS_STRATEGY", planId),
    ENTRYREASON: canUse("TRADELOG_OPTIONS_ENTRYREASON", planId),
    EXITREASON: canUse("TRADELOG_OPTIONS_EXITREASON", planId),
    CONFIDENCE: canUse("TRADELOG_OPTIONS_CONFIDENCE", planId),
    TIMEFRAME: canUse("TRADELOG_OPTIONS_TIMEFRAME", planId),
    BROKER: canUse("TRADELOG_OPTIONS_BROKER", planId),
  };

  /* ================= FILTER LOGIC ================= */

  const filteredTrades = useMemo(() => {
    return optionTrades.filter((t) => {
      const d = t.date || t.tradeDate;

      if (F.DATE) {
        if (fromDate && d && new Date(d) < new Date(fromDate)) return false;
        if (toDate && d && new Date(d) > new Date(toDate)) return false;
      }

      if (F.SYMBOL && symbol && t.underlying !== symbol) return false;
      if (F.OPTIONTYPE && optionType && t.optionType !== optionType) return false;
      if (F.POSITION && position && t.position !== position) return false;
      if (F.EXPIRY && expiry && t.expiry !== expiry) return false;
      if (F.STRIKE && strike && String(t.strike) !== String(strike)) return false;
      if (F.STRATEGY && strategy && t.strategy !== strategy) return false;
      if (F.ENTRYREASON && entryReason && t.reason !== entryReason) return false;
      if (F.EXITREASON && exitReason && t.exitReason !== exitReason) return false;
      if (F.CONFIDENCE && confidence && t.confidence !== confidence) return false;
      if (F.TIMEFRAME && timeframe && t.timeframe !== timeframe) return false;
      if (F.BROKER && broker && t.broker !== broker) return false;

      return true;
    });
  }, [
    optionTrades,
    fromDate,
    toDate,
    symbol,
    optionType,
    position,
    expiry,
    strike,
    strategy,
    entryReason,
    exitReason,
    confidence,
    timeframe,
    broker,
    F,
  ]);

  /* ================= EXPORT FUNCTIONS (FIXED) ================= */

  function downloadExcel() {
    const rows = filteredTrades.map((t) =>
      HEADERS.map((h) => show(t[KEY_MAP[h]])).join(",")
    );
    const csv = [HEADERS.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "options-trade-log.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function downloadPDF() {
    const table = document.getElementById("trade-log-table");
    if (!table) return;

    const win = window.open("", "", "width=1200,height=800");
    win.document.write(`
      <html>
        <head>
          <title>Options Trade Log</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: center; white-space: nowrap; }
            th { background: #e5e7eb; }
          </style>
        </head>
        <body>
          <h3>Options Trade Log</h3>
          ${table.outerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }

  /* ================= TAB LOCK ================= */

  if (!canUse("TRADELOG_OPTIONS_TAB", planId)) {
    return (
      <div style={lockedBox}>
        🔒 Options Trade Log not available in your plan
      </div>
    );
  }

  return (
    <div style={container}>
      <h3 style={{ marginBottom: 16 }}>Options Trade Log</h3>

      {/* ================= FILTER BAR ================= */}
      <div style={filterBar}>
        <FilterBox>
          <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} style={input} disabled={!F.DATE}/>
          <LockNote featureId="TRADELOG_OPTIONS_DATE"/>
        </FilterBox>

        <FilterBox>
          <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} style={input} disabled={!F.DATE}/>
        </FilterBox>

        <FilterBox>
          <Select label="Symbol" value={symbol} set={setSymbol} options={symbols} disabled={!F.SYMBOL}/>
          <LockNote featureId="TRADELOG_OPTIONS_SYMBOL"/>
        </FilterBox>

        <FilterBox>
          <Select label="Call / Put" value={optionType} set={setOptionType} options={["CALL","PUT"]} disabled={!F.OPTIONTYPE}/>
          <LockNote featureId="TRADELOG_OPTIONS_OPTIONTYPE"/>
        </FilterBox>

        <FilterBox>
          <Select label="Position" value={position} set={setPosition} options={["LONG","SHORT"]} disabled={!F.POSITION}/>
          <LockNote featureId="TRADELOG_OPTIONS_POSITION"/>
        </FilterBox>

        <FilterBox>
          <Select label="Expiry" value={expiry} set={setExpiry} options={expiries} disabled={!F.EXPIRY}/>
          <LockNote featureId="TRADELOG_OPTIONS_EXPIRY"/>
        </FilterBox>

        <FilterBox>
          <Select label="Strike" value={strike} set={setStrike} options={strikes} disabled={!F.STRIKE}/>
          <LockNote featureId="TRADELOG_OPTIONS_STRIKE"/>
        </FilterBox>

        <FilterBox>
          <Select label="Strategy" value={strategy} set={setStrategy} options={strategies} disabled={!F.STRATEGY}/>
          <LockNote featureId="TRADELOG_OPTIONS_STRATEGY"/>
        </FilterBox>

        <FilterBox>
          <Select label="Entry Reason" value={entryReason} set={setEntryReason} options={entryReasons} disabled={!F.ENTRYREASON}/>
          <LockNote featureId="TRADELOG_OPTIONS_ENTRYREASON"/>
        </FilterBox>

        <FilterBox>
          <Select label="Exit Reason" value={exitReason} set={setExitReason} options={exitReasons} disabled={!F.EXITREASON}/>
          <LockNote featureId="TRADELOG_OPTIONS_EXITREASON"/>
        </FilterBox>

        <FilterBox>
          <Select label="Confidence" value={confidence} set={setConfidence} options={confidences} disabled={!F.CONFIDENCE}/>
          <LockNote featureId="TRADELOG_OPTIONS_CONFIDENCE"/>
        </FilterBox>

        <FilterBox>
          <Select label="Timeframe" value={timeframe} set={setTimeframe} options={timeframes} disabled={!F.TIMEFRAME}/>
          <LockNote featureId="TRADELOG_OPTIONS_TIMEFRAME"/>
        </FilterBox>

        <FilterBox>
          <Select label="Broker" value={broker} set={setBroker} options={brokers} disabled={!F.BROKER}/>
          <LockNote featureId="TRADELOG_OPTIONS_BROKER"/>
        </FilterBox>
      </div>

      {/* ================= EXPORT ================= */}
      <div style={exportBar}>
        <div>
          <button
            style={exportBtn}
            disabled={!canUse("TRADELOG_OPTIONS_EXCEL", planId)}
            onClick={downloadExcel}
          >
            ⬇ Excel Export
          </button>
          <LockNote featureId="TRADELOG_OPTIONS_EXCEL"/>
        </div>

        <div>
          <button
            style={exportBtn}
            disabled={!canUse("TRADELOG_OPTIONS_PDF", planId)}
            onClick={downloadPDF}
          >
            🖨️ PDF Export
          </button>
          <LockNote featureId="TRADELOG_OPTIONS_PDF"/>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div style={tableWrap}>
        <table style={table} id="trade-log-table">
          <thead>
            <tr>
              {HEADERS.map((h)=>(<th key={h} style={th}>{h}</th>))}
              <th style={th}>Remarks</th>
              <th style={th}>Chart</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((t)=>(
              <tr key={t.id}>
                {HEADERS.map((h)=>(<td key={h} style={td}>{show(t[KEY_MAP[h]])}</td>))}
                <td style={td}>{t.remarks ? <button style={iconBtn} onClick={()=>setPreviewRemarks(t.remarks)}>👁️</button> : "-"}</td>
                <td style={td}>{t.chartImage ? <button style={iconBtn} onClick={()=>setPreviewImg(t.chartImage)}>🖼️</button> : "-"}</td>
                <td style={td}>
                  <button style={iconBtn} onClick={()=>{setEditTradeId(t.id);navigate("/trade-entry");}}>✏️</button>
                  <button style={iconBtn} onClick={()=>deleteTrade(t.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewImg && (
        <div style={modal} onClick={()=>setPreviewImg(null)}>
          <img src={previewImg} alt="chart" style={modalImg}/>
        </div>
      )}

      {previewRemarks && (
        <div style={modal} onClick={()=>setPreviewRemarks(null)}>
          <div style={remarksBox}>
            <h4>Remarks</h4>
            {previewRemarks}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SMALL ================= */

function FilterBox({ children }) {
  return <div style={{ width: 210 }}>{children}</div>;
}

function Select({ label, value, set, options, disabled }) {
  return (
    <select value={value} onChange={(e)=>set(e.target.value)} style={select} disabled={disabled}>
      <option value="">{label}</option>
      {options.map((o)=>(<option key={o} value={o}>{o}</option>))}
    </select>
  );
}

/* ================= STYLES ================= */

const HEADERS = [
  "Date","Time","Time Range","Underlying","Expiry","Strike",
  "Option Type","Position","Entry","SL","Target","Qty",
  "Strategy","Timeframe","Reason","Confidence",
  "Exit Price","Exit Time","Exit Reason",
  "Charges","Broker","Capital"
];

const KEY_MAP = {
  "Date":"date","Time":"time","Time Range":"timeRange","Underlying":"underlying",
  "Expiry":"expiry","Strike":"strike","Option Type":"optionType","Position":"position",
  "Entry":"entry","SL":"sl","Target":"target","Qty":"qty",
  "Strategy":"strategy","Timeframe":"timeframe","Reason":"reason",
  "Confidence":"confidence","Exit Price":"exitPrice","Exit Time":"exitTime",
  "Exit Reason":"exitReason","Charges":"charges","Broker":"broker","Capital":"capital"
};

const container = { background:"#fff", padding:16, borderRadius:12 };
const filterBar = { display:"flex", flexWrap:"wrap", gap:14, marginBottom:24 };
const input = { padding:8, width:"100%", borderRadius:6, border:"1px solid #cbd5e1" };
const select = { padding:8, width:"100%", borderRadius:6, border:"1px solid #cbd5e1" };
const exportBar = { display:"flex", gap:32, marginBottom:20 };
const exportBtn = { padding:"10px 22px", borderRadius:10, border:"none", background:"#0f172a", color:"#fff", cursor:"pointer", fontSize:14 };
const tableWrap = { overflowX:"auto", maxHeight:"65vh" };
const table = { width:"100%", borderCollapse:"collapse", minWidth:1400 };
const th = { border:"1px solid #1f2937", padding:8, background:"#e5e7eb", fontSize:12, whiteSpace:"nowrap" };
const td = { border:"1px solid #1f2937", padding:8, fontSize:12, whiteSpace:"nowrap", textAlign:"center" };
const iconBtn = { border:"none", background:"transparent", cursor:"pointer", fontSize:16 };
const lockText = { fontSize:11, color:"#64748b", marginTop:4 };

const lockedBox = {
  padding:32,
  border:"2px dashed #ef4444",
  borderRadius:12,
  background:"#fff1f2",
  textAlign:"center",
};

const modal = {
  position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
  display:"flex", justifyContent:"center", alignItems:"center", zIndex:999,
};

const modalImg = { maxWidth:"90%", maxHeight:"90%", borderRadius:12 };
const remarksBox = { background:"#fff", padding:20, borderRadius:12, maxWidth:600 };
