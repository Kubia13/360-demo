import React, { useState, useEffect } from "react";
import "./index.css";

const SCORE = { ja: 100, nein: 0, unbekannt: 0 };

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

  kfz_haftpflicht: "mobilitaet",
  kasko: "mobilitaet",
  schutzbrief: "mobilitaet",

  private_rente: "vorsorge",
  rentenluecke: "vorsorge",

  zahn: "gesundheit",
  pflege: "gesundheit",
  kv_typ: "gesundheit",
};

export default function App() {
  const [step, setStep] = useState("welcome");
  const [answers, setAnswers] = useState({});
  const [baseData, setBaseData] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showInfo, setShowInfo] = useState(null);
  const [modules, setModules] = useState({});

function resetAll() {
  setStep("welcome");
  setAnswers({});
  setBaseData({});
  setModules({});
  }

  function answer(key, value) {
    setAnswers({ ...answers, [key]: value });
  }

  /* ================= ERWEITERTE SCORE-LOGIK ================= */

function getScore(key) {
  const value = answers[key];

  // Standard Ja / Nein
  if (value === "ja") return 100;
  if (value === "nein" || value === "unbekannt") return 0;

  // Kasko differenziert
  if (key === "kasko") {
    if (value === "vollkasko") return 100;
    if (value === "teilkasko") return 50;
    if (value === "haftpflicht") return 0;
    return 0;
  }

  // Rechtsschutz Module
  if (key === "rechtsschutz") {
    if (answers[key] !== "ja") return 0;
    const m = modules?.rechtsschutz || {};
    const count = Object.values(m).filter(Boolean).length;
    return Math.min(count * 25, 100);
  }

  // Private Altersvorsorge Module
  if (key === "private_rente") {
    if (answers[key] !== "ja") return 0;
    const m = modules?.private_rente || {};
    const count = Object.values(m).filter(Boolean).length;
    return Math.min(count * 34, 100);
  }

  return 0;
}

  const categoryScores = Object.keys(CATEGORY_WEIGHTS).reduce((acc, cat) => {
    const questionsInCategory = Object.keys(QUESTION_CATEGORY_MAP).filter(
      (q) => QUESTION_CATEGORY_MAP[q] === cat && answers[q] !== undefined
    );

    if (questionsInCategory.length === 0) {
      acc[cat] = 0;
    } else {
      const sum = questionsInCategory.reduce((s, k) => s + getScore(k), 0);
      acc[cat] = Math.round(sum / questionsInCategory.length);
    }

    return acc;
  }, {});

  const totalScore = Math.round(
    Object.keys(CATEGORY_WEIGHTS).reduce(
      (sum, cat) => sum + categoryScores[cat] * CATEGORY_WEIGHTS[cat],
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

        <Select
          label="Geschlecht"
          options={["Herr", "Frau", "Divers"]}
          onChange={(v) => setBaseData({ ...baseData, geschlecht: v })}
        />

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

        <Select
          label="Besitzt du ein KFZ?"
          options={["Nein", "Ja"]}
          onChange={(v) => setBaseData({ ...baseData, kfz: v })}
        />

        {baseData.kfz === "Ja" && (
          <Input
            label="Anzahl Fahrzeuge"
            type="number"
            onChange={(v) => setBaseData({ ...baseData, kfzAnzahl: v })}
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
        <Header reset={resetAll} back={() => setStep("base")} />
        <h2>Absicherungsfragen</h2>

        <Question label="Berufsunfähigkeitsversicherung vorhanden?" id="bu" {...{ answers, answer }} />

        <Question
          label="Krankentagegeld vorhanden?"
          id="ktg"
          link={{
            label: "Krankentagegeld-Rechner",
            url: "https://ssl.barmenia.de/formular-view/#/krankentagegeldrechner?prd=Apps%2Bund%2BRechner&dom=www.barmenia.de&p0=334300",
          }}
          {...{ answers, answer }}
        />

        <Question label="Unfallversicherung vorhanden?" id="unfall" {...{ answers, answer }} />
        <Question label="Private Haftpflicht vorhanden?" id="haftpflicht" {...{ answers, answer }} />

        {(baseData.tiere === "Hund" || baseData.tiere === "Hund und Katze") && (
          <>
            <Question label="Tierhalterhaftpflicht vorhanden?" id="tierhaft" {...{ answers, answer }} />
            <Question label="Tier-OP/Krankenversicherung vorhanden?" id="tierkranken" {...{ answers, answer }} />
          </>
        )}

        {baseData.wohnen !== "Wohne bei Eltern" && (
          <>
            <Question
              label="Hausrat ausreichend versichert?"
              id="hausrat"
              info="Faustregel: Wohnfläche × 650 €.\nHausrat wird zum Neuwert versichert."
              {...{ answers, answer, setShowInfo }}
            />
            <Question label="Elementarversicherung vorhanden?" id="elementar" {...{ answers, answer }} />
          </>
        )}

        {baseData.wohnen === "Eigentum Haus" && (
          <Question label="Wohngebäudeversicherung vorhanden?" id="gebaeude" {...{ answers, answer }} />
        )}

        {baseData.kfz === "Ja" && (
          <>
            <Question label="KFZ-Haftpflicht vorhanden?" id="kfz_haftpflicht" {...{ answers, answer }} />
            <Question label="Schutzbrief vorhanden?" id="schutzbrief" {...{ answers, answer }} />
            <Question label="Teilkasko oder Vollkasko vorhanden?" id="kasko" {...{ answers, answer }} />
          </>
        )}

        <Question
  label="Rechtsschutz vorhanden?"
  id="rechtsschutz"
  {...{
    answers,
    answer: (id, value) => {
      answer(id, value);
    },
  }}
/>
{answers.rechtsschutz === "ja" && (
  <div className="subOptions">
    {["Privat", "Beruf", "Verkehr", "Immobilie/Mietrecht"].map((mod) => (
      <Checkbox
        key={mod}
        label={mod}
        checked={modules.rechtsschutz?.[mod]}
        onChange={() =>
          setModules({
            ...modules,
            rechtsschutz: {
              ...modules.rechtsschutz,
              [mod]: !modules.rechtsschutz?.[mod],
            },
          })
        }
      />
    ))}
  </div>
)}

        <Select
          label="Welche Krankenversicherung?"
          options={["Gesetzlich", "Privat", "Weiß nicht"]}
          onChange={(v) => answer("kv_typ", v === "Weiß nicht" ? "nein" : "ja")}
        />

        <Question label="Krankenzusatzversicherung vorhanden? (Zahn, Ambulant, Stationär...)" id="zahn" {...{ answers, answer }} />
        <Question label="Private Pflegezusatz vorhanden?" id="pflege" {...{ answers, answer }} />

        <Question
  label="Sorgst du privat für deine Rente vor?"
  id="private_rente"
  {...{
    answers,
    answer: (id, value) => {
      answer(id, value);
    },
  }}
/>

{answers.private_rente === "ja" && (
  <div className="subOptions">
    {["Private Vorsorge", "Rürup", "Riester"].map((mod) => (
      <Checkbox
        key={mod}
        label={mod}
        checked={modules.private_rente?.[mod]}
        onChange={() =>
          setModules({
            ...modules,
            private_rente: {
              ...modules.private_rente,
              [mod]: !modules.private_rente?.[mod],
            },
          })
        }
      />
    ))}
  </div>
)}
        <Question
          label="Kennst du deine Rentenlücke?"
          id="rentenluecke"
          link={{
            label: "Rentenlückenrechner",
            url: "https://rentenrechner.dieversicherer.de/app/gdv.html#luecke",
          }}
          {...{ answers, answer }}
        />

        <button className="primaryBtn" onClick={() => setStep("dashboard")}>
          Auswertung
        </button>

        {showInfo && (
          <div className="infoOverlay" onClick={() => setShowInfo(null)}>
            <div className="infoBox">
              {showInfo.split("\n").map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          </div>
        )}

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

function Question({ label, id, answers, answer, link, info, setShowInfo }) {
  return (
    <div className="questionCard dark">
      <div className="questionText">
        {label}
        {info && (
          <span className="infoIcon" onClick={() => setShowInfo(info)}>
            ℹ️
          </span>
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
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={!!checked} onChange={onChange} />
      {label}
    </label>
  );
}
