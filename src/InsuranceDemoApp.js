import React, { useState } from "react";
import { motion } from "framer-motion";

export default function InsuranceDemoApp() {
  const [screen, setScreen] = useState("dashboard");

  const headerStyle = {
    background: "#062B4B",
    color: "white",
    padding: "18px",
    fontSize: "20px",
    fontWeight: 600,
  };

  const cardStyle = {
    background: "white",
    borderRadius: "18px",
    padding: "20px",
    marginTop: "16px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  };

  const buttonStyle = {
    marginTop: "14px",
    padding: "12px 18px",
    borderRadius: "14px",
    border: "none",
    background: "#00AEEF",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
  };

  return (
    <div>
      <div style={headerStyle}>BarmeniaGothaer – 360° Check</div>

      <div style={{ padding: 20 }}>
        {screen === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={cardStyle}>
              <h2>Hallo Kundin/Kunde</h2>
              <p>Ihr aktueller Absicherungsgrad:</p>
              <div style={{ fontSize: 42, fontWeight: 700 }}>75%</div>
              <button style={buttonStyle} onClick={() => setScreen("gaps")}>
                Versicherungslücken ansehen →
              </button>
            </div>
          </motion.div>
        )}

        {screen === "gaps" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={cardStyle}>
              <h2>Offene Lücken</h2>
              <ul>
                <li>Berufsunfähigkeit</li>
                <li>Rechtsschutz</li>
              </ul>
              <button
                style={buttonStyle}
                onClick={() => setScreen("questions")}
              >
                Lücke schließen →
              </button>
            </div>
          </motion.div>
        )}

        {screen === "questions" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={cardStyle}>
              <h2>Kurz-Check</h2>
              <p>Lebenssituation: Single / Familie / Kinder?</p>
              <button
                style={buttonStyle}
                onClick={() => setScreen("recommendation")}
              >
                Weiter →
              </button>
            </div>
          </motion.div>
        )}

        {screen === "recommendation" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={cardStyle}>
              <h2>Empfehlung</h2>
              <p>Privathaftpflicht Komfort</p>
              <p>Beitrag: ab 4,90 € / Monat</p>
              <button
                style={buttonStyle}
                onClick={() => setScreen("checkout")}
              >
                Online abschließen →
              </button>
            </div>
          </motion.div>
        )}

        {screen === "checkout" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={cardStyle}>
              <h2>Abschluss (Demo)</h2>
              <p>Hier startet die Online-Abschlussstrecke.</p>
              <button
                style={buttonStyle}
                onClick={() => setScreen("dashboard")}
              >
                Zurück zum Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
