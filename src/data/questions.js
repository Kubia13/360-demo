/* ================= FRAGEN ================= */

export const QUESTIONS = {

  /* ===== EXISTENZ ===== */

  bu: {
    label: "Berufsunfähigkeitsversicherung vorhanden?",
    category: "existenz",
    type: "yesno",
    condition: (baseData) => baseData.beruf !== "Beamter",
    info:
      "Eine BU leistet, wenn du deinen zuletzt ausgeübten Beruf voraussichtlich dauerhaft (mind. 6 Monate) zu mindestens 50% nicht mehr ausüben kannst.\n\n" +
      "Sie sichert dein Einkommen ab.\n\n" +
      "Faustformel:\n" +
      "ca. 60–70% deines Bruttoeinkommens\n" +
      "oder\n" +
      "80–90% deines Nettoeinkommens.\n\n" +
      "Ziel ist es, deinen Lebensstandard auch im Ernstfall stabil zu halten."
  },

  du: {
    label: "Dienstunfähigkeitsversicherung vorhanden?",
    category: "existenz",
    type: "yesno",
    condition: (baseData) => baseData.beruf === "Beamter",
    info:
      "Beamte benötigen keine klassische BU, sondern eine Dienstunfähigkeitsversicherung.\n\n" +
      "Diese leistet, wenn dich dein Dienstherr wegen Dienstunfähigkeit entlässt oder in den Ruhestand versetzt.\n\n" +
      "Besonders wichtig ist eine echte DU-Klausel."
  },

  anwartschaft: {
    label: "Besteht eine Anwartschaft auf eine private Krankenversicherung?",
    category: "existenz",
    type: "select",
    options: [
      "Große Anwartschaft",
      "Kleine Anwartschaft",
      "Keine",
      "Weiß nicht"
    ],
    condition: (baseData) =>
      baseData.krankenversicherung === "Heilfürsorge",
    info:
      "Heilfürsorge ist keine eigene Krankenversicherung, sondern eine Absicherung über den Dienstherrn.\n\n" +
      "Endet das Dienstverhältnis, wird in der Regel eine private Krankenversicherung benötigt.\n\n" +
      "Eine Anwartschaft sichert den späteren Zugang zur PKV ohne erneute Gesundheitsprüfung.\n\n" +
      "Große Anwartschaft: Gesundheitszustand und Eintrittsalter werden gesichert.\n" +
      "Kleine Anwartschaft: Nur der Gesundheitszustand wird gesichert."
  },


  ktg: {
    label: "Krankentagegeld vorhanden?",
    category: "existenz",
    type: "yesno",
    condition: (baseData) =>
      baseData.beruf &&
      baseData.beruf !== "Nicht berufstätig" &&
      baseData.beruf !== "Beamter",
    info: {
      text: [
        "Nach 6 Wochen endet die Lohnfortzahlung.",
        "",
        "Gesetzlich Versicherte erhalten danach Krankengeld (ca. 70% vom Brutto, max. 90% vom Netto).",
        "Privatversicherte erhalten ohne Vereinbarung kein Krankengeld.",
        "",
        "Ohne Krankentagegeld entsteht eine Einkommenslücke."
      ],
      link: {
        label: "Prüfe, wie hoch dein finanzieller Bedarf ab der 7. Woche wirklich ist:",
        url: "https://ssl.barmenia.de/formular-view/#/krankentagegeldrechner"
      }
    }
  },

  unfall: {
    label: "Unfallversicherung vorhanden?",
    category: "existenz",
    type: "yesno",
  },

  risiko_lv: {
    label: "Risikolebensversicherung vorhanden?",
    category: "existenz",
    type: "yesno",
    condition: (baseData) =>
      baseData.beziehungsstatus === "Verheiratet" ||
      baseData.kinder === "Ja" ||
      baseData.wohnen === "Eigentum Haus",
    info:
      "Eine Risikolebensversicherung sichert Hinterbliebene oder laufende Verpflichtungen im Todesfall ab.\n\n" +
      "Besonders relevant bei Familie oder Immobilienbesitz."
  },

  ruecklagen: {
    label: "Hast du finanzielle Rücklagen für mindestens 3 Monate Lebenshaltungskosten?",
    category: "existenz",
    type: "yesno",
    condition: () => true,
    info:
      "Eine Liquiditätsreserve schützt vor finanziellen Engpässen bei Jobverlust, Krankheit oder unerwarteten Ausgaben.\n\n" +
      "Empfehlung: mindestens 3 Netto-Monatsgehälter als Rücklage."
  },


  /* ===== HAFTUNG ===== */

  haftpflicht: {
    label: "Private Haftpflicht vorhanden? (Min.10 Mio€)",
    category: "haftung",
    type: "yesno",
  },

  tierhaft: {
    label: "Tierhalterhaftpflicht vorhanden?",
    category: "haftung",
    type: "yesno",
    condition: (baseData) =>
      baseData.tiere === "Hund" ||
      baseData.tiere === "Hund und Katze",
  },

  tier_op: {
    label: "Tier OP- oder Tierkrankenversicherung vorhanden?",
    category: "haftung",
    type: "yesno",
    condition: (baseData) =>
      baseData.tiere === "Hund" ||
      baseData.tiere === "Katze" ||
      baseData.tiere === "Hund und Katze",

    subOptions: [
      { key: "tier_op_only", label: "Nur OP-Versicherung" },
      { key: "tier_full", label: "Vollständige Tierkrankenversicherung" }
    ]
  },

  rechtsschutz: {
    label: "Rechtsschutz vorhanden?",
    category: "haftung",
    type: "yesno",
    hasSubOptions: true
  },

  /* ===== WOHNEN ===== */

  hausrat: {
    label: "Hausrat ausreichend versichert?",
    category: "wohnen",
    type: "yesno",
    condition: (baseData) =>
      baseData.wohnen &&
      baseData.wohnen !== "Wohne bei Eltern",
    info: "Die Hausratversicherung schützt dein gesamtes bewegliches Eigentum (Möbel, Kleidung, Technik usw.).\n\nEntscheidend ist der Neuwert – also der Betrag, den du heute für eine Neuanschaffung zahlen müsstest.\n\nAls Orientierung gelten ca. 650 € pro m² Wohnfläche.\nBeispiel: 80 m² × 650 € = 52.000 € Versicherungssumme.\n\nIst die Summe zu niedrig, droht im Schadenfall eine Kürzung wegen Unterversicherung."
  },

  elementar: {
    label: "Elementarversicherung vorhanden?",
    category: "wohnen",
    type: "yesno",
    condition: (baseData) =>
      baseData.wohnen &&
      baseData.wohnen !== "Wohne bei Eltern",
  },

  gebaeude: {
    label: "Wohngebäudeversicherung vorhanden?",
    category: "wohnen",
    type: "yesno",
    condition: (baseData) =>
      baseData.wohnen === "Eigentum Haus",
  },

  /* ===== MOBILITÄT ===== */

  fahrerschutz: {
    label: "Fahrerschutzversicherung vorhanden?",
    category: "mobilitaet",
    type: "yesno",
    condition: (baseData) => baseData.kfz === "Ja",
    info: {
      text: [
        "Die KFZ-Haftpflicht ist in Deutschland gesetzlich vorgeschrieben und schützt andere Verkehrsteilnehmer.",
        "",
        "Der Fahrerschutz hingegen schützt den Fahrer selbst bei selbstverschuldeten Unfällen.",
        "",
        "Ohne Fahrerschutz erhält der Fahrer bei einem selbst verursachten Unfall keine Leistungen für Verdienstausfall, Schmerzensgeld oder Rentenzahlungen.",
        "",
        "Gerade für Familien, Selbstständige oder Hauptverdiener kann diese Absicherung existenziell sein."
      ]
    }
  },


  kasko: {
    label: "Welche KFZ-Kasko besteht?",
    category: "mobilitaet",
    type: "select",
    options: ["Keine", "Teilkasko", "Vollkasko", "Weiß nicht"],
    condition: (baseData) => baseData.kfz === "Ja",
  },

  schutzbrief: {
    label: "Schutzbrief vorhanden?",
    category: "mobilitaet",
    type: "yesno",
    condition: (baseData) => baseData.kfz === "Ja",
  },

  /* ===== GESUNDHEIT ===== */

  krankenzusatz: {
    label: "Krankenzusatzversicherung vorhanden?",
    category: "gesundheit",
    type: "yesno",
    hasSubOptions: true,
    condition: (baseData) =>
      baseData.krankenversicherung === "Gesetzlich versichert (GKV)"
  },

  pflege: {
    label: "Private Pflegezusatz vorhanden?",
    category: "gesundheit",
    type: "yesno",
  },

  /* ===== VORSORGE ===== */

  private_rente: {
    label: "Private Altersvorsorge vorhanden?",
    category: "vorsorge",
    type: "yesno",
  },

  rentenluecke: {
    label: "Kennst du deine Rentenlücke?",
    category: "vorsorge",
    type: "yesno",
    info: {
      text: [
        "Die gesetzliche Rente deckt meist nur einen Teil deines letzten Einkommens.",
        "",
        "Die Rentenlücke ist die Differenz zwischen Wunsch-Rente und tatsächlicher gesetzlicher Rente.",
        "",
        "Ohne zusätzliche Vorsorge ensteht eine Versorgungslücke"
      ],
      link: {
        label: "Berechne hier deine persönliche Rentenlücke:",
        url: "https://rentenrechner.dieversicherer.de/app/gdv.html#luecke"
      }
    }
  },

  bav: {
    label: "Nutzt du eine betriebliche Altersvorsorge (bAV)?",
    category: "vorsorge",
    type: "yesno",
    condition: (baseData) =>
      baseData.beruf === "Angestellt" ||
      baseData.beruf === "Öffentlicher Dienst",
    info:
      "Die betriebliche Altersvorsorge ermöglicht eine zusätzliche Altersabsicherung über den Arbeitgeber.\n\n" +
      "Oft besteht Anspruch auf einen Arbeitgeberzuschuss."
  },

  /* ===== KINDER ===== */

  kinder_unfall: {
    label: "Unfallversicherung für dein Kind vorhanden?",
    category: "kinder",
    type: "yesno",
    condition: (baseData) => baseData.kinder === "Ja",
  },

  kinder_krankenzusatz: {
    label: "Krankenzusatz für dein Kind vorhanden?",
    category: "kinder",
    type: "yesno",
    condition: (baseData) =>
      baseData.kinder === "Ja" &&
      (
        baseData.kinderKrankenversicherung === "Gesetzlich versichert (GKV)" ||
        baseData.kinderKrankenversicherung === "Weiß nicht"
      ),
    hasSubOptions: true
  },

  kinder_vorsorge: {
    label: "Wird für dein Kind privat vorgesorgt?",
    category: "kinder",
    type: "yesno",
    condition: (baseData) => baseData.kinder === "Ja",
  },
};
