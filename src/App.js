import React, { useState, useEffect } from "react";
import "./index.css";

/* ================= KONFIG ================= */

const CATEGORIES = [
  { key: "existenz", label: "Existenz", weight: 30 },
  { key: "haftung", label: "Haftung", weight: 20 },
  { key: "gesundheit", label: "Gesundheit", weight: 15 },
  { key: "wohnen", label: "Wohnen", weight: 15 },
  { key: "mobilitaet", label: "Mobilität", weight: 10 },
  { key: "vorsorge", label: "Vorsorge", weight: 10 },
];

const QUESTIONS = {
  existenz: [
    "Hast du eine Berufsunfähigkeitsversicherung?",
    "Deckt sie mindestens 60 % deines Nettoeinkommens?",
    "Wurde der Vertrag in den letzten 5 Jahren geprüft?",
  ],
  haftung: [
    "Hast du eine private Haftpflichtversicherung?",
    "Sind hohe Deckungssummen vereinbart?",
  ],
  gesundheit: [
    "Bist du krankenversichert?",
    "Hast du Zusatzversicherungen?",
  ],
  wohnen: [
    "Ist dein Hausrat versichert?",
    "Sind Wertsachen/Fahrräder mitversichert?",
  ],
  mobilitaet: [
    "Ist dein KFZ versichert?",
    "Hast du einen Schutzbrief?",
  ],
  vorsorge: [
    "Sparst du aktiv für das Alter?",
    "Kennst du deine Rentenlücke?",
  ],
};

const SCORE = {
  ja: 100,
  unbekannt: 40,
  nein: 0,
};

/* ================= APP ================= */

export default function App() {
  const [step, setStep] = useState("welcome");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);

  const category = CATEGORIES[categoryIndex];
  const qs = QUESTIONS[category.key];

  function reset() {
    setStep("welcome");
    setCategoryIndex(0);
    setAnswers({});
  }

  function answer(cat, index, value) {
    setAnswers({
      ...answers,
      [cat]: {
        ...(answers[cat] || {}),
        [index]: value,
      },
    });
  }

  function categoryScore(cat) {
    const a = answers[cat] || {};
    const max = QUESTIONS[cat].length * 100;
    const val = QUESTIONS[cat].reduce(
      (sum, _, i) => sum + (SCORE[a[i]] ?? 0),
      0
    );
    return Math.round((val / max) * 100);
  }

  const totalScore = Math.round(
    CATEGORIES.reduce(
      (sum, c) => sum + (categoryScore(c.key) * c.weight) / 100,
      0
    )
  );

  useEffect(() => {
    let cur = 0;
    const timer = setInterval(() => {
      cur += 1;
      if (cur >= totalScore) {
        cur = totalScore;
        clearInterval(timer);
      }
      setAnimatedScore(cur);
    }, 15);
    return () => clearInterval(timer);
  }, [totalScore]);

  /* ================= HEADER ================= */

  const Header = () => (
    <div className="header center">
      <img
        src="/logo.jpg"
        alt="BarmeniaGothaer"
        className="logoImg"
        onClick={reset}
      />
    </div>
  );

  /* ================= WELCOME ================= */

  if (step === "welcome") {
    return (
      <div className="screen center full">
        <Header />
        <h2>Willkommen</h2>
        <p>
          Wir prüfen deine Absicherung nach DIN-Logik – klar, neutral und
          verständlich.
        </p>
        <button className="primaryBtn big" onClick={() => setStep("questions")}>
          Jetzt starten
        </button>
      </div>
    );
  }

  /* ================= FRAGEN ================= */

  if (step === "questions") {
    return (
      <div className="screen center">
        <Header />
        <h3>{category.label}</h3>

        {qs.map((q, i) => {
          const selected = answers[category.key]?.[i];

          return (
            <div key={i} className="questionCard">
              <div className="questionText">{q}</div>

              <div className="buttonRow">
                <button
                  className={selected === "ja" ? "selected yes" : ""}
                  onClick={() => answer(category.key, i, "ja")}
                >
                  Ja
                </button>

                <button
                  className={selected === "unbekannt" ? "selected maybe" : ""}
                  onClick={() => answer(category.key, i, "unbekannt")}
                >
                  Weiß ich nicht
                </button>

                <button
                  className={selected === "nein" ? "selected no" : ""}
                  onClick={() => answer(category.key, i, "nein")}
                >
                  Nein
                </button>
              </div>
            </div>
          );
        })}

        <button
          className="primaryBtn"
          onClick={() =>
            categoryIndex < CATEGORIES.length - 1
              ? setCategoryIndex(categoryIndex + 1)
              : setStep("dashboard")
          }
        >
          Weiter
        </button>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */

  return (
    <div className="screen center">
      <Header />
      <h2>Dein Absicherungsstatus</h2>

      <div className="heroCard">
        <div className="ringWrap">
          <svg width="200" height="200">
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke="#1A2A36"
              strokeWidth="16"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke="#8B7CF6"
              strokeWidth="16"
              fill="none"
              strokeDasharray="503"
              strokeDashoffset={503 - (503 * animatedScore) / 100}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="ringCenter">
            <div className="percent">{animatedScore}%</div>
            <div className="sub">Gesamtabsicherung</div>
          </div>
        </div>
      </div>

      {CATEGORIES.map((c) => (
        <div key={c.key} className="categoryRow">
          <span>{c.label}</span>
          <strong>{categoryScore(c.key)}%</strong>
        </div>
      ))}
    </div>
  );
}
