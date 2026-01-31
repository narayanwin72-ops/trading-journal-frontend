import { useMemo } from "react";

/* =====================================================
   ROBUST WIN / LOSS DAY + TRADE ANALYSIS
   (RANDOM DATE ENTRY SAFE)
===================================================== */

export default function useOptionIntradayWinLossDays(trades) {
  return useMemo(() => {
    if (!Array.isArray(trades) || trades.length === 0) {
      return {
        winDays: 0,
        lossDays: 0,
        avgWinDay: 0,
        avgLossDay: 0,
        maxWinDay: 0,
        maxLossDay: 0,
        consecutiveWinDays: 0,
        consecutiveLossDays: 0,
        consecutiveWinTrades: 0,
        consecutiveLossTrades: 0,
      };
    }

    /* =====================================================
       1️⃣ NORMALIZE TRADES (SAFE)
    ===================================================== */
    const normalized = trades
      .map((t) => {
        const dateStr = t.date || t.entryDate;
        const time = new Date(dateStr).getTime();

        const entry = Number(t.entry);
        const exit = Number(t.exitPrice);
        const qty = Number(t.qty || 1);

        if (!time || !entry || !exit) return null;

        const pnl =
          t.position === "SHORT"
            ? (entry - exit) * qty
            : (exit - entry) * qty;

        return {
          time,
          dateStr,
          pnl,
        };
      })
      .filter(Boolean);

    if (normalized.length === 0) {
      return {
        winDays: 0,
        lossDays: 0,
        avgWinDay: 0,
        avgLossDay: 0,
        maxWinDay: 0,
        maxLossDay: 0,
        consecutiveWinDays: 0,
        consecutiveLossDays: 0,
        consecutiveWinTrades: 0,
        consecutiveLossTrades: 0,
      };
    }

    /* =====================================================
       2️⃣ SORT BY DATE (IMPORTANT FIX)
    ===================================================== */
    normalized.sort((a, b) => a.time - b.time);

    /* =====================================================
       3️⃣ BUILD DAY-WISE PNL (ORDER PRESERVED)
    ===================================================== */
    const days = [];

    normalized.forEach((t) => {
      const last = days[days.length - 1];

      if (!last || last.dateStr !== t.dateStr) {
        days.push({
          dateStr: t.dateStr,
          pnl: t.pnl,
          trades: [t.pnl],
        });
      } else {
        last.pnl += t.pnl;
        last.trades.push(t.pnl);
      }
    });

    /* =====================================================
       4️⃣ DAY BASED CONSECUTIVE
    ===================================================== */
    let winDays = 0,
      lossDays = 0;

    let winDayArr = [],
      lossDayArr = [];

    let maxWinDay = 0,
      maxLossDay = 0;

    let consecutiveWinDays = 0,
      consecutiveLossDays = 0;

    let tmpWinDays = 0,
      tmpLossDays = 0;

    days.forEach((d) => {
      if (d.pnl > 0) {
        winDays++;
        winDayArr.push(d.pnl);
        maxWinDay = Math.max(maxWinDay, d.pnl);

        tmpWinDays++;
        tmpLossDays = 0;
      } else if (d.pnl < 0) {
        lossDays++;
        lossDayArr.push(Math.abs(d.pnl));
        maxLossDay = Math.max(maxLossDay, Math.abs(d.pnl));

        tmpLossDays++;
        tmpWinDays = 0;
      }

      consecutiveWinDays = Math.max(consecutiveWinDays, tmpWinDays);
      consecutiveLossDays = Math.max(consecutiveLossDays, tmpLossDays);
    });

    /* =====================================================
       5️⃣ TRADE BASED CONSECUTIVE (GLOBAL ORDER)
    ===================================================== */
    let consecutiveWinTrades = 0,
      consecutiveLossTrades = 0;

    let tmpWinTrades = 0,
      tmpLossTrades = 0;

    normalized.forEach((t) => {
      if (t.pnl > 0) {
        tmpWinTrades++;
        tmpLossTrades = 0;
      } else if (t.pnl < 0) {
        tmpLossTrades++;
        tmpWinTrades = 0;
      }

      consecutiveWinTrades = Math.max(
        consecutiveWinTrades,
        tmpWinTrades
      );
      consecutiveLossTrades = Math.max(
        consecutiveLossTrades,
        tmpLossTrades
      );
    });

    /* =====================================================
       6️⃣ RETURN FINAL (UI SAFE)
    ===================================================== */
    return {
      winDays,
      lossDays,

      avgWinDay: winDayArr.length
        ? (winDayArr.reduce((a, b) => a + b, 0) / winDayArr.length).toFixed(0)
        : 0,

      avgLossDay: lossDayArr.length
        ? (lossDayArr.reduce((a, b) => a + b, 0) / lossDayArr.length).toFixed(0)
        : 0,

      maxWinDay: maxWinDay.toFixed(0),
      maxLossDay: maxLossDay.toFixed(0),

      consecutiveWinDays,
      consecutiveLossDays,
      consecutiveWinTrades,
      consecutiveLossTrades,
    };
  }, [trades]);
}
