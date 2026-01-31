import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
  USER LOG STRUCTURE (ADMIN SIDE + USER SIDE SOURCE)
  -------------------------------------------------
  ✔ Persistent
  ✔ ID safe
  ✔ Login safe
  ✔ Refresh safe
  ✔ Trial → FREE auto
  ✔ Paid expire → FREE auto
*/

export const useUserLogStore = create(
  persist(
    (set, get) => ({
      users: [],

      /* ================= USER CRUD ================= */

      addUser: (user) =>
        set((state) => {
          // 🔒 DUPLICATE PROTECTION
          if (state.users.some((u) => u.id === user.id)) {
            return state;
          }

          return {
            users: [
              ...state.users,
              {
                registrationDate: Date.now(),
                status: "ACTIVE",

                stats: {
                  totalTrades: 0,
                  netPnl: 0,
                },

                payments: [],
                extraFields: {},

                ...user, // 🔥 USER ID COMES FROM REGISTER
              },
            ],
          };
        }),

      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...updates } : u
          ),
        })),

      setUserStatus: (id, status) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, status } : u
          ),
        })),

      /* ================= PLAN CONTROL ================= */

      updateUserPlan: (id, planData) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? {
                  ...u,
                  plan: {
                    ...u.plan,
                    ...planData,
                  },
                }
              : u
          ),
        })),

      updateExpiry: (id, newExpiryDate) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? {
                  ...u,
                  plan: {
                    ...u.plan,
                    expiryDate: newExpiryDate,
                  },
                }
              : u
          ),
        })),

      /* ================= PAYMENT ================= */

      addPayment: (id, payment) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? {
                  ...u,
                  payments: [
                    ...u.payments,
                    {
                      id: Date.now().toString(),
                      date: Date.now(),
                      ...payment,
                    },
                  ],
                }
              : u
          ),
        })),

      /* ================= STATS ================= */

      updateUserStats: (id, stats) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? {
                  ...u,
                  stats: {
                    ...u.stats,
                    ...stats,
                  },
                }
              : u
          ),
        })),

      /* ================= HELPERS ================= */

      getActiveUsers: () =>
        get().users.filter((u) => u.status === "ACTIVE"),

      getBlockedUsers: () =>
        get().users.filter((u) => u.status === "BLOCKED"),

      getExpiredUsers: () =>
        get().users.filter(
          (u) =>
            u.plan &&
            u.plan.expiryDate &&
            u.plan.expiryDate < Date.now()
        ),

      /* ================= 🔑 USER SIDE PLAN (FINAL) ================= */

      /*
        SAAS FINAL RULES
        ----------------
        ✔ ACTIVE + valid plan → that plan
        ✔ ACTIVE + expired → FREE
        ✔ ACTIVE + no plan → FREE
        ✔ BLOCKED → null
      */

      getUserActivePlanId: (userId) => {
        const user = get().users.find((u) => u.id === userId);

        if (!user) return null;
        if (user.status !== "ACTIVE") return null;

        // ❌ no plan → FREE
        if (!user.plan || !user.plan.planId) {
          return "FREE";
        }

        // ❌ expired → FREE
        if (
          user.plan.expiryDate &&
          user.plan.expiryDate < Date.now()
        ) {
          return "FREE";
        }

        // ✅ valid
        return user.plan.planId;
      },
    }),
    {
      name: "admin-user-log-store", // 🔥 persistence key
    }
  )
);
