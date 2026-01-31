import { useUserPlanStore } from "../store/userPlan.store";

export default function PlanGuard({
  allowedPlans = [],
  children,
}) {
  const activePlanId =
    useUserPlanStore((s) => s.activePlanId);

  // 🔒 No plan yet → block
  if (!activePlanId) {
    return (
      <div style={lockStyle}>
        <h3>🔒 Access Locked</h3>
        <p>Please login or activate a plan.</p>
      </div>
    );
  }

  // 🔒 Plan not allowed
  if (
    allowedPlans.length > 0 &&
    !allowedPlans.includes(activePlanId)
  ) {
    return (
      <div style={lockStyle}>
        <h3>🚫 Plan Restricted</h3>
        <p>
          Your current plan does not allow
          access to this section.
        </p>
      </div>
    );
  }

  // ✅ Allowed
  return children;
}

const lockStyle = {
  padding: "40px",
  border: "2px dashed #ef4444",
  borderRadius: "12px",
  background: "#fff1f2",
  textAlign: "center",
};
