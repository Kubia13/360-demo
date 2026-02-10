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

/* ================= DIN-STARTABFRAGE ================= */
const START_QUESTIONS = [
  { id: "alter", label: "Wie alt bist du?", type: "number" },
  {
    id: "beruf",
    label: "Deine berufliche Situation",
    type: "select",
    options: ["Angestellt", "Selbstständig", "Beamter", "Nicht erwerbstätig"],
  },
  {
    id: "wohnen",
    label: "Wie wohnst du?",
    type: "select",
    options: ["Miete", "Eigentum"],
  },
  { id: "kfz", label: "Besitzt du ein KFZ?", type: "boolean" },
  { id: "haustier", label: "Hast du ein Haustier (z. B. Hund)?", type: "boolean" },
];

/* ================= DETAILFRAGEN PRO KATEGORIE ================= */
const CATEGORY_QUESTIONS = {
  existenz: [
    "Ist eine Berufsunfähigkeitsversicherung vorhanden?",
    "Ist die BU-Rente ausreichend hoch?",
    "Passt der Schutz zu deinem aktuellen Beruf?",
    "Wurde der Vertrag in den letzten 5 Jahren geprüft?",
    "Fühlst du dich damit ausreichend abgesichert?",
  ],
  haftung: [
    "Ist eine private Haftpflichtversicherung vorhanden?",
    "Sind hohe Deckungssummen vereinbart?",
    "Ist ein Haustier mitversichert?",
    "Wurde der Vertrag in den letzten 5 Jahren geprüft?",
  ],
  gesundheit: [
    "Besteht eine Krankenversicherung?",
    "Hast du Zusatzversicherungen (z. B. Zähne)?",
    "Entspricht der Schutz deinem aktuellen Bedarf?",
    "Wurde der Schutz zuletzt überprüft?",
  ],
  wohnen: [
    "Ist dein Hausrat versichert?",
    "Ist die Versicherungssumme ausreichend?",
    "Sind Fahrräder oder Wertsachen mitversichert?",
    "Wurde der Vertrag aktualisiert?",
  ],
  mobilitaet: [
    "Ist dein KFZ versichert?",
    "Besteht ein Schutzbrief?",
    "Sind Zusatzbausteine (z. B. GAP) vorhanden?",
  ],
  vorsorge: [
    "Sparst du aktiv für das Alter?",
    "Kennst du deine Rentenlücke?",
    "Ist die Vorsorge langfristig passend?",
    "Wurde die Vorsorge regelmäßig überprüft?",
  ],
};

/* ================= SCORING ================= */
function scoreFromAnswer(answer) {
  if (answer === "ja") return 100;
  if (answer === "bestand") return 75;
  if (answer === "unbekannt") return 45;
  return 0;
}

/* ================= APP ================= */
export default function App() {
  const [step, setStep] = useState("start"); // start | category | dashboard
  const [startData, setStartData] = useState({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);

  const currentCategory = CATEGORIES[currentCategoryIndex];

  function answerQuestion(catKey, index, value) {
    setAnswers({
      ...answers,
      [catKey]: {
        ...(answers[catKey] || {}),
        [index]: value,
      },
    });
  }

  function categoryScore(catKey) {
    const qs = CATEGORY_QUESTIONS[catKey];
    const a = answers[catKey] || {};
    const total = qs.length * 100;
    const achieved = qs.reduce(
      (sum, _, i) => sum + scoreFromAnswer(a[i]),
      0
    );
    return Math.round((achieved / total) * 100);
  }

  const totalScore = Math.round(
    CATEGORIES.reduce(
      (sum, c) => sum + (categoryScore(c.key) * c.weight) / 100,
      0
    )
  );

  useEffect(() => {
    let cur = 0;
    const i = setInterval(() => {
      cur += 1;
      if (cur >= totalScore) {
        cur = totalScore;
        clearInterval(i);
      }
      setAnimatedScore(cur);
    }, 15);
    return () => clearInterval(i);
  }, [totalScore]);

  /* ================= START ================= */
  if (step === "start") {
    return (
      <div className="screen">
        <h2>360°-Check</h2>
        <p>Kurze Fragen, damit wir nur relevante Themen prüfen.</p>

        {START_QUESTIONS.map((q) => (
          <div key={q.id} className="questionCard">
            <div className="questionText">{q.label}</div>

            {q.type === "number" && (
              <input
                type="number"
                onChange={(e) =>
                  setStartData({ ...startData, [q.id]: e.target.value })
                }
              />
            )}

            {q.type === "boolean" && (
              <div className="buttonRow">
                <button
                  onClick={() =>
                    setStartData({ ...startData, [q.id]: true })
                  }
                >
                  Ja
                </button>
                <button
                  onClick={() =>
                    setStartData({ ...startData, [q.id]: false })
                  }
                >
                  Nein
                </button>
              </div>
            )}

            {q.type === "select" && (
              <select
                onChange={(e) =>
                  setStartData({ ...startData, [q.id]: e.target.value })
                }
              >
                <option value="">Bitte wählen</option>
                {q.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            )}
          </div>
        ))}

        <button className="primaryBtn" onClick={() => setStep("category")}>
          Weiter
        </button>
      </div>
    );
  }

  /* ================= KATEGORIE-WEISE FRAGEN ================= */
  if (step === "category") {
    const qs = CATEGORY_QUESTIONS[currentCategory.key];

    return (
      <div className="screen">
        <h3>{currentCategory.label}</h3>

        {qs.map((q, i) => (
          <div key={i} className="questionCard">
            <div className="questionText">{q}</div>
            <div className="buttonRow">
              <button onClick={() => answerQuestion(currentCategory.key, i, "ja")}>
                Ja
              </button>
              <button
                onClick={() =>
                  answerQuestion(currentCategory.key, i, "bestand")
                }
              >
                Habe ich
              </button>
              <button
                onClick={() =>
                  answerQuestion(currentCategory.key, i, "unbekannt")
                }
              >
                Weiß ich nicht
              </button>
              <button
                onClick={() => answerQuestion(currentCategory.key, i, "nein")}
              >
                Nein
              </button>
            </div>
          </div>
        ))}

        <button
          className="primaryBtn"
          onClick={() => {
            if (currentCategoryIndex < CATEGORIES.length - 1) {
              setCurrentCategoryIndex(currentCategoryIndex + 1);
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
            <circle cx="100" cy="100" r="80" stroke="#1A2A36" strokeWidth="16" fill="none" />
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
          </div>
        </div>
      </div>

      {CATEGORIES.map((c) => (
        <div key={c.key} className="categoryItem">
          <div className="categoryHeader">
            <span>{c.label}</span>
            <span>{categoryScore(c.key)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
