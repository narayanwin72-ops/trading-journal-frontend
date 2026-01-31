import { useMemo } from "react";

export default function useOptionIntradayKPIs(trades) {
  return useMemo(() => {
    if (!trades.length) {
      return {
        totalTrades: 0,
        totalPNL: 0,
        winTrades: 0,
        lossTrades: 0,
        winRate: 0,
        lossRate: 0,
        avgPNL: 0,
        avgWin: 0,
        avgLoss: 0,
        maxProfit: 0,
        maxLoss: 0,
        profitFactor: 0,
      };
    }

    let totalPNL = 0;
    let winTrades = 0;
    let lossTrades = 0;
    let totalWinAmount = 0;
    let totalLossAmount = 0;
    let maxProfit = -Infinity;
    let maxLoss = Infinity;

    trades.forEach((t) => {
      const pnl =
        (Number(t.exitPrice) - Number(t.entry)) *
        Number(t.qty) *
        (t.position === "SHORT" ? -1 : 1);

      totalPNL += pnl;

      if (pnl > 0) {
        winTrades++;
        totalWinAmount += pnl;
        maxProfit = Math.max(maxProfit, pnl);
      } else if (pnl < 0) {
        lossTrades++;
        totalLossAmount += Math.abs(pnl);
        maxLoss = Math.min(maxLoss, pnl);
      }
    });

    const totalTrades = trades.length;

    return {
      totalTrades,
      totalPNL,
      winTrades,
      lossTrades,
      winRate: ((winTrades / totalTrades) * 100).toFixed(1),
      lossRate: ((lossTrades / totalTrades) * 100).toFixed(1),
      avgPNL: (totalPNL / totalTrades).toFixed(2),
      avgWin: winTrades ? (totalWinAmount / winTrades).toFixed(2) : 0,
      avgLoss: lossTrades ? (totalLossAmount / lossTrades).toFixed(2) : 0,
      maxProfit,
      maxLoss,
      profitFactor: totalLossAmount
        ? (totalWinAmount / totalLossAmount).toFixed(2)
        : "∞",
    };
  }, [trades]);
}
