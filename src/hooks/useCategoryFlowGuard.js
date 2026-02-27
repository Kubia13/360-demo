import { useEffect } from "react";

/* ================= CATEGORY FLOW GUARD ================= */

export function useCategoryFlowGuard({
  step,
  currentCategoryIndex,
  categories,
  setCurrentCategoryIndex
}) {

  useEffect(() => {

    if (step !== "category") return;

    if (currentCategoryIndex >= categories.length) {
      setCurrentCategoryIndex(0);
    }

  }, [
    step,
    currentCategoryIndex,
    categories,
    setCurrentCategoryIndex
  ]);

}