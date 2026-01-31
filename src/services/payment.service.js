import { useUserLogStore } from "../store/userLog.store";
import { usePlanVariantStore } from "../store/planVariant.store";
import { useUserPlanStore } from "../store/userPlan.store";

export function finalizePayment({
  userId,
  variantId,
  provider = "COSMOFEED",
  paymentRef = "",
}) {
  const userLog = useUserLogStore.getState();
  const variantStore = usePlanVariantStore.getState();

  const user = userLog.users.find(u => u.id === userId);
  if (!user || user.status !== "ACTIVE") return false;

  const variant = variantStore.variants.find(
    v => v.id === variantId && v.isActive
  );
  if (!variant) return false;

  // 🔒 duplicate protection
  if (user.payments?.some(p => p.variantId === variantId)) {
    return true;
  }

  const now = Date.now();
  const expiry =
    now + variant.durationDays * 24 * 60 * 60 * 1000;

  // ✅ UPDATE USER LOG (SINGLE SOURCE)
  userLog.updateUserPlan(userId, {
    planId: variant.planId,
    planName: variant.name.split("_")[0].toUpperCase(),
    variantId: variant.id,
    variantName: variant.name,
    startDate: now,
    expiryDate: expiry,
    isTrial: false,
  });

  // ✅ ADD PAYMENT RECORD
  userLog.addPayment(userId, {
    amount: variant.price,
    planId: variant.planId,
    variantId: variant.id,
    provider,
    paymentRef,
  });

  // 🔥 FORCE USER SIDE REFRESH
  useUserPlanStore.getState().refreshForUser();

  return true;
}
