import React, { useState, useEffect } from "react";
import "./index.css";

/* ================= DIN-KATEGORIEN ================= */
const CATEGORIES = [
  { key: "existenz", label: "Existenz", weight: 30, color: "#8B7CF6" },
  { key: "haftung", label: "Haftung", weight: 20, color: "#00E5FF" },
  { key: "gesundheit", label: "Gesundheit", weight: 15, color: "#5ED1B2" },
  { key: "wohnen", label: "Wohnen", weight: 15, color: "#4DA3FF" },
  { key: "mobilitaet", label: "Mobilität", weight: 10, color: "#7FD8FF" },
  { key: "vorsorge", label: "Vorsorge", weight: 10, color: "#B9A7FF" },
];

/* ================= FRAGEN ================= */
const QUESTIONS = {
  existenz: [
    "Hast du eine Berufsunfähigkeitsversicherung?",
    "Ist die BU-Rente mindestens 60 % deines Nettoeinkommens?",
    "Passt der Schutz zu deinem aktuellen Beruf?",
    "Wurde der Vertrag in den letzten 5 Jahren geprüft?",
  ],
  haftung: [
    "Hast du eine private Haftpflichtversicherung?",
    "Ist eine hohe Deckungssumme (mind. 10 Mio €) vereinbart?",
    "Sind Haustiere mitversichert?",
  ],
  gesundheit: [
    "Bist du krankenversichert?",
    "Hast du private Zusatzversicherungen?",
    "Wurde dein Schutz zuletzt überprüft?",
  ],
  wohnen: [
    "Ist dein Hausrat versichert?",
    "Ist die Versicherungssumme ausreichend?",
    "Sind Fahrräder oder Wertsachen mitversichert?",
  ],
  mobilitaet: [
    "Ist dein KFZ versichert?",
    "Hast du einen Schutzbrief?",
  ],
  vorsorge: [
    "Sparst du aktiv für das Alter?",
    "Kennst du deine Rentenlücke?",
    "Wurde deine Vorsorge geprüft?",
  ],
};

/* ================= SCORING ================= */
const SCORE = {
  ja: 100,
  bestand: 75,
  unbekannt: 40,
  nein: 0,
};

/* ================= APP ================= */
export default function App() {
  const [step, setStep] = useState("questions"); // questions | dashboard
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);

  const category = CATEGORIES[categoryIndex];
  const questions = QUESTIONS[category.key];

  function answer(catKey, index, value) {
    setAnswers({
      ...answers,
      [catKey]: {
        ...(answers[catKey] || {}),
        [index]: value,
      },
    });
  }

  function categoryScore(catKey) {
    const qs = QUESTIONS[catKey];
    const a = answers[catKey] || {};
    const max = qs.length * 100;
    const value = qs.reduce(
      (sum, _, i) => sum + (SCORE[a[i]] ?? 0),
      0
    );
    return Math.round((value / max) * 100);
  }

  const totalScore = Math.round(
    CATEGORIES.reduce(
      (sum, c) => sum + (categoryScore(c.key) * c.weight) / 100,
      0
    )
  );

  /* ================= RING-ANIMATION ================= */
  useEffect(() => {
    let cur = 0;
    const i = setInterval(() => {
      cur += 1;
      if (cur >= totalScore) {
        cur = totalScore;
        clearInterval(i);
      }
      setAnimatedScore(cur);
    }, 12);
    return () => clearInterval(i);
  }, [totalScore]);

  /* ================= FRAGEN ================= */
  if (step === "questions") {
    return (
      <div className="screen">
        <h2>360°-Analyse</h2>
        <h3>{category.label}</h3>

        {questions.map((q, i) => (
          <div key={i} className="questionCard">
            <div className="questionText">{q}</div>
            <div className="buttonRow">
              {["ja", "bestand", "unbekannt", "nein"].map((v) => (
                <button
                  key={v}
                  onClick={() => answer(category.key, i, v)}
                >
                  {v === "ja"
                    ? "Ja"
                    : v === "bestand"
                    ? "Habe ich"
                    : v === "unbekannt"
                    ? "Weiß ich nicht"
                    : "Nein"}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          className="primaryBtn"
          onClick={() => {
            if (categoryIndex < CATEGORIES.length - 1) {
              setCategoryIndex(categoryIndex + 1);
            } else {
              setStep("dashboard");
            }
          }}
        >
          Weiter
        </button>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <div className="screen">
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
              stroke="#00E5FF"
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

      {CATEGORIES.map((c) => {
        const s = categoryScore(c.key);
        return (
          <div key={c.key} className="categoryItem">
            <div className="categoryHeader">
              <span>{c.label}</span>
              <span>{s}%</span>
            </div>
            {s < 70 && (
              <div className="recommendation">
                Handlungsbedarf in {c.label}
              </div>
            )}
          </div>
        );
      })}

      <button className="primaryBtn">
        Empfehlung & DIN-Protokoll ansehen
      </button>
    </div>
  );
}
