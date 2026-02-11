import React, { useState, useEffect } from "react";
import "./index.css";

/* ================= KONFIG ================= */

const CATEGORIES = [
  { key: "existenz", label: "Existenz", weight: 30 },
  { key: "haftung", label: "Haftung", weight: 20 },
  { key: "gesundheit", label: "Gesundheit", weight: 15 },
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
  const [showInfo, setShowInfo] = useState(null);

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
    const max = Object.keys(a).length * 100;
    const val = Object.values(a).reduce(
      (s, v) => s + (SCORE[v] || 0),
      0
    );
    return max ? Math.round((val / max) * 100) : 0;
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
    }, 12);
    return () => clearInterval(i);
  }, [totalScore]);

  /* ================= WELCOME ================= */

  if (step === "welcome") {
    return (
      <div className="screen center">
        <img src="/logo.jpg" className="logo large" onClick={resetAll} />
        <h1>360°-Absicherungscheck</h1>
        <p>Beantworte ein paar Fragen – wir zeigen dir deine Absicherung.</p>
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
        <Header back={() => setStep("welcome")} reset={resetAll} />

        <Input label="Vorname" onChange={(v) => setBaseData({ ...baseData, vorname: v })} />
        <Input label="Nachname" onChange={(v) => setBaseData({ ...baseData, nachname: v })} />

        <Select
          label="Geschlecht"
          options={["Frau", "Mann", "Divers"]}
          onChange={(v) => setBaseData({ ...baseData, geschlecht: v })}
        />

        <Input label="Alter" type="number" onChange={(v) => setBaseData({ ...baseData, alter: v })} />

        <Input label="Monatliches Netto-Gehalt (€)" type="number"
          onChange={(v) => setBaseData({ ...baseData, gehalt: v })} />

        <Select
          label="Beruf"
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
          onChange={(v) => setBaseData({ ...baseData, haustier: v })}
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

        <button className="primaryBtn"
          onClick={() => {
            if (baseData.haustier && baseData.haustier !== "Keine Tiere") {
              setStep("tiere");
            } else if (baseData.wohnen) {
              setStep("wohnen");
            } else {
              setStep("questions");
            }
          }}>
          Weiter
        </button>

        <ContactButton />
      </div>
    );
  }

  /* ================= TIERE ================= */

  if (step === "tiere") {
    return (
      <div className="screen">
        <Header back={() => setStep("base")} reset={resetAll} />

        <h2>Tiere Absicherung</h2>

        {(baseData.haustier === "Hund" ||
          baseData.haustier === "Hund und Katze") && (
          <QuestionBlock
            label="Tierhalterhaftpflicht vorhanden?"
            value={answers.tiere?.haftpflicht}
            onClick={(v) => answer("tiere", "haftpflicht", v)}
          />
        )}

        <Select
          label="Tierkranken-/OP-Versicherung"
          options={["Keine", "Krankenversicherung", "OP-Versicherung", "Weiß nicht"]}
          onChange={(v) => answer("tiere", "tierKV", v === "Weiß nicht" ? "unbekannt" : v === "Keine" ? "nein" : "ja")}
        />

        <button className="primaryBtn"
          onClick={() => setStep("wohnen")}>
          Weiter
        </button>

        <ContactButton />
      </div>
    );
  }

  /* ================= WOHNEN ================= */

  if (step === "wohnen") {
    return (
      <div className="screen">
        <Header back={() => setStep(baseData.haustier !== "Keine Tiere" ? "tiere" : "base")} reset={resetAll} />

        <h2>Wohnen Absicherung</h2>

        {baseData.wohnen !== "Wohne bei Eltern" && (
          <>
            <QuestionBlock
              label="Hausrat ausreichend versichert?"
              value={answers.wohnen?.hausrat}
              onClick={(v) => answer("wohnen", "hausrat", v)}
              info="Faustregel: Wohnfläche × 650 €\nVersicherung immer zum Neuwert"
              setShowInfo={setShowInfo}
            />

            <QuestionBlock
              label="Elementarversicherung vorhanden?"
              value={answers.wohnen?.elementar}
              onClick={(v) => answer("wohnen", "elementar", v)}
            />
          </>
        )}

        {baseData.wohnen === "Eigentum Haus" && (
          <QuestionBlock
            label="Wohngebäudeversicherung vorhanden?"
            value={answers.wohnen?.gebaeude}
            onClick={(v) => answer("wohnen", "gebaeude", v)}
          />
        )}

        <button className="primaryBtn"
          onClick={() => setStep("questions")}>
          Weiter
        </button>

        {showInfo && (
          <div className="infoOverlay" onClick={() => setShowInfo(null)}>
            <div className="infoBox">
              {showInfo.split("\n").map((l, i) => <p key={i}>{l}</p>)}
            </div>
          </div>
        )}

        <ContactButton />
      </div>
    );
  }

  /* ================= KATEGORIEN ================= */

  if (step === "questions") {
    const category = CATEGORIES[categoryIndex];

    return (
      <div className="screen">
        <Header back={() => setCategoryIndex(categoryIndex - 1)} reset={resetAll} />
        <h2>{category.label}</h2>

        {category.key === "existenz" && (
          <>
            <QuestionBlock label="Berufsunfähigkeitsversicherung?"
              value={answers.existenz?.bu}
              onClick={(v) => answer("existenz", "bu", v)} />

            <QuestionBlock label="Krankentagegeld?"
              value={answers.existenz?.ktg}
              onClick={(v) => answer("existenz", "ktg", v)}
              link={{
                label: "Krankentagegeld-Rechner",
                url: "https://ssl.barmenia.de/formular-view/#/krankentagegeldrechner?prd=Apps%2Bund%2BRechner&dom=www.barmenia.de&p0=334300"
              }}
            />

            <QuestionBlock label="Unfallversicherung?"
              value={answers.existenz?.unfall}
              onClick={(v) => answer("existenz", "unfall", v)} />
          </>
        )}

        <button className="primaryBtn"
          onClick={() =>
            categoryIndex < CATEGORIES.length - 1
              ? setCategoryIndex(categoryIndex + 1)
              : setStep("dashboard")
          }>
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

      <h2>{baseData.vorname ? `${baseData.vorname}, dein Status` : "Dein Status"}</h2>

      <div className="ringWrap">
        <svg width="200" height="200">
          <circle cx="100" cy="100" r="80" stroke="#1a2a36" strokeWidth="16" fill="none" />
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="#00e5ff"
            strokeWidth="16"
            fill="none"
            strokeDasharray="503"
            strokeDashoffset={503 - (503 * animatedScore) / 100}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
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

function Header({ back, reset }) {
  return (
    <div className="header">
      {back && <div className="backArrow" onClick={back}>←</div>}
      <img src="/logo.jpg" className="logo small" onClick={reset} />
    </div>
  );
}

function QuestionBlock({ label, value, onClick, link, info, setShowInfo }) {
  return (
    <div className="questionCard dark">
      <div className="questionText">
        {label}
        {info && (
          <span className="infoIcon" onClick={() => setShowInfo(info)}>!</span>
        )}
      </div>

      {link && (
        <a href={link.url} target="_blank" rel="noreferrer" className="inlineLink">
          {link.label}
        </a>
      )}

      <div className="buttonRow">
        {["ja", "nein", "unbekannt"].map((v) => (
          <button
            key={v}
            className={`answerBtn ${value === v ? "active" : ""}`}
            onClick={() => onClick(v)}
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
