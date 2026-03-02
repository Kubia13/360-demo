/* ================= BASISDATEN ================= */

import React from "react";
import { Header, Input, Select, ContactButton } from "../components/UI";

export default function BaseScreen({
  baseData,
  updateBaseData,
  baseFormRefs,
  focusNext,
  setStep,
  scrollToTop,
  goToBaseWithoutReset,
  setLegalOverlay,
  setShowResetConfirm,
  setContactOverlay,
  baseValidation,
  devBypass
}) {
  const canProceed = devBypass || baseValidation?.isValid;
  return (

    <div className="screen">
      <Header goBase={goToBaseWithoutReset} />

      <h2>Persönliche Angaben</h2>

      <Select
        label="Anrede"
        options={["Herr", "Frau", "Divers", "Keine Angabe"]}
        value={baseData.anrede}
        onChange={(v) => updateBaseData("anrede", v)}
        selectRef={baseFormRefs.anrede}
        onEnter={() => focusNext(baseFormRefs.anrede)}
      />

      <Input
        label="Vorname"
        value={baseData.vorname}
        onChange={(v) => updateBaseData("vorname", v)}
        inputRef={baseFormRefs.vorname}
        onEnter={() => focusNext(baseFormRefs.vorname)}
      />

      <Input
        label="Nachname"
        value={baseData.nachname}
        onChange={(v) => updateBaseData("nachname", v)}
        inputRef={baseFormRefs.nachname}
        onEnter={() => focusNext(baseFormRefs.nachname)}
      />

      <Input
        label="Alter"
        type="number"
        value={baseData.alter}
        onChange={(v) => updateBaseData("alter", v)}
        inputRef={baseFormRefs.alter}
        onEnter={() => focusNext(baseFormRefs.alter)}
      />

      <Select
        label="Familienstand"
        options={["Ledig", "Partnerschaft", "Verheiratet"]}
        value={baseData.beziehungsstatus}
        onChange={(v) => updateBaseData("beziehungsstatus", v)}
        selectRef={baseFormRefs.beziehungsstatus}
        onEnter={() => focusNext(baseFormRefs.beziehungsstatus)}
      />

      <Select
        label="Berufliche Situation"
        options={[
          "Angestellt",
          "Öffentlicher Dienst",
          "Beamter",
          "Student",
          "In Ausbildung",
          "Selbstständig",
          "Nicht berufstätig",
        ]}
        value={baseData.beruf}
        onChange={(v) => updateBaseData("beruf", v)}
        selectRef={baseFormRefs.beruf}
        onEnter={() => focusNext(baseFormRefs.beruf)}
      />

      <Select
        label="Krankenversicherung"
        options={[
          "Gesetzlich versichert (GKV)",
          "Privat versichert (PKV)",
          "Heilfürsorge"
        ]}
        value={baseData.krankenversicherung}
        onChange={(v) => updateBaseData("krankenversicherung", v)}
        selectRef={baseFormRefs.krankenversicherung}
        onEnter={() => focusNext(baseFormRefs.krankenversicherung)}
      />

      <Input
        label="Monatliches Netto-Gehalt (€)"
        type="number"
        value={baseData.gehalt}
        onChange={(v) => updateBaseData("gehalt", v)}
        inputRef={baseFormRefs.gehalt}
        onEnter={() => focusNext(baseFormRefs.gehalt)}
      />

      <Select
        label="Hast du Kinder?"
        options={["Nein", "Ja"]}
        value={baseData.kinder}
        onChange={(v) => updateBaseData("kinder", v)}
        selectRef={baseFormRefs.kinder}
        onEnter={() => focusNext(baseFormRefs.kinder)}
      />

      {baseData.kinder === "Ja" && (
        <>
          <Select
            label="Wie sind deine Kinder krankenversichert?"
            options={[
              "Gesetzlich versichert (GKV)",
              "Privat versichert (PKV)",
              "Beihilfe + PKV",
              "Weiß nicht"
            ]}
            value={baseData.kinderKrankenversicherung}
            onChange={(v) => updateBaseData("kinderKrankenversicherung", v)}
            selectRef={baseFormRefs.kinderKrankenversicherung}
            onEnter={() => focusNext(baseFormRefs.kinderKrankenversicherung)}
          />

          <Input
            label="Anzahl Kinder"
            type="number"
            value={baseData.kinderAnzahl}
            onChange={(v) => updateBaseData("kinderAnzahl", v)}
            inputRef={baseFormRefs.kinderAnzahl}
            onEnter={() => focusNext(baseFormRefs.kinderAnzahl)}
          />
        </>
      )}

      <Select
        label="Haustiere"
        options={[
          "Keine Tiere",
          "Katze",
          "Hund",
          "Hund und Katze",
        ]}
        value={baseData.tiere}
        onChange={(v) => updateBaseData("tiere", v)}
        selectRef={baseFormRefs.tiere}
        onEnter={() => focusNext(baseFormRefs.tiere)}
      />

      <Select
        label="Wie wohnst du?"
        options={[
          "Wohne bei Eltern",
          "Miete Wohnung",
          "Miete Haus",
          "Eigentumswohnung",
          "Eigentum Haus",
        ]}
        value={baseData.wohnen}
        onChange={(v) => updateBaseData("wohnen", v)}
        selectRef={baseFormRefs.wohnen}
        onEnter={() => focusNext(baseFormRefs.wohnen)}
      />

      <Select
        label="Besitzt du ein Fahrzeug?"
        options={["Nein", "Ja"]}
        value={baseData.kfz}
        onChange={(v) => updateBaseData("kfz", v)}
        selectRef={baseFormRefs.kfz}
        onEnter={() => focusNext(baseFormRefs.kfz)}
      />

      {baseData.kfz === "Ja" && (
        <Input
          label="Anzahl Fahrzeuge"
          type="number"
          value={baseData.kfzAnzahl}
          onChange={(v) => updateBaseData("kfzAnzahl", v)}
          inputRef={baseFormRefs.kfzAnzahl}
          onEnter={() => focusNext(baseFormRefs.kfzAnzahl)}
        />
      )}

      <button
        className="primaryBtn"
        disabled={!canProceed}
        style={{ opacity: canProceed ? 1 : 0.5 }}
        onClick={() => {
          if (!canProceed) return;
          setStep("category");
          scrollToTop(screenRef);
        }}
      >
        Weiter
      </button>

      <div className="legalFooter">
        <span onClick={() => setLegalOverlay("impressum")}>Impressum</span>
        {" | "}
        <span onClick={() => setLegalOverlay("datenschutz")}>Datenschutz</span>
        {" | "}
        <span onClick={() => setLegalOverlay("hinweis")}>Hinweis</span>
      </div>

      <ContactButton
        onReset={() => setShowResetConfirm(true)}
        onContact={() => setContactOverlay(true)}
      />
    </div>
  );
}