import { useState, useEffect, useMemo, useRef } from "react";
import { useTrades } from "../../store/trade.store";
import { useSettings } from "../../store/settings.store";
import { useBrokerCapital } from "../../store/brokerCapital.store";
import { getTradeSymbols } from "../../utils/symbolMerge";

/* 🔑 FEATURE ACCESS */
import { useTradeEntryFeatureStore } from "../../store/tradeEntryFeature.store";
import { useUserPlanStore } from "../../store/userPlan.store";
import FeatureLockOverlay from "../../guards/FeatureLockOverlay";

export default function EquityIntradayTradeForm() {
  /* ================= STORES ================= */
  const {
    addTrade,
    updateTrade,
    editTradeId,
    trades,
    clearEditTradeId,
  } = useTrades();

  const { transactions } = useBrokerCapital();

  const {
    brokers,
    strategies,
    entryReasons,
    exitReasons,
    confidenceLevels,
  } = useSettings();

  /* ================= PLAN & FEATURE ================= */
  const planId = useUserPlanStore((s) => s.activePlanId);
  const canUse = useTradeEntryFeatureStore((s) => s.canUse);

  const canUseTab = canUse("EQUITY_INTRADAY_TAB", planId);
  const can = (fid) => canUse(fid, planId);

  /* ================= FORM ================= */
  const emptyForm = {
    date: "",
    time: "",
    timeRange: "",
    symbol: "",
    position: "",
    entry: "",
    sl: "",
    target: "",
    qty: "",
    strategy: "",
    timeframe: "",
    reason: "",
    confidence: "",
    exitPrice: "",
    exitTime: "",
    exitReason: "",
    charges: "",
    remarks: "",
    chartImage: "",
    broker: "",
    capital: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [symbolSearch, setSymbolSearch] = useState("");
  const [showSymbols, setShowSymbols] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const fileRef = useRef(null);
  const symbolRef = useRef(null);

  const equitySymbols = useMemo(
    () => getTradeSymbols("EQUITY"),
    []
  );

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    function handleClick(e) {
      if (symbolRef.current && !symbolRef.current.contains(e.target)) {
        setShowSymbols(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ================= EDIT PREFILL ================= */
  useEffect(() => {
    if (editTradeId) {
      const trade = trades.find((t) => t.id === editTradeId);
      if (trade) {
        setForm({ ...emptyForm, ...trade });
        setSymbolSearch(trade.symbol || "");
      }
    }
  }, [editTradeId, trades]);

  function update(name, val) {
    setForm((p) => ({ ...p, [name]: val }));
  }

  /* ================= CAPITAL ================= */
  function getBrokerCapital(broker) {
    let cap = 0;
    transactions.forEach((t) => {
      if (t.broker === broker) cap += Number(t.amount);
    });
    return cap;
  }

  /* ================= TIME RANGE ================= */
  function getTimeRange(time) {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const min = h * 60 + m;

    if (min >= 555 && min < 615) return "9:15 – 10:15";
    if (min >= 615 && min < 675) return "10:15 – 11:15";
    if (min >= 675 && min < 735) return "11:15 – 12:15";
    if (min >= 735 && min < 795) return "12:15 – 1:15";
    if (min >= 795 && min < 855) return "1:15 – 2:15";
    if (min >= 855 && min <= 930) return "2:15 – 3:30";
    return "";
  }

  /* ================= IMAGE ================= */
  function handleImageUpload(file) {
    if (!file || !can("EQUITY_CHARTIMAGE")) return;
    const reader = new FileReader();
    reader.onloadend = () => update("chartImage", reader.result);
    reader.readAsDataURL(file);
  }

  /* ================= RR ================= */
  const rr = useMemo(() => {
    const e = Number(form.entry);
    const s = Number(form.sl);
    const t = Number(form.target);
    if (!e || !s || !t) return "-";
    const risk = Math.abs(e - s);
    if (!risk) return "-";
    return (Math.abs(t - e) / risk).toFixed(2);
  }, [form.entry, form.sl, form.target]);

  /* ================= SAVE ================= */
  function handleSave() {
    if (!canUseTab) {
      alert("Equity Intraday is locked for your plan");
      return;
    }

    if (!form.symbol || !form.entry || !form.sl || !form.target || !form.qty) {
      alert("Please fill required fields");
      return;
    }

    if (editTradeId) {
      updateTrade(editTradeId, { ...form, tradeType: "EQUITY_INTRADAY" });
      clearEditTradeId();
      setSaveStatus("updated");
    } else {
      addTrade({ ...form, tradeType: "EQUITY_INTRADAY" });
      setSaveStatus("saved");
    }

    setForm(emptyForm);
    setSymbolSearch("");
    if (fileRef.current) fileRef.current.value = "";

    setTimeout(() => setSaveStatus(""), 2500);
  }

  /* ================= UI ================= */
  return (
    <div style={container}>
      <h3>{editTradeId ? "Edit Equity Intraday Trade" : "Equity Intraday Trade Entry"}</h3>

      {/* ===== BROKER ===== */}
      <Section title="Broker & Capital">
        <Grid>
          <Select
            label="Broker"
            options={brokers}
            value={form.broker}
            disabled={!can("EQUITY_BROKER")}
            onChange={(v) => {
              update("broker", v);
              update("capital", getBrokerCapital(v));
            }}
          />
          <Input label="Capital (₹)" value={form.capital} readOnly />
        </Grid>
      </Section>

      {/* ===== BASIC ===== */}
      <Section title="Basic Details">
        <Grid>
          <Input label="Date" type="date" value={form.date} disabled={!can("EQUITY_DATE")} onChange={(v)=>update("date",v)} />
          <Input label="Time" type="time" value={form.time} disabled={!can("EQUITY_TIME")} onChange={(v)=>{update("time",v);update("timeRange",getTimeRange(v));}} />
          <Input label="Time Range" value={form.timeRange} readOnly />

          <div ref={symbolRef} style={{ position:"relative" }}>
            <label style={labelStyle}>Stock / Symbol</label>
            <input
              value={symbolSearch}
              disabled={!can("EQUITY_SYMBOL")}
              onFocus={()=>can("EQUITY_SYMBOL") && setShowSymbols(true)}
              onChange={(e)=>{
                if(!can("EQUITY_SYMBOL")) return;
                setSymbolSearch(e.target.value);
                update("symbol",e.target.value);
              }}
              style={{ ...input, background: !can("EQUITY_SYMBOL") ? "#f1f5f9" : "#fff" }}
            />

            {showSymbols && can("EQUITY_SYMBOL") && (
              <div style={symbolDropdown}>
                {equitySymbols
                  .filter((s)=>s.toLowerCase().includes(symbolSearch.toLowerCase()))
                  .slice(0,50)
                  .map((s)=>(
                    <div key={s} style={symbolItem} onClick={()=>{update("symbol",s);setSymbolSearch(s);setShowSymbols(false);}}>
                      {s}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </Grid>
      </Section>

      {/* ===== TRADE SETUP ===== */}
      <Section title="Trade Setup">
        <Grid>
          <Select label="Position" options={["LONG","SHORT"]} value={form.position} disabled={!can("EQUITY_POSITION")} onChange={(v)=>update("position",v)} />
          <Input label="Entry Price" value={form.entry} disabled={!can("EQUITY_ENTRY")} onChange={(v)=>update("entry",v)} />
          <Input label="Stop Loss" value={form.sl} disabled={!can("EQUITY_SL")} onChange={(v)=>update("sl",v)} />
          <Input label="Target" value={form.target} disabled={!can("EQUITY_TARGET")} onChange={(v)=>update("target",v)} />
        </Grid>

        <Grid>
          <Input label="Quantity" value={form.qty} disabled={!can("EQUITY_QTY")} onChange={(v)=>update("qty",v)} />
          <Select label="Timeframe" options={["1m","3m","5m","10m","15m","30m","45m","1H"]} value={form.timeframe} disabled={!can("EQUITY_TIMEFRAME")} onChange={(v)=>update("timeframe",v)} />
        </Grid>

        <div style={rrBox}>RR: <b>{rr}</b></div>
      </Section>

      {/* ===== STRATEGY ===== */}
      <Section title="Strategy & Psychology">
        <Grid>
          <Select label="Strategy" options={strategies} value={form.strategy} disabled={!can("EQUITY_STRATEGY")} onChange={(v)=>update("strategy",v)} />
          <Select label="Reason" options={entryReasons} value={form.reason} disabled={!can("EQUITY_REASON")} onChange={(v)=>update("reason",v)} />
          <Select label="Confidence" options={confidenceLevels} value={form.confidence} disabled={!can("EQUITY_CONFIDENCE")} onChange={(v)=>update("confidence",v)} />
        </Grid>
      </Section>

      {/* ===== EXIT ===== */}
      <Section title="Exit">
        <Grid>
          <Input label="Exit Price" value={form.exitPrice} disabled={!can("EQUITY_EXITPRICE")} onChange={(v)=>update("exitPrice",v)} />
          <Input label="Exit Time" type="time" value={form.exitTime} disabled={!can("EQUITY_EXITTIME")} onChange={(v)=>update("exitTime",v)} />
          <Select label="Exit Reason" options={exitReasons} value={form.exitReason} disabled={!can("EQUITY_EXITREASON")} onChange={(v)=>update("exitReason",v)} />
          <Input label="Brokerage & Charges (₹)" value={form.charges} disabled={!can("EQUITY_CHARGES")} onChange={(v)=>update("charges",v)} />
        </Grid>

        <textarea
          placeholder="Remarks"
          disabled={!can("EQUITY_REMARKS")}
          style={textarea}
          value={form.remarks}
          onChange={(e)=>update("remarks",e.target.value)}
        />
      </Section>

      {/* ===== IMAGE ===== */}
      <Section title="Chart Image">
        <FeatureLockOverlay featureId="EQUITY_CHARTIMAGE">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            disabled={!can("EQUITY_CHARTIMAGE")}
            onChange={(e)=>handleImageUpload(e.target.files[0])}
          />
        </FeatureLockOverlay>
      </Section>

      {/* ===== SAVE ===== */}
      <div style={{ display:"flex", gap:12 }}>
        <button style={saveBtn} onClick={handleSave}>
          {editTradeId ? "Update Trade" : "Save Trade"}
        </button>

        {saveStatus && (
          <span style={badge}>
            Trade {saveStatus === "saved" ? "Saved" : "Updated"} ✔
          </span>
        )}
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h4 style={sectionTitle}>{title}</h4>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>{children}</div>;
}

function Input({ label, type="text", value, onChange, readOnly, disabled }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        onChange={(e)=>onChange && onChange(e.target.value)}
        style={{ ...input, background: disabled ? "#f1f5f9" : "#fff" }}
      />
    </div>
  );
}

function Select({ label, options, value, onChange, disabled }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} disabled={disabled} onChange={(e)=>onChange(e.target.value)} style={input}>
        <option value="">Select</option>
        {options.map((o)=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ================= STYLES ================= */
const container = { background:"#fff", padding:24, borderRadius:12, border:"1px solid #e5e7eb" };
const labelStyle = { fontSize:13, fontWeight:600, marginBottom:4, display:"block" };
const input = { width:"100%", padding:8, borderRadius:6, border:"1px solid #d1d5db" };
const sectionTitle = { fontSize:14, fontWeight:700, marginBottom:12, borderBottom:"1px solid #e5e7eb", paddingBottom:6 };
const rrBox = { marginTop:12, padding:10, background:"#f8fafc", border:"1px solid #e5e7eb", borderRadius:8 };
const textarea = { width:"100%", marginTop:12, padding:10, borderRadius:8, border:"1px solid #d1d5db" };
const saveBtn = { padding:"12px 20px", borderRadius:10, border:"none", background:"#16a34a", color:"#fff", fontWeight:"bold", cursor:"pointer" };
const badge = { padding:"6px 10px", background:"#dcfce7", color:"#166534", borderRadius:20, fontSize:13, fontWeight:600 };
const symbolDropdown = { position:"absolute", top:"100%", left:0, right:0, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, maxHeight:220, overflowY:"auto", zIndex:30 };
const symbolItem = { padding:"8px 10px", cursor:"pointer", borderBottom:"1px solid #f1f5f9" };
