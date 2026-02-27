  /* ================= DYNAMISCHE KATEGORIEN ================= */

export function getDynamicCategories({
  CATEGORY_WEIGHTS,
  QUESTIONS,
  baseData
}) {

  return Object.keys(CATEGORY_WEIGHTS).filter((cat) => {

    const relevantQuestions = Object.keys(QUESTIONS).filter((id) => {
      const q = QUESTIONS[id];

      if (q.category !== cat) return false;
      if (q.condition && !q.condition(baseData)) return false;

      return true;
    });

    return relevantQuestions.length > 0;
  });

}