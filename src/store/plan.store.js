import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FREE_PLAN_ID } from "./userPlan.store";

/*
  PLAN MASTER (FINAL – FREE = SAME ID EVERYWHERE)
*/

export const usePlanStore = create(
  persist(
    (set, get) => ({
      plans: [],

      /* ================= INIT ================= */
      ensureFreePlan: () => {
        const plans = get().plans;

        const hasFree = plans.some(
          (p) => p.id === FREE_PLAN_ID
        );

        if (!hasFree) {
          set({
            plans: [
              {
                id: FREE_PLAN_ID,     // 🔥 FIX
                name: "FREE",
                description: "Default free plan",
                isActive: true,
                createdAt: Date.now(),
              },
              ...plans,
            ],
          });
        }
      },

      addPlan: ({ name, description }) =>
        set((state) => ({
          plans: [
            ...state.plans,
            {
              id: Date.now().toString(),
              name,
              description,
              isActive: true,
              createdAt: Date.now(),
            },
          ],
        })),

      updatePlan: (id, updates) =>
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deletePlan: (id) =>
        set((state) => ({
          plans:
            id === FREE_PLAN_ID
              ? state.plans
              : state.plans.filter((p) => p.id !== id),
        })),

      togglePlanStatus: (id) =>
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === FREE_PLAN_ID
              ? p
              : p.id === id
              ? { ...p, isActive: !p.isActive }
              : p
          ),
        })),

      getPlanById: (id) =>
        get().plans.find((p) => p.id === id),
    }),
    {
      name: "admin-plan-store",
      onRehydrateStorage: () => (state) => {
        state?.ensureFreePlan();
      },
    }
  )
);
