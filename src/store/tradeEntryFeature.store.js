import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
  Trade Entry Feature Store (FINAL – PLAN ID BASED, BULLET-PROOF)
  ------------------------------------------------------------
  ✔ Plan ID based
  ✔ Tab + Field level control
  ✔ Auto-create feature
  ✔ Persist safe
  ✔ ❌ No more toUpperCase crashes
*/

export const useTradeEntryFeatureStore = create(
  persist(
    (set, get) => ({
      /* ================= FEATURES ================= */
      features: [
        /* =====================================================
           OPTION INTRADAY
        ===================================================== */

        /* ===== TAB ===== */
        { featureId: "OPTION_INTRADAY_TAB", allowedPlans: [] },

        /* ===== BASIC ===== */
        { featureId: "OPTIONS_DATE", allowedPlans: [] },
        { featureId: "OPTIONS_TIME", allowedPlans: [] },
        { featureId: "OPTIONS_TIMERANGE", allowedPlans: [] },
        { featureId: "OPTIONS_UNDERLYING", allowedPlans: [] },
        { featureId: "OPTIONS_EXPIRY", allowedPlans: [] },

        /* ===== STRUCTURE ===== */
        { featureId: "OPTIONS_STRIKE", allowedPlans: [] },
        { featureId: "OPTIONS_OPTIONTYPE", allowedPlans: [] },
        { featureId: "OPTIONS_POSITION", allowedPlans: [] },

        /* ===== PRICE & RISK ===== */
        { featureId: "OPTIONS_ENTRY", allowedPlans: [] },
        { featureId: "OPTIONS_SL", allowedPlans: [] },
        { featureId: "OPTIONS_TARGET", allowedPlans: [] },
        { featureId: "OPTIONS_QTY", allowedPlans: [] },

        /* ===== STRATEGY ===== */
        { featureId: "OPTIONS_STRATEGY", allowedPlans: [] },
        { featureId: "OPTIONS_TIMEFRAME", allowedPlans: [] },
        { featureId: "OPTIONS_REASON", allowedPlans: [] },
        { featureId: "OPTIONS_CONFIDENCE", allowedPlans: [] },

        /* ===== EXIT ===== */
        { featureId: "OPTIONS_EXITPRICE", allowedPlans: [] },
        { featureId: "OPTIONS_EXITTIME", allowedPlans: [] },
        { featureId: "OPTIONS_EXITREASON", allowedPlans: [] },
        { featureId: "OPTIONS_CHARGES", allowedPlans: [] },

        /* ===== MISC ===== */
        { featureId: "OPTIONS_REMARKS", allowedPlans: [] },
        { featureId: "OPTIONS_CHARTIMAGE", allowedPlans: [] },
        { featureId: "OPTIONS_BROKER", allowedPlans: [] },
        { featureId: "OPTIONS_CAPITAL", allowedPlans: [] },

        /* =====================================================
           EQUITY INTRADAY
        ===================================================== */

        /* ===== TAB ===== */
        { featureId: "EQUITY_INTRADAY_TAB", allowedPlans: [] },

        /* ===== BASIC ===== */
        { featureId: "EQUITY_DATE", allowedPlans: [] },
        { featureId: "EQUITY_TIME", allowedPlans: [] },
        { featureId: "EQUITY_TIMERANGE", allowedPlans: [] },
        { featureId: "EQUITY_SYMBOL", allowedPlans: [] },

        /* ===== TRADE SETUP ===== */
        { featureId: "EQUITY_POSITION", allowedPlans: [] },
        { featureId: "EQUITY_ENTRY", allowedPlans: [] },
        { featureId: "EQUITY_SL", allowedPlans: [] },
        { featureId: "EQUITY_TARGET", allowedPlans: [] },
        { featureId: "EQUITY_QTY", allowedPlans: [] },

        /* ===== STRATEGY ===== */
        { featureId: "EQUITY_STRATEGY", allowedPlans: [] },
        { featureId: "EQUITY_TIMEFRAME", allowedPlans: [] },
        { featureId: "EQUITY_REASON", allowedPlans: [] },
        { featureId: "EQUITY_CONFIDENCE", allowedPlans: [] },

        /* ===== EXIT ===== */
        { featureId: "EQUITY_EXITPRICE", allowedPlans: [] },
        { featureId: "EQUITY_EXITTIME", allowedPlans: [] },
        { featureId: "EQUITY_EXITREASON", allowedPlans: [] },
        { featureId: "EQUITY_CHARGES", allowedPlans: [] },

        /* ===== MISC ===== */
        { featureId: "EQUITY_REMARKS", allowedPlans: [] },
        { featureId: "EQUITY_CHARTIMAGE", allowedPlans: [] },
        { featureId: "EQUITY_BROKER", allowedPlans: [] },
        { featureId: "EQUITY_CAPITAL", allowedPlans: [] },
      ],

      /* ================= ADMIN ACTION ================= */
      updateAllowedPlans: (featureId, planIds) =>
        set((state) => {
          if (!featureId || typeof featureId !== "string") {
            console.warn(
              "⚠️ updateAllowedPlans skipped. Invalid featureId:",
              featureId
            );
            return state;
          }

          const fid = featureId.toUpperCase();

          const exists = state.features.find(
            (f) => f.featureId === fid
          );

          // Auto-create feature if missing
          if (!exists) {
            return {
              features: [
                ...state.features,
                {
                  featureId: fid,
                  allowedPlans: planIds,
                },
              ],
            };
          }

          // Update existing feature
          return {
            features: state.features.map((f) =>
              f.featureId === fid
                ? { ...f, allowedPlans: planIds }
                : f
            ),
          };
        }),

      /* ================= ADMIN HARD RESET ================= */
      resetFeatures: (freshFeatures) =>
        set({
          features: freshFeatures
            .filter(
              (f) =>
                f?.featureId &&
                typeof f.featureId === "string"
            )
            .map((f) => ({
              ...f,
              featureId: f.featureId.toUpperCase(),
            })),
        }),

      /* ================= USER SIDE CHECK ================= */
      canUse: (featureId, planId) => {
        if (
          !planId ||
          !featureId ||
          typeof featureId !== "string"
        )
          return false;

        const fid = featureId.toUpperCase();

        const feature = get().features.find(
          (f) => f.featureId === fid
        );

        if (!feature) return false;

        return feature.allowedPlans.includes(planId);
      },
    }),
    {
      name: "trade-entry-feature-store",
    }
  )
);
