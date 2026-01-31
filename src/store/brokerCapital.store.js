import { create } from "zustand";
import {
  loadBrokerCapital,
  saveBrokerCapital,
} from "../utils/brokerCapitalStorage";

/* =====================================================
   BROKER CAPITAL STORE (USER-WISE + AUTO LOAD)
   -----------------------------------------------------
   ✔ Each user has isolated broker capital
   ✔ Data survives refresh
   ✔ No data mixing between users
===================================================== */

export const useBrokerCapital = create((set, get) => ({
  /* ================= STATE ================= */
  transactions: [],

  /* ================= INIT / REFRESH ================= */
  refreshForUser: () => {
    const data = loadBrokerCapital();

    set({
      transactions: Array.isArray(data) ? data : [],
    });
  },

  /* ================= ADD ================= */
  addTransaction: (tx) => {
    const current = get().transactions;

    const finalTx = {
      id: Date.now(),
      createdAt: new Date().toLocaleString(),
      ...tx,
    };

    const updated = [finalTx, ...current];

    set({ transactions: updated });
    saveBrokerCapital(updated);
  },

  /* ================= UPDATE ================= */
  updateTransaction: (id, updatedTx) => {
    const transactions = get().transactions.map((t) =>
      t.id === id ? { ...t, ...updatedTx } : t
    );

    set({ transactions });
    saveBrokerCapital(transactions);
  },

  /* ================= DELETE ================= */
  deleteTransaction: (id) => {
    const transactions = get().transactions.filter(
      (t) => t.id !== id
    );

    set({ transactions });
    saveBrokerCapital(transactions);
  },

  /* ================= CLEAR (OPTIONAL / FUTURE) ================= */
  clearAll: () => {
    set({ transactions: [] });
    saveBrokerCapital([]);
  },
}));

/* 🔥 AUTO LOAD ON STORE INIT (CRITICAL FIX) */
useBrokerCapital.getState().refreshForUser();
