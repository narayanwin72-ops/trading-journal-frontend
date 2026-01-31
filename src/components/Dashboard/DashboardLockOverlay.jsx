import { useUserPlanStore } from "../../store/userPlan.store";
import { useDashboardFeatureStore } from "../../store/dashboardFeature.store";
import { usePlanStore } from "../../store/plan.store";

export default function DashboardLockOverlay({
  featureId,
  children,
}) {
  const planId = useUserPlanStore(
    (s) => s.activePlanId
  );

  const { canUse, features } =
    useDashboardFeatureStore();

  const plans = usePlanStore((s) => s.plans);

  const allowed = canUse(featureId, planId);

  if (allowed) return children;

  const feature = features.find(
    (f) => f.featureId === featureId
  );

  const planNames =
    feature?.allowedPlans
      ?.map(
        (pid) =>
          plans.find((p) => p.id === pid)
            ?.name
      )
      .filter(Boolean) || [];

  return (
    <div style={wrap}>
      <div style={blur}>{children}</div>

      <div style={overlay}>
        🔓 Unlock with{" "}
        <b>{planNames.join(" / ")}</b>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const wrap = {
  position: "relative",
};

const blur = {
  filter: "blur(4px)",
  pointerEvents: "none",
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(255,255,255,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 15,
  color: "#111827",
  borderRadius: 12,
};
