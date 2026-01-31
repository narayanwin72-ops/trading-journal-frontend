import { useTradeEntryFeatureStore } from "../store/tradeEntryFeature.store";
import { useUserPlanStore } from "../store/userPlan.store";
import { usePlanStore } from "../store/plan.store";

/*
  FeatureLockOverlay (FINAL)
  -------------------------
  ✔ Shows exact plan names (Pro / Elite / Gold)
  ✔ No generic "Premium" text
  ✔ Safe for all inputs
*/

export default function FeatureLockOverlay({
  featureId,
  children,
}) {
  const planId = useUserPlanStore(
    (s) => s.activePlanId
  );

  const { canUse, features } =
    useTradeEntryFeatureStore();

  const plans = usePlanStore(
    (s) => s.plans
  );

  const isAllowed = canUse(featureId, planId);

  // ✅ Allowed → no overlay
  if (isAllowed) {
    return children;
  }

  // 🔍 Find feature config
  const feature = features.find(
    (f) => f.featureId === featureId
  );

  // 🔑 Resolve allowed plan names
  const allowedPlanNames =
    feature?.allowedPlans
      ?.map((pid) => {
        const p = plans.find(
          (pl) => pl.id === pid
        );
        return p?.name;
      })
      .filter(Boolean) || [];

  const unlockText =
    allowedPlanNames.length > 0
      ? `Unlock with ${allowedPlanNames.join(
          " / "
        )}`
      : "Upgrade plan to unlock";

  return (
    <div style={{ position: "relative" }}>
      {children}

      {/* 🔒 Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "rgba(248,250,252,0.75)",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "6px 12px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            color: "#374151",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.08)",
            whiteSpace: "nowrap",
          }}
        >
          🔓 {unlockText}
        </div>
      </div>
    </div>
  );
}
