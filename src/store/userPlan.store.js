import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserLogStore } from "./userLog.store";

/*
  USER PLAN STORE (FINAL – FREE = REAL PLAN)
  -----------------------------------------
  ✔ FREE has real planId (PLAN_FREE)
  ✔ Logged-in user never gets null plan
  ✔ Expired / blocked → FREE
  ✔ Refresh safe
  ✔ Feature control works for FREE also
*/

export const FREE_PLAN_ID = "PLAN_FREE";

export const useUserPlanStore = create(
  persist(
    (set, get) => ({
      /* ================= STATE ================= */
      activePlanId: FREE_PLAN_ID,

      /* ================= CORE ================= */
      setActivePlanId: (planId) => {
        set({
          activePlanId: planId || FREE_PLAN_ID,
        });
      },

      /* ================= AUTO SYNC FROM USER LOG ================= */
      refreshForUser: () => {
        try {
          const auth = JSON.parse(
            localStorage.getItem("auth_user")
          );

          if (!auth || !auth.id) {
            set({ activePlanId: FREE_PLAN_ID });
            return;
          }

          const userId = auth.id;
          const userLog = useUserLogStore.getState();

          const user = userLog.users.find(
            (u) => u.id === userId
          );

          // ❌ no user / blocked
          if (!user || user.status !== "ACTIVE") {
            set({ activePlanId: FREE_PLAN_ID });
            return;
          }

          // ❌ no plan
          if (!user.plan || !user.plan.planId) {
            set({ activePlanId: FREE_PLAN_ID });
            return;
          }

          // ❌ expired plan
          if (
            user.plan.expiryDate &&
            user.plan.expiryDate < Date.now()
          ) {
            set({ activePlanId: FREE_PLAN_ID });
            return;
          }

          // ✅ valid plan
          set({
            activePlanId:
              user.plan.planId || FREE_PLAN_ID,
          });
        } catch {
          set({ activePlanId: FREE_PLAN_ID });
        }
      },

      /* ================= RESET ================= */
      clearPlan: () =>
        set({ activePlanId: FREE_PLAN_ID }),
    }),
    {
      name: "user-plan-store",
    }
  )
);

/* 🔥 AUTO INIT (VERY IMPORTANT) */
useUserPlanStore.getState().refreshForUser();
