import { useTradeEntryFeatureStore } from "../store/tradeEntryFeature.store";

/*
  STEP 3 – FINAL FEATURE GUARD
  ----------------------------
  ✔ Reads admin Trade Entry Control
  ✔ Reads user active planId
  ✔ Locks / unlocks automatically
  ✔ No hard-coded plan names
*/

export default function TradeEntryFeatureGuard({
  featureId,
  planId,
  children,
}) {
  const canUse = useTradeEntryFeatureStore(
    (s) => s.canUse
  );

  /* ❌ Safety */
  if (!featureId || !planId) {
    return (
      <LockedBox />
    );
  }

  /* 🔒 Feature not allowed for this plan */
  if (!canUse(featureId, planId)) {
    return (
      <LockedBox />
    );
  }

  /* ✅ Allowed */
  return children;
}

/* ===== LOCKED UI ===== */
function LockedBox() {
  return (
    <div
      style={{
        padding: 32,
        border: "2px dashed #ef4444",
        borderRadius: 12,
        background: "#fff1f2",
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: 8 }}>
        🔒 Feature Locked
      </h3>
      <p style={{ fontSize: 14 }}>
        This feature is not enabled for your plan.
      </p>
    </div>
  );
}
