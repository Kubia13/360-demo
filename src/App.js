import React, { useState, useEffect } from "react";
import "./index.css";

/* ================= KONFIG ================= */

const CONTACT_URL = "https://agentur.barmenia.de/florian_loeffler";

const CATEGORIES = [
  { key: "existenz", label: "Existenzsicherung", weight: 30 },
  { key: "haftung", label: "Haftung", weight: 20 },
  { key: "gesundheit", label: "Gesundheit", weight: 15 },
  { key: "wohnen", label: "Wohnen", weight: 15 },
  { key: "mobilitaet", label: "Mobilität", weight: 10 },
  { key: "vorsorge", label: "Vorsorge", weight: 10 },
];

const START_QUESTIONS = [
  { id: "vorname", label: "Vorname", type: "text" },
  { id: "nachname", label: "Nachname", type: "text" },
  {
    id: "geschlecht",
    label: "Geschlecht",
    type: "select",
    options: ["Frau", "Mann", "Divers"],
  },
  { id: "alter", label: "Alter", type: "number" },
  {
    id: "beruf",
    label: "Berufliche Situation",
    type: "select",
    options: [
      "Angestellt",
      "Öffentlicher Dienst",
      "Selbstständig",
      "Nicht berufstätig",
    ],
  },
  { id: "einkommen", label: "Monatliches Nettoeinkommen (€)", type: "number" },
  { id: "kinder", label: "Hast du Kinder?", type: "boolean" },
  { id: "haustiere", label: "Hast du Haustiere?", type: "boolean" },
  { id: "kfz", label: "Besitzt du ein KFZ?", type: "boolean" },
  {
    id: "kv",
    label: "Krankenversicherung",
    type: "select",
    options: ["Gesetzlich", "Privat"],
  },
];

const QUESTIONS = {
  existenz: [
    "Hast du eine Berufsunfähigkeitsversicherung?",
    "Deckt die BU mindestens 60 % deines Nettoeinkommens ab?",
    "Passt der Schutz zu deinem aktuellen Beruf?",
  ],
  haftung: [
    "Hast du eine private Haftpflichtversicherung?",
    "Ist eine hohe Deckungssumme (≥10 Mio €) vereinbart?",
  ],
  gesundheit: [
    "Entspricht dein Krankenversicherungsschutz deinem Bedarf?",
    "Hast du relevante Zusatzversicherungen (z. B. Zähne)?",
  ],
  wohnen: [
    "Ist dein Hausrat ausreichend versichert?",
    "Sind Wertsachen/Fahrräder mitversichert?",
  ],
  mobilitaet: [
    "Ist dein KFZ ausreichend versichert?",
    "Hast du einen Schutzbrief?",
  ],
  vorsorge: [
    "Sparst du aktiv für das Alter?",
    "Kennst du deine persönliche Rentenlücke?",
  ],
};

const SCORE = { ja: 100, nein: 0, unbekannt: 40 };

/* ================= APP ================= */

