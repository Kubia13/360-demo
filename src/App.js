import React, { useState, useMemo } from "react";
import "./index.css";

/* ================= IMPORT UI ================= */

import { Header, Select, Checkbox, ContactButton } from "./components/UI";


/* ================= IMPORT CONFIG ================= */

import { ACTION_MAP } from "./config/actionMap";
import { CATEGORY_LABELS } from "./config/categoryLabels";
import { CATEGORY_WEIGHTS } from "./config/categoryWeights";
import { CORE_PRODUCTS } from "./config/coreProducts";
import { PRIORITY_MAP } from "./config/priorityMap";

/* ================= IMPORT DATA ================= */

import { PRODUCT_STRUCTURE } from "./data/productStructure";
import { QUESTIONS } from "./data/questions";

/* ================= IMPORT HOOKS ================= */

import { useBaseFormNavigation } from "./hooks/useBaseFormNavigation";
import { useBaseDataValidation } from "./hooks/useBaseDataValidation";
import { useBuIncomeAutoSync } from "./hooks/useBuIncomeAutoSync";
import { useCategoryFlowGuard } from "./hooks/useCategoryFlowGuard";
import { useOverlayEffects } from "./hooks/useOverlayEffects";
import { useScoreAnimation } from "./hooks/useScoreAnimation";
import { useTopRecommendations } from "./hooks/useTopRecommendations";


/* ================= IMPORT LOGIC ================= */

import { getDynamicCategories } from "./logic/categoryEngine";
import { getDynamicHint } from "./logic/dashboardEngine";
import { getStrategicRecommendation } from "./logic/recommendationEngine";
import { resetAppState } from "./logic/resetAppState";
import { calculateScoreEngine, getScore } from "./logic/scoring";

/* ================= IMPORT OVERLAYS ================= */

import ActionOverlay from "./overlays/ActionOverlay";
import CalculatorOverlay from "./overlays/CalculatorOverlay";
import ContactOverlay from "./overlays/ContactOverlay";
import LegalOverlay from "./overlays/LegalOverlay";
import PdfOverlay from "./overlays/PdfOverlay";
import PdfPreview from "./overlays/PdfPreview";
import ResetOverlay from "./overlays/ResetOverlay";


/* ================= IMPORT SCREENS ================= */

import BaseScreen from "./screens/BaseScreen";
import CategoryScreen from "./screens/CategoryScreens";
import DashboardScreen from "./screens/DashboardScreen";
import DisclaimerScreen from "./screens/DisclaimerScreen";
import ProductsScreen from "./screens/ProductsScreen";
import WelcomeScreen from "./screens/WelcomeScreen";


/* ================= DEV TOOL ================= */

const DEV_BYPASS =
  process.env.NODE_ENV !== "production" &&
  new URLSearchParams(window.location.search).get("dev") === "1";


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

  /* 🔥 HIER rein */
  const { baseFormRefs, focusNext } = useBaseFormNavigation();

  const baseValidation = useBaseDataValidation({
    baseData,
    answers,
    setAnswers
  });


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

  useBuIncomeAutoSync(baseData.gehalt, setBuIncome);


  /* ================= PDF DATA ================= */

  const [pdfOverlay, _setPdfOverlay] = useState(false);
  const [pdfPreview, _setPdfPreview] = useState(false);

  const setPdfOverlay = (v) => {
    _setPdfOverlay(v);
    if (v) _setPdfPreview(false);
  };

  const setPdfPreview = (v) => {
    _setPdfPreview(v);
    if (v) _setPdfOverlay(false);
  };

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

  useOverlayEffects({
    step,
    currentCategoryIndex,
    screenRef,
    legalOverlay,
    contactOverlay,
    showResetConfirm,
    actionOverlay,
    pdfOverlay,
    calculatorOverlay,
    pdfPreview
  });


  /* ================= BACK WITHOUT RESET================= */

  function goToBaseWithoutReset() {
    setCurrentCategoryIndex(0);
    setStep("base");
    scrollToTop();
  }



  /* ================= DYNAMISCHE KATEGORIEN ================= */

  const categories = useMemo(() => {
    return getDynamicCategories({
      CATEGORY_WEIGHTS,
      QUESTIONS,
      baseData
    });
  }, [baseData]);

  const currentCategory = categories[currentCategoryIndex];

  useCategoryFlowGuard({
    step,
    currentCategoryIndex,
    categories,
    setCurrentCategoryIndex
  });

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


  const topRecommendations = useTopRecommendations({
    step,
    baseData,
    answers,
    QUESTIONS,
    CORE_PRODUCTS,
    PRIORITY_MAP,
    getScore,
    getStrategicRecommendation,
    categoryScores
  });

  /* ================= DYNAMIC DASHBOARD HINT ================= */

  const dynamicHint = useMemo(() => {
    return getDynamicHint({
      baseData,
      answers
    });
  }, [baseData, answers, getDynamicHint]);


  /* ===== SCORE ANIMATION (Hook) ===== */

  useScoreAnimation({
    step,
    totalScore,
    hasValidScoreData,
    setAnimatedScore
  });


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
    resetAppState({
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
    });
  }
  /* ================= ANSWER ================= */

  function answer(key, value) {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
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

          baseValidation={baseValidation}
          devBypass={DEV_BYPASS}
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
          dynamicHint={dynamicHint}
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
          QUESTIONS={QUESTIONS}
          devBypass={DEV_BYPASS}
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


