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

const SCORE = { ja: 100, nein: 0, unbekannt: 0 };

/* ================= APP ================= */

export default function App() {
  const [step, setStep] = useState("welcome");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [baseData, setBaseData] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);

  const category = CATEGORIES[categoryIndex];

  function resetAll() {
    setStep("welcome");
    setCategoryIndex(0);
    setAnswers({});
    setBaseData({});
  }

  function answer(cat, key, value) {
    setAnswers({
      ...answers,
      [cat]: { ...(answers[cat] || {}), [key]: value },
    });
  }

  function categoryScore(key) {
    const a = answers[key] || {};
    const values = Object.values(a);
    if (!values.length) return 0;
    const total = values.length * 100;
    const achieved = values.reduce((s, v) => s + (SCORE[v] || 0), 0);
    return Math.round((achieved / total) * 100);
  }

  const totalScore = Math.round(
    CATEGORIES.reduce(
      (s, c) => s + (categoryScore(c.key) * c.weight) / 100,
      0
    )
  );

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
        <img src="/logo.jpg" className="logo large" onClick={resetAll} alt="" />
        <h1>360° Absicherungscheck</h1>
        <button className="primaryBtn big" onClick={() => setStep("base")}>
          Jetzt starten
        </button>
        <ContactButton />
      </div>
    );
  }

  /* ================= BASIS ================= */

  if (step === "base") {
    return (
      <div className="screen">
        <Header reset={resetAll} />

        <h2>Persönliche Angaben</h2>

        <Input label="Vorname" onChange={(v) => setBaseData({ ...baseData, vorname: v })} />
        <Input label="Nachname" onChange={(v) => setBaseData({ ...baseData, nachname: v })} />
        <Input label="Alter" type="number" onChange={(v) => setBaseData({ ...baseData, alter: v })} />
        <Input label="Monatliches Netto-Gehalt (€)" type="number"
          onChange={(v) => setBaseData({ ...baseData, gehalt: v })}
        />

        <Select
          label="Haustiere"
          options={["Keine", "Katze", "Hund", "Katze & Hund"]}
          onChange={(v) => setBaseData({ ...baseData, tiere: v })}
        />

        {baseData.tiere && baseData.tiere !== "Keine" && (
          <div className="subSection">
            <Select
              label="Tierkranken-/OP-Versicherung?"
              options={["Keine", "Krankenversicherung", "OP-Versicherung", "Weiß nicht"]}
              onChange={(v) => setBaseData({ ...baseData, tierKranken: v })}
            />
            <Select
              label="Tierhalterhaftpflicht vorhanden?"
              options={["Ja", "Nein", "Weiß nicht"]}
              onChange={(v) => setBaseData({ ...baseData, tierHaft: v })}
            />
          </div>
        )}

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

        {baseData.wohnen === "Eigentum Haus" && (
          <Select
            label="Gebäudeversicherung vorhanden?"
            options={["Ja", "Nein", "Weiß nicht"]}
            onChange={(v) => setBaseData({ ...baseData, gebaeude: v })}
          />
        )}

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
        <Header reset={resetAll} back={() => setCategoryIndex(categoryIndex - 1)} />

        <h2>{category.label}</h2>

        <div className="questionCard dark">
          <div className="questionText">
            Beispielhafte Frage in {category.label}
          </div>
          <div className="buttonRow">
            {["ja", "nein", "unbekannt"].map((v) => (
              <button
                key={v}
                className={`answerBtn ${
                  answers[category.key]?.main === v ? "active" : ""
                }`}
                onClick={() => answer(category.key, "main", v)}
              >
                {v === "ja" ? "Ja" : v === "nein" ? "Nein" : "Weiß ich nicht"}
              </button>
            ))}
          </div>
        </div>

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

        <ContactButton />
      </div>
    );
  }

  /* ================= DASHBOARD ================= */

  return (
    <div className="screen">
      <Header reset={resetAll} />

      <h2>
        {baseData.vorname
          ? `${baseData.vorname}, dein Absicherungsstatus`
          : "Dein Absicherungsstatus"}
      </h2>

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
            strokeDashoffset={565 - (565 * animatedScore) / 100}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
          />
        </svg>
        <div className="ringCenter">{animatedScore}%</div>
      </div>

      {CATEGORIES.map((c) => (
        <div key={c.key} className="categoryLine">
          <span>{c.label}</span>
          <span>{categoryScore(c.key)}%</span>
        </div>
      ))}

      <ContactButton />
    </div>
  );
}

/* ================= UI ================= */

function Header({ reset, back }) {
  return (
    <div className="header">
      {back && (
        <button className="backBtn" onClick={back}>
          ←
        </button>
      )}
      <img src="/logo.jpg" className="logo small" onClick={reset} alt="" />
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
