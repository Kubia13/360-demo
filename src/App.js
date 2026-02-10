import React, { useState, useEffect } from "react";
import "./index.css";

/* ================= KONFIG ================= */

const CATEGORIES = [
  { key: "existenz", label: "Existenz", weight: 30, color: "#8B7CF6" },
  { key: "haftung", label: "Haftung", weight: 20, color: "#00E5FF" },
  { key: "gesundheit", label: "Gesundheit", weight: 15, color: "#5ED1B2" },
  { key: "wohnen", label: "Wohnen", weight: 15, color: "#4DA3FF" },
  { key: "mobilitaet", label: "Mobilität", weight: 10, color: "#7FD8FF" },
  { key: "vorsorge", label: "Vorsorge", weight: 10, color: "#B9A7FF" },
];

const START_QUESTIONS = [
  { id: "alter", label: "Wie alt bist du?", type: "number" },
  {
    id: "beruf",
    label: "Deine berufliche Situation",
    type: "select",
    options: ["Angestellt", "Selbstständig", "Beamter", "Nicht erwerbstätig"],
  },
  {
    id: "einkommen",
    label: "Monatliches Nettoeinkommen",
    type: "select",
    options: ["< 1.500 €", "1.500 – 2.500 €", "2.500 – 4.000 €", "> 4.000 €"],
  },
  {
    id: "wohnen",
    label: "Wohnsituation",
    type: "select",
    options: ["Miete", "Eigentum"],
  },
  { id: "kinder", label: "Hast du Kinder?", type: "boolean" },
  { id: "kfz", label: "Besitzt du ein KFZ?", type: "boolean" },
  { id: "haustier", label: "Hast du ein Haustier (z. B. Hund)?", type: "boolean" },
];

const QUESTIONS = {
  existenz: [
    "Hast du eine Berufsunfähigkeitsversicherung?",
    "Deckt sie mindestens 60 % deines Nettoeinkommens?",
    "Ist dein aktueller Beruf korrekt abgesichert?",
    "Sind psychische Erkrankungen eingeschlossen?",
    "Wurde der Vertrag in den letzten 5 Jahren geprüft?",
  ],
  haftung: [
    "Hast du eine private Haftpflichtversicherung?",
    "Beträgt die Deckung mindestens 10 Mio €?",
    "Sind Kinder mitversichert?",
    "Ist ein Haustier mitversichert?",
  ],
  gesundheit: [
    "Bist du krankenversichert?",
    "Hast du eine Zahnzusatzversicherung?",
    "Hast du eine stationäre Zusatzversicherung?",
    "Passt dein Schutz zu deinem Einkommen?",
  ],
  wohnen: [
    "Ist dein Hausrat versichert?",
    "Ist die Versicherungssumme korrekt?",
    "Besteht Elementarschutz?",
    "Sind Fahrräder/Wertsachen mitversichert?",
  ],
  mobilitaet: [
    "Ist dein KFZ versichert?",
    "Hast du Voll- oder Teilkasko?",
    "Besteht ein Schutzbrief?",
  ],
  vorsorge: [
    "Sparst du aktiv für das Alter?",
    "Kennst du deine Rentenlücke?",
    "Nutzt du staatliche Förderung?",
    "Wurde die Vorsorge regelmäßig geprüft?",
  ],
};

const SCORE = { ja: 100, bestand: 80, unbekannt: 40, nein: 0 };

/* ================= APP ================= */

export default function App() {
  const [step, setStep] = useState("welcome");
  const [history, setHistory] = useState([]);
  const [startData, setStartData] = useState({});
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);

  const category = CATEGORIES[categoryIndex];

  function go(next) {
    setHistory([...history, step]);
    setStep(next);
  }

  function back() {
    const h = [...history];
    const prev = h.pop();
    setHistory(h);
    setStep(prev || "welcome");
  }

  function reset() {
    setStep("welcome");
    setHistory([]);
    setAnswers({});
    setStartData({});
    setCategoryIndex(0);
  }

  function answer(cat, i, v) {
    setAnswers({
      ...answers,
      [cat]: { ...(answers[cat] || {}), [i]: v },
    });
  }

  function categoryScore(cat) {
    const qs = QUESTIONS[cat];
    const a = answers[cat] || {};
    const max = qs.length * 100;
    const val = qs.reduce((s, _, i) => s + (SCORE[a[i]] ?? 0), 0);
    return Math.round((val / max) * 100);
  }

  const totalScore = Math.round(
    CATEGORIES.reduce(
      (s, c) => s + (categoryScore(c.key) * c.weight) / 100,
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
    }, 12);
    return () => clearInterval(i);
  }, [totalScore]);

  /* ================= HEADER ================= */

  const Header = () => (
    <div className="header">
      {step !== "welcome" && (
        <span className="backBtn" onClick={back}>←</span>
      )}
      <img
        src="/logo.jpg"
        alt="BarmeniaGothaer"
        className="logoImg"
        onClick={reset}
      />
    </div>
  );

  /* ================= SCREENS ================= */

  if (step === "welcome") {
    return (
      <div className="screen">
        <Header />
        <h2>Willkommen</h2>
        <p>
          In wenigen Minuten prüfen wir deine Absicherung nach DIN 77230 –
          verständlich, neutral und individuell.
        </p>
        <button className="primaryBtn" onClick={() => go("start")}>
          Jetzt starten
        </button>
      </div>
    );
  }

  if (step === "start") {
    return (
      <div className="screen">
        <Header />
        <h3>Kurze Einordnung</h3>

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
                <button onClick={() => setStartData({ ...startData, [q.id]: true })}>Ja</button>
                <button onClick={() => setStartData({ ...startData, [q.id]: false })}>Nein</button>
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

        <button className="primaryBtn" onClick={() => go("questions")}>
          Weiter
        </button>
      </div>
    );
  }

  if (step === "questions") {
    const qs = QUESTIONS[category.key];
    return (
      <div className="screen">
        <Header />
        <h3>{category.label}</h3>

        {qs.map((q, i) => (
          <div key={i} className="questionCard">
            <div className="questionText">{q}</div>
            <div className="buttonRow">
              {["ja", "bestand", "unbekannt", "nein"].map((v) => (
                <button
                  key={v}
                  className={`answerBtn ${v}`}
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
          onClick={() =>
            categoryIndex < CATEGORIES.length - 1
              ? setCategoryIndex(categoryIndex + 1)
              : go("dashboard")
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
      <Header />
      <h2>Dein Status</h2>

      <div className="heroCard">
        <div className="ringWrap">
          <svg width="200" height="200">
            <circle cx="100" cy="100" r="80" stroke="#1A2A36" strokeWidth="16" fill="none" />
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
        <div key={c.key} className="categoryCard">
          <span>{c.label}</span>
          <strong>{categoryScore(c.key)}%</strong>
        </div>
      ))}
    </div>
  );
}
