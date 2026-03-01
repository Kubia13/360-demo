/* ================= LEGAL OVERLAY ================= */
import React from "react";

const BUILD_TIME = process.env.REACT_APP_BUILD_TIME || "DEV";
const GIT_HASH = process.env.REACT_APP_GIT_HASH || "LOCAL";

export default function LegalOverlay({
  legalOverlay,
  setLegalOverlay
}) {
  if (!legalOverlay) return null;

  return (
    <div
      className="infoOverlay"
      onClick={() => setLegalOverlay(null)}
    >
      <div
        className="infoBox legalBox"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          className="overlayClose"
          onClick={() => setLegalOverlay(null)}
        >
          ×
        </button>

        <h3 style={{ marginBottom: 12 }}>
          {legalOverlay === "impressum" && "Impressum"}
          {legalOverlay === "datenschutz" && "Datenschutz"}
          {legalOverlay === "hinweis" && "Hinweis"}
        </h3>

        {legalOverlay === "impressum" && (
          <>
            <p><strong>Florian Löffler</strong></p>

            <p>
              BarmeniaGothaer VZ Südbaden<br />
              Breisacher Str. 145b<br />
              79110 Freiburg im Breisgau
            </p>

            <p>
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

            <p>
              Tätig als gebundener Versicherungsvertreter gemäß § 34d Abs. 7 GewO<br />
              Vermittlerregisternummer: D-3ED0-I0NGJ-87
            </p>

            <p>
              Registrierungsstelle:<br />
              DIHK | Deutscher Industrie- und Handelskammertag e. V.<br />
              <a
                href="https://www.vermittlerregister.info"
                target="_blank"
                rel="noreferrer"
              >
                www.vermittlerregister.info
              </a>
            </p>

            <hr style={{ margin: "20px 0", opacity: 0.2 }} />

            <p style={{ fontSize: 13, opacity: 0.85 }}>
              <strong>Hinweis zur Nutzung dieser Anwendung</strong>
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Der 360° Absicherungscheck ist ein unverbindliches digitales Informations-
              und Analyseangebot zur strukturierten Selbsteinschätzung der persönlichen
              Absicherungssituation. Er ersetzt keine individuelle Versicherungsberatung
              oder Bedarfsanalyse im Sinne des Versicherungsvertragsgesetzes (VVG).
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Die dargestellten Ergebnisse basieren ausschließlich auf den vom Nutzer
              gemachten Angaben sowie auf einer algorithmischen Auswertung.
              Angezeigte Handlungsfelder oder Tarifübersichten stellen keine
              individuelle Produktempfehlung dar.
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Ein Beratungsverhältnis entsteht erst im Rahmen eines persönlichen
              Gesprächs. Die Nutzung von Termin- oder Abschlusslinks erfolgt
              eigenverantwortlich.
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Florian Löffler vermittelt ausschließlich die Produkte folgender
              Gesellschaften:
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Barmenia Versicherungen a. G.<br />
              Barmenia Krankenversicherung AG<br />
              Barmenia Allgemeine Versicherungs-AG<br />
              Gothaer Krankenversicherung AG<br />
              Gothaer Lebensversicherung AG<br />
              Roland Rechtsschutz-Versicherungs-AG<br />
              Roland Schutzbrief-Versicherung AG
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Für die Vermittlung erhält Florian Löffler eine Provision sowie
              gegebenenfalls weitere Vergütungen, die in der jeweiligen
              Versicherungsprämie enthalten sind.
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Es bestehen keine direkten oder indirekten Beteiligungen von über 10 %
              an den Stimmrechten oder am Kapital eines Versicherungsunternehmens.
              Ebenso hält kein Versicherungsunternehmen oder Mutterunternehmen
              eines Versicherungsunternehmens eine direkte oder indirekte Beteiligung
              von über 10 % an den Stimmrechten oder am Kapital von Florian Löffler.
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Zuständige Schlichtungsstellen:
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Versicherungsombudsmann e. V.<br />
              Postfach 080632<br />
              10006 Berlin
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Ombudsmann für private Kranken- und Pflegeversicherung<br />
              Postfach 06 02 22<br />
              10052 Berlin
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Zuständige Aufsichtsbehörde gemäß § 34d GewO:<br />
              Industrie- und Handelskammer Südlicher Oberrhein<br />
              Schnewlinstraße 11–13<br />
              79098 Freiburg
            </p>

            <p style={{ fontSize: 13, opacity: 0.75 }}>
              Plattform der EU-Kommission zur Online-Streitbeilegung:<br />
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noreferrer"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
          </>
        )}

        {legalOverlay === "datenschutz" && (
          <>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
              Datenschutzhinweis
            </p>

            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Diese Anwendung verarbeitet personenbezogene Daten ausschließlich lokal
              in deinem Browser. Eine Speicherung der eingegebenen Daten auf externen
              Servern findet nicht statt.
            </p>

            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Es erfolgt keine automatische Übermittlung deiner Eingaben an Dritte.
              Tracking- oder Analyse-Tools werden nicht eingesetzt.
            </p>

            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Die technische Bereitstellung der Website (Hosting) kann durch einen
              externen Dienstleister erfolgen. Dabei werden aus technischen Gründen
              Server-Logfiles (z. B. IP-Adresse, Datum, Uhrzeit, Browsertyp) verarbeitet.
              Diese Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse an einer sicheren und stabilen Bereitstellung).
            </p>

            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Beim Klick auf externe Links (z. B. Online-Abschluss, Terminvereinbarung
              oder externe Rechner) verlässt du diese Anwendung. Für die
              Datenverarbeitung der jeweiligen Anbieter sind ausschließlich deren
              Datenschutzhinweise maßgeblich.
            </p>

            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Sofern eine PDF-Auswertung erzeugt wird, erfolgt diese vollständig lokal
              in deinem Browser ohne Übertragung oder Speicherung auf externen Servern.
            </p>
          </>
        )}

        {legalOverlay === "hinweis" && (
          <>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
              Hinweis zur Nutzung
            </p>

            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Der 360° Absicherungscheck ist ein digitales Informations- und Analyse-Tool
              zur strukturierten Selbsteinschätzung deiner aktuellen Absicherungssituation.
            </p>

            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Die Auswertung erfolgt ausschließlich auf Grundlage deiner eigenen Angaben
              sowie einer algorithmischen Berechnungslogik. Es findet keine individuelle
              Bedarfsanalyse oder persönliche Beratung im Sinne des Versicherungsvertragsgesetzes (VVG) statt.
            </p>

            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Angezeigte Handlungsfelder, Hinweise oder Tarifübersichten stellen
              eine allgemeine Orientierung dar und sind keine konkrete
              Produktempfehlung.
            </p>

            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Ein Beratungsverhältnis entsteht erst im Rahmen eines persönlichen Gesprächs.
              Die Nutzung von Termin- oder Abschlusslinks erfolgt eigenverantwortlich.
              Für die Inhalte und Datenschutzbestimmungen externer Anbieter sind
              ausschließlich deren Betreiber verantwortlich.
            </p>
            <hr className="legalDivider" />

            <div className="legalVersion">
              Version {GIT_HASH} · {BUILD_TIME}
            </div>
          </>
        )}
      </div>
    </div>
  );
}