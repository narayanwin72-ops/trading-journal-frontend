import { useState } from "react";
import { usePlanStore } from "../../store/plan.store";

export default function AdminPlans() {
  const {
    plans,
    addPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
  } = usePlanStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updatePlan(editingId, { name, description });
      setEditingId(null);
    } else {
      addPlan({ name, description });
    }

    setName("");
    setDescription("");
  }

  function handleEdit(plan) {
    setEditingId(plan.id);
    setName(plan.name);
    setDescription(plan.description || "");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
    setDescription("");
  }

  function handleDelete(planId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this plan?"
    );
    if (!confirmed) return;

    deletePlan(planId);
  }

  return (
    <div>
      <h2>Plan Management</h2>

      {/* ADD / EDIT FORM */}
      <form onSubmit={handleSubmit} style={form}>
        <input
          placeholder="Plan name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={input}
        />

        <button type="submit" style={button}>
          {editingId ? "Update Plan" : "Add Plan"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={cancelBtn}
          >
            Cancel
          </button>
        )}
      </form>

      {/* PLAN LIST */}
      {plans.length === 0 && (
        <p style={{ color: "#666" }}>No plans created yet</p>
      )}

      {plans.map((plan) => (
        <div key={plan.id} style={card}>
          <div>
            <strong>{plan.name}</strong>
            <p style={{ fontSize: 13, color: "#555" }}>
              {plan.description || "No description"}
            </p>
          </div>

          <div style={actions}>
            {/* ACTIVE / INACTIVE */}
            <button
              onClick={() => togglePlanStatus(plan.id)}
              style={statusBtn(plan.isActive)}
            >
              {plan.isActive ? "Active" : "Inactive"}
            </button>

            {/* EDIT */}
            <button onClick={() => handleEdit(plan)} style={editBtn}>
              Edit
            </button>

            {/* DELETE (WITH WARNING) */}
            <button
              onClick={() => handleDelete(plan.id)}
              style={deleteBtn}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const form = {
  display: "flex",
  gap: 8,
  marginBottom: 20,
  flexWrap: "wrap",
};

const input = {
  padding: "8px 10px",
  fontSize: 14,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const button = {
  padding: "8px 14px",
  fontSize: 14,
  borderRadius: 6,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};

const cancelBtn = {
  padding: "8px 14px",
  fontSize: 14,
  borderRadius: 6,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
};

const card = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 12,
  marginBottom: 10,
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  background: "#fff",
};

const actions = {
  display: "flex",
  gap: 8,
};

const statusBtn = (active) => ({
  padding: "6px 10px",
  fontSize: 12,
  borderRadius: 20,
  border: "none",
  cursor: "pointer",
  background: active ? "#dcfce7" : "#fee2e2",
  color: active ? "#166534" : "#991b1b",
});

const editBtn = {
  padding: "6px 10px",
  fontSize: 12,
  borderRadius: 6,
  border: "none",
  background: "#fde68a",
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 10px",
  fontSize: 12,
  borderRadius: 6,
  border: "none",
  background: "#fecaca",
  cursor: "pointer",
};
