import { useSymbolStore } from "../store/symbol.store";
import { useUserSymbolStore } from "../store/userSymbol.store";

/*
  Merge Admin + User symbols safely
  - Segment wise
  - ACTIVE admin symbols only
  - Trim extra spaces
  - Remove duplicates
*/

export function getTradeSymbols(segment) {
  const admin =
    useSymbolStore.getState().symbols?.[segment] || [];

  const user =
    useUserSymbolStore.getState().symbols?.[segment] || [];

  const map = new Map();

  /* ADMIN SYMBOLS */
  admin.forEach((s) => {
    if (s.status !== "ACTIVE") return;

    const clean = s.name.trim().toUpperCase();

    if (!map.has(clean)) {
      map.set(clean, clean);
    }
  });

  /* USER SYMBOLS */
  user.forEach((s) => {
    const clean = s.name.trim().toUpperCase();

    if (!map.has(clean)) {
      map.set(clean, clean);
    }
  });

  return Array.from(map.values());
}
