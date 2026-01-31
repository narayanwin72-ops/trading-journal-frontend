import { useState, useMemo } from "react";

/*
  This hook:
  - takes all option intraday trades
  - creates filter options automatically
  - applies filters
*/

export default function useOptionIntradayFilters(optionTrades) {

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

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
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
  };

  /* ================= FILTER OPTIONS FROM TRADES ================= */

  const OPTIONS = useMemo(() => {
    const unique = (key) =>
      [...new Set(optionTrades.map((t) => t[key]).filter(Boolean))];

    return {
      strategy: unique("strategy"),
      callPut: unique("optionType"),
      position: unique("position"),
      confidence: unique("confidence"),
      entryReason: unique("reason"),
      exitReason: unique("exitReason"),
      broker: unique("broker"),
      timeframe: unique("timeframe"),
      timeRange: unique("timeRange"),
      underlying: unique("underlying"),
      expiry: unique("expiry"),
      strike: unique("strike"),
    };
  }, [optionTrades]);

  /* ================= APPLY FILTERS ================= */

  const filteredTrades = useMemo(() => {
    return optionTrades.filter((t) => {
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
  }, [optionTrades, filters]);

  return {
    filters,
    OPTIONS,
    filteredTrades,
    setFilter,
    clearAllFilters,
  };
}
