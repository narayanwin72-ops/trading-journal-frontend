import { useMemo, useState } from "react";

/* =====================================================
   SWING – FILTER LOGIC (SAFE & FINAL)
===================================================== */

export default function useSwingFilters(inputTrades) {
  /* ================= SAFETY ================= */
  const trades = Array.isArray(inputTrades) ? inputTrades : [];

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    symbol: [],
    position: [],
    strategy: [],
    timeframe: [],
    reason: [],
    exitReason: [],        // ✅ ADDED
    confidence: [],
    broker: [],
  });

  /* ================= OPTIONS (FROM TRADE LOG ONLY) ================= */
  const OPTIONS = useMemo(() => {
    const uniq = (key) =>
      Array.from(
        new Set(
          trades
            .map((t) => t?.[key])
            .filter((v) => v !== undefined && v !== null && v !== "")
        )
      );

    return {
      symbols: uniq("symbol").length
        ? uniq("symbol")
        : uniq("stock"), // safety for stock/symbol
      positions: uniq("position"),
      strategies: uniq("strategy"),
      timeframes: uniq("timeframe"),
      reasons: uniq("reason"),
      exitReasons: uniq("exitReason"),   // ✅ ADDED
      confidences: uniq("confidence"),
      brokers: uniq("broker"),
    };
  }, [trades]);

  /* ================= FILTERED TRADES ================= */
  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      if (!t) return false;

      const tradeDate =
        t.entryDate || t.date || t.tradeDate || null;

      if (filters.fromDate && tradeDate) {
        if (new Date(tradeDate) < new Date(filters.fromDate)) return false;
      }

      if (filters.toDate && tradeDate) {
        if (new Date(tradeDate) > new Date(filters.toDate)) return false;
      }

      if (
        filters.symbol.length &&
        !filters.symbol.includes(t.symbol || t.stock)
      )
        return false;

      if (
        filters.position.length &&
        !filters.position.includes(t.position)
      )
        return false;

      if (
        filters.strategy.length &&
        !filters.strategy.includes(t.strategy)
      )
        return false;

      if (
        filters.timeframe.length &&
        !filters.timeframe.includes(t.timeframe)
      )
        return false;

      if (
        filters.reason.length &&
        !filters.reason.includes(t.reason)
      )
        return false;

      if (
        filters.exitReason.length &&                 // ✅ ADDED
        !filters.exitReason.includes(t.exitReason)
      )
        return false;

      if (
        filters.confidence.length &&
        !filters.confidence.includes(t.confidence)
      )
        return false;

      if (
        filters.broker.length &&
        !filters.broker.includes(t.broker)
      )
        return false;

      return true;
    });
  }, [trades, filters]);

  /* ================= HELPERS ================= */
  const setFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () =>
    setFilters({
      fromDate: "",
      toDate: "",
      symbol: [],
      position: [],
      strategy: [],
      timeframe: [],
      reason: [],
      exitReason: [],      // ✅ ADDED
      confidence: [],
      broker: [],
    });

  /* ================= EXPORT ================= */
  return {
    filters,
    setFilter,
    clearAllFilters,
    OPTIONS,
    filteredTrades,
  };
}
