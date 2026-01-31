import { useTradeLogFeatureStore } from "../store/tradeLogFeature.store";

export default function TradeLogFeatureGuard({
  featureId,
  planId,
  children,
}) {
  const canUse = useTradeLogFeatureStore(
    (s) => s.canUse
  );

  if (!featureId || !planId) {
    return <LockedBox />;
  }

  if (!canUse(featureId, planId)) {
    return <LockedBox />;
  }

  return children;
}

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
      <h3>🔒 Trade Log Locked</h3>
      <p style={{ fontSize: 14 }}>
        This trade log is not available in your plan.
      </p>
    </div>
  );
}
