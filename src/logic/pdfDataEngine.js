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

export function groupAnswersForPdf({ answers, QUESTIONS }) {

  const acc = {};

  const push = (category, item) => {
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
  };

  /* ===== SUBOPTION BLÖCKE ===== */

  const SUB_BLOCKS = [
    {
      mainKey: "krankenzusatz",
      prefix: "Krankenzusatz",
      options: [
        "Ambulant",
        "Stationär",
        "Zähne",
        "Brille",
        "Krankenhaustagegeld"
      ]
    },
    {
      mainKey: "kinder_krankenzusatz",
      prefix: "Kinderkrankenzusatz",
      options: [
        "Ambulant",
        "Stationär",
        "Zähne",
        "Brille",
        "Krankenhaustagegeld"
      ]
    },
    {
      mainKey: "rechtsschutz",
      prefix: "Rechtsschutz",
      options: [
        "Privat",
        "Beruf",
        "Verkehr",
        "Immobilie/Miete"
      ]
    }
  ];

  const handledKeys = new Set();

  /* ===== 1. SUBBLOCKS ===== */

  for (const block of SUB_BLOCKS) {

    const { mainKey, prefix, options } = block;

    const qMain = QUESTIONS[mainKey];
    if (!qMain) continue;

    const category = qMain.category;

    const mainVal = answers?.[mainKey];

    handledKeys.add(mainKey);

    options.forEach(opt => {
      handledKeys.add(`${mainKey}_${opt}`);
    });

    /* Wenn Hauptfrage nicht JA → trotzdem anzeigen */

    if (mainVal !== "ja") {

      options.forEach((opt, idx) => {

        push(category, {
          label: `${prefix} ${opt}`,
          value: "✕",
          _order: 1000 + idx
        });

      });

      continue;
    }

    /* Wenn JA → jede Option anzeigen */

    options.forEach((opt, idx) => {

      const subKey = `${mainKey}_${opt}`;

      const isChecked = answers?.[subKey] === true;

      push(category, {
        label: `${prefix} ${opt}`,
        value: isChecked ? "✓" : "✕",
        _order: 1000 + idx
      });

    });

  }

  /* ===== 2. RESTLICHE FRAGEN ===== */

  Object.entries(answers || {}).forEach(([key, value]) => {

    if (handledKeys.has(key)) return;

    if (
      value === false ||
      value === null ||
      value === "" ||
      value === undefined
    ) return;

    let question = QUESTIONS[key];

    let category = null;
    let label = null;

    if (question) {

      category = question.category;
      label = question.label;

    } else {

      const mainKey = key.split("_")[0];
      const mainQuestion = QUESTIONS[mainKey];

      if (!mainQuestion) return;

      category = mainQuestion.category;

      label = key.replace(
        mainKey + "_",
        mainQuestion.label + " – "
      );

    }

    push(category, {
      label,
      value: value === true ? "✓" : value,
      _order: 100
    });

  });

  /* ===== 3. SORTIERUNG ===== */

  Object.keys(acc).forEach((cat) => {

    acc[cat] = acc[cat]
      .sort((a, b) => (a._order || 0) - (b._order || 0))
      .map(({ _order, ...rest }) => rest);

  });

  return acc;

}