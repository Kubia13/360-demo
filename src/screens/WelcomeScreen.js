/* ================= WELCOME ================= */
import React from "react";
import { ContactButton } from "../components/UI";

export default function WelcomeScreen({
  setStep,
  setLegalOverlay,
  setShowResetConfirm,
  setContactOverlay
}) {

  return (
    <div className="screen center">
      <img
        src="/logo.jpg"
        className="logo large"
        alt="Logo"
      />
      <h1>360° Absicherungscheck</h1>

      <p style={{ opacity: 0.85, lineHeight: 1.5 }}>
        In wenigen Minuten erhältst du eine strukturierte Übersicht
        deiner aktuellen Absicherung – klar, verständlich und
        kategorisiert nach Risiko­bereichen.
      </p>

      <p style={{ opacity: 0.65, fontSize: 14, marginTop: 6 }}>
        Keine Anmeldung. Keine Datenspeicherung. Nur Transparenz.
      </p>

      <button
        className="primaryBtn big"
        onClick={() => setStep("disclaimer")}
      >
        Jetzt Check starten
      </button>

      <div className="legalFooter">
        <span onClick={() => setLegalOverlay("impressum")}>
          Impressum
        </span>
        {" | "}
        <span onClick={() => setLegalOverlay("datenschutz")}>
          Datenschutz
        </span>
        {" | "}
        <span onClick={() => setLegalOverlay("hinweis")}>
          Hinweis
        </span>
      </div>

      <ContactButton
        onReset={() => setShowResetConfirm(true)}
        onContact={() => setContactOverlay(true)}
      />
    </div>
  );
}