export default function App() {
  const [screen, setScreen] = useState("start"); // start | intake | questions | dashboard
  const [startData, setStartData] = useState({});
  const [catIndex, setCatIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animated, setAnimated] = useState(0);

  const category = CATEGORIES[catIndex];
  const qs = QUESTIONS[category?.key] || [];

  function resetAll() {
    setScreen("start");
    setStartData({});
    setAnswers({});
    setCatIndex(0);
    setAnimated(0);
  }

  function answer(cat, i, val) {
    setAnswers({
      ...answers,
      [cat]: { ...(answers[cat] || {}), [i]: val },
    });
  }

  function categoryScore(cat) {
    const q = QUESTIONS[cat];
    const a = answers[cat] || {};
    const max = q.length * 100;
    const sum = q.reduce((s, _, i) => s + (SCORE[a[i]] ?? 0), 0);
    return Math.round((sum / max) * 100);
  }

  const totalScore = Math.round(
    CATEGORIES.reduce(
      (s, c) => s + (categoryScore(c.key) * c.weight) / 100,
      0
    )
  );

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      if (i >= totalScore) clearInterval(t);
      setAnimated(i);
    }, 15);
    return () => clearInterval(t);
  }, [totalScore]);

  /* ================= START ================= */

  if (screen === "start") {
    return (
      <div className="screen center">
        <img
          src="/logo.jpg"
          alt="Logo"
          className="logoBig"
          onClick={resetAll}
        />
        <h1>360°-Analyse</h1>
        <p>Kurz. Neutral. DIN-orientiert.</p>
        <button className="primaryBtn big" onClick={() => setScreen("intake")}>
          Jetzt starten
        </button>
        <a href={CONTACT_URL} className="contactLink">
          Kontakt
        </a>
      </div>
    );
  }

  /* ================= INTAKE ================= */

  if (screen === "intake") {
    return (
      <div className="screen">
        <Header onBack={resetAll} />

        {START_QUESTIONS.map((q) => (
          <div key={q.id} className="questionCard">
            <div className="questionText">{q.label}</div>

            {q.type === "text" || q.type === "number" ? (
              <input
                type={q.type}
                value={startData[q.id] || ""}
                onChange={(e) =>
                  setStartData({ ...startData, [q.id]: e.target.value })
                }
              />
            ) : q.type === "select" ? (
              <select
                value={startData[q.id] || ""}
                onChange={(e) =>
                  setStartData({ ...startData, [q.id]: e.target.value })
                }
              >
                <option value="">Bitte wählen</option>
                {q.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <div className="buttonRow">
                {["ja", "nein"].map((v) => (
                  <button
                    key={v}
                    className={startData[q.id] === v ? "active" : ""}
                    onClick={() =>
                      setStartData({ ...startData, [q.id]: v })
                    }
                  >
                    {v === "ja" ? "Ja" : "Nein"}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <button className="primaryBtn" onClick={() => setScreen("questions")}>
          Weiter
        </button>
      </div>
    );
  }

  /* ================= QUESTIONS ================= */

  if (screen === "questions") {
    return (
      <div className="screen">
        <Header
          onBack={() =>
            catIndex === 0 ? setScreen("intake") : setCatIndex(catIndex - 1)
          }
        />

        <h2>{category.label}</h2>

        {qs.map((q, i) => (
          <div key={i} className="questionCard">
            <div className="questionText">{q}</div>
            <div className="buttonRow">
              {["ja", "nein", "unbekannt"].map((v) => (
                <button
                  key={v}
                  className={answers[category.key]?.[i] === v ? "active" : ""}
                  onClick={() => answer(category.key, i, v)}
                >
                  {v === "ja"
                    ? "Ja"
                    : v === "nein"
                    ? "Nein"
                    : "Weiß nicht"}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          className="primaryBtn"
          onClick={() =>
            catIndex < CATEGORIES.length - 1
              ? setCatIndex(catIndex + 1)
              : setScreen("dashboard")
          }
        >
          Weiter
        </button>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */

  return (
    <div className="screen">
      <Header onBack={() => setScreen("questions")} />

      <div className="heroCard">
        <div className="ringWrap">
          <svg width="220" height="220">
            <circle cx="110" cy="110" r="90" stroke="#1a2a36" strokeWidth="18" fill="none" />
            <circle
              cx="110"
              cy="110"
              r="90"
              stroke="#00e5ff"
              strokeWidth="18"
              fill="none"
              strokeDasharray="565"
              strokeDashoffset={565 - (565 * animated) / 100}
              strokeLinecap="round"
              transform="rotate(-90 110 110)"
            />
          </svg>
          <div className="ringCenter">
            <div className="percent">{animated}%</div>
            <div className="sub">Gesamtstatus</div>
          </div>
        </div>
      </div>

      {CATEGORIES.map((c) => (
        <div key={c.key} className="categoryItem">
          <span>{c.label}</span>
          <span>{categoryScore(c.key)}%</span>
        </div>
      ))}

      <a href={CONTACT_URL} className="primaryBtn">
        Kontakt aufnehmen
      </a>
    </div>
  );
}

/* ================= HEADER ================= */

function Header({ onBack }) {
  return (
    <header className="header">
      <div className="backIcon" onClick={onBack}>
        ←
      </div>
      <img src="/logo.jpg" alt="Logo" className="logoSmall" onClick={onBack} />
    </header>
  );
}
