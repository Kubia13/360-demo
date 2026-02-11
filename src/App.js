import React, { useState, useEffect } from "react";
import "./index.css";

const SCORE = { ja: 100, nein: 0, unbekannt: 0 };

/* ================= DIN GEWICHTUNG ================= */

const CATEGORY_WEIGHTS = {
  existenz: 0.3,
  haftung: 0.2,
  gesundheit: 0.15,
  wohnen: 0.15,
  mobilitaet: 0.1,
  vorsorge: 0.1,
};

const CATEGORY_LABELS = {
  existenz: "Existenz",
  haftung: "Haftung",
  gesundheit: "Gesundheit",
  wohnen: "Wohnen",
  mobilitaet: "Mobilität",
  vorsorge: "Vorsorge",
};

/* Frage → Kategorie Mapping */
const QUESTION_CATEGORY_MAP = {
  bu: "existenz",
  ktg: "existenz",
  unfall: "existenz",

  haftpflicht: "haftung",
  tierhaft: "haftung",
  rechtsschutz: "haftung",

  hausrat: "wohnen",
  elementar: "wohnen",
  gebaeude: "wohnen",

  kasko: "mobilitaet",

  rentenluecke: "vorsorge",
};

export default function App() {
  const [step, setStep] = useState("welcome");
  const [answers, setAnswers] = useState({});
  const [baseData, setBaseData] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showInfo, setShowInfo] = useState(null);

  function resetAll() {
    setStep("welcome");
    setAnswers({});
    setBaseData({});
  }

  function answer(key, value) {
    setAnswers({ ...answers, [key]: value });
  }

  function score(key) {
    return SCORE[answers[key]] || 0;
  }

  /* ================= KATEGORIE-SCORES ================= */

  const categoryScores = Object.keys(CATEGORY_WEIGHTS).reduce((acc, cat) => {
    const questionsInCategory = Object.keys(QUESTION_CATEGORY_MAP).filter(
      (q) => QUESTION_CATEGORY_MAP[q] === cat && answers[q]
    );

    if (questionsInCategory.length === 0) {
      acc[cat] = 0;
    } else {
      const sum = questionsInCategory.reduce(
        (s, q) => s + score(q),
        0
      );
      acc[cat] = Math.round(sum / questionsInCategory.length);
    }

    return acc;
  }, {});

  /* ================= GESAMT-SCORE (GEWICHTET) ================= */

  const totalScore = Math.round(
    Object.keys(CATEGORY_WEIGHTS).reduce((sum, cat) => {
      return sum + categoryScores[cat] * CATEGORY_WEIGHTS[cat];
    }, 0)
  );

  /* ================= RING ANIMATION ================= */

  useEffect(() => {
    let c = 0;
    const i = setInterval(() => {
      c++;
      if (c >= totalScore) {
        c = totalScore;
        clearInterval(i);
      }
      setAnimatedScore(c);
    }, 10);
    return () => clearInterval(i);
  }, [totalScore]);

  /* ================= WELCOME ================= */

  if (step === "welcome") {
    return (
      <div className="screen center">
        <img src="/logo.jpg" className="logo large" onClick={resetAll} />
        <h1>360° Absicherungscheck</h1>
        <p>Beantworte ein paar Fragen zu deiner Situation.</p>
        <button className="primaryBtn big" onClick={() => setStep("base")}>
          Jetzt starten
        </button>
        <ContactButton />
      </div>
    );
  }

  /* ================= BASISDATEN ================= */

  if (step === "base") {
    return (
      <div className="screen">
        <Header reset={resetAll} back={() => setStep("welcome")} />

        <h2>Persönliche Angaben</h2>

        <Input label="Vorname" onChange={(v) => setBaseData({ ...baseData, vorname: v })} />
        <Input label="Nachname" onChange={(v) => setBaseData({ ...baseData, nachname: v })} />
        <Input label="Alter" type="number" onChange={(v) => setBaseData({ ...baseData, alter: v })} />
        <Input label="Monatliches Netto-Gehalt (€)" type="number" onChange={(v) => setBaseData({ ...baseData, gehalt: v })} />

        <Select
          label="Berufliche Situation"
          options={["Angestellt", "Öffentlicher Dienst", "Selbstständig", "Nicht berufstätig"]}
          onChange={(v) => setBaseData({ ...baseData, beruf: v })}
        />

        <Select
          label="Hast du Kinder?"
          options={["Nein", "Ja"]}
          onChange={(v) => setBaseData({ ...baseData, kinder: v })}
        />

        {baseData.kinder === "Ja" && (
          <Input
            label="Anzahl Kinder"
            type="number"
            onChange={(v) => setBaseData({ ...baseData, kinderAnzahl: v })}
          />
        )}

        <Select
          label="Haustiere"
          options={["Keine Tiere", "Katze", "Hund", "Hund und Katze"]}
          onChange={(v) => setBaseData({ ...baseData, tiere: v })}
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
          onChange={(v) => setBaseData({ ...baseData, wohnen: v })}
        />

        <button className="primaryBtn" onClick={() => setStep("questions")}>
          Weiter
        </button>

        <ContactButton />
      </div>
    );
  }

  /* ================= FRAGEN ================= */

  if (step === "questions") {
    return (
      <div className="screen">
        <Header reset={resetAll} back={() => setStep("base")} />

        <h2>Absicherungsfragen</h2>

        <Question label="Berufsunfähigkeitsversicherung vorhanden?" id="bu" {...{ answers, answer }} />
        <Question label="Krankentagegeld vorhanden?" id="ktg" {...{ answers, answer }} />
        <Question label="Unfallversicherung vorhanden?" id="unfall" {...{ answers, answer }} />
        <Question label="Private Haftpflicht (mind. 10 Mio €)?" id="haftpflicht" {...{ answers, answer }} />

        <button className="primaryBtn" onClick={() => setStep("dashboard")}>
          Auswertung
        </button>

        <ContactButton />
      </div>
    );
  }

  /* ================= DASHBOARD ================= */

  return (
    <div className="screen">
      <Header reset={resetAll} back={() => setStep("questions")} />

      <h2>
        {baseData.vorname ? `${baseData.vorname}, dein Status` : "Dein Status"}
      </h2>

      <div className="ringWrap">
        <svg width="220" height="220">
          <circle cx="110" cy="110" r="90" stroke="#1a2a36" strokeWidth="16" fill="none" />
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

      <div className="categoryList">
        {Object.keys(categoryScores).map((cat) => (
          <div key={cat} className="categoryRow">
            <span>{CATEGORY_LABELS[cat]}</span>
            <span>{categoryScores[cat]}%</span>
          </div>
        ))}
      </div>

      <ContactButton />
    </div>
  );
}

/* ================= UI KOMPONENTEN ================= */

function Header({ reset, back }) {
  return (
    <div className="header">
      <img src="/logo.jpg" className="logo small" onClick={reset} />
      <button className="backBtn" onClick={back}>
        ⬅
      </button>
    </div>
  );
}

function Question({ label, id, answers, answer }) {
  return (
    <div className="questionCard dark">
      <div className="questionText">{label}</div>
      <div className="buttonRow">
        {["ja", "nein", "unbekannt"].map((v) => (
          <button
            key={v}
            className={`answerBtn ${answers[id] === v ? "active" : ""}`}
            onClick={() => answer(id, v)}
          >
            {v === "ja" ? "Ja" : v === "nein" ? "Nein" : "Weiß ich nicht"}
          </button>
        ))}
      </div>
    </div>
  );
}

function Input({ label, type = "text", onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Select({ label, options, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select onChange={(e) => onChange(e.target.value)}>
        <option value="">Bitte wählen</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function ContactButton() {
  return (
    <div className="contactFixed">
      <a href="https://agentur.barmenia.de/florian_loeffler" target="_blank" rel="noreferrer">
        Kontakt aufnehmen
      </a>
    </div>
  );
}
