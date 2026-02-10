import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./index.css";

/* ======================================================
   FRAGEN (24)
====================================================== */

const questions = [
  { id: "age", label: "Wie alt bist du?", type: "number" },
  { id: "family", label: "Familienstand?", type: "choice", options: ["Single", "Partnerschaft", "Verheiratet"] },
  { id: "children", label: "Kinder vorhanden?", type: "choice", options: ["Nein", "Ja"] },
  { id: "pets", label: "Haustiere?", type: "choice", options: ["Keine", "Hund", "Mehrere"] },
  { id: "job", label: "Berufliche Situation?", type: "choice", options: ["Angestellt", "Selbstständig", "ÖD"] },
  { id: "income", label: "Nettoeinkommen (€)", type: "number" },
  { id: "workDependence", label: "Lebensstandard vom Einkommen abhängig?", type: "choice", options: ["Ja", "Nein"] },
  { id: "living", label: "Wohnsituation?", type: "choice", options: ["Miete", "Eigentum"] },
  { id: "sqm", label: "Wohnfläche (m²)", type: "number" },
  { id: "household", label: "Hausrat-Wert (€)", type: "number" },
  { id: "car", label: "Auto vorhanden?", type: "choice", options: ["Nein", "Ja"] },
  { id: "carCount", label: "Fahrzeuge?", type: "choice", options: ["1", "2", "3+"] },
  { id: "carBusiness", label: "Auto beruflich genutzt?", type: "choice", options: ["Nein", "Ja"] },
  { id: "health", label: "Krankenversicherung?", type: "choice", options: ["Gesetzlich", "Privat"] },
  { id: "addons", label: "Zusatzversicherungen?", type: "choice", options: ["Nein", "Ja"] },
  { id: "jaeg", label: "Einkommen nahe PKV-Grenze?", type: "choice", options: ["Nein", "Ja"] },
  { id: "bu", label: "BU vorhanden?", type: "choice", options: ["Nein", "Ja"] },
  { id: "pension", label: "Private Altersvorsorge?", type: "choice", options: ["Nein", "Ja"] },
  { id: "savings", label: "Rücklagen > 3 Monatsgehälter?", type: "choice", options: ["Nein", "Ja"] },
  { id: "dependants", label: "Jemand finanziell abhängig?", type: "choice", options: ["Nein", "Ja"] },
  { id: "legal", label: "Schon Rechtsstreit gehabt?", type: "choice", options: ["Nein", "Ja"] },
  { id: "claims", label: "Schäden in letzten 5 Jahren?", type: "choice", options: ["Nein", "Ja"] },
  { id: "digital", label: "Digitaler Service wichtig?", type: "choice", options: ["Nein", "Ja"] },
  { id: "advisor", label: "Persönliche Beratung gewünscht?", type: "choice", options: ["Nein", "Ja"] },
];

/* ======================================================
   SCORE + EMPFEHLUNGEN (DIN-orientiert)
====================================================== */

function calculateDIN(answers) {
  const recommendations = [];

  // EXISTENZ
  if (answers.workDependence === "Ja" && answers.bu === "Nein") {
    recommendations.push({
      level: "high",
      title: "Berufsunfähigkeitsversicherung",
      reason: "Dein Einkommen sichert deinen Lebensstandard. Ohne BU besteht ein existenzielles Risiko.",
    });
  }

  // HAFTUNG
  if (answers.pets === "Hund" || answers.pets === "Mehrere") {
    recommendations.push({
      level: "medium",
      title: "Tierhalterhaftpflicht",
      reason: "Als Tierhalter haftest du unbegrenzt für Schäden.",
    });
  }

  // RECHT
  if (answers.legal === "Ja") {
    recommendations.push({
      level: "medium",
      title: "Rechtsschutzversicherung",
      reason: "Frühere Streitigkeiten erhöhen das zukünftige Risiko.",
    });
  }

  // KFZ
  if (answers.car === "Ja") {
    recommendations.push({
      level: "low",
      title: "KFZ-Schutzbrief",
      reason: "Ergänzt deine Mobilitätsabsicherung sinnvoll.",
    });
  }

  // GESUNDHEIT
  if (answers.addons === "Nein") {
    recommendations.push({
      level: "low",
      title: "Gesundheitszusatzversicherung",
      reason: "Zusatzleistungen schließen Versorgungslücken.",
    });
  }

  return recommendations;
}

/* ======================================================
   UI KOMPONENTEN
====================================================== */

function Header() {
  return (
    <header className="header">
      <img src="/logo.jpg" alt="Logo" className="logoImg" />
    </header>
  );
}

function Progress({ step }) {
  const percent = Math.round(((step + 1) / questions.length) * 100);
  return (
    <div className="progressWrap">
      <div className="progressText">
        Schritt {step + 1} von {questions.length}
      </div>
      <div className="progressBar">
        <div className="progressFill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

/* ======================================================
   WIZARD
====================================================== */

function Wizard() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = questions[step];

  return (
    <div className="screen">
      <Header />
      <Progress step={step} />

      <div className="card">
        <h2>{q.label}</h2>

        {q.type === "number" && (
          <input
            type="number"
            value={answers[q.id] || ""}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
          />
        )}

        {q.type === "choice" && (
          <div className="choices">
            {q.options.map((o) => (
              <button
                key={o}
                className={answers[q.id] === o ? "active" : ""}
                onClick={() => setAnswers({ ...answers, [q.id]: o })}
              >
                {o}
              </button>
            ))}
          </div>
        )}

        <button
          className="primary"
          disabled={!answers[q.id]}
          onClick={() =>
            step < questions.length - 1
              ? setStep(step + 1)
              : nav("/recommendation", { state: answers })
          }
        >
          Weiter
        </button>
      </div>
    </div>
  );
}

/* ======================================================
   EMPFEHLUNG
====================================================== */

function Recommendation() {
  const { state } = useLocation();
  const recs = calculateDIN(state);

  return (
    <div className="screen">
      <Header />
      <div className="card">
        <h2>Deine Empfehlungen</h2>

        {recs.map((r, i) => (
          <div key={i} className={`rec ${r.level}`}>
            <strong>{r.title}</strong>
            <p>{r.reason}</p>
          </div>
        ))}

        <p className="hint">
          Empfehlungen basieren auf DIN-orientierter Bedarfsermittlung.
        </p>
      </div>
    </div>
  );
}

/* ======================================================
   APP
====================================================== */

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Wizard />} />
        <Route path="/recommendation" element={<Recommendation />} />
      </Routes>
    </Router>
  );
}
