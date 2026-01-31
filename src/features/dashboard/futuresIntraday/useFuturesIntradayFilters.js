import { useState, useMemo } from "react";

/* =====================================================
   FUTURES INTRADAY FILTER LOGIC
===================================================== */

export default function useFuturesIntradayFilters(trades = []) {

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    symbol: [],
    position: [],
    strategy: [],
    timeframe: [],
    timeRange: [],
    confidence: [],
    entryReason: [],
    exitReason: [],
    broker: [],
  });

  /* ================= SET FILTER ================= */
  function setFilter(key, value) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /* ================= CLEAR ALL ================= */
  function clearAllFilters() {
    setFilters({
      from: "",
      to: "",
      symbol: [],
      position: [],
      strategy: [],
      timeframe: [],
      timeRange: [],
      confidence: [],
      entryReason: [],
      exitReason: [],
      broker: [],
    });
  }

  /* ================= OPTIONS (FROM TRADE LOG) ================= */
  const OPTIONS = useMemo(() => {
    const unique = (key) =>
      [...new Set(trades.map((t) => t[key]).filter(Boolean))];

    return {
      symbol: unique("symbol"),
      position: unique("position"),
      strategy: unique("strategy"),
      timeframe: unique("timeframe"),
      timeRange: unique("timeRange"),
      confidence: unique("confidence"),
      entryReason: unique("reason"),
      exitReason: unique("exitReason"),
      broker: unique("broker"),
    };
  }, [trades]);

  /* ================= APPLY FILTER ================= */
  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {

      if (filters.from && new Date(t.date) < new Date(filters.from)) return false;
      if (filters.to && new Date(t.date) > new Date(filters.to)) return false;

      if (filters.symbol.length && !filters.symbol.includes(t.symbol)) return false;
      if (filters.position.length && !filters.position.includes(t.position)) return false;
      if (filters.strategy.length && !filters.strategy.includes(t.strategy)) return false;
      if (filters.timeframe.length && !filters.timeframe.includes(t.timeframe)) return false;
      if (filters.timeRange.length && !filters.timeRange.includes(t.timeRange)) return false;
      if (filters.confidence.length && !filters.confidence.includes(t.confidence)) return false;
      if (filters.entryReason.length && !filters.entryReason.includes(t.reason)) return false;
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
