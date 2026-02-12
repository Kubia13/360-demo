import React, { useState, useEffect, useMemo } from "react";
import "./index.css";

/* ================= KATEGORIE GEWICHTE ================= */

const CATEGORY_WEIGHTS = {
  existenz: 0.25,
  kinder: 0.1,
  haftung: 0.15,
  gesundheit: 0.15,
  wohnen: 0.1,
  mobilitaet: 0.1,
  vorsorge: 0.15,
};

const CATEGORY_LABELS = {
  existenz: "Existenz",
  haftung: "Haftung",
  gesundheit: "Gesundheit",
  wohnen: "Wohnen",
  mobilitaet: "Mobilität",
  vorsorge: "Vorsorge",
  kinder: "Kinder",
};

/* ================= FRAGEN ================= */

const QUESTIONS = {

  /* ===== EXISTENZ ===== */

  bu: {
    label: "Berufsunfähigkeitsversicherung vorhanden?",
    category: "existenz",
    type: "yesno",
  },

  ktg: {
    label: "Krankentagegeld vorhanden?",
    category: "existenz",
    type: "yesno",
    link: {
      label: "Krankentagegeld-Rechner",
      url: "https://ssl.barmenia.de/formular-view/#/krankentagegeldrechner"
    }
  },

  unfall: {
    label: "Unfallversicherung vorhanden?",
    category: "existenz",
    type: "yesno",
  },

  /* ===== HAFTUNG ===== */

  haftpflicht: {
    label: "Private Haftpflicht vorhanden? (Min.10 Mio€)",
    category: "haftung",
    type: "yesno",
  },

  tierhaft: {
    label: "Tierhalterhaftpflicht vorhanden?",
    category: "haftung",
    type: "yesno",
    condition: (baseData) =>
      baseData.tiere === "Hund" ||
      baseData.tiere === "Hund und Katze",
  },

  tier_op: {
    label: "Tier OP- oder Tierkrankenversicherung vorhanden?",
    category: "haftung",
    type: "yesno",
    condition: (baseData) =>
      baseData.tiere === "Hund" ||
      baseData.tiere === "Hund und Katze",
  },

  rechtsschutz: {
    label: "Rechtsschutz vorhanden?",
    category: "haftung",
    type: "yesno",
    hasSubOptions: true
  },

  /* ===== WOHNEN ===== */

  hausrat: {
    label: "Hausrat ausreichend versichert?",
    category: "wohnen",
    type: "yesno",
    condition: (baseData) =>
      baseData.wohnen &&
      baseData.wohnen !== "Wohne bei Eltern",
    info: "Die Hausratversicherung schützt dein gesamtes bewegliches Eigentum (Möbel, Kleidung, Technik usw.).\n\nEntscheidend ist der Neuwert – also der Betrag, den du heute für eine Neuanschaffung zahlen müsstest.\n\nAls Orientierung gelten ca. 650 € pro m² Wohnfläche.\nBeispiel: 80 m² × 650 € = 52.000 € Versicherungssumme.\n\nIst die Summe zu niedrig, droht im Schadenfall eine Kürzung wegen Unterversicherung."
  },

  elementar: {
    label: "Elementarversicherung vorhanden?",
    category: "wohnen",
    type: "yesno",
    condition: (baseData) =>
      baseData.wohnen &&
      baseData.wohnen !== "Wohne bei Eltern",
  },

  gebaeude: {
    label: "Wohngebäudeversicherung vorhanden?",
    category: "wohnen",
    type: "yesno",
    condition: (baseData) =>
      baseData.wohnen === "Eigentum Haus",
  },

  /* ===== MOBILITÄT ===== */

  kfz_haftpflicht: {
    label: "Haftpflichtversicherung für dein Fahrzeug vorhanden? (z. B. Auto, Motorrad, Roller, Mofa)",
    category: "mobilitaet",
    type: "yesno",
    condition: (baseData) => baseData.kfz === "Ja",
  },


  kasko: {
    label: "Welche KFZ-Kasko besteht?",
    category: "mobilitaet",
    type: "select",
    options: ["Haftpflicht", "Teilkasko", "Vollkasko", "Weiß nicht"],
    condition: (baseData) => baseData.kfz === "Ja",
  },

  schutzbrief: {
    label: "Schutzbrief vorhanden?",
    category: "mobilitaet",
    type: "yesno",
    condition: (baseData) => baseData.kfz === "Ja",
  },

  /* ===== GESUNDHEIT ===== */

  zahn: {
    label: "Krankenzusatzversicherung vorhanden?",
    category: "gesundheit",
    type: "yesno",
  },

  pflege: {
    label: "Private Pflegezusatz vorhanden?",
    category: "gesundheit",
    type: "yesno",
  },

  /* ===== VORSORGE ===== */

  private_rente: {
    label: "Private Altersvorsorge vorhanden?",
    category: "vorsorge",
    type: "yesno",
  },

  rentenluecke: {
    label: "Kennst du deine Rentenlücke?",
    category: "vorsorge",
    type: "yesno",
    link: {
      label: "Rentenlückenrechner",
      url: "https://rentenrechner.dieversicherer.de/app/gdv.html#luecke"
    }
  },

  /* ===== KINDER ===== */

  kinder_unfall: {
    label: "Unfallversicherung für dein Kind vorhanden?",
    category: "kinder",
    type: "yesno",
    condition: (baseData) => baseData.kinder === "Ja",
  },

  kinder_zahn: {
    label: "Krankenzusatz für dein Kind vorhanden?",
    category: "kinder",
    type: "yesno",
    condition: (baseData) => baseData.kinder === "Ja",
  },

  kinder_vorsorge: {
    label: "Wird für dein Kind privat vorgesorgt?",
    category: "kinder",
    type: "yesno",
    condition: (baseData) => baseData.kinder === "Ja",
  },
};

