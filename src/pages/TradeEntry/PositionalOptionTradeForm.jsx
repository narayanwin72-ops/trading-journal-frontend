import { useState, useMemo, useEffect } from "react";
import { useTrades } from "../../store/trade.store";
import { useSettings } from "../../store/settings.store";
import { useBrokerCapital } from "../../store/brokerCapital.store";
import { getTradeSymbols } from "../../utils/symbolMerge";

/* ================= COMPONENT ================= */

export default function PositionalOptionTradeForm() {
  const {
    addTrade,
    updateTrade,
    trades,
    editTradeId,
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

  /* ================= EMPTY FORM ================= */
  const emptyForm = {
    entryDate: "",
    exitDate: "",
    underlying: "",
    expiry: "",
    strike: "",
    optionType: "",
    position: "",
    entry: "",
    sl: "",
    target: "",
    qty: "",
    timeframe: "",
    strategy: "",
    reason: "",
    confidence: "",
    exitPrice: "",
    exitReason: "",
    charges: "",
    remarks: "",
    chartImage: "",
    broker: "",
    capital: "",
  };

  const [form, setForm] = useState(emptyForm);

  /* ===== MERGED OPTION UNDERLYINGS ===== */
  const optionUnderlyings = getTradeSymbols("OPTIONS");

  /* ===== SEARCH STATE (SAME AS FUTURES) ===== */
  const [underlyingSearch, setUnderlyingSearch] = useState("");
  const [showUnderlyingList, setShowUnderlyingList] = useState(false);

  /* ================= EDIT PREFILL ================= */
  useEffect(() => {
    if (editTradeId) {
      const trade = trades.find((t) => t.id === editTradeId);
      if (trade) {
        setForm({ ...emptyForm, ...trade });
        setUnderlyingSearch(trade.underlying || "");
      }
    }
  }, [editTradeId, trades]);

  function update(name, val) {
    setForm((p) => ({ ...p, [name]: val }));
  }

  /* ================= BROKER CAPITAL ================= */
  function getBrokerCapital(broker) {
    let cap = 0;
    transactions.forEach((t) => {
      if (t.broker === broker) cap += Number(t.amount);
    });
    return cap;
  }

  /* ================= IMAGE ================= */
  function handleImageUpload(file) {
    if (!file) return;
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

  /* ================= SAVE / UPDATE ================= */
  function handleSave() {
    if (
      !form.entryDate ||
      !form.entry ||
      !form.sl ||
      !form.target ||
      !form.qty
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (editTradeId) {
      updateTrade(editTradeId, {
        ...form,
        tradeType: "OPTIONS_POSITIONAL",
      });
      clearEditTradeId();
      alert("✏️ Positional Option trade updated");
    } else {
      addTrade({
        ...form,
        tradeType: "OPTIONS_POSITIONAL",
      });
      alert("✅ Positional Option trade saved");
    }

    setForm(emptyForm);
    setUnderlyingSearch("");
  }

  /* ================= UI ================= */
  return (
    <div style={container}>
      <h3 style={{ marginBottom: "16px" }}>
        {editTradeId
          ? "Edit Positional Option Trade"
          : "Positional Option Trade Entry"}
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
          <Input label="Capital (₹)" value={form.capital} readOnly />
        </Grid>
      </Section>

      {/* ===== DATES ===== */}
      <Section title="Trade Dates">
        <Grid>
          <Input
            label="Entry Date"
            type="date"
            value={form.entryDate}
            onChange={(v) => update("entryDate", v)}
          />
          <Input
            label="Exit Date"
            type="date"
            value={form.exitDate}
            onChange={(v) => update("exitDate", v)}
          />
        </Grid>
      </Section>

      {/* ===== OPTION STRUCTURE ===== */}
      <Section title="Option Structure">
        <Grid>
          {/* ===== UNDERLYING (SEARCHABLE – SAME AS FUTURES) ===== */}
          <div style={{ position: "relative" }}>
            <label style={labelStyle}>Underlying</label>
            <input
              value={underlyingSearch}
              placeholder="Search & select underlying"
              onFocus={() => setShowUnderlyingList(true)}
              onChange={(e) => {
                setUnderlyingSearch(e.target.value);
                setShowUnderlyingList(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  if (!optionUnderlyings.includes(underlyingSearch)) {
                    setUnderlyingSearch("");
                    update("underlying", "");
                  }
                  setShowUnderlyingList(false);
                }, 150);
              }}
              style={input}
            />

            {showUnderlyingList && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  maxHeight: "220px",
                  overflowY: "auto",
                  zIndex: 20,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                }}
              >
                {optionUnderlyings
                  .filter((s) =>
                    s.toLowerCase().includes(underlyingSearch.toLowerCase())
                  )
                  .slice(0, 100)
                  .map((s) => (
                    <div
                      key={s}
                      onMouseDown={() => {
                        setUnderlyingSearch(s);
                        update("underlying", s);
                        setShowUnderlyingList(false);
                      }}
                      style={{ padding: "8px 12px", cursor: "pointer" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f1f5f9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#fff")
                      }
                    >
                      {s}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <Select
            label="Expiry"
            options={["Weekly", "Monthly"]}
            value={form.expiry}
            onChange={(v) => update("expiry", v)}
          />

          <Select
            label="Strike"
            options={[
              "ATM",
              "ITM +1","ITM +2","ITM +3","ITM +4","ITM +5",
              "OTM +1","OTM +2","OTM +3","OTM +4","OTM +5",
            ]}
            value={form.strike}
            onChange={(v) => update("strike", v)}
          />

          <Select
            label="Call / Put"
            options={["CALL", "PUT"]}
            value={form.optionType}
            onChange={(v) => update("optionType", v)}
          />
        </Grid>

        <Grid>
          <Select
            label="Position"
            options={["LONG", "SHORT"]}
            value={form.position}
            onChange={(v) => update("position", v)}
          />
        </Grid>
      </Section>

      {/* ===== PRICE & RISK ===== */}
      <Section title="Price & Risk">
        <Grid>
          <Input label="Entry Price" value={form.entry} onChange={(v) => update("entry", v)} />
          <Input label="Stop Loss" value={form.sl} onChange={(v) => update("sl", v)} />
          <Input label="Target" value={form.target} onChange={(v) => update("target", v)} />
          <Input label="Quantity" value={form.qty} onChange={(v) => update("qty", v)} />
        </Grid>

        <div style={rrBox}>
          Risk–Reward (RR): <strong>{rr}</strong>
        </div>
      </Section>

      {/* ===== STRATEGY ===== */}
      <Section title="Strategy & Psychology">
        <Grid>
          <Select
            label="Timeframe"
            options={["15m","30m","1H","4H","1D","Weekly","Monthly"]}
            value={form.timeframe}
            onChange={(v) => update("timeframe", v)}
          />
          <Select
            label="Strategy"
            options={strategies}
            value={form.strategy}
            onChange={(v) => update("strategy", v)}
          />
          <Select
            label="Reason for Entry"
            options={entryReasons}
            value={form.reason}
            onChange={(v) => update("reason", v)}
          />
          <Select
            label="Confidence"
            options={confidenceLevels}
            value={form.confidence}
            onChange={(v) => update("confidence", v)}
          />
        </Grid>
      </Section>

      {/* ===== EXIT ===== */}
      <Section title="Exit Details">
        <Grid>
          <Input label="Exit Price" value={form.exitPrice} onChange={(v) => update("exitPrice", v)} />
          <Select
            label="Exit Reason"
            options={exitReasons}
            value={form.exitReason}
            onChange={(v) => update("exitReason", v)}
          />
          <Input label="Brokerage & Charges (₹)" value={form.charges} onChange={(v) => update("charges", v)} />
        </Grid>

        <textarea
          placeholder="Remarks"
          style={textarea}
          value={form.remarks}
          onChange={(e) => update("remarks", e.target.value)}
        />
      </Section>

      {/* ===== IMAGE ===== */}
      <Section title="Chart Image">
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
      </Section>

      <button style={saveBtn} onClick={handleSave}>
        {editTradeId ? "Update Trade" : "Save Trade"}
      </button>
    </div>
  );
}

/* ================= UI HELPERS & STYLES (UNCHANGED) ================= */

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h4 style={sectionTitle}>{title}</h4>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>{children}</div>;
}

function Input({ label, type="text", value, onChange, readOnly }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{ ...input, background: readOnly ? "#f1f5f9" : "#fff" }}
      />
    </div>
  );
}

function Select({ label, options, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={input}>
        <option value="">Select</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

const container = { background:"#fff", padding:"24px", borderRadius:"12px", border:"1px solid #e5e7eb" };
const labelStyle = { fontSize:"13px", fontWeight:600, marginBottom:"4px", display:"block" };
const input = { width:"100%", padding:"8px", borderRadius:"6px", border:"1px solid #d1d5db" };
const sectionTitle = { fontSize:"14px", fontWeight:700, marginBottom:"12px", borderBottom:"1px solid #e5e7eb", paddingBottom:"6px" };
const rrBox = { marginTop:"12px", padding:"10px", background:"#f8fafc", border:"1px solid #e5e7eb", borderRadius:"8px" };
const textarea = { width:"100%", marginTop:"12px", padding:"10px", borderRadius:"8px", border:"1px solid #d1d5db" };
const saveBtn = { marginTop:"16px", padding:"12px 20px", borderRadius:"10px", border:"none", background:"#16a34a", color:"#fff", fontWeight:"bold", cursor:"pointer" };
