import { useEffect, useMemo } from "react";

/*
  Enterprise Base Validation Hook

  Verantwortlich für:
  1. Datenkonsistenz zwischen baseData und answers
  2. Strukturierte Base-Validierung
*/

export function useBaseDataValidation({
  baseData,
  answers,
  setAnswers
}) {

  /* ================= CLEANUP ANSWERS ================= */

  useEffect(() => {
    setAnswers(prev => {
      let updated = { ...prev };
      let changed = false;

      /* ===== KINDER ===== */

      if (baseData.kinder !== "Ja") {
        [
          "kinder_unfall",
          "kinder_vorsorge",
          "kinder_krankenzusatz"
        ].forEach(key => {
          if (updated[key] !== undefined) {
            delete updated[key];
            changed = true;
          }
        });

        Object.keys(updated).forEach(key => {
          if (key.startsWith("kinder_krankenzusatz_")) {
            delete updated[key];
            changed = true;
          }
        });
      }

      /* ===== KFZ ===== */

      if (baseData.kfz !== "Ja") {
        ["fahrerschutz", "kasko", "schutzbrief"].forEach(key => {
          if (updated[key] !== undefined) {
            delete updated[key];
            changed = true;
          }
        });
      }

      /* ===== TIERE ===== */

      if (!baseData.tiere || baseData.tiere === "Keine Tiere") {
        ["tierhaft", "tier_op"].forEach(key => {
          if (updated[key] !== undefined) {
            delete updated[key];
            changed = true;
          }
        });
      }

      return changed ? updated : prev;
    });

  }, [baseData.kinder, baseData.kfz, baseData.tiere, setAnswers]);



  /* ================= BASE FIELD VALIDATION ================= */

  const validation = useMemo(() => {

    const errors = {};

    const isEmptySelect = (v) =>
      !v ||
      String(v).trim() === "" ||
      String(v).toLowerCase().includes("bitte");

    // Pflichtfelder
    if (isEmptySelect(baseData.anrede)) errors.anrede = "Anrede fehlt";
    if (isEmptySelect(baseData.krankenversicherung)) errors.krankenversicherung = "Krankenversicherung fehlt";
    if (!baseData.vorname?.trim()) errors.vorname = "Vorname fehlt";
    if (!baseData.nachname?.trim()) errors.nachname = "Nachname fehlt";
    if (!baseData.alter) errors.alter = "Alter fehlt";
    if (!baseData.beruf?.trim()) errors.beruf = "Beruf fehlt";
    if (!baseData.wohnen) errors.wohnen = "Wohnsituation fehlt";
    if (isEmptySelect(baseData.beziehungsstatus)) errors.beziehungsstatus = "Beziehungsstatus fehlt";

    // Diese Felder brauchst du für sauberen Flow (sonst wird "Weiter" zu früh aktiv)
    if (!baseData.gehalt) errors.gehalt = "Gehalt fehlt";
    if (baseData.kinder === "Ja" && isEmptySelect(baseData.kinderKrankenversicherung)) {
      errors.kinderKrankenversicherung = "Kinder-KV fehlt";
    }
    if (!baseData.tiere) errors.tiere = "Tier-Angabe fehlt";
    if (!baseData.kfz) errors.kfz = "KFZ-Angabe fehlt";

    // Zahlenvalidierung
    const age = Number(baseData.alter);
    if (baseData.alter && (isNaN(age) || age < 18)) {
      errors.alter = "Mindestalter 18 Jahre";
    }

    const income = Number(baseData.gehalt);
    if (baseData.gehalt && (isNaN(income) || income < 0)) {
      errors.gehalt = "Ungültiges Gehalt";
    }

    // Abhängigkeitslogik
    if (baseData.kinder === "Ja" && !baseData.kinderAnzahl) {
      errors.kinderAnzahl = "Kinderanzahl fehlt";
    }

    if (baseData.kfz === "Ja") {
      const n = Number(baseData.kfzAnzahl);
      if (!baseData.kfzAnzahl) errors.kfzAnzahl = "KFZ-Anzahl fehlt";
      else if (isNaN(n) || n <= 0) errors.kfzAnzahl = "KFZ-Anzahl ungültig";
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };

  }, [baseData]);

  return validation;
}