export default function App() {

  const [step, setStep] = useState("welcome");
  const [answers, setAnswers] = useState({});
  const [baseData, setBaseData] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInfo, setShowInfo] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const vornameRef = React.useRef(null);
  const nachnameRef = React.useRef(null);
  const alterRef = React.useRef(null);
  const gehaltRef = React.useRef(null);
  const kinderAnzahlRef = React.useRef(null);
  const kfzAnzahlRef = React.useRef(null);

/* ================= DYNAMISCHE KATEGORIEN ================= */

const categories = useMemo(() => {
  return Object.keys(CATEGORY_WEIGHTS);
}, []);

const currentCategory = categories[currentCategoryIndex];

/* ===== FLOW-SCHUTZ ===== */

useEffect(() => {
  if (currentCategoryIndex >= categories.length) {
    setCurrentCategoryIndex(0);
  }
}, [categories, currentCategoryIndex]);

/* ================= RESET ================= */

function resetAll() {
  setStep("welcome");
  setAnswers({});
  setBaseData({});
  setCurrentCategoryIndex(0);
  setAnimatedScore(0);
}

/* ================= ANSWER ================= */

function answer(key, value) {
  setAnswers((prev) => ({
    ...prev,
    [key]: value,
  }));
}

/* ================= SCORE ================= */

