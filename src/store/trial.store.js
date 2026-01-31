import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
  TRIAL MASTER CONFIG (GLOBAL)

  trial = {
    enabled: boolean
    durationDays: number
    trialPlanId: string | null   // 🔥 LINKED TO PLAN MASTER
    autoDowngradeToFree: boolean
    updatedAt: number
  }
*/

export const useTrialStore = create(
  persist(
    (set, get) => ({
      trial: {
        enabled: true,
        durationDays: 7,          // 1 / 3 / 7 / 15 / custom
        trialPlanId: null,        // planId from admin Plans
        autoDowngradeToFree: true,
        updatedAt: Date.now(),
      },

      /* 🔄 UPDATE FULL TRIAL CONFIG */
      updateTrialConfig: (updates) =>
        set((state) => ({
          trial: {
            ...state.trial,
            ...updates,
            updatedAt: Date.now(),
          },
        })),

      /* 🔁 ENABLE / DISABLE TRIAL */
      toggleTrial: (enabled) =>
        set((state) => ({
          trial: {
            ...state.trial,
            enabled,
            updatedAt: Date.now(),
          },
        })),

      /* ⏱️ SET TRIAL DURATION */
      setTrialDuration: (days) =>
        set((state) => ({
          trial: {
            ...state.trial,
            durationDays: Number(days),
            updatedAt: Date.now(),
          },
        })),

      /* 🎯 SET TRIAL PLAN (FROM PLAN MASTER) */
      setTrialPlan: (planId) =>
        set((state) => ({
          trial: {
            ...state.trial,
            trialPlanId: planId,
            updatedAt: Date.now(),
          },
        })),

      /* 🔍 HELPER: GET TRIAL EXPIRY DATE */
      getTrialExpiryDate: (startDate) => {
        const { durationDays } = get().trial;
        return startDate + durationDays * 24 * 60 * 60 * 1000;
      },
    }),
    {
      name: "trial-master-store",
    }
  )
);
