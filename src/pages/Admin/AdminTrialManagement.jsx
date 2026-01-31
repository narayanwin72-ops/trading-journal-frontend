import { useTrialStore } from "../../store/trial.store";
import { usePlanStore } from "../../store/plan.store";
import { useUserLogStore } from "../../store/userLog.store";

export default function AdminTrialManagement() {
  const {
    trial,
    toggleTrial,
    setTrialDuration,
    setTrialPlan,
  } = useTrialStore();

  const plans = usePlanStore((s) => s.plans);
  const users = useUserLogStore((s) => s.users);

  const trialUsers = users.filter(
    (u) => u.plan?.isTrial === true
  );

  return (
    <div style={{ maxWidth: 1100 }}>
      <h2>Trial Management</h2>

      {/* ================= TRIAL SETTINGS ================= */}
      <div style={card}>
        <h3>Trial Settings</h3>

        <label style={label}>
          <input
            type="checkbox"
            checked={trial.enabled}
            onChange={(e) => toggleTrial(e.target.checked)}
          />{" "}
          Enable Trial
        </label>

        <div style={row}>
          {/* TRIAL DURATION INPUT */}
          <div>
            <label style={label}>Trial Duration (Days)</label>
            <input
              type="number"
              min="1"
              placeholder="Enter days (e.g. 7)"
              value={trial.durationDays}
              onChange={(e) =>
                setTrialDuration(e.target.value)
              }
              style={input}
            />
          </div>

          {/* TRIAL PLAN */}
          <div>
            <label style={label}>Trial Plan</label>
            <select
              value={trial.trialPlanId || ""}
              onChange={(e) => setTrialPlan(e.target.value)}
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
        </div>
      </div>

      {/* ================= TRIAL LOG ================= */}
      <div style={card}>
        <h3>Trial Users Log</h3>

        {trialUsers.length === 0 ? (
          <p style={muted}>No users currently in trial</p>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Plan</th>
                <th style={th}>Expiry</th>
                <th style={th}>Days Left</th>
              </tr>
            </thead>
            <tbody>
              {trialUsers.map((u) => (
                <tr key={u.id}>
                  <td style={td}>{u.name}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>{u.plan.planName}</td>
                  <td style={td}>
                    {new Date(
                      u.plan.expiryDate
                    ).toLocaleDateString()}
                  </td>
                  <td style={td}>
                    {Math.ceil(
                      (u.plan.expiryDate - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */
const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  marginBottom: 20,
};

const row = {
  display: "flex",
  gap: 20,
  alignItems: "flex-end",
};

const label = {
  display: "block",
  fontSize: 14,
  marginBottom: 6,
};

const input = {
  padding: 8,
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  width: 220,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  border: "1px solid #cbd5e1",
  padding: 8,
  background: "#f1f5f9",
};

const td = {
  border: "1px solid #cbd5e1",
  padding: 8,
};

const muted = {
  color: "#64748b",
};