function getScore(key) {

  const value = answers[key];
  const age = Number(baseData.alter);
  const verheiratet = baseData.beziehungsstatus === "Verheiratet";

  if (!value) return 0;

  /* ===== RENTENLÜCKE NICHT WERTEN ===== */
  if (key === "rentenluecke") return null;

  /* ===== PRIVATE ALTERSVORSORGE ===== */
  if (key === "private_rente") {

    if (value === "ja") return 100;

    // Ohne Vorsorge
    if (age < 30) return 0;
    if (age < 50) return 0;

    return 20; // 50+
  }

  /* ===== PFLEGE ===== */
  if (key === "pflege") {

    if (value === "ja") return 100;

    if (age < 30) return 40;
    if (age < 50) return 20;

    return 0;
  }

  /* ===== KRANKENZUSATZ ===== */
  if (key === "zahn") {

    if (value === "ja") return 100;

    if (age < 30) return 70;
    if (age < 50) return 40;

    return 20;
  }

  /* ===== BU – MIT VERHEIRATET BONUS-RISIKO ===== */
  if (key === "bu") {

    if (value === "ja") return 100;

    if (verheiratet) return 0;

    return 0;
  }

  /* ===== RECHTSSCHUTZ ===== */
  if (key === "rechtsschutz") {

    if (value !== "ja") return 0;

    const rsBereiche = [
      { key: "Privat", relevant: true },
      { key: "Beruf", relevant: baseData.beruf && baseData.beruf !== "Nicht berufstätig" },
      { key: "Verkehr", relevant: baseData.kfz === "Ja" },
      { key: "Immobilie/Miete", relevant: baseData.wohnen && baseData.wohnen !== "Wohne bei Eltern" }
    ];

    const relevanteBereiche = rsBereiche.filter(b => b.relevant);

    if (relevanteBereiche.length === 0) return 100;

    const abgedeckt = relevanteBereiche.filter(
      (b) => answers["rechtsschutz_" + b.key]
    );

    return Math.round((abgedeckt.length / relevanteBereiche.length) * 100);
  }


  /* ===== STANDARD YES / NO ===== */
  if (value === "ja") return 100;
  if (value === "nein" || value === "unbekannt") return 0;

  /* ===== KASKO ===== */
  if (key === "kasko") {
    if (value === "vollkasko") return 100;
    if (value === "teilkasko") return 50;
    return 0;
  }

  return 0;
}

const categoryScores = useMemo(() => {

  return Object.keys(CATEGORY_WEIGHTS).reduce((acc, cat) => {

    const relevantQuestions = Object.keys(QUESTIONS).filter((id) => {

      const q = QUESTIONS[id];

      if (q.category !== cat) return false;
      if (q.condition && !q.condition(baseData)) return false;
      if (answers[id] === undefined) return false;

      return true;
    });

    if (!relevantQuestions.length) {
      acc[cat] = 0;
    } else {

      const scoredQuestions = relevantQuestions.filter(
        (id) => getScore(id) !== null
      );

      if (!scoredQuestions.length) {
        acc[cat] = 0;
      } else {

        const sum = scoredQuestions.reduce(
          (total, id) => total + getScore(id),
          0
        );

        acc[cat] = Math.round(sum / scoredQuestions.length);
      }
    }

    return acc;

  }, {});

}, [answers, baseData]);

const totalScore = useMemo(() => {

  const activeCategories = Object.keys(CATEGORY_WEIGHTS).filter((cat) => {

    const relevantQuestions = Object.keys(QUESTIONS).filter((id) => {
      const q = QUESTIONS[id];

      if (q.category !== cat) return false;
      if (q.condition && !q.condition(baseData)) return false;

      return true;
    });

    return relevantQuestions.length > 0;
  });

  const totalWeight = activeCategories.reduce(
    (sum, cat) => sum + CATEGORY_WEIGHTS[cat],
    0
  );

  if (totalWeight === 0) return 0;

  const weightedScore = activeCategories.reduce((sum, cat) => {
    return sum + (categoryScores[cat] || 0) * CATEGORY_WEIGHTS[cat];
  }, 0);

  return Math.round(weightedScore / totalWeight);

}, [categoryScores, baseData]);

/* ===== SCORE ANIMATION ===== */

useEffect(() => {

  let current = 0;

  const interval = setInterval(() => {

    current++;

    if (current >= totalScore) {
      current = totalScore;
      clearInterval(interval);
    }

    setAnimatedScore(current);

  }, 8);

  return () => clearInterval(interval);

}, [totalScore]);

/* ===== DYNAMISCHER DASHBOARD-HINWEIS ===== */

