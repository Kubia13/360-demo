import React, { useState, useMemo, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import "./index.css";

/* -----------------------------
   MODULES (Demo)
------------------------------ */

const MODULES = [
  { key: "existenz", title: "BU", icon: "💼", weight: 20 },
  { key: "haftpflicht", title: "Haftpflicht", icon: "🛡️", weight: 15 },
  { key: "gesundheit", title: "Gesundheit", icon: "❤️", weight: 15 },
  { key: "wohnen", title: "Wohnen", icon: "🏠", weight: 10 },
  { key: "mobilitaet", title: "Mobilität", icon: "🚗", weight: 10 },
  { key: "recht", title: "Recht", icon: "⚖️", weight: 10 },
];

/* -----------------------------
   COVERAGE SCORE (Demo Logic)
------------------------------ */

function calculateCoverage(profile) {
  let covered = [];

  if (profile.hasCar) covered.push("mobilitaet");
  if (profile.rentsFlat) covered.push("wohnen");
  if (profile.hasDog) covered.push("haftpflicht");
  if (profile.age < 40) covered.push("existenz");

  return covered;
}

function scorePercent(coveredKeys) {
  const total = MODULES.reduce((s, m) => s + m.weight, 0);
  const covered = MODULES.reduce(
    (s, m) => s + (coveredKeys.includes(m.key) ? m.weight : 0),
    0
  );
  return Math.round((covered / total) * 100);
}

/* -----------------------------
   TABBAR
------------------------------ */

function Tabbar() {
  return (
    <div className="tabbar">
      <Link className="tabItem active" to="/">
        Home
      </Link>
      <Link className="tabItem" to="/onboarding">
        Check
      </Link>
      <Link className="tabItem" to="/recommendation">
        Empfehlung
      </Link>

      <a
        className="tabItem"
        href="https://agentur.barmenia.de/florian_loeffler"
        target="_blank"
        rel="noreferrer"
      >
        Kontakt
      </a>
    </div>
  );
}

/* -----------------------------
   ONBOARDING (Mini Demo)
------------------------------ */

function Onboarding({ setProfile }) {
  const nav = useNavigate();

  const [age, setAge] = useState(25);
  const [hasCar, setHasCar] = useState(true);
  const [hasDog, setHasDog] = useState(true);
  const [rentsFlat, setRentsFlat] = useState(true);

  function save() {
    const p = { age, hasCar, hasDog, rentsFlat };
    localStorage.setItem("bg360_profile", JSON.stringify(p));
    setProfile(p);
    nav("/");
  }

  return (
    <div className="screen">
      <h2>360° Bedarfs-Check</h2>

      <label>Alter: {age}</label>
      <input
        type="range"
        min="18"
        max="70"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />

      <label>
        <input
          type="checkbox"
          checked={hasCar}
          onChange={(e) => setHasCar(e.target.checked)}
        />
        KFZ vorhanden
      </label>

      <label>
        <input
          type="checkbox"
          checked={hasDog}
          onChange={(e) => setHasDog(e.target.checked)}
        />
        Hund vorhanden
      </label>

      <label>
        <input
          type="checkbox"
          checked={rentsFlat}
          onChange={(e) => setRentsFlat(e.target.checked)}
        />
        Mietwohnung
      </label>

      <button className="primaryBtn" onClick={save}>
        Speichern
      </button>

      <Tabbar />
    </div>
  );
}

/* -----------------------------
   DASHBOARD – SEGMENT RING
------------------------------ */

function Dashboard({ profile }) {
  const coveredKeys = useMemo(() => calculateCoverage(profile), [profile]);
  const targetScore = useMemo(
    () => scorePercent(coveredKeys),
    [coveredKeys]
  );

  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setTimeout(() => setAnimatedScore(targetScore), 300);
  }, [targetScore]);

  return (
    <div className="screen">
      <header className="header">
        <img src="/logo.jpg" alt="BG Logo" className="logoImg" />
      </header>

      <div className="heroCard">
        <div className="heroTitle">Dein 360° Absicherungsstatus</div>

        {/* Progress Ring */}
        <div className="ringWrap">
          <svg width="200" height="200">
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke="#1a2a36"
              strokeWidth="14"
              fill="none"
            />

            <circle
              cx="100"
              cy="100"
              r="80"
              stroke="#b39ddb"
              strokeWidth="14"
              fill="none"
              strokeDasharray="502"
              strokeDashoffset={502 - (502 * animatedScore) / 100}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              className="ringProgress"
            />
          </svg>

          <div className="ringCenter">
            <div className="avatar">👤</div>
            <div className="percent">{animatedScore}%</div>
          </div>
        </div>

        {/* Segment Modules */}
        <div className="segmentRing">
          {MODULES.map((m) => (
            <Link
              key={m.key}
              to={`/module/${m.key}`}
              className={
                coveredKeys.includes(m.key)
                  ? "segmentItem covered"
                  : "segmentItem open"
              }
            >
              <div className="segIcon">{m.icon}</div>
              <div className="segTitle">{m.title}</div>
            </Link>
          ))}
        </div>

        <div className="gapText">
          Offen:{" "}
          {MODULES.filter((m) => !coveredKeys.includes(m.key))
            .map((m) => m.title)
            .join(" · ")}
        </div>
      </div>

      <Tabbar />
    </div>
  );
}

/* -----------------------------
   MODULE DETAIL PAGE
------------------------------ */

function ModuleDetail() {
  const { key } = useParams();
  const mod = MODULES.find((m) => m.key === key);

  if (!mod) return <div className="screen">Nicht gefunden</div>;

  return (
    <div className="screen">
      <Link to="/" className="backBtn">
        ← Zurück
      </Link>

      <h2>
        {mod.icon} {mod.title}
      </h2>

      <div className="detailCard">
        Hier kommt später DIN 77230 Logik + echte Empfehlung rein.
      </div>

      <Tabbar />
    </div>
  );
}

/* -----------------------------
   RECOMMENDATION
------------------------------ */

function Recommendation() {
  return (
    <div className="screen">
      <h2>Empfehlung</h2>

      <div className="detailCard">
        <b>Top Priorität:</b> Berufsunfähigkeit (BU)
        <p>
          In jungen Jahren ist die Absicherung der Arbeitskraft die wichtigste
          Existenzgrundlage.
        </p>
      </div>

      <Tabbar />
    </div>
  );
}

/* -----------------------------
   MAIN APP
------------------------------ */

export default function App() {
  const stored = localStorage.getItem("bg360_profile");

  const [profile, setProfile] = useState(
    stored
      ? JSON.parse(stored)
      : { age: 25, hasCar: true, hasDog: true, rentsFlat: true }
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard profile={profile} />} />
        <Route
          path="/onboarding"
          element={<Onboarding setProfile={setProfile} />}
        />
        <Route path="/module/:key" element={<ModuleDetail />} />
        <Route path="/recommendation" element={<Recommendation />} />
      </Routes>
    </Router>
  );
}
