// src/routes/ProtectedRoute.jsx

import { hasFeatureAccess } from "../utils/featureAccess";
import LockedFeature from "../components/LockedFeature/LockedFeature";

export default function ProtectedRoute({
  userPlan,
  requiredFeature,
  requiredPlan,
  children,
}) {
  if (!hasFeatureAccess(userPlan, requiredFeature)) {
    return (
      <LockedFeature
        title="Premium Feature"
        description="This feature is available in higher plan."
        requiredPlan={requiredPlan}
      />
    );
  }

  return children;
}
