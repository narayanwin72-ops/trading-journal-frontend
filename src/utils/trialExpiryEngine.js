import { useUserLogStore } from "../store/userLog.store";
import {
  useUserPlanStore,
  FREE_PLAN_ID,
} from "../store/userPlan.store";

/*
  TRIAL / PLAN EXPIRY ENGINE (FINAL – FREE = REAL PLAN)
*/

export function checkAndHandleTrialExpiry() {
  const userId =
    localStorage.getItem("LOGGED_IN_USER_ID");

  if (!userId) return;

  const {
    users,
    updateUserPlan,
  } = useUserLogStore.getState();

  const { setActivePlanId } =
    useUserPlanStore.getState();

  const user = users.find(
    (u) => u.id === userId
  );

  // 🔹 No user or no plan → FREE
  if (!user || !user.plan) {
    setActivePlanId(FREE_PLAN_ID);
    return;
  }

  const now = Date.now();
  const expiryDate = user.plan.expiryDate;

  // 🔒 Blocked user → FREE
  if (user.status !== "ACTIVE") {
    setActivePlanId(FREE_PLAN_ID);
    return;
  }

  // ⏳ Expired → downgrade to FREE
  if (!expiryDate || expiryDate < now) {
    updateUserPlan(userId, {
      planId: FREE_PLAN_ID,
      planName: "FREE",
      variantId: null,
      variantName: null,
      startDate: now,
      expiryDate: null,
    });

    setActivePlanId(FREE_PLAN_ID);
    return;
  }

  // ✅ Valid paid / trial plan
  setActivePlanId(user.plan.planId);
}
