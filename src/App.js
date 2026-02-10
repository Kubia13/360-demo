import React, { useState, useEffect } from "react";
import "./index.css";

/* ---------------- DIN Kategorien ---------------- */
const CATEGORIES = {
  existenz: { label: "Existenz", weight: 30 },
  haftung: { label: "Haftung", weight: 20 },
  gesundheit: { label: "Gesundheit", weight: 15 },
  wohnen: { label: "Wohnen", weight: 15 },
  mobilitaet: { label: "Mobilität", weight: 10 },
  vorsorge: { label: "Vorsorge", weight: 10 },
};

/* ---------------- Fragenkatalog (DIN-nah, 22 Fragen gekürzt auf Kern) ---------------- */
const QUESTIONS = [
  {
    id: "bu",
    category: "existenz",
    text: "Bist du aktuell gegen Berufsunfähigkeit abgesichert?",
  },
  {
    id: "einkommen",
    category: "existenz",
    text: "Könntest du deinen Lebensstandard länger als 6 Monate ohne Einkommen halten?",
  },
  {
    id: "haftpflicht",
    category: "haftung",
    text: "Hast du eine private Haftpflichtversicherung?",
  },
  {
    id: "tierhaftung",
    category: "haftung",
    text: "Besitzt du ein Haustier mit eigener Haftpflicht (z. B. Hund)?",
  },
  {
    id: "kranken",
    category: "gesundheit",
    text: "Bist du aktuell krankenversichert?",
  },
  {
    id: "zusatz",
    category: "gesundheit",
    text: "Hast du sinnvolle Krankenzusatzversicherungen (z. B. Zähne)?",
  },
  {
    id: "hausrat",
    category: "wohnen",
    text: "Ist dein Hausrat ausreichend versichert?",
  },
  {
    id: "fahrrad",
    category: "wohnen",
    text: "Sind hochwertige Fahrräder separat abgesichert?",
  },
  {
    id: "kfz",
    category: "mobilitaet",
    text: "Ist dein Fahrzeug ausreichend versichert?",
  },
  {
    id: "schutzbrief",
    category: "mobilitaet",
    text: "Hast du einen Schutzbrief für Pannen & Abschleppen?",
  },
  {
    id: "rente",
    category: "vorsorge",
    text: "Sparst du aktiv für deine Altersvorsorge?",
  },
  {
    id: "rentenluecke",
    category: "vorsorge",
    text: "Kennst du deine persönliche Rentenlücke?",
  },
];

/* ---------------- App ---------------- */
export default function App() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  /* ---------- Antwort setzen ---------- */
  function answerQuestion(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  /* ---------- Score berechnen ---------- */
  useEffect(() => {
    let categoryPoints = {};
    let categoryMax = {};

    QUESTIONS.forEach((q) => {
      if (!categoryPoints[q.category]) {
        categoryPoints[q.category] = 0;
        categoryMax[q.category] = 0;
      }

      categoryMax[q.category] += 1;

      if (answers[q.id] === "yes") categoryPoints[q.category] += 1;
      if (answers[q.id] === "existing") categoryPoints[q.category] += 0.7;
    });

    let total = 0;

    Object.keys(CATEGORIES).forEach((cat) => {
      const max = categoryMax[cat] || 1;
      const value = categoryPoints[cat] || 0;
      const ratio = value / max;
      total += ratio * CATEGORIES[cat].weight;
    });

    setScore(Math.round(total));
  }, [answers]);

  /* ---------- Ring animieren ---------- */
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= score) {
        current = score;
        clearInterval(interval);
      }
      setAnimatedScore(current);
    }, 15);

    return () => clearInterval(interval);
  }, [score]);

  /* ---------- Empfehlung ---------- */
  function getRecommendation() {
    if (score < 40)
      return "Deine Absicherung ist kritisch. Wir empfehlen dringend eine persönliche Beratung.";
    if (score < 70)
      return "Deine Absicherung ist ausbaufähig. Es bestehen relevante Versorgungslücken.";
    return "Deine Absicherung ist gut. Einzelne Optimierungen sind möglich.";
  }

  return (
    <div className="screen">
      <header className="header">
        <img src="/logo.jpg" alt="BarmeniaGothaer" className="logoImg" />
      </header>

      <div className="welcome">Dein 360°-Absicherungsstatus</div>

      {/* ---------- Ring ---------- */}
      <div className="heroCard">
        <div className="ringWrap">
          <svg width="180" height="180">
            <circle cx="90" cy="90" r="70" stroke="#1a2a36" strokeWidth="14" fill="none" />
            <circle
              cx="90"
              cy="90"
              r="70"
              stroke="#8b7cf6"
              strokeWidth="14"
              fill="none"
              strokeDasharray="439"
              strokeDashoffset={439 - (439 * animatedScore) / 100}
              strokeLinecap="round"
              transform="rotate(-90 90 90)"
            />
          </svg>

          <div className="ringCenter">
            <div className="avatar">👤</div>
            <div className="percent">{animatedScore}%</div>
          </div>
        </div>

        <div className="gapText">{getRecommendation()}</div>
      </div>

      {/* ---------- Fragen ---------- */}
      {QUESTIONS.map((q) => (
        <div key={q.id} className="questionCard">
          <div className="questionText">{q.text}</div>
          <div className="buttonRow">
            <button onClick={() => answerQuestion(q.id, "yes")}>Ja</button>
            <button onClick={() => answerQuestion(q.id, "existing")}>
              Habe ich schon
            </button>
            <button onClick={() => answerQuestion(q.id, "no")}>Nein</button>
          </div>
        </div>
      ))}

      {/* ---------- CTA ---------- */}
      <div className="ctaCard">
        <button className="primaryBtn">Empfehlung ansehen</button>
        <button
          className="secondaryBtn"
          onClick={() =>
            window.open("https://agentur.barmenia.de/florian_loeffler", "_blank")
          }
        >
          Berater kontaktieren
        </button>
      </div>
    </div>
  );
}
