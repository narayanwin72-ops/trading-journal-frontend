import { useState, useMemo } from "react";

/* =====================================================
   EQUITY INTRADAY FILTERS (FIXED – TRADE LOG BASED)
===================================================== */

export default function useEquityIntradayFilters(trades = []) {

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    strategy: [],
    position: [],
    symbol: [],
    confidence: [],
    entryReason: [],
    exitReason: [],
    broker: [],
    timeframe: [],
    timeRange: [],
  });

  /* ================= SET FILTER ================= */
  function setFilter(key, value) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /* ================= CLEAR ================= */
  function clearAllFilters() {
    setFilters({
      from: "",
      to: "",
      strategy: [],
      position: [],
      symbol: [],
      confidence: [],
      entryReason: [],
      exitReason: [],
      broker: [],
      timeframe: [],
      timeRange: [],
    });
  }

  /* ================= OPTIONS FROM TRADE LOG ================= */
  const OPTIONS = useMemo(() => {
    const unique = (key) =>
      [...new Set(trades.map((t) => t[key]).filter(Boolean))];

    return {
      strategy: unique("strategy"),
      position: unique("position"),
      symbol: unique("symbol"),
      confidence: unique("confidence"),
      entryReason: unique("reason"),        // ✅ TRADE LOG FIELD
      exitReason: unique("exitReason"),     // ✅ TRADE LOG FIELD
      broker: unique("broker"),
      timeframe: unique("timeframe"),
      timeRange: unique("timeRange"),
    };
  }, [trades]);

  /* ================= APPLY FILTER ================= */
  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {

      /* DATE */
      if (filters.from && new Date(t.date) < new Date(filters.from)) return false;
      if (filters.to && new Date(t.date) > new Date(filters.to)) return false;

      /* MULTI SELECT */
      if (filters.strategy.length && !filters.strategy.includes(t.strategy)) return false;
      if (filters.position.length && !filters.position.includes(t.position)) return false;
      if (filters.symbol.length && !filters.symbol.includes(t.symbol)) return false;
      if (filters.confidence.length && !filters.confidence.includes(t.confidence)) return false;
      if (filters.entryReason.length && !filters.entryReason.includes(t.reason)) return false;
      if (filters.exitReason.length && !filters.exitReason.includes(t.exitReason)) return false;
      if (filters.broker.length && !filters.broker.includes(t.broker)) return false;
      if (filters.timeframe.length && !filters.timeframe.includes(t.timeframe)) return false;
      if (filters.timeRange.length && !filters.timeRange.includes(t.timeRange)) return false;

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
