import React, { useState } from "react";
import Input from "../components/UI/Input";

export default function PdfOverlay({
  pdfOverlay,
  setPdfOverlay,
  pdfData,
  setPdfData,
  baseData,
  buIncome,
  setPdfPreview
}) {

  const [infoField, setInfoField] = useState(null);

  if (!pdfOverlay) return null;

  const autoBU =
    buIncome
      ? Math.round(Number(buIncome) * 0.8)
      : baseData.gehalt
        ? Math.round(Number(baseData.gehalt) * 0.8)
        : "";

  const isValid =
    pdfData.adresse.trim() !== "" &&
    pdfData.email.trim() !== "" &&
    (
      pdfData.telefon.trim() !== "" ||
      pdfData.handy.trim() !== ""
    );

  return (
    <div
      className="infoOverlay"
      onClick={() => setPdfOverlay(false)}
    >
      <div
        className="infoBox pdfBox"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="overlayClose"
          onClick={() => setPdfOverlay(false)}
        >
          ×
        </button>

        <h3 style={{ marginBottom: 20 }}>
          PDF-Auswertung vorbereiten
        </h3>

        {/* Pflichtfelder */}

        <Input
          label="Straße & Hausnummer "
          value={pdfData.adresse}
          onChange={(v) =>
            setPdfData({ ...pdfData, adresse: v })
          }
        />

        <Input
          label="PLZ"
          value={pdfData.plz}
          onChange={(v) =>
            setPdfData({ ...pdfData, plz: v })
          }
        />
        <Input
          label="Ort"
          value={pdfData.ort}
          onChange={(v) =>
            setPdfData({ ...pdfData, ort: v })
          }
        />

        <Input
          label="Geburtsdatum *"
          type="date"
          value={pdfData.geburtsdatum || ""}
          onChange={(v) =>
            setPdfData({ ...pdfData, geburtsdatum: v })
          }
        />

        <Input
          label="E-Mail *"
          value={pdfData.email}
          onChange={(v) =>
            setPdfData({ ...pdfData, email: v })
          }
        />

        <Input
          label="Telefon"
          value={pdfData.telefon}
          onChange={(v) =>
            setPdfData({ ...pdfData, telefon: v })
          }
        />

        <Input
          label="Handy"
          value={pdfData.handy}
          onChange={(v) =>
            setPdfData({ ...pdfData, handy: v })
          }
        />

        <hr style={{ margin: "20px 0", opacity: 0.2 }} />

        {/* BU direkt übernommen */}

        {/* ================= BU ================= */}

        <div className="overlayField">
          <div className="overlayLabelRow">
            <label>BU-Rente (€)</label>
            <span
              className="infoIconInline"
              onClick={() => setInfoField(infoField === "bu" ? null : "bu")}
            >
              i
            </span>
          </div>

          {infoField === "bu" && (
            <div className="overlayInfoText">
              Empfohlen werden oft 60 % des Bruttoeinkommens oder 80 % des Nettoeinkommens als maximale Absicherung.
              <br /><br />
              Für Selbstständige empfiehlt sich meist eine Absicherung in Höhe von
              ca. 60-70% des Bruttogewinns oder 80% des Nettoeinkommens.
              <br /><br />
              Beamte benötigen statt einer BU in der Regel eine
              Dienstunfähigkeitsversicherung.
            </div>
          )}

          <Input
            value={
              pdfData.buEmpfehlung !== ""
                ? pdfData.buEmpfehlung
                : autoBU
            }
            onChange={(v) =>
              setPdfData({ ...pdfData, buEmpfehlung: v })
            }
          />
        </div>


        {/* ================= RENTENLÜCKE ================= */}

        <div className="overlayField">
          <div className="overlayLabelRow">
            <label>Altersrentenlücke (€)</label>
            <span
              className="infoIconInline"
              onClick={() => setInfoField(infoField === "rente" ? null : "rente")}
            >
              i
            </span>
          </div>

          {infoField === "rente" && (
            <div className="overlayInfoText">
              Die Rentenlücke ergibt sich aus der Differenz zwischen
              gewünschtem Ruhestandseinkommen und der zu erwartenden
              gesetzlichen Rente.
              <br /><br />
              Besonders bei Selbstständigen oder höherem Einkommen
              entsteht hier oft deutlicher Handlungsbedarf.
            </div>
          )}

          <Input
            value={pdfData.rentenluecke}
            onChange={(v) =>
              setPdfData({ ...pdfData, rentenluecke: v })
            }
          />
        </div>


        {/* ================= KRANKENTAGEGELD ================= */}

        <div className="overlayField">
          <div className="overlayLabelRow">
            <label>Krankentagegeld (€)</label>
            <span
              className="infoIconInline"
              onClick={() => setInfoField(infoField === "ktg" ? null : "ktg")}
            >
              i
            </span>
          </div>

          {infoField === "ktg" && (
            <div className="overlayInfoText">
              Für Selbstständige ist das Krankentagegeld essenziell, da keine Lohnfortzahlung durch einen Arbeitgeber erfolgt.
              <br /><br />
              Angestellte – auch wenn sie privat krankenversichert sind – erhalten in den ersten 42 Tagen eine Lohnfortzahlung durch den Arbeitgeber.
              <br /><br />
              Ab dem 43. Tag entsteht bei privat Versicherten jedoch nur dann ein Leistungsanspruch, wenn ein Krankentagegeld vertraglich vereinbart wurde.
            </div>
          )}

          <Input
            value={pdfData.ktgEmpfehlung}
            onChange={(v) =>
              setPdfData({ ...pdfData, ktgEmpfehlung: v })
            }
          />
        </div>


        <button
          className="primaryBtn big"
          disabled={!isValid}
          style={{
            marginTop: 20,
            opacity: isValid ? 1 : 0.5
          }}
          onClick={() => {
            if (!isValid) return;

            const autoBU =
              buIncome
                ? Math.round(Number(buIncome) * 0.8)
                : baseData.gehalt
                  ? Math.round(Number(baseData.gehalt) * 0.8)
                  : "";

            if (!pdfData.buEmpfehlung && autoBU) {
              setPdfData(prev => ({
                ...prev,
                buEmpfehlung: autoBU
              }));
            }

            setPdfOverlay(false);
            setPdfPreview(true);
          }}
        >
          Vorschau anzeigen
        </button>


      </div>
    </div>
  );
}