function getDynamicHint() {

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
/* ===== STRATEGISCHE EMPFEHLUNGEN ===== */

function getStrategicRecommendation(id) {

  const value = answers[id]
  const age = Number(baseData.alter)
  const verheiratet = baseData.beziehungsstatus === "Verheiratet"

  if (!value || value === "ja") return null

  const unsicher = value === "unbekannt"

  switch (id) {

    case "bu":
      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Eine Prüfung deiner Einkommensabsicherung ist sinnvoll."
      if (verheiratet)
        return "Als verheiratete Person trägt dein Einkommen besondere Verantwortung. Eine Berufsunfähigkeitsabsicherung schützt die wirtschaftliche Stabilität eurer Lebensplanung."
      return "Die Absicherung der eigenen Arbeitskraft zählt zu den wichtigsten finanziellen Grundlagen."

    case "private_rente":
      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Eine strukturierte Ruhestandsplanung schafft Klarheit über Versorgungslücken."
      if (age >= 50)
        return "Im fortgeschrittenen Erwerbsleben lassen sich Vorsorgelücken nur noch begrenzt aufholen."
      if (age >= 30)
        return "Je früher private Altersvorsorge beginnt, desto geringer ist der monatliche Aufwand."
      return "Früher Vorsorgebeginn schafft langfristige finanzielle Flexibilität."

    case "pflege":
      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Eine Prüfung der Pflegeabsicherung kann finanzielle Risiken reduzieren."
      if (age >= 50)
        return "Mit steigendem Alter erhöhen sich Eintrittswahrscheinlichkeit und Beitragshöhe."
      if (age >= 30)
        return "Pflegekosten können erhebliche Eigenanteile verursachen."
      return "Frühe Gesundheitsabsicherung sichert langfristig günstige Beiträge."

    case "zahn":
      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Eine Überprüfung des Leistungsumfangs schafft Transparenz."
      return "Eine Krankenzusatzversicherung kann Eigenkosten im Leistungsfall deutlich reduzieren."

    case "hausrat":
      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Eine Überprüfung der Versicherungssumme schützt vor Unterversicherung."
      return "Der Schutz deines beweglichen Eigentums sollte regelmäßig am Neuwert ausgerichtet sein."

    case "elementar":
      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Elementarschäden sind häufig nicht automatisch eingeschlossen."
      return "Naturgefahren nehmen statistisch zu. Elementarschutz ergänzt die Wohnabsicherung sinnvoll."

    case "gebaeude":
      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Eine vollständige Gebäudeabsicherung ist essenziell."
      return "Als Eigentümer ist eine vollständige Gebäudeabsicherung essenziell."

    case "haftpflicht":
      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Eine Überprüfung der Deckungssumme ist sinnvoll."
      return "Die private Haftpflichtversicherung zählt zu den elementaren Basisabsicherungen."

    case "rechtsschutz":

      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Eine Analyse der abgedeckten Bereiche schafft Klarheit.";

      const rsBereiche = [
        { key: "Privat", relevant: true },
        { key: "Beruf", relevant: baseData.beruf && baseData.beruf !== "Nicht berufstätig" },
        { key: "Verkehr", relevant: baseData.kfz === "Ja" },
        { key: "Immobilie/Miete", relevant: baseData.wohnen && baseData.wohnen !== "Wohne bei Eltern" }
      ];

      const relevanteBereiche = rsBereiche.filter(b => b.relevant);

      const fehlendeBereiche = relevanteBereiche.filter(
        (b) => !answers["rechtsschutz_" + b.key]
      );

      if (fehlendeBereiche.length === 0)
        return null;

      return "In folgenden relevanten Bereichen besteht Optimierungsbedarf: " +
        fehlendeBereiche.map(b => b.key).join(", ") + ".";


    case "kfz_haftpflicht":
      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Die gesetzliche Haftpflicht sollte eindeutig geprüft werden."
      return "Die KFZ-Haftpflicht schützt vor existenzbedrohenden Schadenersatzforderungen."

    case "kasko":
      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Der passende Kaskoschutz hängt vom Fahrzeugwert ab."
      return "Der passende Kaskoschutz hängt vom Fahrzeugwert und deiner Risikobereitschaft ab."

    case "schutzbrief":
      if (unsicher)
        return "Hier besteht eventuell Optimierungsbedarf. Ein Schutzbrief kann im Notfall organisatorische Sicherheit bieten."
      return "Ein Schutzbrief reduziert organisatorische und finanzielle Belastungen im Notfall."

    default:
      return null
  }
}

/* ================= RESET OVERLAY ================= */

const ResetOverlay = showResetConfirm && (
  <div
    className="infoOverlay"
    onClick={() => setShowResetConfirm(false)}
  >
    <div
      className="infoBox"
      onClick={(e) => e.stopPropagation()}
    >
      <p>Möchtest du von vorne beginnen?</p>

      <div className="overlayButtons">
        <button
          className="overlayBtn primary"
          onClick={() => {
            setShowResetConfirm(false);
            resetAll();
          }}
        >
          Ja
        </button>

        <button
          className="overlayBtn secondary"
          onClick={() => setShowResetConfirm(false)}
        >
          Nein
        </button>
      </div>
    </div>
  </div>
);

/* ================= WELCOME ================= */

if (step === "welcome") {
  return (
    <div className="screen center">
      <img
        src="/logo.jpg"
        className="logo large"
        onClick={resetAll}
        alt="Logo"
      />

      <h1>360° Absicherungscheck</h1>

      <p style={{ opacity: 0.85, lineHeight: 1.5 }}>
        In wenigen Minuten erhältst du eine strukturierte Übersicht
        deiner aktuellen Absicherung – klar, verständlich und
        kategorisiert nach Risiko­bereichen.
      </p>

      <p style={{ opacity: 0.65, fontSize: 14, marginTop: 6 }}>
        Keine Anmeldung. Keine Datenspeicherung. Nur Transparenz.
      </p>

      <button
        className="primaryBtn big"
        onClick={() => setStep("base")}
      >
        Jetzt Check starten
      </button>

      <ContactButton onReset={() => setShowResetConfirm(true)} />
      {ResetOverlay}
    </div>
  );
}


/* ================= BASISDATEN ================= */

if (step === "base") {

  return (
    <div className="screen">
      <Header reset={resetAll} back={() => setStep("welcome")} />

      <h2>Persönliche Angaben</h2>

      <Select
        label="Geschlecht"
        options={["Herr", "Frau", "Divers"]}
        value={baseData.geschlecht}
        onChange={(v) =>
          setBaseData(prev => ({ ...prev, geschlecht: v }))
        }
      />

      <Input
        label="Vorname"
        value={baseData.vorname}
        onChange={(v) =>
          setBaseData(prev => ({ ...prev, vorname: v }))
        }
        onEnter={() => nachnameRef.current?.focus()}
        inputRef={vornameRef}
      />

      <Input
        label="Nachname"
        value={baseData.nachname}
        onChange={(v) =>
          setBaseData(prev => ({ ...prev, nachname: v }))
        }
        onEnter={() => alterRef.current?.focus()}
        inputRef={nachnameRef}
      />

      <Input
        label="Alter"
        type="number"
        value={baseData.alter}
        onChange={(v) =>
          setBaseData(prev => ({ ...prev, alter: v }))
        }
        onEnter={() => gehaltRef.current?.focus()}
        inputRef={alterRef}
      />

      <Input
        label="Monatliches Netto-Gehalt (€)"
        type="number"
        value={baseData.gehalt}
        onChange={(v) =>
          setBaseData(prev => ({ ...prev, gehalt: v }))
        }
        inputRef={gehaltRef}
      />

      <Select
        label="Beziehungsstatus"
        options={[
          "Single",
          "Partnerschaft",
          "Verheiratet"
        ]}
        value={baseData.beziehungsstatus}
        onChange={(v) =>
          setBaseData(prev => ({ ...prev, beziehungsstatus: v }))
        }
      />

      <Select
        label="Berufliche Situation"
        options={[
          "Angestellt",
          "Öffentlicher Dienst",
          "Selbstständig",
          "Nicht berufstätig",
        ]}
        value={baseData.beruf}
        onChange={(v) =>
          setBaseData(prev => ({ ...prev, beruf: v }))
        }
      />

      <Select
        label="Hast du Kinder?"
        options={["Nein", "Ja"]}
        value={baseData.kinder}
        onChange={(v) =>
          setBaseData(prev => ({ ...prev, kinder: v }))
        }
      />

      {baseData.kinder === "Ja" && (
        <Input
          label="Anzahl Kinder"
          type="number"
          value={baseData.kinderAnzahl}
          onChange={(v) =>
            setBaseData(prev => ({
              ...prev,
              kinderAnzahl: v,
            }))
          }
          inputRef={kinderAnzahlRef}
        />
      )}

      <Select
        label="Haustiere"
        options={[
          "Keine Tiere",
          "Katze",
          "Hund",
          "Hund und Katze",
        ]}
        value={baseData.tiere}
        onChange={(v) =>
          setBaseData(prev => ({ ...prev, tiere: v }))
        }
      />

      <Select
        label="Wie wohnst du?"
        options={[
          "Wohne bei Eltern",
          "Miete Wohnung",
          "Miete Haus",
          "Eigentumswohnung",
          "Eigentum Haus",
        ]}
        value={baseData.wohnen}
        onChange={(v) =>
          setBaseData(prev => ({ ...prev, wohnen: v }))
        }
      />

      <Select
        label="Besitzt du ein Fahrzeug? (z. B. Auto, Motorrad, Roller, Mofa)"
        options={["Nein", "Ja"]}
        value={baseData.kfz}
        onChange={(v) =>
          setBaseData(prev => ({ ...prev, kfz: v }))
        }
      />

      {baseData.kfz === "Ja" && (
        <Input
          label="Anzahl Fahrzeuge"
          type="number"
          value={baseData.kfzAnzahl}
          onChange={(v) =>
            setBaseData(prev => ({
              ...prev,
              kfzAnzahl: v,
            }))
          }
          inputRef={kfzAnzahlRef}
        />
      )}

      <button
        className="primaryBtn"
        onClick={() => setStep("category")}
      >
        Weiter
      </button>

      <ContactButton onReset={() => setShowResetConfirm(true)} />
      {ResetOverlay}
    </div>
  );
}

/* ================= KATEGORIEN ================= */

if (step === "category") {

  const questionsOfCategory = Object.keys(QUESTIONS).filter((id) => {
    const q = QUESTIONS[id];

    if (q.category !== currentCategory) return false;
    if (q.condition && !q.condition(baseData)) return false;

    return true;
  });

  return (
    <div className="screen">
      <Header
        reset={resetAll}
        back={() => {
          if (currentCategoryIndex > 0) {
            setCurrentCategoryIndex((prev) => prev - 1);
          } else {
            setStep("base");
          }
        }}
      />

      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, opacity: 0.7 }}>
          Kategorie {currentCategoryIndex + 1} von {categories.length}
        </div>

        <div style={{ fontSize: 20, fontWeight: "bold" }}>
          {CATEGORY_LABELS[currentCategory]}
        </div>

        <div
          style={{
            height: 6,
            background: "#1a2a36",
            borderRadius: 6,
            marginTop: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((currentCategoryIndex + 1) / categories.length) * 100}%`,
              height: "100%",
              background: "linear-gradient(135deg, #8B7CF6, #5E4AE3)",
              transition: "0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Fragen */}
      {questionsOfCategory.map((id) => {
        const q = QUESTIONS[id];

        return (
          <div key={id} className="questionCard dark">
            <div className="questionText">
              {q.label}

              {q.info && (
                <span
                  className="infoIcon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(q.info);
                  }}
                >
                  i
                </span>
              )}
            </div>

            {q.link && (
              <a
                href={q.link.url}
                target="_blank"
                rel="noreferrer"
                className="calculatorIcon"
                title={q.link.label}
              >
                🧮
              </a>
            )}

            {/* SELECT */}
            {q.type === "select" && (
              <Select
                label=""
                options={q.options}
                value={
                  id === "kasko"
                    ? answers[id] === "haftpflicht"
                      ? "Haftpflicht"
                      : answers[id] === "teilkasko"
                        ? "Teilkasko"
                        : answers[id] === "vollkasko"
                          ? "Vollkasko"
                          : answers[id] === "unbekannt"
                            ? "Weiß nicht"
                            : ""
                    : answers[id] || ""
                }
                onChange={(v) => {
                  if (id === "kasko") {
                    if (v === "Haftpflicht") answer(id, "haftpflicht");
                    else if (v === "Teilkasko") answer(id, "teilkasko");
                    else if (v === "Vollkasko") answer(id, "vollkasko");
                    else answer(id, "unbekannt");
                  } else {
                    answer(id, v === "Weiß nicht" ? "unbekannt" : v);
                  }
                }}
              />
            )}

            {/* YES / NO */}
            {q.type === "yesno" && (
              <>
                <div className="buttonRow">
                  {["ja", "nein", "unbekannt"].map((v) => {
                    const isActive = answers[id] === v;

                    return (
                      <button
                        key={v}
                        className={`answerBtn ${isActive ? "active" : ""}`}
                        onClick={() => answer(id, v)}
                        style={{
                          transform: isActive ? "scale(1.02)" : "scale(1)",
                          boxShadow: isActive
                            ? "0 0 14px rgba(139,124,246,0.6)"
                            : "none",
                          transition: "all 0.18s ease",
                        }}
                      >
                        {v === "ja"
                          ? "Ja"
                          : v === "nein"
                            ? "Nein"
                            : "Weiß ich nicht"}
                      </button>
                    );
                  })}
                </div>

                {/* RECHTSSCHUTZ SUBOPTIONEN */}
                {id === "rechtsschutz" && answers[id] === "ja" && (
                  <div className="subOptions">
                    {["Privat", "Beruf", "Verkehr", "Immobilie/Miete"].map((opt) => (
                      <Checkbox
                        key={opt}
                        label={opt}
                        checked={answers["rechtsschutz_" + opt]}
                        onChange={(e) =>
                          answer("rechtsschutz_" + opt, e.target.checked)
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      <button
        className="primaryBtn"
        onClick={() => {
          if (currentCategoryIndex < categories.length - 1) {
            setCurrentCategoryIndex((prev) => prev + 1);
          } else {
            setStep("dashboard");
          }
        }}
      >
        {currentCategoryIndex < categories.length - 1
          ? "Weiter"
          : "Auswertung"}
      </button>

      {showInfo && (
        <div
          className="infoOverlay"
          onClick={() => setShowInfo(null)}
        >
          <div
            className="infoBox"
            onClick={(e) => e.stopPropagation()}
          >
            {showInfo.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      <ContactButton onReset={() => setShowResetConfirm(true)} />
      {ResetOverlay}
    </div>
  );
}

  /* ================= DASHBOARD ================= */

  if (step === "dashboard") {

  return (
    <div className="screen">
      <Header reset={resetAll} back={() => setStep("category")} />

      <h2 className="dashboardTitle">
        {baseData.vorname
          ? `${baseData.vorname}, dein Status`
          : "Dein Status"}
      </h2>

      {/* Score Ring */}
      <div className="ringWrap">
        <svg width="220" height="220">
          <circle
            cx="110"
            cy="110"
            r="90"
            stroke="#1a2a36"
            strokeWidth="16"
            fill="none"
          />

          <circle
            cx="110"
            cy="110"
            r="90"
            stroke="url(#grad)"
            strokeWidth="16"
            fill="none"
            strokeDasharray="565"
            strokeDashoffset={565 - (565 * animatedScore) / 100}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
            style={{
              filter: "drop-shadow(0 0 12px rgba(139,124,246,0.6))",
              transition: "0.6s ease",
            }}
          />

          <defs>
            <linearGradient id="grad">
              <stop offset="0%" stopColor="#8B7CF6" />
              <stop offset="100%" stopColor="#5E4AE3" />
            </linearGradient>
          </defs>
        </svg>

        <div className="ringCenter">{animatedScore}%</div>
      </div>

      {/* Bewertung + Hinweis */}
      <div className="scoreLabel">
        <p>
          {animatedScore >= 80
            ? "Sehr gut abgesichert"
            : animatedScore >= 60
            ? "Solide Basis"
            : "Optimierung sinnvoll"}
        </p>

        <p style={{ fontSize: 14, opacity: 0.75, marginTop: 6 }}>
          {getDynamicHint()}
        </p>
      </div>

      {/* Kategorien Übersicht */}
      <div className="categoryList">
        {categories.map((cat) => {
          const questionsInCat = Object.keys(QUESTIONS).filter((id) => {
            const q = QUESTIONS[id];

            if (q.category !== cat) return false;
            if (q.condition && !q.condition(baseData)) return false;
            if (answers[id] === undefined) return false;

            return true;
          });

          const needsOptimization = questionsInCat.filter((id) =>
            getStrategicRecommendation(id)
          );

          const isOpen = expandedCategory === cat;

          return (
            <div key={cat}>
              <div
                className="categoryRow"
                onClick={() =>
                  setExpandedCategory(isOpen ? null : cat)
                }
                style={{ cursor: "pointer" }}
              >
                <span>{CATEGORY_LABELS[cat]}</span>
                <span>{categoryScores[cat] || 0}%</span>
              </div>

              {isOpen && (
                <div className="categoryDetails open">
                  {needsOptimization.length > 0 ? (
                    needsOptimization.map((id) => (
                      <div key={id} className="recommendationItem">
                        <strong>{QUESTIONS[id].label}</strong>
                        <p>{getStrategicRecommendation(id)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="noIssues">
                      Kein unmittelbarer Optimierungsbedarf.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ContactButton onReset={() => setShowResetConfirm(true)} />
      {ResetOverlay}
    </div>
  );
  }
  
  /* ================= UI COMPONENTS ================= */

  function Header({ reset, back }) {
    return (
      <div className="header">
        <img
          src="/logo.jpg"
          className="logo small"
          onClick={reset}
          alt="Logo"
        />
        <button className="backBtn" onClick={back}>
          <span className="arrowIcon"></span>
        </button>
      </div>
    );
  }

  function Input({
    label,
    type = "text",
    value,
    onChange,
    onEnter,
    inputRef,
  }) {
    return (
      <div className="field">
        {label && <label>{label}</label>}
        <input
          ref={inputRef}
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter) {
              e.preventDefault();
              onEnter();
            }
          }}
        />
      </div>
    );
  }

  function Select({ label, options, onChange, value }) {
    return (
      <div className="field">
        {label && <label>{label}</label>}
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Bitte wählen</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  }

  function Checkbox({ label, checked, onChange }) {
    return (
      <label className="checkbox">
        <input
          type="checkbox"
          checked={!!checked}
          onChange={onChange}
        />
        {label}
      </label>
    );
  }

  function ContactButton({ onReset }) {
    return (
      <div className="contactFixed">
        <button
          className="contactBtn"
          onClick={() =>
            window.open(
              "https://agentur.barmenia.de/florian_loeffler",
              "_blank"
            )
          }
        >
          Kontakt aufnehmen
        </button>

        <button
          className="contactBtn secondary"
          onClick={onReset}
        >
          Neustart
        </button>
      </div>
    );
  }
}
