/* ================= DISCLAIMER ================= */

import React from "react";

export default function DisclaimerScreen({
  disclaimerAccepted,
  setDisclaimerAccepted,
  setStep
}) {

  return (
    <div className="screen center disclaimerScreen">

      <div className="disclaimerCard">

        <h2 style={{ marginBottom: 20 }}>
          Hinweis zur Nutzung
        </h2>

        <p style={{ fontSize: 13, opacity: 0.75 }}>
          Der 360° Absicherungscheck stellt ein unverbindliches digitales
          Informations- und Analyseangebot dar. Er ersetzt keine individuelle
          Versicherungsberatung oder Bedarfsanalyse im Sinne des
          Versicherungsvertragsgesetzes (VVG).
        </p>

        <p style={{ fontSize: 13, opacity: 0.75 }}>
          Die dargestellten Ergebnisse basieren ausschließlich auf den vom Nutzer
          gemachten Angaben sowie auf einer algorithmischen Auswertung.
          Angezeigte Handlungsfelder oder Abschlussmöglichkeiten stellen
          keine individuelle Empfehlung dar.
        </p>

        <p style={{ fontSize: 13, opacity: 0.75 }}>
          Ein Beratungsverhältnis entsteht erst im Rahmen eines persönlichen
          Gesprächs. Die Nutzung von Abschluss- oder Terminlinks erfolgt
          eigenverantwortlich.
        </p>

        <p style={{ fontSize: 13, opacity: 0.75 }}>
          Florian Löffler ist als gebundener Versicherungsvertreter gemäß § 34d GewO tätig
          und vermittelt ausschließlich die Produkte der im Impressum aufgeführten
          Gesellschaften.
        </p>

        <div className="disclaimerCheckbox">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={disclaimerAccepted}
              onChange={(e) => setDisclaimerAccepted(e.target.checked)}
            />
            Ich habe den Hinweis gelesen und akzeptiere ihn.
          </label>
        </div>

        <button
          className="primaryBtn big"
          disabled={!disclaimerAccepted}
          style={{
            marginTop: 20,
            opacity: disclaimerAccepted ? 1 : 0.5,
            cursor: disclaimerAccepted ? "pointer" : "not-allowed"
          }}
          onClick={() => setStep("base")}
        >
          Weiter zu den persönlichen Angaben
        </button>

      </div>
    </div>
  );
}