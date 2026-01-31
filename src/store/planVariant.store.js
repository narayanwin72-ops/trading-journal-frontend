import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
  Plan Variant Structure:
  {
    id: string
    planId: string
    name: string                // basic_monthly
    durationDays: number
    price: number
    paymentLink?: string
    isActive: boolean
    createdAt: number
  }
*/

export const usePlanVariantStore = create(
  persist(
    (set, get) => ({
      variants: [],

      // ➕ Add variant
      addVariant: ({
        planId,
        name,
        durationDays,
        price,
        paymentLink,
      }) =>
        set((state) => ({
          variants: [
            ...state.variants,
            {
              id: Date.now().toString(),
              planId,
              name,
              durationDays,
              price,
              paymentLink,
              isActive: true,
              createdAt: Date.now(),
            },
          ],
        })),

      // ✏️ Update variant
      updateVariant: (id, updates) =>
        set((state) => ({
          variants: state.variants.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          ),
        })),

      // ❌ Delete variant
      deleteVariant: (id) =>
        set((state) => ({
          variants: state.variants.filter((v) => v.id !== id),
        })),

      // 🔁 Toggle Active / Inactive
      toggleVariantStatus: (id) =>
        set((state) => ({
          variants: state.variants.map((v) =>
            v.id === id
              ? { ...v, isActive: !v.isActive }
              : v
          ),
        })),

      // 🔍 Get variants by plan
      getVariantsByPlan: (planId) =>
        get().variants.filter((v) => v.planId === planId),
    }),
    {
      name: "admin-plan-variant-store", // localStorage key
    }
  )
);
