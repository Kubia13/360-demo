import React, { useState, useEffect, useMemo } from "react";
import "./index.css";


/* ================= IMPORT CONFIG ================= */

import { CATEGORY_WEIGHTS } from "./config/categoryWeights";
import { CATEGORY_LABELS } from "./config/categoryLabels";
import { PRIORITY_MAP } from "./config/priorityMap";
import { CORE_PRODUCTS } from "./config/coreProducts";
import { ACTION_MAP } from "./config/actionMap";


/* ================= IMPORT DATA ================= */

import { QUESTIONS } from "./data/questions";
import { PRODUCT_STRUCTURE } from "./data/productStructure";


/* ================= IMPORT LOGIC ================= */

import { calculateScoreEngine } from "./logic/scoring";
import { getScore } from "./logic/scoring";
import { getStrategicRecommendation } from "./logic/recommendationEngine";


/* ================= IMPORT OVERLAYS ================= */

import ActionOverlay from "./overlays/ActionOverlay";
import ContactOverlay from "./overlays/ContactOverlay";
import LegalOverlay from "./overlays/LegalOverlay";
import ResetOverlay from "./overlays/ResetOverlay";

import PdfOverlay from "./overlays/PdfOverlay";
import CalculatorOverlay from "./overlays/CalculatorOverlay";
import PdfPreview from "./overlays/PdfPreview";


/* ================= IMPORT SCREENS ================= */

import DashboardScreen from "./screens/DashboardScreen";
import CategoryScreen from "./screens/CategoryScreens";
import ProductsScreen from "./screens/ProductsScreen";

import WelcomeScreen from "./screens/WelcomeScreen";
import DisclaimerScreen from "./screens/DisclaimerScreen";
import BaseScreen from "./screens/BaseScreen";


/* ================= IMPORT UI ================= */

import { Header, Input, Select, Checkbox, ContactButton } from "./components/UI";


/* ================= APP ================= */

