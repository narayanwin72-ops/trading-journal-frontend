import { useState, useEffect } from "react";
import { useSettings } from "../../store/settings.store";
import { useUserSymbolStore } from "../../store/userSymbol.store";

export default function Settings() {
  const settings = useSettings();

  /* ================= USER-WISE LOAD ================= */
  useEffect(() => {
    useSettings.getState().refreshForUser();
    useUserSymbolStore.getState().loadUserSymbols();
  }, []);

  const brokers = Array.isArray(settings.brokers) ? settings.brokers : [];
  const strategies = Array.isArray(settings.strategies) ? settings.strategies : [];
  const entryReasons = Array.isArray(settings.entryReasons) ? settings.entryReasons : [];
  const exitReasons = Array.isArray(settings.exitReasons) ? settings.exitReasons : [];
  const confidenceLevels = Array.isArray(settings.confidenceLevels)
    ? settings.confidenceLevels
    : [];

  return (
    <div style={page}>
      <div style={header}>
        <h2 style={{ margin: 0 }}>⚙️ Settings</h2>
        <p style={subText}>
          Customize your trading environment. These will appear automatically in Trade Entry forms.
        </p>
      </div>

      <Grid>
        <SettingCard title="Brokers" desc="Manage broker accounts you use" list="brokers" data={brokers} />
        <SettingCard title="Strategies" desc="Your personal trading strategies" list="strategies" data={strategies} />
        <SettingCard title="Entry Reasons" desc="Why you entered a trade" list="entryReasons" data={entryReasons} />
        <SettingCard title="Exit Reasons" desc="Why you exited a trade" list="exitReasons" data={exitReasons} />
        <SettingCard
          title="Confidence Levels"
          desc="Self-rating for discipline & mindset"
          list="confidenceLevels"
          data={confidenceLevels}
        />

        {/* ✅ FIXED: My Symbols */}
        <MySymbolsCard />
      </Grid>
    </div>
  );
}

/* ================= EXISTING CARD ================= */

function SettingCard({ title, desc, data, list }) {
  const settings = useSettings();
  const [value, setValue] = useState("");

  const safeData = Array.isArray(data) ? data : [];

  function handleAdd() {
    if (!value.trim()) return;
    settings.addItem(list, value.trim());
    setValue("");
  }

  function handleRemove(item) {
    settings.removeItem(list, item);
  }

  return (
    <div style={card}>
      <h4 style={cardTitle}>{title}</h4>
      <p style={cardDesc}>{desc}</p>

      <div style={inputRow}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Add ${title}`}
          style={input}
        />
        <button style={addBtn} onClick={handleAdd}>
          + Add
        </button>
      </div>

      <div style={pillWrap}>
        {safeData.length === 0 && <span style={empty}>No items added</span>}

        {safeData.map((item) => (
          <div key={item} style={pill}>
            {item}
            <span style={remove} onClick={() => handleRemove(item)}>
              ✕
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= FIXED: MY SYMBOLS CARD ================= */

function MySymbolsCard() {
  const { symbols, addSymbol, deleteSymbol } = useUserSymbolStore(); // 🔑 DIRECT SUBSCRIBE
  const [segment, setSegment] = useState("OPTIONS");
  const [value, setValue] = useState("");

  const list = symbols[segment] || [];

  function handleAdd() {
    if (!value.trim()) return;
    const ok = addSymbol(segment, value.trim());
    if (!ok) alert("Symbol already exists");
    setValue("");
  }

  function handleDelete(id) {
    deleteSymbol(segment, id);
  }

  return (
    <div style={card}>
      <h4 style={cardTitle}>My Symbols</h4>
      <p style={cardDesc}>Your personal trading symbols (merged with admin symbols)</p>

      {/* SEGMENT SWITCH */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        {["OPTIONS", "EQUITY", "FUTURES"].map((s) => (
          <button
            key={s}
            onClick={() => setSegment(s)}
            style={{
              padding: "6px 10px",
              borderRadius: "999px",
              border: "none",
              background: segment === s ? "#2563eb" : "#e5e7eb",
              color: segment === s ? "#fff" : "#000",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ADD */}
      <div style={inputRow}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add symbol"
          style={input}
        />
        <button style={addBtn} onClick={handleAdd}>
          + Add
        </button>
      </div>

      {/* LIST */}
      <div style={pillWrap}>
        {list.length === 0 && <span style={empty}>No symbols added</span>}

        {list.map((s) => (
          <div key={s.id} style={pill}>
            {s.name}
            <span style={remove} onClick={() => handleDelete(s.id)}>
              ✕
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= LAYOUT ================= */

function Grid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px",
      }}
    >
      {children}
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const page = { padding: "20px" };
const header = { marginBottom: "24px" };
const subText = { color: "#6b7280", fontSize: "14px", marginTop: "6px" };

const card = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "16px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

const cardTitle = { margin: 0, fontSize: "16px", fontWeight: 700 };
const cardDesc = { fontSize: "13px", color: "#6b7280", marginBottom: "12px" };

const inputRow = { display: "flex", gap: "8px", marginBottom: "12px" };

const input = {
  flex: 1,
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const addBtn = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 600,
};

const pillWrap = { display: "flex", flexWrap: "wrap", gap: "8px" };

const pill = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#f1f5f9",
  fontSize: "13px",
};

const remove = { cursor: "pointer", color: "#ef4444", fontWeight: "bold" };
const empty = { fontSize: "13px", color: "#9ca3af" };
