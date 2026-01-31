import { useState, useMemo, useEffect, useRef } from "react";
import { useTrades } from "../../store/trade.store";
import { useSettings } from "../../store/settings.store";
import { useBrokerCapital } from "../../store/brokerCapital.store";
import { getTradeSymbols } from "../../utils/symbolMerge";

/* 🔒 FEATURE LOCK */
import FeatureLockOverlay from "../../guards/FeatureLockOverlay";
import { useTradeEntryFeatureStore } from "../../store/tradeEntryFeature.store";
import { useUserPlanStore } from "../../store/userPlan.store";

/* ===== EXPIRY GENERATOR ===== */
function getNextExpiryMonths(entryDate) {
  if (!entryDate) return [];
  const baseDate = new Date(entryDate);
  const months = [];

  for (let i = 0; i <= 5; i++) {
    const d = new Date(baseDate);
    d.setMonth(d.getMonth() + i);
    const month = d
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    const year = d.getFullYear();
    months.push(`${month}-${year}`);
  }
  return months;
}

export default function IntradayFuturesTradeForm() {
  const {
    addTrade,
    updateTrade,
    trades,
    editTradeId,
    editTradeType,
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

  /* 🔑 PLAN + FEATURE */
  const planId = useUserPlanStore((s) => s.activePlanId);
  const canUse = useTradeEntryFeatureStore((s) => s.canUse);
  const can = (fid) => canUse(fid, planId);

  const fileRef = useRef(null);

  /* ================= EMPTY FORM ================= */
  const emptyForm = {
    date: "",
    time: "",
    timeRange: "",
    symbol: "",
    expiry: "",
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
  const [expiryOptions, setExpiryOptions] = useState([]);
  const [symbolSearch, setSymbolSearch] = useState("");
  const [showSymbolList, setShowSymbolList] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  /* ===== MERGED FUTURES SYMBOLS ===== */
  const futuresSymbols = getTradeSymbols("FUTURES");

  /* ================= EDIT PREFILL ================= */
  useEffect(() => {
    if (editTradeId && editTradeType === "FUTURES_INTRADAY") {
      const trade = trades.find(
        (t) =>
          t.id === editTradeId &&
          t.tradeType === "FUTURES_INTRADAY"
      );

      if (trade) {
        setForm({ ...emptyForm, ...trade });
        setSymbolSearch(trade.symbol || "");
        if (trade.date) {
          setExpiryOptions(
            getNextExpiryMonths(trade.date)
          );
        }
      }
    }
  }, [editTradeId, editTradeType, trades]);

  function update(name, val) {
    setForm((p) => ({ ...p, [name]: val }));
  }

  /* ================= IMAGE UPLOAD ================= */
  function handleImageUpload(file) {
    if (!file || !can("FUTURES_CHARTIMAGE")) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      update("chartImage", reader.result);
    reader.readAsDataURL(file);
  }

  /* ================= BROKER CAPITAL ================= */
  function getBrokerCapital(broker) {
    let cap = 0;
    transactions.forEach((t) => {
      if (t.broker === broker)
        cap += Number(t.amount);
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
    return (
      Math.abs(t - e) / risk
    ).toFixed(2);
  }, [form.entry, form.sl, form.target]);

  /* ================= SAVE / UPDATE ================= */
  function handleSave() {
    if (
      !form.symbol ||
      !form.entry ||
      !form.sl ||
      !form.target ||
      !form.qty
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (
      editTradeId &&
      editTradeType === "FUTURES_INTRADAY"
    ) {
      updateTrade(editTradeId, {
        ...form,
        tradeType: "FUTURES_INTRADAY",
      });
      clearEditTradeId();
      setSaveStatus("updated");
    } else {
      addTrade({
        ...form,
        tradeType: "FUTURES_INTRADAY",
      });
      setSaveStatus("saved");
    }

    setForm(emptyForm);
    setSymbolSearch("");
    if (fileRef.current) fileRef.current.value = "";
    setTimeout(() => setSaveStatus(""), 5000);
  }

  /* ================= UI ================= */
  return (
    <div style={container}>
      <h3 style={{ marginBottom: 16 }}>
        {editTradeId
          ? "Edit Intraday Futures Trade"
          : "Intraday Futures Trade Entry"}
      </h3>

      {/* ===== BROKER ===== */}
      <Section title="Broker & Capital">
        <Grid>
          <Select
            label="Broker"
            options={brokers}
            value={form.broker}
            onChange={(v) => {
              update("broker", v);
              update("capital", getBrokerCapital(v));
            }}
          />
          <Input
            label="Capital (₹)"
            value={form.capital}
            readOnly
          />
        </Grid>
      </Section>

      {/* ===== BASIC ===== */}
      <Section title="Basic Details">
        <Grid>
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(v) => {
              update("date", v);
              setExpiryOptions(
                getNextExpiryMonths(v)
              );
            }}
          />
          <Input
            label="Time"
            type="time"
            value={form.time}
            onChange={(v) => {
              update("time", v);
              update(
                "timeRange",
                getTimeRange(v)
              );
            }}
          />
          <Input
            label="Time Range"
            value={form.timeRange}
            readOnly
          />

          {/* ===== SYMBOL ===== */}
          <div style={{ position: "relative" }}>
            <label style={labelStyle}>
              Futures Symbol
            </label>
            <input
              value={symbolSearch}
              placeholder="Search & select symbol"
              onFocus={() => setShowSymbolList(true)}
              onChange={(e) => {
                setSymbolSearch(e.target.value);
                setShowSymbolList(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  if (
                    !futuresSymbols.includes(
                      symbolSearch
                    )
                  ) {
                    setSymbolSearch("");
                    update("symbol", "");
                  }
                  setShowSymbolList(false);
                }, 150);
              }}
              style={input}
            />

            {showSymbolList && (
              <div style={dropdown}>
                {futuresSymbols
                  .filter((s) =>
                    s
                      .toLowerCase()
                      .includes(
                        symbolSearch.toLowerCase()
                      )
                  )
                  .slice(0, 100)
                  .map((s) => (
                    <div
                      key={s}
                      onMouseDown={() => {
                        setSymbolSearch(s);
                        update("symbol", s);
                        setShowSymbolList(false);
                      }}
                      style={dropdownItem}
                    >
                      {s}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <Select
            label="Expiry Month"
            options={expiryOptions}
            value={form.expiry}
            onChange={(v) => update("expiry", v)}
          />
        </Grid>
      </Section>

      {/* ===== TRADE SETUP ===== */}
      <Section title="Trade Setup">
        <Grid>
          <Select
            label="Position"
            options={["LONG", "SHORT"]}
            value={form.position}
            onChange={(v) =>
              update("position", v)
            }
          />
          <Input
            label="Entry Price"
            value={form.entry}
            onChange={(v) => update("entry", v)}
          />
          <Input
            label="Stop Loss"
            value={form.sl}
            onChange={(v) => update("sl", v)}
          />
          <Input
            label="Target"
            value={form.target}
            onChange={(v) =>
              update("target", v)
            }
          />
        </Grid>

        <Grid>
          <Input
            label="Quantity"
            value={form.qty}
            onChange={(v) => update("qty", v)}
          />
          <Select
            label="Timeframe"
            options={[
              "1m","3m","5m","10m","15m",
              "30m","45m","1H","4H",
              "1D","1W","1M","Multi",
            ]}
            value={form.timeframe}
            onChange={(v) =>
              update("timeframe", v)
            }
          />
        </Grid>

        <div style={rrBox}>
          Risk–Reward (RR): <strong>{rr}</strong>
        </div>
      </Section>

      {/* ===== STRATEGY ===== */}
      <Section title="Strategy & Psychology">
        <Grid>
          <Select
            label="Strategy"
            options={strategies}
            value={form.strategy}
            onChange={(v) =>
              update("strategy", v)
            }
          />
          <Select
            label="Reason for Entry"
            options={entryReasons}
            value={form.reason}
            onChange={(v) =>
              update("reason", v)
            }
          />
          <Select
            label="Confidence"
            options={confidenceLevels}
            value={form.confidence}
            onChange={(v) =>
              update("confidence", v)
            }
          />
        </Grid>
      </Section>

      {/* ===== EXIT ===== */}
      <Section title="Exit">
        <Grid>
          <Input
            label="Exit Price"
            value={form.exitPrice}
            onChange={(v) =>
              update("exitPrice", v)
            }
          />
          <Input
            label="Exit Time"
            type="time"
            value={form.exitTime}
            onChange={(v) =>
              update("exitTime", v)
            }
          />
          <Select
            label="Exit Reason"
            options={exitReasons}
            value={form.exitReason}
            onChange={(v) =>
              update("exitReason", v)
            }
          />
          <Input
            label="Brokerage & Charges (₹)"
            value={form.charges}
            onChange={(v) =>
              update("charges", v)
            }
          />
        </Grid>

        <textarea
          placeholder="Remarks"
          style={textarea}
          value={form.remarks}
          onChange={(e) =>
            update("remarks", e.target.value)
          }
        />
      </Section>

      {/* ===== IMAGE (LOCKED) ===== */}
      <Section title="Chart Image">
        <FeatureLockOverlay featureId="FUTURES_CHARTIMAGE">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            disabled={!can("FUTURES_CHARTIMAGE")}
            onChange={(e) =>
              handleImageUpload(e.target.files[0])
            }
          />
        </FeatureLockOverlay>
      </Section>

      {/* ===== SAVE ===== */}
      <div style={{ display: "flex", gap: 12 }}>
        <button style={saveBtn} onClick={handleSave}>
          {editTradeId ? "Update Trade" : "Save Trade"}
        </button>

        {saveStatus && (
          <span style={successBadge}>
            Trade{" "}
            {saveStatus === "saved"
              ? "Saved"
              : "Updated"}{" "}
            ✓
          </span>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

function Input({ label, type="text", value, onChange, readOnly }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e)=>onChange && onChange(e.target.value)}
        style={{ ...input, background: readOnly ? "#f1f5f9" : "#fff" }}
      />
    </div>
  );
}

function Select({ label, options, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        style={input}
      >
        <option value="">Select</option>
        {options.map(o=>(
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

/* ===== STYLE CONST ===== */
const container = { background:"#fff", padding:"24px", borderRadius:"12px", border:"1px solid #e5e7eb" };
const labelStyle = { fontSize:13, fontWeight:600, marginBottom:4, display:"block" };
const input = { width:"100%", padding:8, borderRadius:6, border:"1px solid #d1d5db" };
const sectionTitle = { fontSize:14, fontWeight:700, marginBottom:12, borderBottom:"1px solid #e5e7eb", paddingBottom:6 };
const rrBox = { marginTop:12, padding:10, background:"#f8fafc", border:"1px solid #e5e7eb", borderRadius:8 };
const textarea = { width:"100%", marginTop:12, padding:10, borderRadius:8, border:"1px solid #d1d5db" };
const saveBtn = { padding:"12px 20px", borderRadius:10, border:"none", background:"#16a34a", color:"#fff", fontWeight:"bold", cursor:"pointer" };
const successBadge = { padding:"6px 12px", background:"#dcfce7", color:"#166534", borderRadius:20, fontSize:13, fontWeight:600 };
const dropdown = { position:"absolute", top:"100%", left:0, right:0, background:"#fff", border:"1px solid #d1d5db", borderRadius:8, maxHeight:220, overflowY:"auto", zIndex:20 };
const dropdownItem = { padding:"8px 12px", cursor:"pointer" };
