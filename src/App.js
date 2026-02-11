import React, { useState, useEffect } from "react";
import "./index.css";

const SCORE = { ja: 100, nein: 0, unbekannt: 0 };

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

  const totalScore =
    Math.round(
      (Object.keys(answers).reduce((s, k) => s + score(k), 0) /
        (Object.keys(answers).length || 1))
    ) || 0;

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

        <Question
          label="Private Haftpflicht (mind. 10 Mio €)?"
          id="haftpflicht"
          {...{ answers, answer }}
        />

        {(baseData.tiere === "Hund" || baseData.tiere === "Hund und Katze") && (
          <>
            <Question label="Tierhalterhaftpflicht vorhanden?" id="tierhaft" {...{ answers, answer }} />

            <Select
              label="Tier-Kranken-/OP-Versicherung"
              options={["Keine", "Krankenversicherung", "OP-Versicherung", "Weiß nicht"]}
              onChange={(v) =>
                answer("tierkranken", v === "Weiß nicht" ? "nein" : v === "Keine" ? "nein" : "ja")
              }
            />
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

        <Question label="Rechtsschutz vorhanden?" id="rechtsschutz" {...{ answers, answer }} />

        <Select
          label="KFZ-Kasko"
          options={["Teilkasko", "Vollkasko", "Weiß nicht"]}
          onChange={(v) =>
            answer("kasko", v === "Weiß nicht" ? "nein" : "ja")
          }
        />

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
            stroke="#00e5ff"
            strokeWidth="16"
            fill="none"
            strokeDasharray="565"
            strokeDashoffset={565 - (565 * animatedScore) / 100}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
          />
        </svg>
        <div className="ringCenter">{animatedScore}%</div>
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
            !
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
