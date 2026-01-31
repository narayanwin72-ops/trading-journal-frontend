import { useMemo, useState } from "react";

/* =====================================================
   OPTIONS POSITIONAL – FILTER LOGIC
===================================================== */

export default function useOptionsPositionalFilters(trades) {

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    underlying: [],
    expiry: [],
    strike: [],
    optionType: [],
    position: [],
    strategy: [],
    timeframe: [],
    entryReason: [],   // ✅ ENTRY REASON
    confidence: [],
    exitReason: [],
    broker: [],
  });

  /* ================= SET / CLEAR ================= */
  function setFilter(key, value) {
    setFilters((p) => ({ ...p, [key]: value }));
  }

  function clearAllFilters() {
    setFilters({
      from: "",
      to: "",
      underlying: [],
      expiry: [],
      strike: [],
      optionType: [],
      position: [],
      strategy: [],
      timeframe: [],
      entryReason: [],
      confidence: [],
      exitReason: [],
      broker: [],
    });
  }

  /* ================= OPTIONS FROM TRADE LOG ================= */
  const OPTIONS = useMemo(() => {
    const getUnique = (key) =>
      [...new Set(trades.map((t) => t[key]).filter(Boolean))];

    return {
      underlying: getUnique("underlying"),
      expiry: getUnique("expiry"),
      strike: getUnique("strike"),
      optionType: getUnique("optionType"),
      position: getUnique("position"),
      strategy: getUnique("strategy"),
      timeframe: getUnique("timeframe"),
      entryReason: getUnique("reason"),     // ✅ IMPORTANT
      confidence: getUnique("confidence"),
      exitReason: getUnique("exitReason"),
      broker: getUnique("broker"),
    };
  }, [trades]);

  /* ================= FILTERED TRADES ================= */
  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      const d = new Date(t.entryDate || t.date);

      if (filters.from && d < new Date(filters.from)) return false;
      if (filters.to && d > new Date(filters.to)) return false;

      if (filters.underlying.length && !filters.underlying.includes(t.underlying)) return false;
      if (filters.expiry.length && !filters.expiry.includes(t.expiry)) return false;
      if (filters.strike.length && !filters.strike.includes(t.strike)) return false;
      if (filters.optionType.length && !filters.optionType.includes(t.optionType)) return false;
      if (filters.position.length && !filters.position.includes(t.position)) return false;
      if (filters.strategy.length && !filters.strategy.includes(t.strategy)) return false;
      if (filters.timeframe.length && !filters.timeframe.includes(t.timeframe)) return false;
      if (filters.entryReason.length && !filters.entryReason.includes(t.reason)) return false; // ✅
      if (filters.confidence.length && !filters.confidence.includes(t.confidence)) return false;
      if (filters.exitReason.length && !filters.exitReason.includes(t.exitReason)) return false;
      if (filters.broker.length && !filters.broker.includes(t.broker)) return false;

      return true;
    });
  }, [trades, filters]);

  return {
    filters,
    setFilter,
    clearAllFilters,
    OPTIONS,
    filteredTrades,
  };
}
