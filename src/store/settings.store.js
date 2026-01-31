import { create } from "zustand";
import { loadSettings, saveSettings } from "../utils/settingsStorage";

/* =====================================================
   SETTINGS STORE (USER-WISE + SAFE)
===================================================== */

const defaultState = {
  brokers: [],
  strategies: [],
  entryReasons: [],
  exitReasons: [],
  confidenceLevels: [],
};

export const useSettings = create((set, get) => ({
  ...defaultState,

  /* ================= INIT / LOAD ================= */
  refreshForUser: () => {
    const data = loadSettings() || {};

    set({
      brokers: Array.isArray(data.brokers) ? data.brokers : [],
      strategies: Array.isArray(data.strategies)
        ? data.strategies
        : [],
      entryReasons: Array.isArray(data.entryReasons)
        ? data.entryReasons
        : [],
      exitReasons: Array.isArray(data.exitReasons)
        ? data.exitReasons
        : [],
      confidenceLevels: Array.isArray(
        data.confidenceLevels
      )
        ? data.confidenceLevels
        : [],
    });
  },

  /* ================= SAFETY NET ================= */
  ensureLoaded: () => {
    const s = get();

    const empty =
      s.brokers.length === 0 &&
      s.strategies.length === 0 &&
      s.entryReasons.length === 0 &&
      s.exitReasons.length === 0 &&
      s.confidenceLevels.length === 0;

    if (empty) {
      get().refreshForUser();
    }
  },

  /* ================= GENERIC ADD ================= */
  addItem: (key, value) => {
    const current = get()[key];
    if (!Array.isArray(current)) return;
    if (!value || current.includes(value)) return;

    const updated = [...current, value];

    const newState = {
      ...get(),
      [key]: updated,
    };

    set({ [key]: updated });
    saveSettings(newState);
  },

  /* ================= GENERIC REMOVE ================= */
  removeItem: (key, value) => {
    const current = get()[key];
    if (!Array.isArray(current)) return;

    const updated = current.filter(
      (v) => v !== value
    );

    const newState = {
      ...get(),
      [key]: updated,
    };

    set({ [key]: updated });
    saveSettings(newState);
  },
}));
