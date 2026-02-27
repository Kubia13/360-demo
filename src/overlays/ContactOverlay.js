  /* ================= Contact Overlay ================= */

 import React from "react";

export default function ContactOverlay({
  contactOverlay,
  setContactOverlay
}) {
  if (!contactOverlay) return null;

  return (
    <div
      className="infoOverlay"
      onClick={() => setContactOverlay(false)}
    >
      <div
        className="infoBox"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: 14 }}>
          Persönliche Beratung & Strategiegespräch
        </h3>

        <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>
          In einem strukturierten Gespräch analysieren wir gemeinsam deine aktuelle
          Absicherung, priorisieren sinnvolle Maßnahmen und prüfen,
          welche Lösungen wirtschaftlich und langfristig sinnvoll sind.
        </p>

        <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>
          Transparent. Individuell. Ohne Verpflichtung.
        </p>

        <div style={{ marginTop: 18 }}>
          <p><strong>Florian Löffler</strong></p>

          <p style={{ fontSize: 13, opacity: 0.75 }}>
            BarmeniaGothaer VZ Südbaden<br />
            Breisacher Str. 145b<br />
            79110 Freiburg im Breisgau
          </p>

          <p style={{ fontSize: 13, opacity: 0.75 }}>
            Telefon:{" "}
            <a href="tel:+497612027423">
              0761-2027423
            </a>
            <br />
            E-Mail:{" "}
            <a href="mailto:florian.loeffler@barmenia.de?subject=Anfrage%20360%C2%B0%20Absicherungscheck">
              florian.loeffler@barmenia.de
            </a>
          </p>
        </div>

        <div className="overlayButtons" style={{ marginTop: 20 }}>

          <button
            className="overlayBtn primary"
            onClick={() =>
              window.open(
                "https://agentur.barmenia.de/florian_loeffler",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Zur Agentur-Website
          </button>

          <button
            className="overlayBtn secondary"
            onClick={() => setContactOverlay(false)}
          >
            Schließen
          </button>

        </div>

        <p style={{ fontSize: 12, opacity: 0.6, marginTop: 14 }}>
          100% unverbindlich · Persönliche Analyse · Keine automatische Datenübertragung
        </p>

      </div>
    </div>
  );
}