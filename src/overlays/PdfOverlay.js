import { usePdfFormNavigation } from "../hooks/usePdfFormNavigation";

import { calculateAutoBU } from "../logic/pdfDataEngine";

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

  const { pdfFormRefs, focusNext } = usePdfFormNavigation();

  const [infoField, setInfoField] = useState(null);

  const [touched, setTouched] = useState({});

  if (!pdfOverlay) return null;

  const autoBU = calculateAutoBU({
    buIncome,
    baseData
  });

  // ================= INPUT VALIDATION HELPERS =================

  const numbersOnly = (value) => value.replace(/[^\d+]/g, "");
  const plzOnly = (value) => value.replace(/\D/g, "").slice(0, 5);
  const isValidPlz = (value = "") => /^\d{5}$/.test(value.trim());

  const validateEmail = (value = "") => {
    const email = value.trim();
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateStreet = (value = "") => {
    const hasNumber = /\d/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    return hasNumber && hasLetter;
  };

  // ================= LIVE ERROR LOGIC =================

  const errors = {
    adresse:
      touched.adresse && !validateStreet(pdfData.adresse)
        ? "Bitte Straße UND Hausnummer angeben."
        : null,

    email:
      touched.email && !validateEmail(pdfData.email)
        ? "Bitte eine gültige E-Mail-Adresse eingeben."
        : null,

    plz:
      touched.plz && !isValidPlz(pdfData.plz)
        ? "PLZ muss exakt 5 Ziffern haben."
        : null,

    telefon:
      (touched.telefon || touched.handy) &&
        (pdfData.telefon || "").trim() === "" &&
        (pdfData.handy || "").trim() === ""
        ? "Bitte Telefon oder Handy angeben."
        : null
  };

  const isValid =
    validateStreet(pdfData.adresse) &&
    validateEmail(pdfData.email) &&
    isValidPlz(pdfData.plz) &&
    (
      (pdfData.telefon || "").trim() !== "" ||
      (pdfData.handy || "").trim() !== ""
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
          label="Straße & Hausnummer"
          value={pdfData.adresse}
          onChange={(v) =>
            setPdfData({ ...pdfData, adresse: v })
          }
          inputRef={pdfFormRefs.adresse}
          onEnter={() => focusNext(pdfFormRefs.adresse)}
          onBlur={() =>
            setTouched(prev => ({ ...prev, adresse: true }))
          }
          error={errors.adresse}
        />

        <Input
          label="PLZ"
          value={pdfData.plz}
          onChange={(v) =>
            setPdfData({ ...pdfData, plz: plzOnly(v) })
          }
          inputRef={pdfFormRefs.plz}
          onEnter={() => focusNext(pdfFormRefs.plz)}
          onBlur={() =>
            setTouched(prev => ({ ...prev, plz: true }))
          }
          error={errors.plz}
        />

        <Input
          label="Ort"
          value={pdfData.ort}
          onChange={(v) =>
            setPdfData({ ...pdfData, ort: v })
          }
          inputRef={pdfFormRefs.ort}
          onEnter={() => focusNext(pdfFormRefs.ort)}
        />

        <Input
          label="Geburtsdatum *"
          type="date"
          value={pdfData.geburtsdatum || ""}
          onChange={(v) =>
            setPdfData({ ...pdfData, geburtsdatum: v })
          }
          inputRef={pdfFormRefs.geburtsdatum}
          onEnter={() => focusNext(pdfFormRefs.geburtsdatum)}
        />

        <Input
          label="E-Mail *"
          type="email"
          value={pdfData.email}
          onChange={(v) =>
            setPdfData({ ...pdfData, email: v })
          }
          inputRef={pdfFormRefs.email}
          onEnter={() => focusNext(pdfFormRefs.email)}
          onBlur={() =>
            setTouched(prev => ({ ...prev, email: true }))
          }
          error={errors.email}
        />

        <Input
          label="Telefon"
          value={pdfData.telefon}
          onChange={(v) =>
            setPdfData({ ...pdfData, telefon: numbersOnly(v) })
          }
          inputRef={pdfFormRefs.telefon}
          onEnter={() => focusNext(pdfFormRefs.telefon)}
          onBlur={() =>
            setTouched(prev => ({ ...prev, telefon: true }))
          }
        />

        <Input
          label="Handy"
          value={pdfData.handy}
          onChange={(v) =>
            setPdfData({ ...pdfData, handy: numbersOnly(v) })
          }
          inputRef={pdfFormRefs.handy}
          onEnter={() => focusNext(pdfFormRefs.handy)}
          onBlur={() =>
            setTouched(prev => ({ ...prev, handy: true }))
          }
        />

        <div className="pdfSeparator" />

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
            inputRef={pdfFormRefs.buEmpfehlung}
            onEnter={() => focusNext(pdfFormRefs.buEmpfehlung)}
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
            inputRef={pdfFormRefs.ktgEmpfehlung}
            onEnter={() => {
              if (!isValid) return;

              setPdfOverlay(false);
              setPdfPreview(true);
            }}
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

            const autoBU = calculateAutoBU({
              buIncome,
              baseData
            });

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
