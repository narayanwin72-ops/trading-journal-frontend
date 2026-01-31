import { useTradeEntryFeatureStore } from "../store/tradeEntryFeature.store";
import { useUserPlanStore } from "../store/userPlan.store";

export default function TradeEntryFieldGuard({
  featureId,
  children,
}) {
  const planId = useUserPlanStore(
    (s) => s.activePlanId
  );

  const canUse = useTradeEntryFeatureStore(
    (s) => s.canUse
  );

  // যদি plan না থাকে → locked
  const allowed =
    !!planId && canUse(featureId, planId);

  // children কে function হিসেবে call করা হচ্ছে
  return children(allowed);
}
