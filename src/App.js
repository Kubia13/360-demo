import React, { useState, useEffect } from "react";
import "./index.css";

/* ---------------- DIN Kategorien & Farben (BG-nah) ---------------- */
const CATEGORIES = [
  { key: "existenz", label: "Existenz", weight: 30, color: "#8B7CF6" },
  { key: "haftung", label: "Haftung", weight: 20, color: "#00E5FF" },
  { key: "gesundheit", label: "Gesundheit", weight: 15, color: "#5ED1B2" },
  { key: "wohnen", label: "Wohnen", weight: 15, color: "#4DA3FF" },
  { key: "mobilitaet", label: "Mobilität", weight: 10, color: "#7FD8FF" },
  { key: "vorsorge", label: "Vorsorge", weight: 10, color: "#B9A7FF" },
];

/* ---------------- DIN-Startabfrage ---------------- */
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
  { id: "haustiere", label: "Hast du Haustiere (z. B. Hund)?", type: "boolean" },
];

/* ---------------- Kategorie-Detailfragen (gekürzt, erweiterbar) ---------------- */
const DETAIL_QUESTIONS = {
  existenz: [
    "Könntest du deinen Lebensstandard länger als 6 Monate ohne Einkommen halten?",
  ],
  haftung: ["Sind ausreichend hohe Deckungssummen vereinbart?"],
  gesundheit: ["Hast du sinnvolle Krankenzusatzversicherungen?"],
  wohnen: ["Ist dein Hausrat aktuell und ausreichend versichert?"],
  mobilitaet: ["Hast du einen Schutzbrief für Pannen & Abschleppen?"],
  vorsorge: ["Kennst du deine persönliche Rentenlücke?"],
};

export default function App() {
  const [step, setStep] = useState(0); // 0=Start, 1=Kategorie, 2=Dashboard
  const [startData, setStartData] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [status, setStatus] = useState({});
  const [detailAnswers, setDetailAnswers] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);

  /* ---------------- Relevante Kategorien aus Start ableiten ---------------- */
  function isRelevant(catKey) {
    if (catKey === "mobilitaet" && !startData.kfz) return false;
    if (catKey === "haftung" && !startData.haustiere) return true; // Haftpflicht immer relevant
    if (catKey === "existenz" && startData.beruf === "Nicht erwerbstätig")
      return false;
    return true;
  }

  /* ---------------- Score pro Kategorie ---------------- */
  function categoryScore(catKey) {
    if (!isRelevant(catKey)) return 100;

    const s = status[catKey];
    let base = 0;

    if (s === "vorhanden") base = 70;
    if (s === "unbekannt") base = 40;
    if (s === "keine") base = 0;

    const details = detailAnswers[catKey] || [];
    const bonus = details.filter(Boolean).length * 10;

    return Math.min(100, base + bonus);
  }

  /* ---------------- Gesamt-Score ---------------- */
  const totalScore = Math.round(
    CATEGORIES.reduce(
      (sum, c) =>
        sum +
        (categoryScore(c.key) * c.weight) / 100,
      0
    )
  );

  /* ---------------- Ring animieren ---------------- */
  useEffect(() => {
    let current = 0;
    const i = setInterval(() => {
      current += 1;
      if (current >= totalScore) {
        current = totalScore;
        clearInterval(i);
      }
      setAnimatedScore(current);
    }, 15);
    return () => clearInterval(i);
  }, [totalScore]);

  /* ===================== RENDER ===================== */

  /* ---------- STEP 0: DIN-START ---------- */
  if (step === 0) {
    return (
      <div className="screen">
        <h2>Kurzer 360°-Check</h2>
        <p>Ein paar Fragen – damit wir nur relevante Themen prüfen.</p>

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

        <button className="primaryBtn" onClick={() => setStep(1)}>
          Weiter
        </button>
      </div>
    );
  }

  /* ---------- STEP 1: KATEGORIE-DETAIL ---------- */
  if (step === 1 && activeCategory) {
    const questions = DETAIL_QUESTIONS[activeCategory] || [];
    return (
      <div className="screen">
        <button className="backBtn" onClick={() => setActiveCategory(null)}>
          ← Zur Übersicht
        </button>

        <h3>{CATEGORIES.find((c) => c.key === activeCategory).label}</h3>

        <div className="questionCard">
          <div className="questionText">Versicherungsstatus</div>
          <div className="buttonRow">
            {["vorhanden", "keine", "unbekannt"].map((v) => (
              <button
                key={v}
                onClick={() =>
                  setStatus({ ...status, [activeCategory]: v })
                }
              >
                {v === "vorhanden"
                  ? "Versicherung vorhanden"
                  : v === "keine"
                  ? "Keine Versicherung"
                  : "Weiß ich nicht"}
              </button>
            ))}
          </div>
        </div>

        {questions.map((q, i) => (
          <div key={i} className="questionCard">
            <div className="questionText">{q}</div>
            <div className="buttonRow">
              <button
                onClick={() =>
                  setDetailAnswers({
                    ...detailAnswers,
                    [activeCategory]: [
                      ...(detailAnswers[activeCategory] || []),
                      true,
                    ],
                  })
                }
              >
                Ja
              </button>
              <button>Nein</button>
            </div>
          </div>
        ))}

        <button className="primaryBtn" onClick={() => setActiveCategory(null)}>
          Fertig
        </button>
      </div>
    );
  }

  /* ---------- STEP 1: KATEGORIEN-ÜBERSICHT ---------- */
  if (step === 1 && !activeCategory) {
    return (
      <div className="screen">
        <h2>Themen</h2>
        {CATEGORIES.filter((c) => isRelevant(c.key)).map((cat) => (
          <div
            key={cat.key}
            className="categoryItem"
            onClick={() => setActiveCategory(cat.key)}
          >
            <div className="categoryHeader">
              <span>{cat.label}</span>
              <span>{categoryScore(cat.key)}%</span>
            </div>
            <div className="categoryBar">
              <div
                className="categoryFill"
                style={{
                  width: `${categoryScore(cat.key)}%`,
                  background: cat.color,
                }}
              />
            </div>
          </div>
        ))}

        <button className="primaryBtn" onClick={() => setStep(2)}>
          Zum Dashboard
        </button>
      </div>
    );
  }

  /* ---------- STEP 2: END-DASHBOARD ---------- */
  return (
    <div className="screen">
      <header className="header">
        <img src="/logo.jpg" alt="BarmeniaGothaer" className="logoImg" />
      </header>

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
            <div className="ringLabel">Dein Absicherungsstatus</div>
          </div>
        </div>
      </div>

      {CATEGORIES.filter((c) => isRelevant(c.key)).map((cat) => (
        <div key={cat.key} className="categoryItem">
          <div className="categoryHeader">
            <span>{cat.label}</span>
            <span>{categoryScore(cat.key)}%</span>
          </div>
        </div>
      ))}

      <div className="ctaCard">
        <button className="primaryBtn">Empfehlung ansehen</button>
        <button
          className="secondaryBtn"
          onClick={() =>
            window.open(
              "https://agentur.barmenia.de/florian_loeffler",
              "_blank"
            )
          }
        >
          Berater kontaktieren
        </button>
      </div>
    </div>
  );
}
