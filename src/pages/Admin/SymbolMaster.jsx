import { useState, useMemo } from "react";
import { useSymbolStore } from "../../store/symbol.store";

const SEGMENTS = ["OPTIONS", "EQUITY", "FUTURES"];

export default function SymbolMaster() {
  const { symbols, addSymbol, toggleStatus, bulkAdd, save } = useSymbolStore();

  const [segment, setSegment] = useState("OPTIONS");
  const [input, setInput] = useState("");

  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [toast, setToast] = useState("");

  const [search, setSearch] = useState("");
  const [sortAZ, setSortAZ] = useState(true);
  const [selected, setSelected] = useState([]);

  /* ================= FILTER + SORT ================= */
  const visibleSymbols = useMemo(() => {
    let list = [...symbols[segment]];

    if (search.trim()) {
      list = list.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    list.sort((a, b) =>
      sortAZ
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return list;
  }, [symbols, segment, search, sortAZ]);

  /* ================= ADD ================= */
  function handleAdd() {
    if (!input.trim()) return;
    const ok = addSymbol(segment, input);
    if (!ok) return alert("Duplicate symbol!");
    setInput("");
  }

  /* ================= UPDATE ================= */
  function handleUpdate() {
    const data = { ...symbols };
    const list = data[segment];

    const duplicate = list.some(
      (s) =>
        s.name === editData.name.toUpperCase() &&
        s.id !== editData.id
    );
    if (duplicate) return alert("Duplicate symbol!");

    data[segment] = list.map((s) =>
      s.id === editData.id
        ? { ...s, name: editData.name.toUpperCase() }
        : s
    );

    save(data);
    setEditData(null);
  }

  /* ================= DELETE ================= */
  function confirmDelete() {
    const data = { ...symbols };
    data[segment] = data[segment].filter((s) => s.id !== deleteId);
    save(data);
    setDeleteId(null);
  }

  /* ================= BULK STATUS ================= */
  function bulkStatus(status) {
    const data = { ...symbols };
    data[segment] = data[segment].map((s) =>
      selected.includes(s.id) ? { ...s, status } : s
    );
    save(data);
    setSelected([]);
  }

  /* ================= EXCEL ================= */
  function handleExcel(e) {
    const file = e.target.files[0];
    if (!file) return;

    const before = symbols[segment].length;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const rows = evt.target.result
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);

      bulkAdd(segment, rows);

      const after =
        JSON.parse(localStorage.getItem("ADMIN_SYMBOLS"))?.[segment]
          ?.length || 0;

      const added = after - before;
      const skipped = rows.length - added;

      setToast(`${added} added, ${skipped} duplicates ignored`);
      setTimeout(() => setToast(""), 3000);

      e.target.value = "";
    };
    reader.readAsText(file);
  }

  /* ================= SAMPLE CSV ================= */
  function downloadSample() {
    const data = "NIFTY\nBANKNIFTY\nFINNIFTY\nRELIANCE\nTCS";
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-symbols.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={wrapper}>
      <h2 style={heading}>Symbol Master</h2>

      {/* SEGMENT TABS */}
      <div style={tabs}>
        {SEGMENTS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setSegment(s);
              setSelected([]);
            }}
            style={{
              ...tab,
              ...(segment === s ? activeTab : {}),
            }}
          >
            {s} ({symbols[s].length})
          </button>
        ))}
      </div>

      {/* ADD BAR */}
      <div style={card}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add Symbol"
          style={inputBox}
        />
        <button onClick={handleAdd} style={primaryBtn}>➕ Add</button>

        <input type="file" accept=".csv" onChange={handleExcel} style={{ marginLeft: 8 }} />

        <button onClick={downloadSample} style={secondaryBtn}>
          ⬇ Sample CSV
        </button>
      </div>

      {/* SEARCH + ACTIONS */}
      <div style={card}>
        <input
          placeholder="Search symbol"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputBox}
        />
        <button onClick={() => setSortAZ(!sortAZ)} style={secondaryBtn}>
          Sort {sortAZ ? "Z–A" : "A–Z"}
        </button>

        {selected.length > 0 && (
          <>
            <button onClick={() => bulkStatus("ACTIVE")} style={primaryBtn}>
              Mark Active
            </button>
            <button onClick={() => bulkStatus("INACTIVE")} style={secondaryBtn}>
              Mark Inactive
            </button>
          </>
        )}
      </div>

      {/* TABLE */}
      <div style={card}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}></th>
              <th style={th}>SL</th>
              <th style={th}>Symbol</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleSymbols.map((s, i) => (
              <tr key={s.id}>
                <td style={td}>
                  <input
                    type="checkbox"
                    checked={selected.includes(s.id)}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? [...selected, s.id]
                          : selected.filter((id) => id !== s.id)
                      )
                    }
                  />
                </td>
                <td style={td}>{i + 1}</td>
                <td style={td}>{s.name}</td>
                <td style={td}>
                  <button
                    onClick={() => toggleStatus(segment, s.id)}
                    style={{
                      ...statusBtn,
                      background:
                        s.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                    }}
                  >
                    {s.status}
                  </button>
                </td>
                <td style={td}>
                  <button
                    onClick={() => setEditData({ id: s.id, name: s.name })}
                    style={iconBtn}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setDeleteId(s.id)}
                    style={iconBtn}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editData && (
        <div style={modalOverlay}>
          <div style={modal}>
            <h3>Edit Symbol</h3>
            <input
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              style={inputBox}
            />
            <div style={modalActions}>
              <button onClick={handleUpdate} style={primaryBtn}>
                Update
              </button>
              <button onClick={() => setEditData(null)} style={secondaryBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {deleteId && (
        <div style={modalOverlay}>
          <div style={modal}>
            <h3>⚠️ Confirm Delete</h3>
            <p>This symbol will be permanently deleted.</p>
            <div style={modalActions}>
              <button onClick={confirmDelete} style={dangerBtn}>
                Delete
              </button>
              <button onClick={() => setDeleteId(null)} style={secondaryBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={toastStyle}>{toast}</div>}
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const wrapper = { maxWidth: 1000 };
const heading = { fontSize: 24, fontWeight: 600, marginBottom: 20 };
const tabs = { display: "flex", gap: 10, marginBottom: 20 };

const tab = {
  padding: "8px 16px",
  borderRadius: 6,
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
  cursor: "pointer",
};

const activeTab = { background: "#4f46e5", color: "#fff" };

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 8,
  marginBottom: 20,
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};

const inputBox = {
  padding: 8,
  fontSize: 14,
  width: 200,
  marginRight: 8,
};

const primaryBtn = {
  padding: "8px 14px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "8px 14px",
  background: "#e5e7eb",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const dangerBtn = {
  padding: "8px 14px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "center",
  border: "1px solid #cbd5e1",
};

const th = { border: "1px solid #cbd5e1", padding: 10, background: "#f1f5f9" };
const td = { border: "1px solid #cbd5e1", padding: 10 };

const statusBtn = { padding: "6px 12px", borderRadius: 6, border: "none" };
const iconBtn = { fontSize: 18, background: "transparent", border: "none", cursor: "pointer" };

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 320,
};

const modalActions = {
  marginTop: 16,
  display: "flex",
  gap: 10,
  justifyContent: "flex-end",
};

const toastStyle = {
  position: "fixed",
  bottom: 20,
  right: 20,
  background: "#0f172a",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 6,
};
