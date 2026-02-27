  /* ===== BU RECHNER VORBELEGUNG ===== */

import { useEffect } from "react";

export function useBuIncomeAutoSync(gehalt, setBuIncome) {
  useEffect(() => {
    if (gehalt) {
      setBuIncome(String(gehalt));
    } else {
      setBuIncome("");
    }
  }, [gehalt, setBuIncome]);
}