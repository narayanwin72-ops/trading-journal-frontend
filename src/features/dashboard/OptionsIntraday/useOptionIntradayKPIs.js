import { useMemo } from "react";

/* =====================================================
   OPTIONS INTRADAY – OVERVIEW KPI CALCULATION
===================================================== */

export default function useOptionIntradayKPIs(trades) {
  const kpis = useMemo(() => {
    let totalTrades = 0;
    let wins = 0;
    let losses = 0;

    let grossProfit = 0;
    let grossLoss = 0;
    let netPNL = 0;

    let equity = 0;
    let peak = 0;
    let maxDrawdown = 0;

    trades.forEach((t) => {
      const entry = Number(t.entry);
      const exit = Number(t.exitPrice);
      const qty = Number(t.qty || 1);

      if (!entry || !exit) return;

      totalTrades++;

      const pnl =
        t.position === "LONG"
          ? (exit - entry) * qty
          : (entry - exit) * qty;

      netPNL += pnl;
      equity += pnl;

      peak = Math.max(peak, equity);
      maxDrawdown = Math.min(maxDrawdown, equity - peak);

      if (pnl > 0) {
        wins++;
        grossProfit += pnl;
      } else if (pnl < 0) {
        losses++;
        grossLoss += Math.abs(pnl);
      }
    });

    const winRate = totalTrades
      ? ((wins / totalTrades) * 100).toFixed(1)
      : 0;

    const lossRate = totalTrades
      ? ((losses / totalTrades) * 100).toFixed(1)
      : 0;

    const avgPNL = totalTrades
      ? (netPNL / totalTrades).toFixed(0)
      : 0;

    const profitFactor =
      grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : "-";

    /* Expectancy = (Win% × Avg Win) − (Loss% × Avg Loss) */
    const avgWin = wins ? grossProfit / wins : 0;
    const avgLoss = losses ? grossLoss / losses : 0;

    const expectancy =
      totalTrades > 0
        ? (
            (wins / totalTrades) * avgWin -
            (losses / totalTrades) * avgLoss
          ).toFixed(0)
        : 0;

    const maxDDPercent =
      peak > 0 ? ((Math.abs(maxDrawdown) / peak) * 100).toFixed(1) : 0;

    return {
      totalTrades,
      netPNL: netPNL.toFixed(0),
      winRate,
      lossRate,
      avgPNL,
      profitFactor,
      expectancy,
      maxDrawdown: maxDrawdown.toFixed(0),
      maxDDPercent,
    };
  }, [trades]);

  return kpis;
}
