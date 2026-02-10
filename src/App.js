import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./index.css";

/* ======================================================
   DIN-77230 BASIS
====================================================== */

const DIN = {
  existenz: 0.4,
  sach: 0.3,
  vorsorge: 0.2,
  komfort: 0.1,
};

/* ======================================================
   INITIAL PROFIL (Bestandskunde = später vorfüllbar)
====================================================== */

const initialProfile = {
  age: "",
  job: "",
  income: "",
  living: "",
  car: false,
  dog: false,
  bu: false,
  gkv: true,
};

/* ======================================================
   SCORE LOGIK (DIN-nah, erklärbar)
====================================================== */

function calculateScores(p) {
  const existenz =
    p.bu && p.income > 0 ? 90 : p.income > 0 ? 30 : 60;

  const sach =
    (p.car ? 70 : 100) - (p.dog ? 15 : 0);

  const vorsorge =
    p.age < 30 ? 40 : p.age < 50 ? 60 : 70;

  const komfort = 60;

  const total =
    existenz * DIN.existenz +
    sach * DIN.sach +
    vorsorge * DIN.vorsorge +
    komfort * DIN.komfort;

  return {
    existenz,
    sach,
    vorsorge,
    komfort,
    total: Math.round(total),
  };
}

/* ======================================================
   UI KOMPONENTEN
====================================================== */

function Header({ back }) {
  const nav = useNavigate();
  return (
    <header className="header">
      {back && (
        <button className="backBtn" onClick={() => nav(-1)}>
          ←
        </button>
      )}
      <img src="/logo.jpg" className="logoImg" alt="Logo" />
    </header>
  );
}

function Ring({ value }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const o = c - (value / 100) * c;

  return (
    <div className="ringWrap">
      <svg width="180" height="180">
        <circle
          cx="90"
          cy="90"
          r={r}
          stroke="#1a2a36"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="90"
          cy="90"
          r={r}
          stroke="#00e5ff"
          strokeWidth="12"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={o}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          className="ringAnim"
        />
      </svg>
      <div className="ringCenter">
        <div className="avatar">👤</div>
        <div className="percent">{value}%</div>
      </div>
    </div>
  );
}

/* ======================================================
   WIZARD (ECHTE ABFRAGE)
====================================================== */

function Wizard({ profile, setProfile }) {
  const nav = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Über dich",
      content: (
        <>
          <input
            placeholder="Alter"
            type="number"
            value={profile.age}
            onChange={(e) =>
              setProfile({ ...profile, age: +e.target.value })
            }
          />
          <select
            value={profile.job}
            onChange={(e) =>
              setProfile({ ...profile, job: e.target.value })
            }
          >
            <option value="">Beruf</option>
            <option value="angestellt">Angestellt</option>
            <option value="selbständig">Selbständig</option>
            <option value="öd">Öffentlicher Dienst</option>
          </select>
        </>
      ),
    },
    {
      title: "Einkommen & Wohnen",
      content: (
        <>
          <input
            placeholder="Nettoeinkommen"
            type="number"
            value={profile.income}
            onChange={(e) =>
              setProfile({ ...profile, income: +e.target.value })
            }
          />
          <select
            value={profile.living}
            onChange={(e) =>
              setProfile({ ...profile, living: e.target.value })
            }
          >
            <option value="">Wohnsituation</option>
            <option value="miete">Miete</option>
            <option value="eigentum">Eigentum</option>
          </select>
        </>
      ),
    },
    {
      title: "Risiken",
      content: (
        <>
          <label>
            <input
              type="checkbox"
              checked={profile.car}
              onChange={(e) =>
                setProfile({ ...profile, car: e.target.checked })
              }
            />
            KFZ vorhanden
          </label>
          <label>
            <input
              type="checkbox"
              checked={profile.dog}
              onChange={(e) =>
                setProfile({ ...profile, dog: e.target.checked })
              }
            />
            Hund vorhanden
          </label>
        </>
      ),
    },
    {
      title: "Vorsorge",
      content: (
        <>
          <label>
            <input
              type="checkbox"
              checked={profile.bu}
              onChange={(e) =>
                setProfile({ ...profile, bu: e.target.checked })
              }
            />
            Berufsunfähigkeitsversicherung vorhanden
          </label>
        </>
      ),
    },
  ];

  return (
    <div className="screen">
      <Header back={step > 0} />
      <div className="heroCard">
        <div className="heroTitle">{steps[step].title}</div>
        <div className="form">{steps[step].content}</div>

        <button
          className="primaryBtn"
          onClick={() =>
            step < steps.length - 1
              ? setStep(step + 1)
              : nav("/result")
          }
        >
          {step < steps.length - 1 ? "Weiter" : "Auswertung"}
        </button>
      </div>
    </div>
  );
}

/* ======================================================
   ERGEBNIS
====================================================== */

function Result({ profile }) {
  const scores = calculateScores(profile);

  return (
    <div className="screen">
      <Header back />
      <div className="heroCard">
        <div className="heroTitle">Dein Absicherungsstatus</div>
        <Ring value={scores.total} />

        <div className="statusRow">
          <span>Existenz</span>
          <span>{scores.existenz}%</span>
        </div>
        <div className="statusRow">
          <span>Sach & Haftung</span>
          <span>{scores.sach}%</span>
        </div>
        <div className="statusRow">
          <span>Vorsorge</span>
          <span>{scores.vorsorge}%</span>
        </div>

        <div className="gapText">
          Empfehlung priorisiert nach DIN-Logik
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   APP
====================================================== */

export default function App() {
  const [profile, setProfile] = useState(initialProfile);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Wizard profile={profile} setProfile={setProfile} />}
        />
        <Route
          path="/result"
          element={<Result profile={profile} />}
        />
      </Routes>
    </Router>
  );
}
