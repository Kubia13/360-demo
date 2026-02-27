  /* ===== DYNAMISCHER DASHBOARD-HINWEIS ===== */

 export function getDynamicHint({ baseData, answers }) {

    const age = Number(baseData.alter);
    const verheiratet = baseData.beziehungsstatus === "Verheiratet";

    // Pflege-Risiko
    if (answers.pflege !== "ja") {

      if (age >= 50)
        return "Mit steigendem Alter wird Pflegeabsicherung zunehmend relevanter – und teurer.";

      if (age >= 30)
        return "Pflegeabsicherung wird mit zunehmendem Alter deutlich kostenintensiver.";
    }

    // Altersvorsorge
    if (answers.private_rente !== "ja") {

      if (age >= 50)
        return "Im späteren Erwerbsleben sind Vorsorgelücken schwerer auszugleichen.";

      if (age >= 30)
        return "Je früher Altersvorsorge startet, desto geringer ist der monatliche Aufwand.";
    }

    // Verheiratet & BU
    if (verheiratet && answers.bu !== "ja")
      return "Als verheiratete Person spielt Einkommensabsicherung eine zentrale Rolle.";

    // Standard
    return "Dein Ergebnis zeigt eine strukturierte Übersicht deiner aktuellen Absicherung.";
  }
