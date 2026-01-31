import { usePlanStore } from "../../store/plan.store";
import { useUserPlanStore } from "../../store/userPlan.store";
import { useDashboardFeatureStore } from "../../store/dashboardFeature.store";

export default function DashboardFilterLockNote({
  featureId,
}) {
  const planId = useUserPlanStore(
    (s) => s.activePlanId
  );
  const plans = usePlanStore((s) => s.plans);
  const {
    canUse,
    getAllowedPlanNames,
  } = useDashboardFeatureStore();

  if (canUse(featureId, planId)) return null;

  const names = getAllowedPlanNames(
    featureId,
    plans
  );

  return (
    <div style={{ fontSize: 11, color: "#64748b" }}>
      🔓 Unlock filters with{" "}
      {names.join(" / ")}
    </div>
  );
}
