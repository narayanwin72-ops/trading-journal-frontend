import { useState, useMemo, useEffect, useRef } from "react";
import { useTrades } from "../../store/trade.store";
import { useSettings } from "../../store/settings.store";
import { useBrokerCapital } from "../../store/brokerCapital.store";
import { getTradeSymbols } from "../../utils/symbolMerge";

/* 🔑 FEATURE ACCESS */
import { useTradeEntryFeatureStore } from "../../store/tradeEntryFeature.store";
import { useUserPlanStore } from "../../store/userPlan.store";
import FeatureLockOverlay from "../../guards/FeatureLockOverlay";


export default function OptionsTradeForm() {
  /* ================= STORES ================= */
  const {
    addTrade,
    updateTrade,
    trades,
    editTradeId,
    clearEditTradeId,
  } = useTrades();

  const { transactions } = useBrokerCapital();

  const settings = useSettings();
  const brokers = settings?.brokers || [];
  const strategies = settings?.strategies || [];
  const entryReasons = settings?.entryReasons || [];
  const exitReasons = settings?.exitReasons || [];
  const confidenceLevels = settings?.confidenceLevels || [];

  /* ================= PLAN & FEATURE ================= */
  const planId = useUserPlanStore((s) => s.activePlanId);
  const canUse = useTradeEntryFeatureStore((s) => s.canUse);

  const canUseTab = canUse("OPTION_INTRADAY_TAB", planId);
  const can = (fid) => canUse(fid, planId);

  /* ================= UNDERLYING ================= */
  const optionUnderlyings = useMemo(() => {
    const list = getTradeSymbols("OPTIONS");
    return Array.isArray(list) ? list : [];
  }, []);

  /* ================= FORM STATE ================= */
  const emptyForm = {
    date: "",
    time: "",
    timeRange: "",
    underlying: "",
    expiry: "",
    strike: "",
    optionType: "",
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

  /* ================= UNDERLYING UI ================= */
  const [symbolSearch, setSymbolSearch] = useState("");
  const [showSymbols, setShowSymbols] = useState(false);
  const symbolRef = useRef(null);

  /* ================= SAVE STATE ================= */
  const [saveStatus, setSaveStatus] = useState("");

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    function handleClick(e) {
      if (
        symbolRef.current &&
        !symbolRef.current.contains(e.target)
      ) {
        setShowSymbols(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ================= EDIT PREFILL ================= */
  useEffect(() => {
    if (editTradeId) {
      const trade = trades.find((t) => t.id === editTradeId);
      if (trade) {
        setForm({ ...emptyForm, ...trade });
        setSymbolSearch(trade.underlying || "");
      }
    }
  }, [editTradeId, trades]);

  function update(name, val) {
    setForm((p) => ({ ...p, [name]: val }));
  }

  /* ================= IMAGE ================= */
  function handleImageUpload(file) {
    if (!file || !can("OPTIONS_CHARTIMAGE")) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      update("chartImage", reader.result);
    reader.readAsDataURL(file);
  }

  /* ================= BROKER CAPITAL ================= */
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
      alert("Option Intraday is locked for your plan");
      return;
    }

    if (!form.entry || !form.sl || !form.target || !form.qty) {
      alert("Please fill Entry, SL, Target & Quantity");
      return;
    }

    if (editTradeId) {
      updateTrade(editTradeId, {
        ...form,
        tradeType: "OPTIONS",
      });
      clearEditTradeId();
      setSaveStatus("updated");
    } else {
      addTrade({
        ...form,
        tradeType: "OPTIONS",
      });
      setSaveStatus("saved");
    }

    setForm(emptyForm);
    setSymbolSearch("");

    setTimeout(() => setSaveStatus(""), 2500);
  }

  /* ================= UI ================= */
  return (
    <div style={container}>
      <h3>
        {editTradeId
          ? "Edit Options Trade"
          : "Options Trade Entry"}
      </h3>

      {/* ===== BROKER ===== */}
      <Section title="Broker & Capital">
        <Grid>
          <Select
            label="Broker"
            options={brokers}
            value={form.broker}
            disabled={!can("OPTIONS_BROKER")}
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
          <Input label="Date" type="date" value={form.date} disabled={!can("OPTIONS_DATE")} onChange={(v)=>update("date",v)} />
          <Input label="Time" type="time" value={form.time} disabled={!can("OPTIONS_TIME")} onChange={(v)=>{update("time",v);update("timeRange",getTimeRange(v));}} />
          <Input label="Time Range" value={form.timeRange} readOnly />

          {/* ===== UNDERLYING (PLAN CONTROLLED – FIXED) ===== */}
    <div ref={symbolRef} style={{ position: "relative" }}>
      <label style={labelStyle}>Underlying</label>

      <input
        value={symbolSearch}
        disabled={!can("OPTIONS_UNDERLYING")}
        onFocus={() => {
          if (can("OPTIONS_UNDERLYING")) {
            setShowSymbols(true);
          }
        }}
        onChange={(e) => {
          if (!can("OPTIONS_UNDERLYING")) return;
          setSymbolSearch(e.target.value);
          update("underlying", e.target.value);
        }}
        style={{
          ...input,
          background: !can("OPTIONS_UNDERLYING")
            ? "#f1f5f9"
            : "#fff",
          cursor: !can("OPTIONS_UNDERLYING")
            ? "not-allowed"
            : "text",
        }}
      />

      {showSymbols &&
        can("OPTIONS_UNDERLYING") && (
          <div style={symbolDropdown}>
            {optionUnderlyings
              .filter((s) =>
                s
                  .toLowerCase()
                  .includes(
                    symbolSearch.toLowerCase()
                  )
              )
              .slice(0, 50)
              .map((s) => (
                <div
                  key={s}
                  style={symbolItem}
                  onClick={() => {
                    update("underlying", s);
                    setSymbolSearch(s);
                    setShowSymbols(false);
                  }}
                >
                  {s}
                </div>
              ))}
          </div>
        )}
    </div>

          <Select label="Expiry" options={["Weekly","Monthly"]} value={form.expiry} disabled={!can("OPTIONS_EXPIRY")} onChange={(v)=>update("expiry",v)} />
        </Grid>
      </Section>

      {/* ===== STRUCTURE ===== */}
      <Section title="Option Structure">
        <Grid>
          <Select label="Strike" options={["ATM","ITM +1","ITM +2","ITM +3","OTM +1","OTM +2"]} value={form.strike} disabled={!can("OPTIONS_STRIKE")} onChange={(v)=>update("strike",v)} />
          <Select label="Call / Put" options={["CALL","PUT"]} value={form.optionType} disabled={!can("OPTIONS_OPTIONTYPE")} onChange={(v)=>update("optionType",v)} />
          <Select label="Position" options={["LONG","SHORT"]} value={form.position} disabled={!can("OPTIONS_POSITION")} onChange={(v)=>update("position",v)} />
        </Grid>
      </Section>

      {/* ===== PRICE ===== */}
      <Section title="Price & Risk">
        <Grid>
          <Input label="Entry Price" value={form.entry} disabled={!can("OPTIONS_ENTRY")} onChange={(v)=>update("entry",v)} />
          <Input label="Stop Loss" value={form.sl} disabled={!can("OPTIONS_SL")} onChange={(v)=>update("sl",v)} />
          <Input label="Target" value={form.target} disabled={!can("OPTIONS_TARGET")} onChange={(v)=>update("target",v)} />
          <Input label="Quantity" value={form.qty} disabled={!can("OPTIONS_QTY")} onChange={(v)=>update("qty",v)} />
        </Grid>
        <div style={rrBox}>RR: <b>{rr}</b></div>
      </Section>

      {/* ===== STRATEGY ===== */}
      <Section title="Strategy & Psychology">
        <Grid>
          <Select label="Strategy" options={strategies} value={form.strategy} disabled={!can("OPTIONS_STRATEGY")} onChange={(v)=>update("strategy",v)} />
          <Select label="Timeframe" options={["1m","5m","15m","30m"]} value={form.timeframe} disabled={!can("OPTIONS_TIMEFRAME")} onChange={(v)=>update("timeframe",v)} />
          <Select label="Reason" options={entryReasons} value={form.reason} disabled={!can("OPTIONS_REASON")} onChange={(v)=>update("reason",v)} />
          <Select label="Confidence" options={confidenceLevels} value={form.confidence} disabled={!can("OPTIONS_CONFIDENCE")} onChange={(v)=>update("confidence",v)} />
        </Grid>
      </Section>

      {/* ===== EXIT ===== */}
      <Section title="Exit">
        <Grid>
          <Input label="Exit Price" value={form.exitPrice} disabled={!can("OPTIONS_EXITPRICE")} onChange={(v)=>update("exitPrice",v)} />
          <Input label="Exit Time" type="time" value={form.exitTime} disabled={!can("OPTIONS_EXITTIME")} onChange={(v)=>update("exitTime",v)} />
          <Select label="Exit Reason" options={exitReasons} value={form.exitReason} disabled={!can("OPTIONS_EXITREASON")} onChange={(v)=>update("exitReason",v)} />
          <Input label="Brokerage & Charges (₹)" value={form.charges} disabled={!can("OPTIONS_CHARGES")} onChange={(v)=>update("charges",v)} />
        </Grid>

        <textarea
          placeholder="Remarks"
          disabled={!can("OPTIONS_REMARKS")}
          style={textarea}
          value={form.remarks}
          onChange={(e)=>update("remarks",e.target.value)}
        />
      </Section>

      {/* ===== IMAGE ===== */}
<Section title="Chart Image">
  <FeatureLockOverlay featureId="OPTIONS_CHARTIMAGE">
    <input
      type="file"
      accept="image/*"
      disabled={!can("OPTIONS_CHARTIMAGE")}
      onChange={(e) => {
        if (!can("OPTIONS_CHARTIMAGE")) return;
        handleImageUpload(e.target.files[0]);
      }}
      style={{
        background: !can("OPTIONS_CHARTIMAGE")
          ? "#f1f5f9"
          : "#fff",
        cursor: !can("OPTIONS_CHARTIMAGE")
          ? "not-allowed"
          : "pointer",
      }}
    />
  </FeatureLockOverlay>
</Section>


      {/* ===== SAVE BUTTON ===== */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
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
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
      {children}
    </div>
  );
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
      <select
        value={value}
        disabled={disabled}
        onChange={(e)=>onChange(e.target.value)}
        style={input}
      >
        <option value="">Select</option>
        {options.map((o)=>(
          <option key={o} value={o}>{o}</option>
        ))}
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

const badge = {
  padding: "6px 10px",
  background: "#dcfce7",
  color: "#166534",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 600,
};

const symbolDropdown = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  maxHeight: 220,
  overflowY: "auto",
  zIndex: 30,
};

const symbolItem = {
  padding: "8px 10px",
  cursor: "pointer",
  borderBottom: "1px solid #f1f5f9",
};
