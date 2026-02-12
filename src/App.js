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

/* ================= PRODUKTSTRUKTUR ================= */

const PRODUCT_STRUCTURE = {
  krankenzusatz: {
    label: "Krankenzusatzversicherung",
    products: [
      { name: "Kombi (Mehr für Sie)", url: "#" },
      { name: "Zahn (Mehr Zahn und Mehr Zahnvorsorge)", url: "#" },
      { name: "Zahn (Mehr Zahn)", url: "#" },
      { name: "Zahn (Mehr Zahnvorsorge)", url: "#" },
      { name: "Zahn (DentPlus/ZIB)", url: "#" },
      { name: "Ambulant (Mehr Gesundheit und Mehr Sehen)", url: "#" },
      { name: "Ambulant (Mehr Gesundheit)", url: "#" },
      { name: "Stationär (Mehr Komfort)", url: "#" },
      { name: "Stationär (BKKST)", url: "#" },
      { name: "Exclusiv+", url: "#" },
    ]
  },

  reise: {
    label: "Reiseversicherung",
    products: [
      { name: "Travel+ / Travel Day", url: "#" },
      { name: "BKKR", url: "#" },
    ]
  },

  tier: {
    label: "Rund ums Tier",
    products: [
      { name: "Hund, Katze und Pferd", url: "#" },
      { name: "Hunde-KV", url: "#" },
      { name: "Hunde-OP", url: "#" },
      { name: "Katzen-KV", url: "#" },
      { name: "Katzen-OP", url: "#" },
      { name: "Pferde-OP", url: "#" },
      { name: "Tierhalterhaftpflicht", url: "#" },
    ]
  },

  haftpflicht: {
    label: "Haus und Haftpflicht",
    products: [
      { name: "Privathaftpflicht", url: "#" },
      { name: "Hausrat", url: "#" },
      { name: "Berufshaftpflicht (Heilberufe)", url: "#" },
      { name: "Berufshaftpflicht (Psychologische Berufe)", url: "#" },
    ]
  },

  mobilitaet: {
    label: "Mobilität",
    products: [
      { name: "Fahrradversicherung", url: "#" },
      { name: "Kfz-Versicherung", url: "#" },
    ]
  },

  unfall: {
    label: "Unfall und Invalidität",
    products: [
      { name: "UnfallhilfeSofort", url: "#" },
      { name: "Unfallversicherung", url: "#" },
      { name: "Kinder-Invaliditätsvorsorge (KISS)", url: "#" },
    ]
  }
};

