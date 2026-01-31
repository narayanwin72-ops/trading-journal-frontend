import { useState, useMemo } from "react";

/* =====================================================
   OPTIONS INTRADAY FILTER LOGIC
===================================================== */

export default function useOptionIntradayFilters(trades) {
  /* ================= FILTER STATE ================= */

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    strategy: [],
    callPut: [],
    position: [],
    confidence: [],
    entryReason: [],
    exitReason: [],
    broker: [],
    timeframe: [],
    timeRange: [],
    underlying: [],
    expiry: [],
    strike: [],
  });

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearAllFilters() {
    setFilters({
      from: "",
      to: "",
      strategy: [],
      callPut: [],
      position: [],
      confidence: [],
      entryReason: [],
      exitReason: [],
      broker: [],
      timeframe: [],
      timeRange: [],
      underlying: [],
      expiry: [],
      strike: [],
    });
  }

  /* ================= FILTER OPTIONS FROM DATA ================= */

  const OPTIONS = useMemo(() => {
    const uniq = (key) =>
      [...new Set(trades.map((t) => t[key]).filter(Boolean))];

    return {
      strategy: uniq("strategy"),
      callPut: uniq("optionType"),
      position: uniq("position"),
      confidence: uniq("confidence"),
      entryReason: uniq("reason"),
      exitReason: uniq("exitReason"),
      broker: uniq("broker"),
      timeframe: uniq("timeframe"),
      timeRange: uniq("timeRange"),
      underlying: uniq("underlying"),
      expiry: uniq("expiry"),
      strike: uniq("strike"),
    };
  }, [trades]);

  /* ================= APPLY FILTERS ================= */

  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      const d = new Date(t.date);

      if (filters.from && d < new Date(filters.from)) return false;
      if (filters.to && d > new Date(filters.to)) return false;

      const match = (key, arr) =>
        arr.length === 0 || arr.includes(t[key]);

      return (
        match("strategy", filters.strategy) &&
        match("optionType", filters.callPut) &&
        match("position", filters.position) &&
        match("confidence", filters.confidence) &&
        match("reason", filters.entryReason) &&
        match("exitReason", filters.exitReason) &&
        match("broker", filters.broker) &&
        match("timeframe", filters.timeframe) &&
        match("timeRange", filters.timeRange) &&
        match("underlying", filters.underlying) &&
        match("expiry", filters.expiry) &&
        match("strike", filters.strike)
      );
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
