import { create } from "zustand";

/* ================= HELPERS ================= */

function getCurrentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("auth_user"));
    return user?.id || null; // ✅ FIXED
  } catch {
    return null;
  }
}

function getUserTradesKey() {
  const userId = getCurrentUserId();
  return userId ? `user_trades_${userId}` : null;
}

function loadTrades() {
  const key = getUserTradesKey();
  if (!key) return [];

  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}

function saveTrades(trades) {
  const key = getUserTradesKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(trades));
}

/* ================= STORE ================= */

export const useTrades = create((set, get) => ({
  trades: loadTrades(),

  editTradeId: null,
  editTradeType: null,

  addTrade: (trade) => {
    const updated = [
      {
        ...trade,
        id: Date.now().toString(),
        createdAt: Date.now(),
      },
      ...get().trades,
    ];

    saveTrades(updated);
    set({ trades: updated });
  },

  updateTrade: (id, updatedTrade) => {
    const updated = get().trades.map((t) =>
      t.id === id ? { ...t, ...updatedTrade } : t
    );

    saveTrades(updated);
    set({ trades: updated });
  },

  deleteTrade: (id) => {
    const updated = get().trades.filter((t) => t.id !== id);
    saveTrades(updated);
    set({ trades: updated });
  },

  setEditTradeId: (id, tradeType) =>
    set({ editTradeId: id, editTradeType: tradeType }),

  clearEditTradeId: () =>
    set({ editTradeId: null, editTradeType: null }),

  refreshTradesForUser: () => {
    set({ trades: loadTrades() });
  },
}));
