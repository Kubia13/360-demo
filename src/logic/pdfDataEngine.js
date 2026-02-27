/* ================= PDF DATA ENGINE ================= */

/* ===== AUTO BU BERECHNUNG ===== */

export function calculateAutoBU({ buIncome, baseData }) {
  if (buIncome) {
    return Math.round(Number(buIncome) * 0.8);
  }

  if (baseData?.gehalt) {
    return Math.round(Number(baseData.gehalt) * 0.8);
  }

  return "";
}

/* ===== FINAL BU MIT MANUELLER ÜBERSTEUERUNG ===== */

export function calculateFinalBU({
  pdfData,
  buIncome,
  baseData
}) {
  const manualValue = pdfData?.buEmpfehlung;

  if (manualValue && String(manualValue).trim() !== "") {
    return manualValue;
  }

  return calculateAutoBU({ buIncome, baseData });
}

/* ===== PDF VALIDIERUNG ===== */

export function validatePdfData(pdfData) {
  return (
    pdfData.adresse.trim() !== "" &&
    pdfData.email.trim() !== "" &&
    (
      pdfData.telefon.trim() !== "" ||
      pdfData.handy.trim() !== ""
    )
  );
}

/* ===== ANSWERS FÜR PDF GRUPPIEREN ===== */

export function groupAnswersForPdf({
  answers,
  QUESTIONS
}) {
  return Object.entries(answers || {}).reduce((acc, [key, value]) => {

    if (
      value === false ||
      value === null ||
      value === "" ||
      value === undefined
    ) return acc;

    let question = QUESTIONS[key];
    let category = null;
    let label = null;

    if (question) {
      category = question.category;
      label = question.label;
    } else {
      const mainKey = key.split("_")[0];
      const mainQuestion = QUESTIONS[mainKey];

      if (!mainQuestion) return acc;

      category = mainQuestion.category;
      label = key.replace(
        mainKey + "_",
        mainQuestion.label + " – "
      );
    }

    if (!acc[category]) acc[category] = [];

    acc[category].push({
      label,
      value
    });

    return acc;

  }, {});
}