import { useDashboardFeatureStore } from "../store/dashboardFeature.store";
import { useUserPlanStore } from "../store/userPlan.store";
import { usePlanStore } from "../store/plan.store";

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

  if (canUse(featureId, planId)) {
    return children;
  }

  const feature = features.find(
    (f) => f.featureId === featureId
  );

  const names =
    feature?.allowedPlans
      ?.map(
        (pid) =>
          plans.find((p) => p.id === pid)?.name
      )
      .filter(Boolean) || [];

  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: "blur(4px)" }}>
        {children}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "rgba(255,255,255,0.6)",
        }}
      >
        🔓 Unlock with {names.join(" / ")}
      </div>
    </div>
  );
}
