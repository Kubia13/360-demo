import React from "react";
import Input from "../components/UI/Input";

const CalculatorOverlay = React.memo(function CalculatorOverlay({
  calculatorOverlay,
  setCalculatorOverlay,
  buIncome,
  setBuIncome
}) {
  if (!calculatorOverlay) return null;

  return (
    <div
      className="infoOverlay"
      onClick={() => setCalculatorOverlay(false)}
    >
      <div
        className="infoBox calculatorBox"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="overlayClose"
          onClick={() => setCalculatorOverlay(false)}
        >
          ×
        </button>

        <h3 style={{ marginBottom: 16 }}>
          Rechner & Analyse-Tools
        </h3>

        <p style={{ opacity: 0.75, fontSize: 14, marginBottom: 20 }}>
          Mit diesen Tools kannst du zentrale Versorgungslücken selbst berechnen
          und deine Absicherung gezielt prüfen.
        </p>

        {/* EXTERNE RECHNER */}

        <div className="calculatorList">

          <a
            href="https://ssl.barmenia.de/formular-view/#/krankentagegeldrechner?prd=Apps%2Bund%2BRechner&dom=www.barmenia.de&p0=334300"
            target="_blank"
            rel="noopener noreferrer"
            className="calculatorItem"
          >
            <strong>Krankentagegeld-Rechner</strong>
            <span>Ermittelt deinen Einkommensbedarf bei längerer Krankheit.</span>
          </a>

          <a
            href="https://rentenrechner.dieversicherer.de/app/gdv.html#start"
            target="_blank"
            rel="noopener noreferrer"
            className="calculatorItem"
          >
            <strong>Altersrentenlücken-Rechner</strong>
            <span>Berechnet deine voraussichtliche Versorgungslücke im Ruhestand.</span>
          </a>

        </div>

        <hr style={{ margin: "20px 0", opacity: 0.15 }} />



        {/* BU RECHNER */}

        <h4 style={{ marginBottom: 14 }}>
          BU-Bedarfsrechner
        </h4>

        <div className="buCalculatorRow">

          <div className="buInput">
            <Input
              label="Monatliches Netto-Einkommen (€)"
              type="number"
              value={buIncome}
              onChange={(v) => setBuIncome(v)}
            />
          </div>

          <div className="buResult">
            <div className="buResultLabel">
              BU-Rente (80%)
            </div>

            <div className="buResultValue">
              {buIncome
                ? `${Math.round(Number(buIncome) * 0.8)} €`
                : "–"}
            </div>
          </div>

        </div>

        <p className="buDisclaimer">
          Orientierung auf Basis der Faustformel (80 % des Nettoeinkommens).
          Keine individuelle Bedarfsanalyse im Sinne des VVG.
        </p>

      </div>
    </div>
  );
});

export default CalculatorOverlay;