export default function App() {

  /* ================= STEP & CORE STATE ================= */

  const [step, setStep] = useState("welcome");
  const [answers, setAnswers] = useState({});

  const [baseData, setBaseData] = useState({
    geschlecht: "",
    vorname: "",
    nachname: "",
    alter: "",
    gehalt: "",
    beziehungsstatus: "",
    beruf: "",
    kinder: "",
    kinderAnzahl: "",
    tiere: "",
    wohnen: "",
    kfz: "",
    kfzAnzahl: ""
  });

  const updateBaseData = React.useCallback((field, value) => {
    setBaseData(prev => {
      if (prev[field] === value) return prev;
      return { ...prev, [field]: value };
    });
  }, []);


  /* ================= UI STATE ================= */

  const [animatedScore, setAnimatedScore] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInfo, setShowInfo] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [legalOverlay, setLegalOverlay] = useState(null);
  // "impressum" | "datenschutz" | null
  const [expandedProductCategory, setExpandedProductCategory] = useState(null);

  /* ================= BASE FORM REFS ================= */

  const baseFormRefs = {
    geschlecht: React.useRef(null),
    vorname: React.useRef(null),
    nachname: React.useRef(null),
    alter: React.useRef(null),
    gehalt: React.useRef(null),
    beziehungsstatus: React.useRef(null),
    beruf: React.useRef(null),
    kinder: React.useRef(null),
    kinderAnzahl: React.useRef(null),
    tiere: React.useRef(null),
    wohnen: React.useRef(null),
    kfz: React.useRef(null),
    kfzAnzahl: React.useRef(null),
  };


  /* ================= BASE INPUT ORDER ================= */

  const baseInputOrder = [
    baseFormRefs.geschlecht,
    baseFormRefs.vorname,
    baseFormRefs.nachname,
    baseFormRefs.alter,
    baseFormRefs.gehalt,
    baseFormRefs.beziehungsstatus,
    baseFormRefs.beruf,
    baseFormRefs.kinder,
    baseFormRefs.kinderAnzahl,
    baseFormRefs.tiere,
    baseFormRefs.wohnen,
    baseFormRefs.kfz,
    baseFormRefs.kfzAnzahl,
  ];


  /* ================= FOCUS LOGIC ================= */

  function focusNext(currentRef) {
    const index = baseInputOrder.indexOf(currentRef);
    if (index === -1) return;

    const nextRef = baseInputOrder[index + 1];

    if (nextRef?.current) {
      nextRef.current.focus();
    }
  }

  /* ================= DYNAMISCHE KATEGORIEN ================= */

  const categories = useMemo(() => {
    return Object.keys(CATEGORY_WEIGHTS).filter((cat) => {

      const relevantQuestions = Object.keys(QUESTIONS).filter((id) => {
        const q = QUESTIONS[id];

        if (q.category !== cat) return false;
        if (q.condition && !q.condition(baseData)) return false;

        return true;
      });

      return relevantQuestions.length > 0;
    });
  }, [baseData]);

  const currentCategory = categories[currentCategoryIndex];

  /* ===== FLOW-SCHUTZ ===== */

  useEffect(() => {
    if (step !== "category") return;

    if (currentCategoryIndex >= categories.length) {
      setCurrentCategoryIndex(0);
    }
  }, [categories, currentCategoryIndex, step]);

  /* ================= RESET ================= */

  function resetAll() {
    setStep("welcome");
    setAnswers({});
    setBaseData({
      geschlecht: "",
      vorname: "",
      nachname: "",
      alter: "",
      gehalt: "",
      beziehungsstatus: "",
      beruf: "",
      kinder: "",
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

    return categories.reduce((acc, cat) => {

      const relevantQuestions = Object.keys(QUESTIONS).filter((id) => {
        const q = QUESTIONS[id];

        if (q.category !== cat) return false;
        if (q.condition && !q.condition(baseData)) return false;
        if (answers[id] === undefined) return false;

        return true;
      });

      if (relevantQuestions.length === 0) {
        acc[cat] = 0;
        return acc;
      }

      const scoredQuestions = relevantQuestions.filter(
        (id) => getScore(id) !== null
      );

      if (scoredQuestions.length === 0) {
        acc[cat] = 0;
        return acc;
      }

      const sum = scoredQuestions.reduce(
        (total, id) => total + getScore(id),
        0
      );

      acc[cat] = Math.round(sum / scoredQuestions.length);

      return acc;

    }, {});

  }, [answers, baseData, categories]);


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
    if (step !== "dashboard") return;

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
  }, [totalScore, step]);

  /* ================= PRODUKTSEITE ================= */

  if (step === "products") {
    return (
      <div className="screen">
        <Header reset={resetAll} back={() => setStep("dashboard")} />

        <h2>Abschlussmöglichkeiten</h2>

        <div className="categoryList">
          {Object.keys(PRODUCT_STRUCTURE).map((key) => {
            const category = PRODUCT_STRUCTURE[key];
            const isOpen = expandedProductCategory === key;

            return (
              <div key={key}>

                {/* Kategorie Kopf */}
                <div
                  className="categoryRow"
                  onClick={() =>
                    setExpandedProductCategory(isOpen ? null : key)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <span>{category.label}</span>

                  <div
                    className="categoryChevron"
                    style={{
                      transform: isOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Produkte */}
                {isOpen && (
                  <div className="categoryDetails open">

                    {category.products.map((product, index) => (
                      <div key={index} className="productRow">

                        <div className="productName">
                          {product.name}
                        </div>

                        <button
                          className="productButton"
                          onClick={() =>
                            window.open(product.url, "_blank", "noopener,noreferrer")
                          }
                        >
                          Abschließen
                        </button>

                      </div>
                    ))}

                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Footer gehört UNTER die gesamte Liste */}
        <div className="legalFooter">
          <span onClick={() => setLegalOverlay("impressum")}>
            Impressum
          </span>
          {" | "}
          <span onClick={() => setLegalOverlay("datenschutz")}>
            Datenschutz
          </span>
        </div>

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        <ResetOverlayComponent />
      </div>
    );
  }

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

  /* ================= LEGAL OVERLAY ================= */

  const LegalOverlay = legalOverlay && (
    <div
      className="infoOverlay"
      onClick={() => setLegalOverlay(null)}
    >
      <div
        className="infoBox legalBox"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: 12 }}>
          {legalOverlay === "impressum" ? "Impressum" : "Datenschutz"}
        </h3>

        {legalOverlay === "impressum" && (
          <>
            <p><strong>Florian Löffler</strong></p>
            <p>Breisacher Str. 145b<br />79110 Freiburg</p>
            <p>Telefon: 0761-2027423<br />E-Mail: florian.loeffler@barmenia.de</p>
            <p>Vermittlerregisternummer: D-3ED0-I0NGJ-87</p>
            <p>
              Registrierungsstelle:<br />
              DIHK | Deutscher Industrie- und Handelskammertag e. V.<br />
              www.vermittlerregister.info
            </p>
          </>
        )}

        {legalOverlay === "datenschutz" && (
          <>
            <p>
              Diese Anwendung speichert keine personenbezogenen Daten.
            </p>
            <p>
              Alle Eingaben erfolgen ausschließlich lokal im Browser
              und werden nicht an Server übertragen.
            </p>
            <p>
              Beim Klick auf externe Links (z. B. Rechner oder Kontakt)
              gelten die Datenschutzbestimmungen der jeweiligen Anbieter.
            </p>
          </>
        )}
      </div>
    </div>
  );
  /* ================= RESET OVERLAY ================= */

  function ResetOverlayComponent() {
    if (!showResetConfirm) return null;

    return (
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
  }

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

        <div className="legalFooter">
          <span onClick={() => setLegalOverlay("impressum")}>
            Impressum
          </span>
          {" | "}
          <span onClick={() => setLegalOverlay("datenschutz")}>
            Datenschutz
          </span>
        </div>

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        <ResetOverlayComponent />
        {LegalOverlay}
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
          onChange={(v) => updateBaseData("geschlecht", v)}
          selectRef={baseFormRefs.geschlecht}
          onEnter={() => focusNext(baseFormRefs.geschlecht)}
        />

        <Input
          label="Vorname"
          value={baseData.vorname}
          onChange={(v) => updateBaseData("vorname", v)}
          inputRef={baseFormRefs.vorname}
          onEnter={() => focusNext(baseFormRefs.vorname)}
        />

        <Input
          label="Nachname"
          value={baseData.nachname}
          onChange={(v) => updateBaseData("nachname", v)}
          inputRef={baseFormRefs.nachname}
          onEnter={() => focusNext(baseFormRefs.nachname)}
        />

        <Input
          label="Alter"
          type="number"
          value={baseData.alter}
          onChange={(v) => updateBaseData("alter", v)}
          inputRef={baseFormRefs.alter}
          onEnter={() => focusNext(baseFormRefs.alter)}
        />

        <Input
          label="Monatliches Netto-Gehalt (€)"
          type="number"
          value={baseData.gehalt}
          onChange={(v) => updateBaseData("gehalt", v)}
          inputRef={baseFormRefs.gehalt}
          onEnter={() => focusNext(baseFormRefs.gehalt)}
        />

        <Select
          label="Beziehungsstatus"
          options={[
            "Single",
            "Partnerschaft",
            "Verheiratet"
          ]}
          value={baseData.beziehungsstatus}
          onChange={(v) => updateBaseData("beziehungsstatus", v)}
          selectRef={baseFormRefs.beziehungsstatus}
          onEnter={() => focusNext(baseFormRefs.beziehungsstatus)}
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
          onChange={(v) => updateBaseData("beruf", v)}
          selectRef={baseFormRefs.beruf}
          onEnter={() => focusNext(baseFormRefs.beruf)}
        />

        <Select
          label="Hast du Kinder?"
          options={["Nein", "Ja"]}
          value={baseData.kinder}
          onChange={(v) => updateBaseData("kinder", v)}
          selectRef={baseFormRefs.kinder}
          onEnter={() => focusNext(baseFormRefs.kinder)}
        />

        {baseData.kinder === "Ja" && (
          <Input
            label="Anzahl Kinder"
            type="number"
            value={baseData.kinderAnzahl}
            onChange={(v) => updateBaseData("kinderAnzahl", v)}
            inputRef={baseFormRefs.kinderAnzahl}
            onEnter={() => focusNext(baseFormRefs.kinderAnzahl)}
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
          onChange={(v) => updateBaseData("tiere", v)}
          selectRef={baseFormRefs.tiere}
          onEnter={() => focusNext(baseFormRefs.tiere)}
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
          onChange={(v) => updateBaseData("wohnen", v)}
          selectRef={baseFormRefs.wohnen}
          onEnter={() => focusNext(baseFormRefs.wohnen)}
        />

        <Select
          label="Besitzt du ein Fahrzeug? (z. B. Auto, Motorrad, Roller, Mofa)"
          options={["Nein", "Ja"]}
          value={baseData.kfz}
          onChange={(v) => updateBaseData("kfz", v)}
          selectRef={baseFormRefs.kfz}
          onEnter={() => focusNext(baseFormRefs.kfz)}
        />

        {baseData.kfz === "Ja" && (
          <Input
            label="Anzahl Fahrzeuge"
            type="number"
            value={baseData.kfzAnzahl}
            onChange={(v) => updateBaseData("kfzAnzahl", v)}
            inputRef={baseFormRefs.kfzAnzahl}
            onEnter={() => focusNext(baseFormRefs.kfzAnzahl)}
          />
        )}

        <button
          className="primaryBtn"
          onClick={() => setStep("category")}
        >
          Weiter
        </button>

        <div className="legalFooter">
          <span onClick={() => setLegalOverlay("impressum")}>
            Impressum
          </span>
          {" | "}
          <span onClick={() => setLegalOverlay("datenschutz")}>
            Datenschutz
          </span>
        </div>

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        <ResetOverlayComponent />
        {LegalOverlay}
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
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="3" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                    <line x1="8" y1="10" x2="8" y2="14" />
                    <line x1="12" y1="10" x2="12" y2="14" />
                    <line x1="16" y1="10" x2="16" y2="14" />
                    <line x1="8" y1="17" x2="16" y2="17" />
                  </svg>
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

        <div className="legalFooter">
          <span onClick={() => setLegalOverlay("impressum")}>
            Impressum
          </span>
          {" | "}
          <span onClick={() => setLegalOverlay("datenschutz")}>
            Datenschutz
          </span>
        </div>

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        <ResetOverlayComponent />
        {LegalOverlay}
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

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{categoryScores[cat] || 0}%</span>

                    <div
                      className="categoryChevron"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
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

        <button
          className="primaryBtn"
          style={{ marginTop: 20 }}
          onClick={() => setStep("products")}
        >
          Alle Abschlussmöglichkeiten anzeigen
        </button>

        <div className="legalFooter">
          <span onClick={() => setLegalOverlay("impressum")}>
            Impressum
          </span>
          {" | "}
          <span onClick={() => setLegalOverlay("datenschutz")}>
            Datenschutz
          </span>
        </div>

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        <ResetOverlayComponent />
        {LegalOverlay}
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
    inputRef,
    onEnter,
  }) {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && onEnter) {
        e.preventDefault();
        onEnter();
      }
    };

    return (
      <div className="field">
        {label && <label>{label}</label>}

        <input
          ref={inputRef}
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }

  function Select({
    label,
    options,
    value,
    onChange,
    selectRef,
    onEnter,
  }) {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && onEnter) {
        e.preventDefault();
        onEnter();
      }
    };

    return (
      <div className="field">
        {label && <label>{label}</label>}

        <select
          ref={selectRef}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
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

  function Checkbox({
    label,
    checked,
    onChange,
  }) {
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