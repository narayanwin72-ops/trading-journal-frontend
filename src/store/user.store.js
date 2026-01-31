import { create } from "zustand";

/*
  TEMP USER ID
  (later login system এ backend থেকে আসবে)
*/
const USER_ID = "user_1";

/* helper */
const key = (name) => `${name}_${USER_ID}`;

const load = (name, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key(name))) || fallback;
  } catch {
    return fallback;
  }
};

export const useSettings = create((set) => ({
  brokers: load("brokers", []),
  strategies: load("strategies", []),
  entryReasons: load("entryReasons", []),
  exitReasons: load("exitReasons", []),
  confidenceLevels: load("confidenceLevels", ["1","2","3","4","5"]),

  addItem: (listName, value) =>
    set((state) => {
      const updated = [...state[listName], value];
      localStorage.setItem(key(listName), JSON.stringify(updated));
      return { [listName]: updated };
    }),

  removeItem: (listName, value) =>
    set((state) => {
      const updated = state[listName].filter((v) => v !== value);
      localStorage.setItem(key(listName), JSON.stringify(updated));
      return { [listName]: updated };
    }),
}));
