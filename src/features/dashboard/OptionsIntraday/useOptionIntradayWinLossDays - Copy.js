import { useMemo } from "react";

/* =====================================================
   WIN / LOSS DAY KPI CALCULATION
===================================================== */

export default function useOptionIntradayWinLossDays(trades) {
  return useMemo(() => {
    const dayMap = {};

    /* ===== GROUP TRADES BY DATE ===== */
    trades.forEach((t) => {
      if (!t.date) return;

      const e = Number(t.entry);
      const x = Number(t.exitPrice);
      const q = Number(t.qty || 1);
      if (!e || !x) return;

      const pnl =
        t.position === "LONG" ? (x - e) * q : (e - x) * q;

      if (!dayMap[t.date]) {
        dayMap[t.date] = { pnl: 0, trades: 0 };
      }

      dayMap[t.date].pnl += pnl;
      dayMap[t.date].trades += 1;
    });

    /* ===== DAY LEVEL ANALYSIS ===== */
    let winDays = 0;
    let lossDays = 0;

    let winDayPnls = [];
    let lossDayPnls = [];

    let maxWinDay = 0;
    let maxLossDay = 0;

    let consecutiveWinDays = 0;
    let consecutiveLossDays = 0;

    let tempWin = 0;
    let tempLoss = 0;

    Object.values(dayMap).forEach((d) => {
      if (d.pnl > 0) {
        winDays++;
        winDayPnls.push(d.pnl);
        maxWinDay = Math.max(maxWinDay, d.pnl);

        tempWin++;
        tempLoss = 0;
      } else if (d.pnl < 0) {
        lossDays++;
        lossDayPnls.push(Math.abs(d.pnl));
        maxLossDay = Math.max(maxLossDay, Math.abs(d.pnl));

        tempLoss++;
        tempWin = 0;
      }

      consecutiveWinDays = Math.max(consecutiveWinDays, tempWin);
      consecutiveLossDays = Math.max(consecutiveLossDays, tempLoss);
    });

    return {
      winDays,
      lossDays,

      avgWinDay: winDayPnls.length
        ? (winDayPnls.reduce((a, b) => a + b, 0) / winDayPnls.length).toFixed(0)
        : 0,

      avgLossDay: lossDayPnls.length
        ? (lossDayPnls.reduce((a, b) => a + b, 0) / lossDayPnls.length).toFixed(0)
        : 0,

      maxWinDay: maxWinDay.toFixed(0),
      maxLossDay: maxLossDay.toFixed(0),

      consecutiveWinDays,
      consecutiveLossDays,
    };
  }, [trades]);
}
