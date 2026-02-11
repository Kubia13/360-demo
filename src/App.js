import React, { useState, useEffect, useMemo } from "react";
import "./index.css";

/* ================= KATEGORIE GEWICHTE ================= */

const CATEGORY_WEIGHTS = {
  existenz: 0.25,
  haftung: 0.15,
  gesundheit: 0.15,
  wohnen: 0.1,
  mobilitaet: 0.1,
  vorsorge: 0.15,
  kinder: 0.1,
};

const CATEGORY_LABELS = {
  existenz: "Existenz",
  haftung: "Haftung",
  gesundheit: "Gesundheit",
  wohnen: "Wohnen",
  mobilitaet: "Mobilität",
  vorsorge: "Vorsorge",
  kinder: "Kinder",
};

/* ================= FRAGEN ================= */

const QUESTIONS = {
  /* ===== EXISTENZ ===== */

  bu: {
    label: "Berufsunfähigkeitsversicherung vorhanden?",
    category: "existenz",
    type: "yesno",
  },

  ktg: {
    label: "Krankentagegeld vorhanden?",
    category: "existenz",
    type: "yesno",
    link: {
      label: "Krankentagegeld-Rechner",
      url: "https://ssl.barmenia.de/formular-view/#/krankentagegeldrechner?..."
    }
  },

  unfall: {
    label: "Unfallversicherung vorhanden?",
    category: "existenz",
    type: "yesno",
  },

  /* ===== HAFTUNG ===== */

  haftpflicht: {
    label: "Private Haftpflicht vorhanden?",
    category: "haftung",
    type: "yesno",
  },

  tierhaft: {
    label: "Tierhalterhaftpflicht vorhanden?",
    category: "haftung",
    type: "yesno",
    condition: (baseData) =>
      baseData.tiere === "Hund" ||
      baseData.tiere === "Hund und Katze",
  },

  tier_op: {
    label: "Tier OP- oder Tierkrankenversicherung vorhanden?",
    category: "haftung",
    type: "yesno",
    condition: (baseData) =>
      baseData.tiere === "Hund" ||
      baseData.tiere === "Hund und Katze",
  },

  rechtsschutz: {
    label: "Rechtsschutz vorhanden?",
    category: "haftung",
    type: "yesno",
  },

  /* ===== WOHNEN ===== */

  hausrat: {
    label: "Hausrat ausreichend versichert?",
    category: "wohnen",
    type: "yesno",
    condition: (baseData) =>
      baseData.wohnen &&
      baseData.wohnen !== "Wohne bei Eltern",
  },

  elementar: {
    label: "Elementarversicherung vorhanden?",
    category: "wohnen",
    type: "yesno",
    condition: (baseData) =>
      baseData.wohnen &&
      baseData.wohnen !== "Wohne bei Eltern",
  },

  gebaeude: {
    label: "Wohngebäudeversicherung vorhanden?",
    category: "wohnen",
    type: "yesno",
    condition: (baseData) =>
      baseData.wohnen === "Eigentum Haus",
  },

  /* ===== MOBILITÄT ===== */

  kfz_haftpflicht: {
    label: "KFZ-Haftpflicht vorhanden?",
    category: "mobilitaet",
    type: "yesno",
    condition: (baseData) => baseData.kfz === "Ja",
  },

  kasko: {
    label: "Welche KFZ-Kasko besteht?",
    category: "mobilitaet",
    type: "select",
    options: ["Haftpflicht", "Teilkasko", "Vollkasko", "Weiß nicht"],
    condition: (baseData) => baseData.kfz === "Ja",
  },

  schutzbrief: {
    label: "Schutzbrief vorhanden?",
    category: "mobilitaet",
    type: "yesno",
    condition: (baseData) => baseData.kfz === "Ja",
  },

  /* ===== GESUNDHEIT ===== */

  zahn: {
    label: "Krankenzusatzversicherung vorhanden?",
    category: "gesundheit",
    type: "yesno",
  },

  pflege: {
    label: "Private Pflegezusatz vorhanden?",
    category: "gesundheit",
    type: "yesno",
  },

  /* ===== VORSORGE ===== */

  private_rente: {
    label: "Private Altersvorsorge vorhanden?",
    category: "vorsorge",
    type: "yesno",
  },

  rentenluecke: {
  label: "Kennst du deine Rentenlücke?",
  category: "vorsorge",
  type: "yesno",
  link: {
    label: "Rentenlückenrechner",
    url: "https://rentenrechner.dieversicherer.de/app/gdv.html#luecke"
  }
},

  /* ===== KINDER ===== */

  kinder_unfall: {
    label: "Unfallversicherung für dein Kind vorhanden?",
    category: "kinder",
    type: "yesno",
    condition: (baseData) => baseData.kinder === "Ja",
  },

  kinder_zahn: {
    label: "Krankenzusatz für dein Kind vorhanden?",
    category: "kinder",
    type: "yesno",
    condition: (baseData) => baseData.kinder === "Ja",
  },

  kinder_vorsorge: {
    label: "Wird für dein Kind privat vorgesorgt?",
    category: "kinder",
    type: "yesno",
    condition: (baseData) => baseData.kinder === "Ja",
  },
};
export default function App() {
  const [step, setStep] = useState("welcome");
  const [answers, setAnswers] = useState({});
  const [baseData, setBaseData] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInfo, setShowInfo] = useState(null);

  /* ================= DYNAMISCHE KATEGORIEN ================= */

  const categories = useMemo(() => {
    return Object.keys(CATEGORY_WEIGHTS).filter((cat) => {
      cconst questionsInCategory = Object.keys(QUESTIONS).filter((id) => {
        const q = QUESTIONS[id];
        
        if (q.category !== cat) return false;
        if (q.condition) return q.condition(baseData);
        
        return true;
      });

      return questionsInCategory.length > 0;
    });
  }, [baseData]);

  const currentCategory = categories[currentCategoryIndex];

  /* ===== FLOW-SCHUTZ ===== */

  useEffect(() => {
    if (currentCategoryIndex >= categories.length) {
      setCurrentCategoryIndex(0);
    }
  }, [categories, currentCategoryIndex]);

  /* ================= RESET ================= */

  function resetAll() {
    setStep("welcome");
    setAnswers({});
    setBaseData({});
    setCurrentCategoryIndex(0);
  }

  /* ================= ANSWER ================= */

  function answer(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  /* ================= SCORE ================= */

  function getScore(key) {
    const value = answers[key];

    if (value === "ja") return 100;
    if (value === "nein" || value === "unbekannt") return 0;

    if (key === "kasko") {
      if (value === "vollkasko") return 100;
      if (value === "teilkasko") return 50;
      return 0;
    }

    return 0;
  }

  const categoryScores = Object.keys(CATEGORY_WEIGHTS).reduce((acc, cat) => {
    const questions = Object.keys(QUESTIONS).filter((id) => {
      const q = QUESTIONS[id];
      if (q.category !== cat) return false;
      if (q.condition && !q.condition(baseData)) return false;
      if (answers[id] === undefined) return false;
      return true;
    });

    if (!questions.length) {
      acc[cat] = 0;
    } else {
      const sum = questions.reduce((s, id) => s + getScore(id), 0);
      acc[cat] = Math.round(sum / questions.length);
    }

    return acc;
  }, {});

  const totalScore = Math.round(
    Object.keys(CATEGORY_WEIGHTS).reduce(
      (sum, cat) =>
        sum + (categoryScores[cat] || 0) * CATEGORY_WEIGHTS[cat],
      0
    )
  );

  /* ===== SCORE ANIMATION ===== */

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= totalScore) {
        current = totalScore;
        clearInterval(interval);
      }
      setAnimatedScore(current);
    }, 10);

    return () => clearInterval(interval);
  }, [totalScore]);

  /* ================= RESET OVERLAY ================= */

  const ResetOverlay = showResetConfirm && (
    <div
      className="infoOverlay"
      onClick={() => setShowResetConfirm(false)}
    >
      <div
        className="infoBox"
        onClick={(e) => e.stopPropagation()}
      >
        <p>Möchtest du von vorne beginnen?</p>

        <div className="overlayButtons">
          <button
            className="overlayBtn primary"
            onClick={() => {
              setShowResetConfirm(false);
              resetAll();
            }}
          >
            Ja
          </button>

          <button
            className="overlayBtn secondary"
            onClick={() => setShowResetConfirm(false)}
          >
            Nein
          </button>
        </div>
      </div>
    </div>
  );
  /* ================= WELCOME ================= */

  if (step === "welcome") {
    return (
      <div className="screen center">
        <img
          src="/logo.jpg"
          className="logo large"
          onClick={resetAll}
          alt="Logo"
        />

        <h1>360° Absicherungscheck</h1>
        <p>Beantworte ein paar Fragen zu deiner Situation.</p>

        <button
          className="primaryBtn big"
          onClick={() => setStep("base")}
        >
          Jetzt starten
        </button>

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        {ResetOverlay}
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
          onChange={(v) =>
            setBaseData({ ...baseData, geschlecht: v })
          }
        />

        <Input
          label="Vorname"
          onChange={(v) =>
            setBaseData({ ...baseData, vorname: v })
          }
        />

        <Input
          label="Nachname"
          onChange={(v) =>
            setBaseData({ ...baseData, nachname: v })
          }
        />

        <Input
          label="Alter"
          type="number"
          onChange={(v) =>
            setBaseData({ ...baseData, alter: v })
          }
        />

        <Input
          label="Monatliches Netto-Gehalt (€)"
          type="number"
          onChange={(v) =>
            setBaseData({ ...baseData, gehalt: v })
          }
        />

        <Select
          label="Berufliche Situation"
          options={[
            "Angestellt",
            "Öffentlicher Dienst",
            "Selbstständig",
            "Nicht berufstätig",
          ]}
          onChange={(v) =>
            setBaseData({ ...baseData, beruf: v })
          }
        />

        <Select
          label="Hast du Kinder?"
          options={["Nein", "Ja"]}
          onChange={(v) =>
            setBaseData({ ...baseData, kinder: v })
          }
        />

        {baseData.kinder === "Ja" && (
          <Input
            label="Anzahl Kinder"
            type="number"
            onChange={(v) =>
              setBaseData({
                ...baseData,
                kinderAnzahl: v,
              })
            }
          />
        )}

        <Select
          label="Haustiere"
          options={[
            "Keine Tiere",
            "Katze",
            "Hund",
            "Hund und Katze",
          ]}
          onChange={(v) =>
            setBaseData({ ...baseData, tiere: v })
          }
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
          onChange={(v) =>
            setBaseData({ ...baseData, wohnen: v })
          }
        />

        <Select
          label="Besitzt du ein KFZ?"
          options={["Nein", "Ja"]}
          onChange={(v) =>
            setBaseData({ ...baseData, kfz: v })
          }
        />

        {baseData.kfz === "Ja" && (
          <Input
            label="Anzahl Fahrzeuge"
            type="number"
            onChange={(v) =>
              setBaseData({
                ...baseData,
                kfzAnzahl: v,
              })
            }
          />
        )}

        <button
          className="primaryBtn"
          onClick={() => setStep("category")}
        >
          Weiter
        </button>

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        {ResetOverlay}
      </div>
    );
  }

  /* ================= KATEGORIEN ================= */

  if (step === "category") {

    const questionsOfCategory = Object.keys(QUESTIONS).filter((id) => {
      const q = QUESTIONS[id];

      if (q.category !== currentCategory) return false;

      if (q.condition && !q.condition(baseData)) return false;

      return true;
    });

    return (
      <div className="screen">
        <Header
          reset={resetAll}
          back={() => {
            if (currentCategoryIndex > 0) {
              setCurrentCategoryIndex((prev) => prev - 1);
            } else {
              setStep("base");
            }
          }}
        />

        {/* Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            Kategorie {currentCategoryIndex + 1} von {categories.length}
          </div>

          <div style={{ fontSize: 20, fontWeight: "bold" }}>
            {CATEGORY_LABELS[currentCategory]}
          </div>

          <div
            style={{
              height: 6,
              background: "#1a2a36",
              borderRadius: 6,
              marginTop: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${((currentCategoryIndex + 1) / categories.length) * 100}%`,
                height: "100%",
                background:
                  "linear-gradient(135deg, #8B7CF6, #5E4AE3)",
                transition: "0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Fragen */}
        {questionsOfCategory.map((id) => {
          const q = QUESTIONS[id];

          return (
            <div key={id} className="questionCard dark">
              <div className="questionText">
                {q.label}

                {q.info && (
                  <span
                    className="infoIcon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInfo(q.info);
                    }}
                  >
                    i
                  </span>
                )}
              </div>

              {q.link && (
                <a
                  href={q.link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inlineLink"
                >
                  {q.link.label}
                </a>
              )}

              {q.type === "select" && (
                <Select
                  label=""
                  options={q.options}
                  onChange={(v) => {
                    if (id === "kasko") {
                      if (v === "Haftpflicht") answer(id, "haftpflicht");
                      else if (v === "Teilkasko") answer(id, "teilkasko");
                      else if (v === "Vollkasko") answer(id, "vollkasko");
                      else answer(id, "unbekannt");
                    } else {
                      answer(
                        id,
                        v === "Weiß nicht" ? "unbekannt" : v
                      );
                    }
                  }}
                />
              )}

              {q.type === "yesno" && (
                <div className="buttonRow">
                  {["ja", "nein", "unbekannt"].map((v) => (
                    <button
                      key={v}
                      className={`answerBtn ${
                        answers[id] === v ? "active" : ""
                      }`}
                      onClick={() => answer(id, v)}
                    >
                      {v === "ja"
                        ? "Ja"
                        : v === "nein"
                        ? "Nein"
                        : "Weiß ich nicht"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <button
          className="primaryBtn"
          onClick={() => {
            if (currentCategoryIndex < categories.length - 1) {
              setCurrentCategoryIndex((prev) => prev + 1);
            } else {
              setStep("dashboard");
            }
          }}
        >
          {currentCategoryIndex < categories.length - 1
            ? "Weiter"
            : "Auswertung"}
        </button>

        {showInfo && (
          <div
            className="infoOverlay"
            onClick={() => setShowInfo(null)}
          >
            <div className="infoBox">
              {showInfo.split("\n").map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          </div>
        )}

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        {ResetOverlay}
      </div>
    );
  }
  /* ================= DASHBOARD ================= */

  return (
    <div className="screen">
      <Header reset={resetAll} back={() => setStep("category")} />

      <h2>
        {baseData.vorname
          ? `${baseData.vorname}, dein Status`
          : "Dein Status"}
      </h2>

      <div className="ringWrap">
        <svg width="220" height="220">
          <circle
            cx="110"
            cy="110"
            r="90"
            stroke="#1a2a36"
            strokeWidth="16"
            fill="none"
          />

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
        {categories.map((cat) => (
          <div key={cat} className="categoryRow">
            <span>{CATEGORY_LABELS[cat]}</span>
            <span>{categoryScores[cat] || 0}%</span>
          </div>
        ))}
      </div>

      <ContactButton onReset={() => setShowResetConfirm(true)} />
      {ResetOverlay}
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Header({ reset, back }) {
  return (
    <div className="header">
      <img
        src="/logo.jpg"
        className="logo small"
        onClick={reset}
        alt="Logo"
      />
      <button className="backBtn" onClick={back}>
        ⬅
      </button>
    </div>
  );
}

function Input({ label, type = "text", onChange }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({ label, options, onChange }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <select onChange={(e) => onChange(e.target.value)}>
        <option value="">Bitte wählen</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="checkbox">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

function ContactButton({ onReset }) {
  return (
    <div className="contactFixed">
      <button
        className="contactBtn"
        onClick={() =>
          window.open(
            "https://agentur.barmenia.de/florian_loeffler",
            "_blank"
          )
        }
      >
        Kontakt aufnehmen
      </button>

      <button
        className="contactBtn secondary"
        onClick={onReset}
      >
        Neustart
      </button>
    </div>
  );
}
