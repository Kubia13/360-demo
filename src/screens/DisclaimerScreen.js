/* ================= DISCLAIMER ================= */
import React from "react";
import { scrollToTop } from "../utils/scrollHelpers";

export default function DisclaimerScreen({
  screenRef,
  disclaimerAccepted,
  setDisclaimerAccepted,
  setStep
}) {
  React.useEffect(() => {
    scrollToTop(screenRef);
  }, [screenRef]);

  return (
    <div className="screen center disclaimerScreen" ref={screenRef}>
      <div className="disclaimerCard">
        <h2 style={{ marginBottom: 20 }}>Hinweis zur Nutzung</h2>

        <p style={{ fontSize: 13, opacity: 0.75 }}>
          Der 360° Absicherungscheck ist ein unverbindliches digitales Informations-
          und Analyse-Tool zur strukturierten Selbsteinschätzung der persönlichen
          Absicherungssituation. Er ersetzt keine individuelle Versicherungsberatung
          oder Bedarfsanalyse im Sinne des Versicherungsvertragsgesetzes (VVG).
        </p>

        <p style={{ fontSize: 13, opacity: 0.75 }}>
          Die dargestellten Ergebnisse basieren ausschließlich auf den vom Nutzer
          gemachten Angaben sowie auf einer algorithmischen Auswertung.
          Es erfolgt keine persönliche Eignungsprüfung und keine individuelle
          Produktempfehlung im Sinne der gesetzlichen Beratungspflichten.
        </p>

        <p style={{ fontSize: 13, opacity: 0.75 }}>
          Angezeigte Handlungsfelder, Hinweise oder Tarifübersichten dienen
          ausschließlich der allgemeinen Orientierung.
        </p>

        <p style={{ fontSize: 13, opacity: 0.75 }}>
          Ein Beratungsverhältnis entsteht erst im Rahmen eines persönlichen
          Gesprächs. Die Nutzung von Termin- oder Abschlusslinks erfolgt
          eigenverantwortlich.
        </p>

        <p style={{ fontSize: 13, opacity: 0.75 }}>
          Florian Löffler ist als gebundener Versicherungsvertreter gemäß
          § 34d Abs. 7 GewO tätig und vermittelt ausschließlich die Produkte
          der im Impressum aufgeführten Gesellschaften.
        </p>

        <div className="disclaimerCheckbox">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={disclaimerAccepted}
              onChange={(e) => setDisclaimerAccepted(e.target.checked)}
            />
            Ich bestätige, den Hinweis zur Kenntnis genommen zu haben.
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