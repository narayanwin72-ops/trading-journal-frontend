import { useState, useEffect } from "react";
import { useSettings } from "../../store/settings.store";
import { useBrokerCapital } from "../../store/brokerCapital.store";

export default function BrokerCapital() {
  const [activeTab, setActiveTab] = useState("summary");
  const [editIndex, setEditIndex] = useState(null);

  /* ================= USER-WISE LOAD ================= */
  useEffect(() => {
    useBrokerCapital.getState().refreshForUser();
  }, []);

  return (
    <div style={page}>
      <h2 style={{ marginBottom: "4px" }}>Broker Capital Management</h2>
      <p style={subtitle}>Manage broker-wise deposits & withdrawals</p>

      <div style={tabBar}>
        <Tab active={activeTab === "summary"} onClick={() => setActiveTab("summary")}>
          Summary
        </Tab>
        <Tab active={activeTab === "entry"} onClick={() => setActiveTab("entry")}>
          Entry
        </Tab>
        <Tab active={activeTab === "log"} onClick={() => setActiveTab("log")}>
          Entry Log
        </Tab>
      </div>

      <div style={contentBox}>
        {activeTab === "summary" && <CapitalSummary />}
        {activeTab === "entry" && (
          <CapitalEntryForm editIndex={editIndex} setEditIndex={setEditIndex} />
        )}
        {activeTab === "log" && (
          <CapitalEntryLog setEditIndex={setEditIndex} setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}

/* ================= ENTRY FORM ================= */

function CapitalEntryForm({ editIndex, setEditIndex }) {
  const settings = useSettings();
  const brokers = Array.isArray(settings?.brokers) ? settings.brokers : [];
  const { transactions, addTransaction, updateTransaction } = useBrokerCapital();

  const [form, setForm] = useState({
    date: "",
    broker: "",
    type: "",
    amount: "",
    remarks: "",
  });

  /* EDIT LOAD */
  useEffect(() => {
    if (editIndex !== null && transactions[editIndex]) {
      setForm(transactions[editIndex]);
    }
  }, [editIndex, transactions]);

  function update(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleSave() {
    if (!form.date || !form.broker || !form.type || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    if (editIndex !== null) {
      updateTransaction(editIndex, form);
      setEditIndex(null);
      alert("✏️ Entry updated");
    } else {
      addTransaction({
        ...form,
        amount:
          form.type === "withdrawal"
            ? -Math.abs(Number(form.amount))
            : Math.abs(Number(form.amount)),
        createdAt: Date.now(),
      });
      alert("✅ Capital entry saved");
    }

    setForm({ date: "", broker: "", type: "", amount: "", remarks: "" });
  }

  return (
    <div>
      <h4 style={{ marginBottom: "16px" }}>
        {editIndex !== null ? "Edit Capital Entry" : "Capital Entry"}
      </h4>

      <div style={grid}>
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(v) => update("date", v)}
        />

        <div>
          <label style={labelStyle}>Broker</label>
          <select
            value={form.broker}
            onChange={(e) => update("broker", e.target.value)}
            style={inputStyle}
          >
            <option value="">Select</option>
            {brokers.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <Select
          label="Type"
          options={[
            { label: "Deposit", value: "deposit" },
            { label: "Withdrawal", value: "withdrawal" },
          ]}
          value={form.type}
          onChange={(v) => update("type", v)}
        />

        <Input
          label="Amount (₹)"
          type="number"
          value={Math.abs(form.amount)}
          onChange={(v) => update("amount", v)}
        />
      </div>

      <textarea
        placeholder="Remarks (optional)"
        style={textarea}
        value={form.remarks}
        onChange={(e) => update("remarks", e.target.value)}
      />

      <button style={saveBtn} onClick={handleSave}>
        {editIndex !== null ? "Update Entry" : "Save Entry"}
      </button>
    </div>
  );
}

/* ================= ENTRY LOG ================= */

function CapitalEntryLog({ setEditIndex, setActiveTab }) {
  const { transactions, deleteTransaction } = useBrokerCapital();

  function handleDelete(index) {
    const ok = window.confirm("Are you sure you want to delete this entry?");
    if (ok) deleteTransaction(index);
  }

  function downloadCSV() {
    const header = ["Date,Broker,Type,Amount,Remarks"];
    const rows = transactions.map(
      (t) => `${t.date},${t.broker},${t.type},${t.amount},${t.remarks || ""}`
    );
    const blob = new Blob([header.concat(rows).join("\n")], {
      type: "text/csv",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "broker-capital-log.csv";
    link.click();
  }

  if (!transactions.length) {
    return <div style={{ color: "#6b7280" }}>No entries found.</div>;
  }

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <button style={downloadBtn} onClick={downloadCSV}>
          ⬇ Download Excel
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Date</th>
              <th style={th}>Broker</th>
              <th style={th}>Type</th>
              <th style={th}>Amount</th>
              <th style={{ ...th, textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i}>
                <td style={td}>{t.date}</td>
                <td style={td}>{t.broker}</td>
                <td style={td}>{t.type}</td>
                <td
                  style={{
                    ...td,
                    color: t.amount > 0 ? "green" : "red",
                    fontWeight: 600,
                  }}
                >
                  ₹ {Math.abs(t.amount).toLocaleString()}
                </td>
                <td style={{ ...td, textAlign: "center" }}>
                  <button
                    style={iconBtn}
                    title="Edit"
                    onClick={() => {
                      setEditIndex(i);
                      setActiveTab("entry");
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    style={iconBtn}
                    title="Delete"
                    onClick={() => handleDelete(i)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ================= SUMMARY ================= */

function CapitalSummary() {
  const { transactions } = useBrokerCapital();
  if (!transactions.length) return <div>No capital entries yet.</div>;

  const summary = {};
  transactions.forEach((t) => {
    if (!summary[t.broker]) summary[t.broker] = { deposit: 0, withdrawal: 0 };
    t.amount > 0
      ? (summary[t.broker].deposit += t.amount)
      : (summary[t.broker].withdrawal += Math.abs(t.amount));
  });

  return (
    <table style={table}>
      <thead>
        <tr>
          <th style={th}>Broker</th>
          <th style={th}>Total Deposit (+)</th>
          <th style={th}>Total Withdrawal (−)</th>
          <th style={th}>Current Capital</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(summary).map((b) => (
          <tr key={b}>
            <td style={td}>{b}</td>
            <td style={{ ...td, color: "green" }}>
              ₹ {summary[b].deposit}
            </td>
            <td style={{ ...td, color: "red" }}>
              ₹ {summary[b].withdrawal}
            </td>
            <td style={{ ...td, fontWeight: "bold" }}>
              ₹ {summary[b].deposit - summary[b].withdrawal}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ================= UI + STYLES (UNCHANGED) ================= */

function Tab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
        background: active ? "#2563eb" : "#e5e7eb",
        color: active ? "#ffffff" : "#000000",
      }}
    >
      {children}
    </button>
  );
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
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
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ================= STYLES ================= */

const page = { padding: "20px" };
const subtitle = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "16px",
};
const tabBar = { display: "flex", gap: "10px", marginBottom: "20px" };
const contentBox = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "24px",
};
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "16px",
};
const labelStyle = {
  fontSize: "13px",
  fontWeight: 600,
  marginBottom: "4px",
  display: "block",
};
const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
};
const textarea = {
  width: "100%",
  marginTop: "16px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};
const saveBtn = {
  marginTop: "16px",
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  background: "#16a34a",
  color: "#ffffff",
  fontWeight: "bold",
  cursor: "pointer",
};
const downloadBtn = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "none",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer",
};
const iconBtn = {
  margin: "0 6px",
  padding: "4px 8px",
  border: "none",
  cursor: "pointer",
  background: "transparent",
};
const table = { width: "100%", borderCollapse: "collapse" };
const th = {
  border: "1px solid #e5e7eb",
  padding: "10px",
  background: "#f1f5f9",
  fontSize: "13px",
  textAlign: "left",
};
const td = {
  border: "1px solid #e5e7eb",
  padding: "10px",
  fontSize: "13px",
};
