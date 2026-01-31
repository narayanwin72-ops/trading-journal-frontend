import { useState } from "react";
import { usePlanStore } from "../../store/plan.store";
import { usePlanVariantStore } from "../../store/planVariant.store";

export default function AdminPlanVariants() {
  const plans = usePlanStore((s) => s.plans);
  const {
    addVariant,
    updateVariant,
    deleteVariant,
    toggleVariantStatus,
    variants,
    getVariantsByPlan,
  } = usePlanVariantStore();

  const [activeTab, setActiveTab] = useState("entry");
  const [planId, setPlanId] = useState("");
  const [logPlanFilter, setLogPlanFilter] = useState("ALL");

  const [durationType, setDurationType] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [price, setPrice] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [editingId, setEditingId] = useState(null);

  const selectedPlan = plans.find((p) => p.id === planId);

  const logVariants =
    logPlanFilter === "ALL"
      ? variants
      : getVariantsByPlan(logPlanFilter);

  function resetForm() {
    setDurationType("");
    setDurationDays("");
    setPrice("");
    setPaymentLink("");
    setEditingId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!planId || !durationType || !durationDays) return;

    const name = `${selectedPlan.name.toLowerCase()}_${durationType}`;

    const payload = {
      planId,
      name,
      durationDays: Number(durationDays),
      price: Number(price || 0),
      paymentLink,
    };

    if (editingId) {
      updateVariant(editingId, payload);
    } else {
      addVariant(payload);
    }

    resetForm();
  }

  function handleEdit(v) {
    setEditingId(v.id);
    setPlanId(v.planId);
    setDurationType(v.name.split("_")[1]);
    setDurationDays(v.durationDays);
    setPrice(v.price);
    setPaymentLink(v.paymentLink || "");
    setActiveTab("entry");
  }

  return (
    <div style={page}>
      <h2 style={title}>Plan Variants</h2>

      {/* PLAN SELECT (ENTRY) */}
      {activeTab === "entry" && (
        <div style={card}>
          <label style={label}>Select Plan</label>
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            style={input}
          >
            <option value="">-- Select Plan --</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* TABS */}
      <div style={tabs}>
        <button
          onClick={() => setActiveTab("entry")}
          style={tab(activeTab === "entry")}
        >
          Variant Entry
        </button>
        <button
          onClick={() => setActiveTab("log")}
          style={tab(activeTab === "log")}
        >
          Variants Log
        </button>
      </div>

      {/* ENTRY TAB */}
      {activeTab === "entry" && planId && (
        <form onSubmit={handleSubmit} style={card}>
          <div style={grid}>
            <select
              value={durationType}
              onChange={(e) => setDurationType(e.target.value)}
              style={input}
            >
              <option value="">Duration Type</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="halfyearly">Half Yearly</option>
              <option value="yearly">Yearly</option>
            </select>

            <input
              type="number"
              placeholder="Duration (Days)"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              style={input}
            />

            <input
              type="number"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={input}
            />

            <input
              placeholder="Cosmofeed Payment Link"
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
              style={input}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <button type="submit" style={primaryBtn}>
              {editingId ? "Update Variant" : "Add Variant"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={secondaryBtn}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* LOG TAB */}
      {activeTab === "log" && (
        <div style={card}>
          {/* FILTER */}
          <div style={{ marginBottom: 12 }}>
            <label style={label}>Filter by Plan</label>
            <select
              value={logPlanFilter}
              onChange={(e) => setLogPlanFilter(e.target.value)}
              style={input}
            >
              <option value="ALL">All Plans</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {logVariants.length === 0 ? (
            <p style={muted}>No variants found</p>
          ) : (
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Plan</th>
                  <th style={th}>Variant</th>
                  <th style={th}>Days</th>
                  <th style={th}>Price</th>
                  <th style={th}>Payment</th>
                  <th style={th}>Status</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {logVariants.map((v) => {
                  const plan = plans.find((p) => p.id === v.planId);
                  return (
                    <tr key={v.id}>
                      <td style={td}>{plan?.name || "-"}</td>
                      <td style={td}>{v.name}</td>
                      <td style={td}>{v.durationDays}</td>
                      <td style={td}>₹{v.price}</td>
                      <td style={td}>
                        {v.paymentLink ? (
                          <a
                            href={v.paymentLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => toggleVariantStatus(v.id)}
                          style={status(v.isActive)}
                        >
                          {v.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => handleEdit(v)}
                          style={editBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm("Delete this variant?")
                            ) {
                              deleteVariant(v.id);
                            }
                          }}
                          style={deleteBtn}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const page = { maxWidth: 1200 };

const title = { marginBottom: 16 };

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  marginBottom: 16,
};

const label = { fontSize: 14, marginBottom: 6, display: "block" };

const tabs = { display: "flex", gap: 8, marginBottom: 16 };

const tab = (active) => ({
  padding: "8px 16px",
  borderRadius: 20,
  border: "1px solid #c7d2fe",
  background: active ? "#e0e7ff" : "#fff",
  fontWeight: active ? "600" : "500",
  cursor: "pointer",
});

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 12,
};

const input = {
  padding: "10px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  fontSize: 14,
};

const primaryBtn = {
  padding: "10px 16px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  marginRight: 8,
};

const secondaryBtn = {
  padding: "10px 16px",
  border: "1px solid #cbd5e1",
  borderRadius: 6,
  background: "#fff",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  border: "1px solid #cbd5e1",
  padding: "10px",
  background: "#f1f5f9",
  fontSize: 14,
  textAlign: "left",
};

const td = {
  border: "1px solid #cbd5e1",
  padding: "10px",
  fontSize: 14,
};

const status = (active) => ({
  padding: "6px 12px",
  borderRadius: 20,
  border: "none",
  background: active ? "#dcfce7" : "#fee2e2",
  color: active ? "#166534" : "#991b1b",
  cursor: "pointer",
});

const editBtn = {
  padding: "6px 10px",
  background: "#fde68a",
  border: "none",
  borderRadius: 4,
  marginRight: 6,
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 10px",
  background: "#fecaca",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const muted = { color: "#64748b" };
