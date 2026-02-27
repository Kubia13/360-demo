export function resetAppState({
  setStep,
  setAnswers,
  setBaseData,
  setCurrentCategoryIndex,
  setAnimatedScore,
  setExpandedCategory,
  setLegalOverlay,
  setDisclaimerAccepted,
  setPdfData,
  scrollToTop
}) {
  setStep("welcome");

  setAnswers({});

  setBaseData({
    anrede: "",
    vorname: "",
    nachname: "",
    alter: "",
    beziehungsstatus: "",
    beruf: "",
    krankenversicherung: "",
    gehalt: "",
    kinder: "",
    kinderKrankenversicherung: "",
    kinderAnzahl: "",
    tiere: "",
    wohnen: "",
    kfz: "",
    kfzAnzahl: ""
  });

  setCurrentCategoryIndex(0);
  setAnimatedScore(0);
  setExpandedCategory(null);
  setLegalOverlay(null);
  setDisclaimerAccepted(false);

  setPdfData({
    adresse: "",
    plz: "",
    ort: "",
    geburtsdatum: "",
    email: "",
    telefon: "",
    handy: "",
    buEmpfehlung: "",
    rentenluecke: "",
    ktgEmpfehlung: ""
  });

  scrollToTop();
}