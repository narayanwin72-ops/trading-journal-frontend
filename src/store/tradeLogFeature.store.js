import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
  TRADE LOG FEATURE STORE
  ======================
  ✔ Same pattern as Trade Entry Control
  ✔ Tab + Filter + Export control
*/

export const useTradeLogFeatureStore = create(
  persist(
    (set, get) => ({
      features: [
        /* ===== OPTIONS TAB ===== */
        { featureId: "TRADELOG_OPTIONS_TAB", allowedPlans: [] },

        /* ===== OPTIONS FILTERS ===== */
        { featureId: "TRADELOG_OPTIONS_DATE", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_SYMBOL", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_OPTIONTYPE", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_POSITION", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_EXPIRY", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_STRIKE", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_STRATEGY", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_ENTRYREASON", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_EXITREASON", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_CONFIDENCE", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_TIMEFRAME", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_BROKER", allowedPlans: [] },

        /* ===== EXPORT ===== */
        { featureId: "TRADELOG_OPTIONS_EXCEL", allowedPlans: [] },
        { featureId: "TRADELOG_OPTIONS_PDF", allowedPlans: [] },
      ],

      /* ===== ADMIN UPDATE ===== */
      updateAllowedPlans: (featureId, planIds) =>
        set((state) => {
          const fid = featureId.toUpperCase();
          const exists = state.features.find(
            (f) => f.featureId === fid
          );

          if (!exists) {
            return {
              features: [
                ...state.features,
                { featureId: fid, allowedPlans: planIds },
              ],
            };
          }

          return {
            features: state.features.map((f) =>
              f.featureId === fid
                ? { ...f, allowedPlans: planIds }
                : f
            ),
          };
        }),

      /* ===== USER CHECK ===== */
      canUse: (featureId, planId) => {
        if (!featureId || !planId) return false;
        const fid = featureId.toUpperCase();
        const feature = get().features.find(
          (f) => f.featureId === fid
        );
        if (!feature) return false;
        return feature.allowedPlans.includes(planId);
      },
    }),
    {
      name: "trade-log-feature-store",
    }
  )
);
