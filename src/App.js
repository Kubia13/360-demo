import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";

function Card({ title, subtitle, to }) {
  return (
    <Link to={to} className="card">
      <div className="cardTitle">{title}</div>
      <div className="cardSubtitle">{subtitle}</div>
    </Link>
  );
}

function Tabbar() {
  return (
    <div className="tabbar">
      <div className="tabItem">Verträge</div>
      <div className="tabItem">Postbox</div>
      <div className="tabItem active">Home</div>
      <div className="tabItem">Services</div>
      <div className="tabItem">Kontakt</div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="screen">
      <header className="header">
        <div className="logo">✦ BarmeniaGothaer</div>
      </header>

      <div className="welcome">Guten Abend</div>
      <div className="persona">
        Max, 25 · Single · Mietwohnung · KFZ · Hund
      </div>

      <div className="heroCard">
        <div className="heroTitle">Dein Schutz-Status</div>

        <div className="ringWrap">
          <div className="ring">
            <div className="ringInner">
              <div className="silhouette">👤</div>
              <div className="percent">62%</div>
            </div>
          </div>
        </div>

        <div className="gapText">3 wichtige Lücken offen</div>

        <Link to="/status" className="primaryBtn">
          Jetzt optimieren
        </Link>
      </div>

      <div className="moduleGrid">
        <Card
          title="Mobilität"
          subtitle="KFZ ✔ Schutzbrief ❌"
          to="/module/mobilitaet"
        />
        <Card title="Wohnen" subtitle="Hausrat ✔ Fahrrad ❌" to="/module/wohnen" />
        <Card
          title="Vorsorge"
          subtitle="BU ❌ Unfall ✔"
          to="/module/vorsorge"
        />
        <Card
          title="Recht & Haftung"
          subtitle="Haftpflicht ✔ Recht ❌"
          to="/module/recht"
        />
        <Card
          title="Gesundheit"
          subtitle="GKV ✔ Zusatz ❌"
          to="/module/gesundheit"
        />
      </div>

      <Tabbar />
    </div>
  );
}

function ModulePage({ title, bullets }) {
  return (
    <div className="screen">
      <header className="header">
        <Link to="/" className="backBtn">
          ←
        </Link>
        <div className="pageTitle">{title}</div>
      </header>

      <div className="detailCard">
        {bullets.map((b, i) => (
          <div key={i} className="bullet">
            {b}
          </div>
        ))}

        <Link to="/recommendation" className="primaryBtn">
          Empfehlung ansehen
        </Link>
      </div>

      <Tabbar />
    </div>
  );
}

function Recommendation() {
  return (
    <div className="screen">
      <header className="header">
        <Link to="/" className="backBtn">
          ←
        </Link>
        <div className="pageTitle">Empfehlung</div>
      </header>

      <div className="detailCard">
        <div className="heroTitle">Top Priorität: Berufsunfähigkeit</div>
        <div className="gapText">
          In deiner Lebensphase ist BU die wichtigste Existenzabsicherung.
        </div>

        <button className="primaryBtn">Online abschließen (Demo)</button>
      </div>

      <Tabbar />
    </div>
  );
}

function StatusPage() {
  return (
    <div className="screen">
      <header className="header">
        <Link to="/" className="backBtn">
          ←
        </Link>
        <div className="pageTitle">Absicherungsstatus</div>
      </header>

      <div className="detailCard">
        <div className="heroTitle">62% abgesichert</div>
        <div className="gapText">
          Offen: BU · Rechtsschutz · Schutzbrief
        </div>
      </div>

      <Tabbar />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/status" element={<StatusPage />} />

        <Route
          path="/module/mobilitaet"
          element={
            <ModulePage
              title="Mobilität"
              bullets={[
                "KFZ Versicherung: vorhanden ✔",
                "Schutzbrief: fehlt ❌",
                "GAP Deckung: optional",
              ]}
            />
          }
        />

        <Route
          path="/module/wohnen"
          element={
            <ModulePage
              title="Wohnen"
              bullets={[
                "Hausrat: vorhanden ✔",
                "Fahrradschutz: fehlt ❌",
                "Glas: optional",
              ]}
            />
          }
        />

        <Route
          path="/module/vorsorge"
          element={
            <ModulePage
              title="Vorsorge"
              bullets={[
                "Berufsunfähigkeit: fehlt ❌",
                "Unfall: optional ✔",
                "Altersvorsorge: später relevant",
              ]}
            />
          }
        />

        <Route
          path="/module/recht"
          element={
            <ModulePage
              title="Recht & Haftung"
              bullets={[
                "Privathaftpflicht: vorhanden ✔",
                "Hundehalterhaftpflicht: vorhanden ✔",
                "Rechtsschutz: fehlt ❌",
              ]}
            />
          }
        />

        <Route
          path="/module/gesundheit"
          element={
            <ModulePage
              title="Gesundheit"
              bullets={[
                "Gesetzliche KV: vorhanden ✔",
                "Zahnzusatz: fehlt ❌",
                "PKV: optional bei hohem Einkommen",
              ]}
            />
          }
        />

        <Route path="/recommendation" element={<Recommendation />} />
      </Routes>
    </Router>
  );
}
