import { create } from "zustand";

/* 🔑 SINGLE SOURCE OF TRUTH */
function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("auth_user"));
    return user?.user_id || user?.id || null;
  } catch {
    return null;
  }
}

const storageKey = () => {
  const uid = getUserId();
  return uid ? `USER_SYMBOLS_${uid}` : null;
};

export const useUserSymbolStore = create((set, get) => ({
  symbols: {
    OPTIONS: [],
    EQUITY: [],
    FUTURES: [],
  },

  /* ================= LOAD ================= */
  loadUserSymbols: () => {
    const key = storageKey();
    if (!key) return;

    const data = JSON.parse(localStorage.getItem(key)) || {
      OPTIONS: [],
      EQUITY: [],
      FUTURES: [],
    };

    set({ symbols: data });
  },

  /* ================= SAVE ================= */
  save: (data) => {
    const key = storageKey();
    if (!key) return;

    localStorage.setItem(key, JSON.stringify(data));
    set({ symbols: data });
  },

  /* ================= ADD ================= */
  addSymbol: (segment, name) => {
    const clean = name.trim().toUpperCase();
    if (!clean) return false;

    const data = { ...get().symbols };

    const exists = data[segment].some(
      (s) => s.name === clean
    );
    if (exists) return false;

    data[segment].push({
      id: Date.now(),
      name: clean,
    });

    get().save(data);
    return true;
  },

  /* ================= DELETE ================= */
  deleteSymbol: (segment, id) => {
    const data = { ...get().symbols };
    data[segment] = data[segment].filter((s) => s.id !== id);
    get().save(data);
  },
}));
