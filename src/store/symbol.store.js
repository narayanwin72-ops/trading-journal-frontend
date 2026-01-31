import { create } from "zustand";

const STORAGE_KEY = "ADMIN_SYMBOLS";

const defaultData = {
  OPTIONS: [],
  EQUITY: [],
  FUTURES: [],
};

export const useSymbolStore = create((set, get) => ({
  symbols: JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData,

  save: (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    set({ symbols: data });
  },

  addSymbol: (segment, name) => {
    const data = { ...get().symbols };

    const exists = data[segment].some(
      (s) => s.name.toUpperCase() === name.toUpperCase()
    );
    if (exists) return false;

    data[segment].push({
      id: Date.now(),
      name: name.toUpperCase(),
      status: "ACTIVE",
    });

    get().save(data);
    return true;
  },

  toggleStatus: (segment, id) => {
    const data = { ...get().symbols };
    data[segment] = data[segment].map((s) =>
      s.id === id
        ? { ...s, status: s.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
        : s
    );
    get().save(data);
  },

  bulkAdd: (segment, names) => {
    const data = { ...get().symbols };

    names.forEach((n) => {
      const exists = data[segment].some(
        (s) => s.name === n.toUpperCase()
      );
      if (!exists) {
        data[segment].push({
          id: Date.now() + Math.random(),
          name: n.toUpperCase(),
          status: "ACTIVE",
        });
      }
    });

    get().save(data);
  },
}));
