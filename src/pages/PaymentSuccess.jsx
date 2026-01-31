import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePlanVariantStore } from "../store/planVariant.store";
import { useUserLogStore } from "../store/userLog.store";
import { useUserPlanStore } from "../store/userPlan.store";
import { usePlanStore } from "../store/plan.store";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const userId = params.get("userId");
  const variantId = params.get("variantId");

  const processedRef = useRef(false);

  useEffect(() => {
    if (!userId || !variantId) return;
    if (processedRef.current) return;

    processedRef.current = true;

    const variantStore = usePlanVariantStore.getState();
    const userLogStore = useUserLogStore.getState();
    const userPlanStore = useUserPlanStore.getState();
    const planStore = usePlanStore.getState();

    const variant = variantStore.variants.find(
      (v) => v.id === variantId
    );
    if (!variant) {
      navigate("/dashboard", { replace: true });
      return;
    }

    const plan = planStore.plans.find(
      (p) => p.id === variant.planId
    );

    const now = Date.now();
    const expiryDate =
      now + variant.durationDays * 24 * 60 * 60 * 1000;

    /* 🔥 ENSURE USER EXISTS IN USER LOG */
    const existingUser = userLogStore.users.find(
      (u) => u.id === userId
    );

    if (!existingUser) {
      const authUser = JSON.parse(
        localStorage.getItem("auth_user")
      );

      if (authUser) {
        userLogStore.addUser({
          ...authUser,
          id: userId,
          status: "ACTIVE",
          plan: {},
        });
      }
    }

    /* 🔥 UPDATE USER PLAN (SOURCE OF TRUTH) */
    userLogStore.updateUserPlan(userId, {
      planId: variant.planId,
      planName: plan?.name || "",
      variantId: variant.id,
      variantName: variant.name,
      startDate: now,
      expiryDate,
      isTrial: false,
    });

    /* 🔥 SYNC auth_user */
    const authUser = JSON.parse(
      localStorage.getItem("auth_user")
    );

    if (authUser && authUser.id === userId) {
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          ...authUser,
          plan: {
            planId: variant.planId,
            planName: plan?.name || "",
            variantId: variant.id,
            variantName: variant.name,
            startDate: now,
            expiryDate,
            isTrial: false,
          },
        })
      );
    }

    /* 🔥 REFRESH USER PLAN STORE */
    userPlanStore.refreshForUser();

    /* 🔥 FINAL REDIRECT */
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 800);
  }, [userId, variantId, navigate]);

  return (
    <div
      style={{
        padding: "60px",
        textAlign: "center",
        fontSize: "16px",
      }}
    >
      <strong>Payment successful</strong>
      <div style={{ marginTop: 10 }}>
        Activating your plan…
      </div>
    </div>
  );
}
