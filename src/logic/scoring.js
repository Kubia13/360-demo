import { CATEGORY_WEIGHTS } from "../config/categoryWeights";
import { QUESTIONS } from "../data/questions";

  /* ================= SCORE ================= */

export function getScore(key, answers, baseData) {

  const value = answers[key];
  const age = Number(baseData.alter);
  const income = Number(baseData.gehalt);
  const verheiratet = baseData.beziehungsstatus === "Verheiratet";
  const hatKinder = baseData.kinder === "Ja";
  const hatHaus = baseData.wohnen === "Eigentum Haus";

  if (value === undefined) return null;

  /* ===== NICHT RELEVANTE FÄLLE ===== */

  if (key === "kinder_krankenzusatz" && !hatKinder) return null;

  if (
    key === "kinder_krankenzusatz" &&
    (
      baseData.kinderKrankenversicherung === "Privat versichert (PKV)" ||
      baseData.kinderKrankenversicherung === "Beihilfe + PKV"
    )
  ) return null;

  if ((key === "kasko" || key === "fahrerschutz" || key === "schutzbrief") && baseData.kfz !== "Ja") return null;
  if ((key === "tierhaft" || key === "tier_op") && (!baseData.tiere || baseData.tiere === "Keine Tiere")) return null;
  if ((key === "hausrat" || key === "elementar") && baseData.wohnen === "Wohne bei Eltern") return null;
  if (key === "gebaeude" && !hatHaus) return null;
  if (key === "ktg" && baseData.beruf === "Beamter") return null;
  if (key === "bu" && (baseData.beruf === "Beamter" || baseData.beruf === "Nicht berufstätig")) return null;
  if (key === "du" && baseData.beruf !== "Beamter") return null;

  if (
    key === "krankenzusatz" &&
    (
      baseData.krankenversicherung === "Privat versichert (PKV)" ||
      baseData.krankenversicherung === "Heilfürsorge"
    )
  ) return null;


    /* ========================================================= */
    /* ===== RÜCKLAGEN ========================================= */
    /* ========================================================= */

    if (key === "ruecklagen") {
      if (value === "ja") return 100;

      // höheres Einkommen → höheres Risiko ohne Reserve
      if (income > 4000) return 0;
      if (income > 2500) return 20;

      return 30;
    }

    /* ========================================================= */
    /* ===== RISIKO LEBENSVERSICHERUNG ========================== */
    /* ========================================================= */

    if (key === "risiko_lv") {

      if (value === "ja") return 100;

      // Relevanz steigt bei Familie oder Immobilie
      if (verheiratet || hatKinder || hatHaus) return 0;

      // ohne Verpflichtungen weniger kritisch
      return 40;
    }

    /* ========================================================= */
    /* ===== PRIVATE RENTE ===================================== */
    /* ========================================================= */

    if (key === "private_rente") {

      if (value === "ja") return 100;

      if (age < 30) return 40;
      if (age < 45) return 20;

      return 0;
    }

    /* ========================================================= */
    /* ===== BETRIEBLICHE ALTERSVORSORGE ======================= */
    /* ========================================================= */

    if (key === "bav") {

      if (baseData.beruf !== "Angestellt") return null;

      if (value === "ja") return 100;

      return 40;
    }


    /* ========================================================= */
    /* ===== PFLEGE ============================================ */
    /* ========================================================= */

    if (key === "pflege") {

      if (value === "ja") return 100;

      if (age < 30) return 50;
      if (age < 50) return 25;

      return 0;
    }

    /* ========================================================= */
    /* ===== KRANKENZUSATZ (GEWICHTET) ========================= */
    /* ========================================================= */

    if (key === "krankenzusatz") {

      const gewichtung = {
        "Stationär": 30,
        "Zähne": 25,
        "Ambulant": 20,
        "Krankenhaustagegeld": 15,
        "Brille": 10
      };

      let score = 0;

      Object.keys(gewichtung).forEach((bereich) => {
        if (answers["krankenzusatz_" + bereich]) {
          score += gewichtung[bereich];
        }
      });

      return score; // maximal 100
    }


    /* ========================================================= */
    /* ===== KINDER KRANKENZUSATZ (GEWICHTET) ================== */
    /* ========================================================= */

    if (key === "kinder_krankenzusatz") {

      const gewichtung = {
        "Stationär": 30,
        "Zähne": 25,
        "Ambulant": 20,
        "Krankenhaustagegeld": 15,
        "Brille": 10
      };

      let score = 0;

      Object.keys(gewichtung).forEach((bereich) => {
        if (answers["kinder_krankenzusatz_" + bereich]) {
          score += gewichtung[bereich];
        }
      });

      return score; // maximal 100
    }

    /* ========================================================= */
    /* ===== RECHTSSCHUTZ (GEWICHTET & RELEVANT) ================ */
    /* ========================================================= */

    if (key === "rechtsschutz") {

      const gewichtung = {
        "Privat": 30,
        "Beruf": 25,
        "Verkehr": 25,
        "Immobilie/Miete": 20
      };

      const relevant = {
        "Privat": true,
        "Beruf": baseData.beruf !== "Nicht berufstätig",
        "Verkehr": baseData.kfz === "Ja",
        "Immobilie/Miete": baseData.wohnen !== "Wohne bei Eltern"
      };

      let maxScore = 0;
      let score = 0;

      Object.keys(gewichtung).forEach((bereich) => {

        if (!relevant[bereich]) return;

        maxScore += gewichtung[bereich];

        if (answers["rechtsschutz_" + bereich]) {
          score += gewichtung[bereich];
        }

      });

      if (maxScore === 0) return 100;

      return Math.round((score / maxScore) * 100);
    }

    /* ========================================================= */
    /* ===== BU ================================================= */
    /* ========================================================= */

    if (key === "bu") {
      if (value === "ja") return 100;

      // höheres Einkommen = höherer Absicherungsbedarf
      if (income > 4000) return 0;
      if (income > 2500) return 10;

      return 20;
    }

    /* ========================================================= */
    /* ===== DU ================================================= */
    /* ========================================================= */

    if (key === "du") {
      if (value === "ja") return 100;
      return 0;
    }

    /* ========================================================= */
    /* ===== MOBILITÄT – INTELLIGENTE GEWICHTUNG =============== */
    /* ========================================================= */

    if (key === "kasko" || key === "fahrerschutz" || key === "schutzbrief") {

      const kasko = answers.kasko;
      const fahrer = answers.fahrerschutz;
      const schutz = answers.schutzbrief;

      let maxScore = 0;
      let score = 0;

      // KASKO (Kernschutz)
      if (kasko) {
        maxScore += 100;

        if (kasko === "vollkasko") score += 100;
        else if (kasko === "teilkasko") score += 70;
      }

      // FAHRERSCHUTZ (Kernschutz)
      if (fahrer) {
        maxScore += 100;
        if (fahrer === "ja") score += 100;
      }

      // SCHUTZBRIEF (Komfort)
      if (schutz) {
        maxScore += 60;
        if (schutz === "ja") score += 60;
      }

      if (maxScore === 0) return null;

      return Math.round((score / maxScore) * 100);
    }
    /* ========================================================= */
    /* ===== TIER OP / TIERKRANKEN ============================= */
    /* ========================================================= */

    if (key === "tier_op") {

      if (value === "ja") {

        if (answers.tier_op_type === "voll") {
          return 100;   // Vollversicherung
        }

        if (answers.tier_op_type === "op") {
          return 60;    // Teilabsicherung
        }

        return 0;       // Ja ohne Auswahl
      }

      if (value === "unbekannt") {
        return 20;
      }

      if (value === "nein") {
        return 0;
      }
    }


    /* ========================================================= */
    /* ===== STANDARD JA / NEIN ================================ */
    /* ========================================================= */

    if (value === "ja") return 100;
    return 0;

  }

