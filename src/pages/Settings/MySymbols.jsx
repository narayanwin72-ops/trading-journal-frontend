import { useEffect, useState } from "react";
import { useUserSymbolStore } from "../../store/userSymbol.store";

const SEGMENTS = ["OPTIONS", "EQUITY", "FUTURES"];

export default function MySymbols() {
  const { symbols, loadUserSymbols, addSymbol, deleteSymbol } =
    useUserSymbolStore();

  const [segment, setSegment] = useState("OPTIONS");
  const [input, setInput] = useState("");

  useEffect(() => {
    loadUserSymbols();
  }, []);

  function handleAdd() {
    if (!input.trim()) return;
    const ok = addSymbol(segment, input);
    if (!ok) alert("Symbol already exists");
    setInput("");
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>My Symbols</h3>

      {/* SEGMENT TABS */}
      <div style={{ marginBottom: 12 }}>
        {SEGMENTS.map((s) => (
          <button
            key={s}
            onClick={() => setSegment(s)}
            style={{
              marginRight: 6,
              padding: "6px 12px",
              background: segment === s ? "#4f46e5" : "#e5e7eb",
              color: segment === s ? "#fff" : "#000",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ADD SYMBOL */}
      <div style={{ marginBottom: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add personal symbol"
        />
        <button onClick={handleAdd} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      {/* LIST */}
      {symbols[segment]?.length === 0 && <p>No symbols added</p>}

      <ul>
        {symbols[segment]?.map((s) => (
          <li key={s.id} style={{ marginBottom: 6 }}>
            {s.name}
            <button
              onClick={() => deleteSymbol(segment, s.id)}
              style={{ marginLeft: 10 }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
