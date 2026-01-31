import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useDashboardFeatureStore = create(
  persist(
    (set, get) => ({
      features: [],

      /* ================= ADMIN ================= */

      // auto create if missing
      registerFeature: (featureId) =>
        set((state) => {
          if (
            state.features.some(
              (f) => f.featureId === featureId
            )
          )
            return state;

          return {
            features: [
              ...state.features,
              {
                featureId,
                allowedPlans: [],
              },
            ],
          };
        }),

      updateAllowedPlans: (featureId, planIds) =>
        set((state) => ({
          features: state.features.map((f) =>
            f.featureId === featureId
              ? { ...f, allowedPlans: planIds }
              : f
          ),
        })),

      /* ================= USER ================= */

      canUse: (featureId, planId) => {
        if (!featureId || !planId) return false;

        const feature = get().features.find(
          (f) => f.featureId === featureId
        );

        if (!feature) return false;

        return feature.allowedPlans.includes(planId);
      },
    }),
    {
      name: "dashboard-feature-store",
    }
  )
);
