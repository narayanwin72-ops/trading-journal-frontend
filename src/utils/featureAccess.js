import { useTradeEntryFeatureStore } from "../store/tradeEntryFeature.store";

/*
  featureId : "OPTION_INTRADAY_TAB"
  planId    : dynamic plan id from user log (string)
*/

export function featureAccess(featureId, planId) {
  if (!featureId || !planId) return false;

  const { features } =
    useTradeEntryFeatureStore.getState();

  const feature = features.find(
    (f) => f.featureId === featureId
  );

  if (!feature) return false;

  return feature.allowedPlans.includes(planId);
}

/* backward compatibility */
export function hasFeatureAccess(featureId, planId) {
  return featureAccess(featureId, planId);
}