export function calculateScoreEngine({
  answers,
  baseData,
  categories,
  pdfData
}) {

  /* ================= CATEGORY SCORES ================= */

  const categoryScores = categories.reduce((acc, cat) => {

    const relevantQuestions = Object.keys(QUESTIONS)
      .filter((id) => {
        const q = QUESTIONS[id];
        if (q.category !== cat) return false;
        if (q.condition && !q.condition(baseData)) return false;
        if (answers[id] === undefined) return false;
        return true;
      });

    const scores = relevantQuestions
      .map((id) => getScore(id, answers, baseData))
      .filter((score) => score !== null);

    if (scores.length === 0) {
      acc[cat] = null;
      return acc;
    }

    const sum = scores.reduce((total, s) => total + s, 0);
    acc[cat] = Math.round(sum / scores.length);

    return acc;

  }, {});

  /* ================= TOTAL SCORE ================= */

  let finalScore = 0;
  let existenzScore = null;

  const answeredRelevantQuestions = Object.keys(QUESTIONS).filter((id) => {
    const q = QUESTIONS[id];
    if (q.condition && !q.condition(baseData)) return false;
    if (answers[id] === undefined) return false;
    return getScore(id, answers, baseData) !== null;
  });

  const totalRelevantQuestions = Object.keys(QUESTIONS).filter((id) => {
    const q = QUESTIONS[id];
    if (q.condition && !q.condition(baseData)) return false;
    return getScore(id, answers, baseData) !== null;
  }).length;

  if (totalRelevantQuestions === 0) {
    finalScore = 0;
  } else {

    const answeredCount = answeredRelevantQuestions.length;
    const minimumRequired = Math.ceil(totalRelevantQuestions * 0.4);

    if (answeredCount < minimumRequired) {
      finalScore = 0;
    } else {

      const activeCategories = Object.keys(CATEGORY_WEIGHTS).filter(
        (cat) => categoryScores[cat] !== null && categoryScores[cat] !== undefined
      );

      const totalWeight = activeCategories.reduce(
        (sum, cat) => sum + CATEGORY_WEIGHTS[cat],
        0
      );

      if (totalWeight === 0) {
        finalScore = 0;
      } else {

       const weightedScore = activeCategories.reduce((sum, cat) => {
  return sum + (categoryScores[cat] || 0) * CATEGORY_WEIGHTS[cat];
}, 0);

finalScore = Math.round(weightedScore / totalWeight);
existenzScore = categoryScores["existenz"];
      }
    }
  }

    /* ===== KOMFORT-DECKELUNG ===== */

    // Kategorien mit eher "Komfort-/Optimierungscharakter"
    const komfortKategorien = ["wohnen", "mobilitaet", "gesundheit"];

    let komfortBoost = 0;

    komfortKategorien.forEach((cat) => {
      const score = categoryScores[cat];

      if (score !== null && score !== undefined) {
        komfortBoost += score * CATEGORY_WEIGHTS[cat];
      }
    });

    /* ===== KOMFORT-DECKEL (HYBRID) ===== */

    if (existenzScore !== null && existenzScore < 90) {

      if (komfortBoost > 5) {
        const reduzierung = Math.min(komfortBoost - 5, 3);
        finalScore = Math.max(finalScore - reduzierung, 0);
      }

    }

    /* ===== EXISTENZIELLE DECKELUNG ===== */

    let kritisch = false;
    let sehrKritisch = false;


    if (existenzScore !== null && existenzScore !== undefined) {
      if (existenzScore < 25) sehrKritisch = true;
      else if (existenzScore < 40) kritisch = true;
    }

    if (sehrKritisch) {
      finalScore = Math.min(finalScore, 55);
    } else if (kritisch) {
      finalScore = Math.min(finalScore, 70);
    }

    /* ===== HAFTPFLICHT-MINIMUM ===== */

    if (answers.haftpflicht === "nein") {
      finalScore = Math.min(finalScore, 60);
    }

    /* ===== HARTE EXISTENZ-LOGIK ===== */

    const hatBU =
      answers.bu === "ja" ||
      answers.du === "ja";

    const hatRuecklagen =
      answers.ruecklagen === "ja";

    if (!hatBU && !hatRuecklagen) {
      finalScore = Math.min(finalScore, 50);
    }

    /* ===== IMMOBILIEN-RISIKO LOGIK ===== */

    const hatHaus = baseData.wohnen === "Eigentum Haus";

    const hatFamilie =
      baseData.beziehungsstatus === "Verheiratet" ||
      baseData.kinder === "Ja";

    const hatRisikoLV = answers.risiko_lv === "ja";

    if (hatHaus && !hatRisikoLV) {

      if (hatFamilie) {
        finalScore = Math.min(finalScore, 65);
      } else {
        finalScore = Math.min(finalScore, 75);
      }

    }

    /* ===== MEHRERE KINDER + KEINE RÜCKLAGEN ===== */

    const kinderAnzahl = Number(baseData.kinderAnzahl) || 0;

    if (kinderAnzahl >= 2 && !hatRuecklagen) {
      finalScore = Math.min(finalScore, 60);
    }

    /* ===== HOHES EINKOMMEN + KEINE BU ===== */

    const income = Number(baseData.gehalt);

    if (income >= 4000 && !hatBU) {

      if (hatFamilie) {
        finalScore = Math.min(finalScore, 60);
      } else {
        finalScore = Math.min(finalScore, 65);
      }

      /* ===== NICHT-LINEARE PROGRESSION (HYBRID) ===== */

      if (finalScore > 90) {
        finalScore = 90 + (finalScore - 90) * 0.7;
      }

      if (finalScore > 98) {
        finalScore = 98 + (finalScore - 98) * 0.4;
      }

      finalScore = Math.round(finalScore);

    }

    /* ===== NICHT-LINEARE PROGRESSION (HYBRID FIX) ===== */

    if (finalScore > 92 && finalScore < 100) {
      finalScore = 92 + (finalScore - 92) * 0.85;
    }

    if (finalScore > 99 && finalScore < 100) {
      finalScore = 99 + (finalScore - 99) * 0.6;
    }

    finalScore = Math.round(finalScore);



    /* ===== 100%-REGEL (HYBRID – ECHTE 100% ERLAUBT) ===== */

    if (finalScore >= 100) {

      const haftungScore = categoryScores["haftung"];
      const aktiveKategorien = Object.values(categoryScores)
        .filter(v => v !== null).length;

      const hatBU = answers.bu === "ja" || answers.du === "ja";
      const hatRuecklagen = answers.ruecklagen === "ja";

      const komplexeLebenslage =
        baseData.beziehungsstatus === "Verheiratet" ||
        baseData.kinder === "Ja" ||
        baseData.wohnen === "Eigentum Haus";

      let darf100 = true;

      /* ===== KOMPLEXE LEBENSLAGE ===== */

      if (komplexeLebenslage) {
        if (
          !existenzScore || existenzScore < 90 ||
          !haftungScore || haftungScore < 85 ||
          (!hatBU && !hatRuecklagen)
        ) {
          darf100 = false;
        }
      } else {
        if (!existenzScore || existenzScore < 85) {
          darf100 = false;
        }
      }

      /* ===== MINDESTSTRUKTUR ===== */

      if (aktiveKategorien < 3) {
        darf100 = false;
      }

      /* ===== ENDERGEBNIS ===== */

      if (!darf100) {
        finalScore = 97;
      } else {
        finalScore = 100;
      }

    }
    /* ================= VALID SCORE DATA ================= */

let minimumRequired = 5;

if (baseData.beziehungsstatus === "Verheiratet") minimumRequired++;
if (baseData.kinder === "Ja") minimumRequired++;
if (baseData.wohnen === "Eigentum Haus") minimumRequired++;
if (baseData.beruf === "Selbstständig") minimumRequired++;
if (Number(baseData.gehalt) > 4000) minimumRequired++;

const hasValidScoreData =
  answeredRelevantQuestions.length >= minimumRequired;


  /* ================= PDF VALID ================= */

const hatAdresse =
  pdfData?.adresse?.trim() &&
  pdfData?.plz?.trim() &&
  pdfData?.ort?.trim();

const hatGeburtsdatum =
  pdfData?.geburtsdatum?.trim();

const hatEmail =
  pdfData?.email?.trim() &&
  pdfData?.email.includes("@");

const hatTelefon =
  pdfData?.telefon?.trim() ||
  pdfData?.handy?.trim();

const isPdfValid = Boolean(
  hatAdresse &&
  hatGeburtsdatum &&
  hatEmail &&
  hatTelefon
);

/* ================= RETURN ================= */

return {
  categoryScores,
  totalScore: finalScore,
  hasValidScoreData,
  isPdfValid
};
}