export default function App() {


  /* ================= STEP & CORE STATE ================= */

  const [step, setStep] = useState("welcome");
  const [answers, setAnswers] = useState({});
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const screenRef = React.useRef(null);



  const [baseData, setBaseData] = useState({
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


  const updateBaseData = React.useCallback((field, value) => {
    setBaseData(prev => {
      if (prev[field] === value) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  /* ===== CLEANUP NICHT MEHR RELEVANTE ANTWORTEN ===== */

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

  }, [baseData.kinder, baseData.kfz, baseData.tiere]);

  /* ================= UI STATE ================= */

  const [contactOverlay, setContactOverlay] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInfo, setShowInfo] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [legalOverlay, setLegalOverlay] = useState(null);
  // "impressum" | "datenschutz" | "hinweis" | null
  const [expandedProductCategory, setExpandedProductCategory] = useState(null);
  const [actionOverlay, setActionOverlay] = useState(null);
  const [calculatorOverlay, setCalculatorOverlay] = useState(false);
  const [buIncome, setBuIncome] = useState("");

  /* ===== BU RECHNER VORBELEGUNG ===== */

  useEffect(() => {
    if (baseData.gehalt) {
      setBuIncome(String(baseData.gehalt));
    } else {
      setBuIncome("");
    }
  }, [baseData.gehalt]);


  /* ================= PDF DATA ================= */

  const [pdfOverlay, setPdfOverlay] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(false); // ← DAS FEHLT

  const [pdfData, setPdfData] = useState({
    adresse: "",
    plz: "",
    ort: "",
    geburtsdatum: "",
    email: "",
    telefon: "",
    handy: "",
    rentenluecke: "",
    ktgEmpfehlung: "",
    buEmpfehlung: ""   // <-- NEU
  });

  /* ================= BASE FORM REFS ================= */

  const baseFormRefs = useMemo(() => ({
    anrede: React.createRef(),
    vorname: React.createRef(),
    nachname: React.createRef(),
    alter: React.createRef(),
    beziehungsstatus: React.createRef(),
    beruf: React.createRef(),
    krankenversicherung: React.createRef(),
    gehalt: React.createRef(),
    kinder: React.createRef(),
    kinderKrankenversicherung: React.createRef(),
    kinderAnzahl: React.createRef(),
    tiere: React.createRef(),
    wohnen: React.createRef(),
    kfz: React.createRef(),
    kfzAnzahl: React.createRef(),
  }), []);


  /* ================= BASE INPUT ORDER ================= */

  const baseInputOrder = useMemo(() => [
    baseFormRefs.anrede,
    baseFormRefs.vorname,
    baseFormRefs.nachname,
    baseFormRefs.alter,
    baseFormRefs.beziehungsstatus,
    baseFormRefs.beruf,
    baseFormRefs.krankenversicherung,
    baseFormRefs.gehalt,
    baseFormRefs.kinder,
    baseFormRefs.kinderKrankenversicherung,
    baseFormRefs.kinderAnzahl,
    baseFormRefs.tiere,
    baseFormRefs.wohnen,
    baseFormRefs.kfz,
    baseFormRefs.kfzAnzahl,
  ], [baseFormRefs]);

  /* ================= FOCUS LOGIC ================= */

  function focusNext(currentRef) {
    const index = baseInputOrder.indexOf(currentRef);
    if (index === -1) return;

    const nextRef = baseInputOrder[index + 1];

    if (nextRef?.current) {
      nextRef.current.focus();
    }
  }

  /* ================= BACK WITHOUT RESET================= */

  function goToBaseWithoutReset() {
    setCurrentCategoryIndex(0);
    setStep("base");
    scrollToTop();
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

  /* ================= SCORE ENGINE ================= */

  const {
    categoryScores,
    totalScore,
    hasValidScoreData,
    isPdfValid
  } = useMemo(() => {
    return calculateScoreEngine({
      answers,
      baseData,
      categories,
      pdfData
    });
  }, [answers, baseData, categories, pdfData]);

  /* ================= FLOW-SCHUTZ ===== */

  useEffect(() => {
    if (step !== "category") return;

    if (currentCategoryIndex >= categories.length) {
      setCurrentCategoryIndex(0);
    }
  }, [categories, currentCategoryIndex, step]);


  // ================= SCROLL TO TOP HELPER (ANDROID SAFE) =================
  const scrollToTop = () => {
    // Aktives Input schließen (Keyboard schließen)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Kleine Verzögerung für Android Keyboard Animation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });

      if (screenRef?.current) {
        screenRef.current.scrollTo({
          top: 0,
          behavior: "auto"
        });
      }
    }, 100); // 80–120ms optimal für Android
  };



  /* ================= RESET ================= */

  function resetAll() {
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

    // 🔥 DAS MUSS HIER REIN
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
      ktgEmpfehlung: "",
    });
    scrollToTop();
  }

  /* ================= ANSWER ================= */

  function answer(key, value) {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /* ===== SCORE ANIMATION ===== */

  useEffect(() => {
    if (step !== "dashboard") return;

    if (!hasValidScoreData) {
      setAnimatedScore(0);
      return;
    }

    let current = 0;
    setAnimatedScore(0);

    const interval = setInterval(() => {
      current++;

      if (current >= totalScore) {
        current = totalScore;
        clearInterval(interval);
      }

      setAnimatedScore(current);
    }, 8);

    return () => clearInterval(interval);

  }, [totalScore, step, hasValidScoreData]);



  /* ===== CATEGORY SCROLL FIX – FINAL STABLE ===== */

  useEffect(() => {

    if (step !== "category") return;

    if (screenRef.current) {
      screenRef.current.scrollTo({
        top: 0,
        behavior: "auto"   // wichtig: kein smooth hier!
      });
    }

  }, [currentCategoryIndex, step]);


  /* ===== OVERLAY SCROLL LOCK (FIXED) ===== */

  useEffect(() => {

    const overlayOpen =
      Boolean(legalOverlay) ||
      Boolean(contactOverlay) ||
      Boolean(showResetConfirm) ||
      Boolean(actionOverlay) ||
      Boolean(pdfOverlay) ||
      Boolean(calculatorOverlay) ||
      Boolean(pdfPreview);

    if (overlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };

  }, [
    legalOverlay,
    contactOverlay,
    showResetConfirm,
    actionOverlay,
    pdfOverlay,
    calculatorOverlay,
    pdfPreview
  ]);


  /* ===== GLOBAL FOCUS SMOOTH SCROLL ===== */

  useEffect(() => {

    const handleFocus = (e) => {

      if (!e || !e.target) return;

      const el = e.target;

      if (typeof el.scrollIntoView !== "function") return;

      // 🔥 Nur reagieren wenn Overlay aktiv ist
      const overlayOpen =
        Boolean(legalOverlay) ||
        Boolean(contactOverlay) ||
        Boolean(showResetConfirm) ||
        Boolean(actionOverlay) ||
        Boolean(pdfOverlay) ||
        Boolean(calculatorOverlay) ||
        Boolean(pdfPreview);

      if (!overlayOpen) return;

      setTimeout(() => {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 120);
    };


    document.addEventListener("focusin", handleFocus);

    return () => {
      document.removeEventListener("focusin", handleFocus);
    };

  }, [
    legalOverlay,
    contactOverlay,
    showResetConfirm,
    actionOverlay,
    pdfOverlay,
    calculatorOverlay,
    pdfPreview
  ]);


  /* ================= TOP 3 HANDLUNGSFELDER ================= */

  const topRecommendations = useMemo(() => {

    if (step !== "dashboard") return [];

    const EXCLUDED_FROM_TOP3 = [
      "elementar",
      "schutzbrief"
    ];

    const hatKinder = baseData.kinder === "Ja";
    const verheiratet = baseData.beziehungsstatus === "Verheiratet";
    const hatHaus = baseData.wohnen === "Eigentum Haus";
    const income = Number(baseData.gehalt);
    const age = Number(baseData.alter);

    const existenzProdukte = [
      "bu", "du", "haftpflicht",
      "risiko_lv", "ruecklagen"
    ];

    const kinderProdukte = [
      "kinder_unfall",
      "kinder_vorsorge",
      "kinder_krankenzusatz"
    ];

    const komfortProdukte = [
      "kasko",
      "krankenzusatz",
      "hausrat"
    ];

    const allRecommendations = Object.keys(QUESTIONS)
      .filter((id) => {

        if (!CORE_PRODUCTS.includes(id)) return false;
        if (EXCLUDED_FROM_TOP3.includes(id)) return false;

        const q = QUESTIONS[id];
        if (q.condition && !q.condition(baseData)) return false;

        const score = getScore(id, answers, baseData);
        if (score === null) return false;
        if (score >= 100) return false;

        // Vollkasko nie empfehlen
        if (id === "kasko" && answers[id] === "vollkasko") return false;

        const text = getStrategicRecommendation(id, answers, baseData);
        if (!text) return false;

        /* ===== HARTE EXISTENZ-SPERRE ===== */

        const existenzScore = categoryScores["existenz"];

        const komfortProdukte = [
          "kasko",
          "krankenzusatz",
          "hausrat"
        ];

        if (
          existenzScore !== null &&
          existenzScore < 50 &&
          komfortProdukte.includes(id)
        ) {
          return false;
        }

        return true;
      })


      .map((id) => {

        let dynamicPriority = PRIORITY_MAP[id] || 1;

        const score = getScore(id, answers, baseData);
        const text = getStrategicRecommendation(id, answers, baseData);

        if (score === null || score === undefined) return null;
        if (!text) return null;

        const existenzScore = categoryScores["existenz"];

        const hatBU = answers.bu === "ja" || answers.du === "ja";
        const hatRuecklagen = answers.ruecklagen === "ja";
        const hatHaftpflicht = answers.haftpflicht === "ja";
        const hatRisikoLV = answers.risiko_lv === "ja";

        const hatHaus = baseData.wohnen === "Eigentum Haus";
        const hatFamilie =
          baseData.beziehungsstatus === "Verheiratet" ||
          baseData.kinder === "Ja";

        /* ================= SCORE-SCHWEREGRAD ================= */

        if (score <= 20) {
          dynamicPriority += 2;
        } else if (score <= 40) {
          dynamicPriority += 1;
        }

        /* ================= EXISTENZ VOR KOMFORT (dein Original) ================= */

        if (existenzProdukte.includes(id)) {
          dynamicPriority += 2;
        }

        /* ================= HARTE EXISTENZ-LOGIK ================= */

        if (!hatBU && !hatRuecklagen) {
          if (["bu", "du", "ruecklagen"].includes(id)) {
            dynamicPriority += 4;
          }
        }

        /* ================= HAFTPFLICHT KRITISCH ================= */

        if (!hatHaftpflicht && id === "haftpflicht") {
          dynamicPriority += 4;
        }

        /* ================= EXISTENZ SCORE < 40 ================= */

        if (existenzScore !== null && existenzScore < 40) {
          if (["bu", "du", "ruecklagen", "risiko_lv"].includes(id)) {
            dynamicPriority += 2;
          }
        }

        /* ================= FAMILIEN-BOOST (dein Original) ================= */

        if (hatKinder || verheiratet) {

          if (["bu", "du", "risiko_lv", "ruecklagen"].includes(id)) {
            dynamicPriority += 2;
          }

          if (kinderProdukte.includes(id)) {
            dynamicPriority += 1.5;
          }
        }

        /* ================= IMMOBILIEN-BOOST (verstärkt) ================= */

        if (hatHaus) {

          if (["gebaeude", "risiko_lv", "ruecklagen"].includes(id)) {
            dynamicPriority += 2;
          }

          if (!hatRisikoLV && id === "risiko_lv") {
            dynamicPriority += hatFamilie ? 3 : 2;
          }
        }

        /* ================= EINKOMMENS-HEBEL (dein Original) ================= */

        if (income >= 4000) {

          if (["bu", "du", "private_rente", "ruecklagen"].includes(id)) {
            dynamicPriority += 1;
          }
        }

        /* ================= ALTER-LOGIK (dein Original) ================= */

        if (age < 30) {

          if (["bu", "bav", "private_rente"].includes(id)) {
            dynamicPriority += 1;
          }
        }

        if (age >= 45) {

          if (["pflege", "private_rente"].includes(id)) {
            dynamicPriority += 1;
          }
        }

        /* ================= KOMFORT DECKEL ================= */

        if (komfortProdukte.includes(id)) {
          dynamicPriority = Math.min(dynamicPriority, 4);
        }

        return {
          id,
          text,
          priority: dynamicPriority,
          score
        };

      })
      .filter(Boolean)
      .sort((a, b) => {

        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }

        return a.score - b.score;
      });
    return allRecommendations.slice(0, 3);

  }, [answers, baseData, step, categoryScores])


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


  return (
    <>
      {step === "welcome" && (
        <WelcomeScreen
          setStep={setStep}
          setLegalOverlay={setLegalOverlay}
          setShowResetConfirm={setShowResetConfirm}
          setContactOverlay={setContactOverlay}
        />
      )}

      {step === "disclaimer" && (
        <DisclaimerScreen
          disclaimerAccepted={disclaimerAccepted}
          setDisclaimerAccepted={setDisclaimerAccepted}
          setStep={setStep}
        />
      )}

      {step === "base" && (
        <BaseScreen
          baseData={baseData}
          updateBaseData={updateBaseData}
          baseFormRefs={baseFormRefs}
          focusNext={focusNext}
          setStep={setStep}
          scrollToTop={scrollToTop}
          goToBaseWithoutReset={goToBaseWithoutReset}
          setLegalOverlay={setLegalOverlay}
          setShowResetConfirm={setShowResetConfirm}
          setContactOverlay={setContactOverlay}
        />
      )}

      {step === "dashboard" && (
        <DashboardScreen
          screenRef={screenRef}
          Header={Header}
          goToBaseWithoutReset={goToBaseWithoutReset}
          setStep={setStep}
          scrollToTop={scrollToTop}
          baseData={baseData}
          animatedScore={animatedScore}
          hasValidScoreData={hasValidScoreData}
          getDynamicHint={getDynamicHint}
          topRecommendations={topRecommendations}
          ACTION_MAP={ACTION_MAP}
          QUESTIONS={QUESTIONS}
          setActionOverlay={setActionOverlay}
          categories={categories}
          answers={answers}
          getStrategicRecommendation={getStrategicRecommendation}
          expandedCategory={expandedCategory}
          setExpandedCategory={setExpandedCategory}
          CATEGORY_LABELS={CATEGORY_LABELS}
          categoryScores={categoryScores}
          setCalculatorOverlay={setCalculatorOverlay}
          setShowResetConfirm={setShowResetConfirm}
          setPdfPreview={setPdfPreview}
          pdfOverlay={pdfOverlay}
          setPdfOverlay={setPdfOverlay}
          calculatorOverlay={calculatorOverlay}
          buIncome={buIncome}
          setBuIncome={setBuIncome}
          pdfData={pdfData}
          setPdfData={setPdfData}
          isPdfValid={isPdfValid}
          totalScore={totalScore}
          pdfPreview={pdfPreview}
          setContactOverlay={setContactOverlay}
          setLegalOverlay={setLegalOverlay}
          ContactButton={ContactButton}
        />
      )}

      {step === "products" && (
        <ProductsScreen
          screenRef={screenRef}
          Header={Header}
          PRODUCT_STRUCTURE={PRODUCT_STRUCTURE}
          expandedProductCategory={expandedProductCategory}
          setExpandedProductCategory={setExpandedProductCategory}
          setStep={setStep}
          setLegalOverlay={setLegalOverlay}
          setShowResetConfirm={setShowResetConfirm}
          setContactOverlay={setContactOverlay}
          ContactButton={ContactButton}
        />
      )}

      {step === "category" && (
        <CategoryScreen
          screenRef={screenRef}
          currentCategoryIndex={currentCategoryIndex}
          categories={categories}
          currentCategory={currentCategory}
          baseData={baseData}
          answers={answers}
          answer={answer}
          setCurrentCategoryIndex={setCurrentCategoryIndex}
          setStep={setStep}
          scrollToTop={scrollToTop}
          goToBaseWithoutReset={goToBaseWithoutReset}
          setShowInfo={setShowInfo}
          showInfo={showInfo}
          setLegalOverlay={setLegalOverlay}
          setContactOverlay={setContactOverlay}
          setShowResetConfirm={setShowResetConfirm}
          Header={Header}
          Select={Select}
          Checkbox={Checkbox}
          ContactButton={ContactButton}
        />
      )}

      <ResetOverlay
        showResetConfirm={showResetConfirm}
        setShowResetConfirm={setShowResetConfirm}
        resetAll={resetAll}
      />

      <LegalOverlay
        legalOverlay={legalOverlay}
        setLegalOverlay={setLegalOverlay}
      />

      <ContactOverlay
        contactOverlay={contactOverlay}
        setContactOverlay={setContactOverlay}
      />

      <ActionOverlay
        actionOverlay={actionOverlay}
        setActionOverlay={setActionOverlay}
        setContactOverlay={setContactOverlay}
        ACTION_MAP={ACTION_MAP}
        QUESTIONS={QUESTIONS}
      />

      {/* ===== NEUE AUSGELAGERTE OVERLAYS ===== */}

      <PdfOverlay
        pdfOverlay={pdfOverlay}
        setPdfOverlay={setPdfOverlay}
        pdfData={pdfData}
        setPdfData={setPdfData}
        baseData={baseData}
        buIncome={buIncome}
        setPdfPreview={setPdfPreview}
      />

      <CalculatorOverlay
        calculatorOverlay={calculatorOverlay}
        setCalculatorOverlay={setCalculatorOverlay}
        buIncome={buIncome}
        setBuIncome={setBuIncome}
      />

      {pdfPreview && (
        <PdfPreview
          pdfPreview={pdfPreview}
          setPdfPreview={setPdfPreview}
          totalScore={totalScore}
          topRecommendations={topRecommendations}
          categoryScores={categoryScores}
          baseData={baseData}
          pdfData={pdfData}
          buIncome={buIncome}
          answers={answers}
        />
      )}
    </>
  );

}


