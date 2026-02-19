import React, { useState, useEffect, useMemo } from "react";
import "./index.css";

/* ================= KATEGORIE GEWICHTE ================= */

const CATEGORY_WEIGHTS = {
  existenz: 0.3,       // Einkommens- & Lebensabsicherung = höchste Priorität
  haftung: 0.15,
  gesundheit: 0.15,
  vorsorge: 0.15,
  wohnen: 0.1,
  mobilitaet: 0.1,
  kinder: 0.05        // nur relevant bei Bedarf, daher geringer gewichtet
};

const CATEGORY_LABELS = {
  existenz: "Existenzabsicherung",
  haftung: "Haftungsrisiken",
  gesundheit: "Gesundheitsabsicherung",
  wohnen: "Wohnen & Eigentum",
  mobilitaet: "Mobilität",
  vorsorge: "Altersvorsorge",
  kinder: "Absicherung der Kinder"
};


/* ================= PRIORITY MAP ================= */

const PRIORITY_MAP = {

  /* ===================================================== */
  /* ===== EXISTENZIELL – ABSOLUTE PRIORITÄT (3) ======== */
  /* ===================================================== */

  bu: 3,
  du: 3,
  risiko_lv: 3,
  ruecklagen: 3,
  haftpflicht: 3,

  /* ===================================================== */
  /* ===== FAMILIEN- & EINKOMMENSVERANTWORTUNG (2) ====== */
  /* ===================================================== */

  pflege: 2,
  bav: 2,
  private_rente: 2,
  gebaeude: 2,
  rechtsschutz: 2,
  fahrerschutz: 2,

  // Kinder – echte Verantwortung, aber nicht über Existenz
  kinder_unfall: 2,
  kinder_vorsorge: 2,

  /* ===================================================== */
  /* ===== OPTIMIERUNG / KOMFORT (1) ===================== */
  /* ===================================================== */

  krankenzusatz: 1,
  kinder_krankenzusatz: 1,
  hausrat: 1,
  kasko: 1,
};

/* ================= CORE PRODUKTE ================= */

const CORE_PRODUCTS = [
  "bu",
  "du",
  "ktg",
  "haftpflicht",
  "anwartschaft",
  "hausrat",
  "private_rente",
  "rentenluecke",
  "pflege",
  "gebaeude",
  "rechtsschutz",
  "krankenzusatz",
  "kinder_krankenzusatz",
  "kinder_unfall",
  "kinder_vorsorge",

  "fahrerschutz",   // ersetzt kfz_haftpflicht
  "kasko",

  "risiko_lv",
  "ruecklagen",
  "bav",
];


/* ================= ACTION MAP ================= */

const ACTION_MAP = {
  /* ===== EXISTENZ ===== */

  bu: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  risiko_lv: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  du: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  ktg: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  unfall: {
    type: "abschluss",
    url: "https://ssl.barmenia.de/online-versichern/#/unfallversicherung/Beitrag?adm=00840513"
  },

  anwartschaft: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },


  /* ===== HAFTUNG ===== */

  haftpflicht: {
    type: "abschluss",
    url: "https://ssl.barmenia.de/online-versichern/#/privathaftpflicht/Beitrag?adm=00840513"
  },

  tierhaft: {
    type: "abschluss",
    url: "https://ssl.barmenia.de/online-versichern/#/tierhalterhaftpflicht/Beitrag?adm=00840513"
  },

  tier_op: {
    type: "abschluss",
    url: "https://ssl.barmenia.de/online-versichern/#/tierversicherung/Beitrag?adm=00840513"
  },

  rechtsschutz: {
    type: "abschluss",
    url: "https://www.roland-rechtsschutz.de/privatkunden/konfigurator_privatkunden/konfigurator_privatkunden_barmenia.html?prd=Rechtsschutz%2Bf_uumlr%2BPrivatkunden&produkt=67018&sparte=BA&oabezeichnung=rechtsschutzversicherung&pid=Rechtsschutzversicherung&dom=www.barmenia.de&p0=334009&adm=00840513&em=florian.loeffler#/"
  },

  /* ===== GESUNDHEIT ===== */

  krankenzusatz: {
    type: "abschluss",
    url: "https://ssl.barmenia.de/online-versichern/#/zusatzversicherung/Beitrag?adm=00840513"
  },

  pflege: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  /* ===== VORSORGE ===== */

  private_rente: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  rentenluecke: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  bav: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  /* ===== WOHNEN ===== */

  hausrat: {
    type: "abschluss",
    url: "https://ssl.barmenia.de/online-versichern/#/hausrat/Beitrag?adm=00840513"
  },

  elementar: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  gebaeude: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  /* ===== MOBILITÄT ===== */

  fahrerschutz: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  kasko: {
    type: "abschluss",
    url: "https://ssl.barmenia.de/online-versichern/#/kfzversicherung/Fahrzeug?adm=00840513"
  },

  schutzbrief: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  },

  /* ===== KINDER ===== */

  kinder_unfall: {
    type: "abschluss",
    url: "https://ssl.barmenia.de/online-versichern/#/kinderinvaliditaetsvorsorge/Beitrag?adm=00840513"
  },

  kinder_krankenzusatz: {
    type: "abschluss",
    url: "https://ssl.barmenia.de/online-versichern/#/zusatzversicherung/Beitrag?adm=00840513"
  },

  kinder_vorsorge: {
    type: "beratung",
    calendar: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N"
  }
};

/* ================= FRAGEN ================= */

const QUESTIONS = {

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

/* ================= PRODUKTSTRUKTUR ================= */

const PRODUCT_STRUCTURE = {
  krankenzusatz: {
    label: "Krankenzusatzversicherung",
    products: [
      {
        name: "Kombi (Mehr für Sie)",
        url: "https://ssl.barmenia.de/online-versichern/#/zusatzversicherung/Beitrag?adm=00840513",
      },
      {
        name: "Zahn (Mehr Zahn und Mehr Zahnvorsorge)",
        url: "https://ssl.barmenia.de/online-versichern/#/zahnversicherung/Beitrag?adm=00840513",
      },
      {
        name: "Zahn (Mehr Zahn)",
        url: "https://ssl.barmenia.de/online-versichern/#/zahnversicherung/Beitrag?tarif=1&adm=00840513",
      },
      {
        name: "Zahn (Mehr Zahnvorsorge)",
        url: "https://ssl.barmenia.de/online-versichern/#/zahnversicherung/Beitrag?tarif=2&adm=00840513",
      },
      {
        name: "Zahn (DentPlus/ZIB)",
        url: "https://ssl.barmenia.de/online-versichern/#/bkk-dentplus/Beitrag?app=bkk&adm=00840513",
      },
      {
        name: "Ambulant (Mehr Gesundheit und Mehr Sehen)",
        url: "https://ssl.barmenia.de/online-versichern/#/ambulante-zusatzversicherung/Beitrag?adm=00840513",
      },
      {
        name: "Ambulant (Mehr Gesundheit)",
        url: "https://ssl.barmenia.de/online-versichern/#/ambulante-zusatzversicherung/Beitrag?tarif=1&adm=00840513",
      },
      {
        name: "Stationär (Mehr Komfort)",
        url: "https://ssl.barmenia.de/online-versichern/#/stationaere-zusatzversicherung/Beitrag?adm=00840513",
      },
      {
        name: "Stationär (BKKST)",
        url: "https://ssl.barmenia.de/online-versichern/#/stationaere-zusatzversicherung/Beitrag?app=bkk&adm=00840513",
      },
      {
        name: "Exclusiv+",
        url: "https://ssl.barmenia.de/online-versichern/#/bkk-exclusivplus/Beitrag?app=bkk&adm=00840513",
      },
    ],
  },

  reise: {
    label: "Reiseversicherung",
    products: [
      {
        name: "Reiseversicherung (Travel+ und Travel day)",
        url: "https://ssl.barmenia.de/online-versichern/#/reiseversicherung/Beitrag?adm=00840513",
      },
      {
        name: "Reiseversicherung (BKKR)",
        url: "https://ssl.barmenia.de/online-versichern/#/bkk-reise/Beitrag?adm=00840513",
      },
    ],
  },

  tier: {
    label: "Rund ums Tier",
    products: [
      {
        name: "Hund, Katze und Pferd",
        url: "https://ssl.barmenia.de/online-versichern/#/tierversicherung/Beitrag?adm=00840513",
      },
      {
        name: "Hunde-KV",
        url: "https://ssl.barmenia.de/online-versichern/#/tierversicherung/Beitrag?tierart=Hund&versicherung=kv&adm=00840513",
      },
      {
        name: "Hunde-OP",
        url: "https://ssl.barmenia.de/online-versichern/#/tierversicherung/Beitrag?tierart=Hund&versicherung=op&adm=00840513",
      },
      {
        name: "Katzen-KV",
        url: "https://ssl.barmenia.de/online-versichern/#/tierversicherung/Beitrag?tierart=Katze&versicherung=kv&adm=00840513",
      },
      {
        name: "Katzen-OP",
        url: "https://ssl.barmenia.de/online-versichern/#/tierversicherung/Beitrag?tierart=Katze&versicherung=op&adm=00840513",
      },
      {
        name: "Pferde-OP",
        url: "https://ssl.barmenia.de/online-versichern/#/tierversicherung/Beitrag?tierart=Pferd&versicherung=op&adm=00840513",
      },
      {
        name: "Tierhalterhaftpflicht",
        url: "https://ssl.barmenia.de/online-versichern/#/tierhalterhaftpflicht/Beitrag?adm=00840513",
      },
    ],
  },

  haus: {
    label: "Haus und Haftpflicht",
    products: [
      {
        name: "Privathaftpflicht",
        url: "https://ssl.barmenia.de/online-versichern/#/privathaftpflicht/Beitrag?adm=00840513",
      },
      {
        name: "Hausrat",
        url: "https://ssl.barmenia.de/online-versichern/#/hausrat/Beitrag?adm=00840513",
      },
      {
        name: "Berufshaftpflicht (Heilberufe)",
        url: "https://ssl.barmenia.de/online-versichern/#/berufshaftpflicht/Beitrag?beruf=heilberufe&adm=00840513",
      },
      {
        name: "Berufshaftpflicht (Psychologische Berufe)",
        url: "https://ssl.barmenia.de/online-versichern/#/berufshaftpflicht/Beitrag?beruf=psychologen&adm=00840513",
      },
    ],
  },

  mobilitaet: {
    label: "Mobilität",
    products: [
      {
        name: "Fahrradversicherung",
        url: "https://ssl.barmenia.de/online-versichern/#/fahrradversicherung/Beitrag?adm=00840513",
      },
      {
        name: "Kfz-Versicherung (Kfz und Motorrad)",
        url: "https://ssl.barmenia.de/online-versichern/#/kfzversicherung/Fahrzeug?adm=00840513",
      },
    ],
  },

  unfall: {
    label: "Unfall und Invalidität",
    products: [
      {
        name: "UnfallhilfeSofort",
        url: "https://ssl.barmenia.de/online-versichern/#/unfallhilfesofort/Beitrag?adm=00840513",
      },
      {
        name: "Unfallversicherung",
        url: "https://ssl.barmenia.de/online-versichern/#/unfallversicherung/Beitrag?adm=00840513",
      },
      {
        name: "Kinder-Invaliditätsvorsorge (KISS)",
        url: "https://ssl.barmenia.de/online-versichern/#/kinder-invaliditaetsvorsorge/Beitrag?adm=00840513",
      },
    ],
  },
};

export default function App() {

  /* ================= STEP & CORE STATE ================= */

  const [step, setStep] = useState("welcome");
  const [answers, setAnswers] = useState({});
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const screenRef = React.useRef(null);



  const [baseData, setBaseData] = useState({
    anrede: "",
    vorname: "",
    nachname: "",
    alter: "",
    beziehungsstatus: "",
    beruf: "",
    krankenversicherung: "",
    gehalt: "",
    kinder: "",
    kinderKrankenversicherung: "",
    kinderAnzahl: "",
    tiere: "",
    wohnen: "",
    kfz: "",
    kfzAnzahl: ""
  });


  const updateBaseData = React.useCallback((field, value) => {
    setBaseData(prev => {
      if (prev[field] === value) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  /* ===== CLEANUP NICHT MEHR RELEVANTE ANTWORTEN ===== */

  useEffect(() => {

    setAnswers(prev => {
      let updated = { ...prev };
      let changed = false;

      /* ===== KINDER ===== */

      if (baseData.kinder !== "Ja") {
        [
          "kinder_unfall",
          "kinder_vorsorge",
          "kinder_krankenzusatz"
        ].forEach(key => {
          if (updated[key] !== undefined) {
            delete updated[key];
            changed = true;
          }
        });

        Object.keys(updated).forEach(key => {
          if (key.startsWith("kinder_krankenzusatz_")) {
            delete updated[key];
            changed = true;
          }
        });
      }
      /* ===== KFZ ===== */

      if (baseData.kfz !== "Ja") {
        ["fahrerschutz", "kasko", "schutzbrief"].forEach(key => {
          if (updated[key] !== undefined) {
            delete updated[key];
            changed = true;
          }
        });
      }


      /* ===== TIERE ===== */

      if (!baseData.tiere || baseData.tiere === "Keine Tiere") {
        ["tierhaft", "tier_op"].forEach(key => {
          if (updated[key] !== undefined) {
            delete updated[key];
            changed = true;
          }
        });
      }

      return changed ? updated : prev;

    });

  }, [baseData.kinder, baseData.kfz, baseData.tiere]);

  /* ================= UI STATE ================= */

  const [contactOverlay, setContactOverlay] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInfo, setShowInfo] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [legalOverlay, setLegalOverlay] = useState(null);
  // "impressum" | "datenschutz" | "hinweis" | null
  const [expandedProductCategory, setExpandedProductCategory] = useState(null);
  const [actionOverlay, setActionOverlay] = useState(null);
  const [calculatorOverlay, setCalculatorOverlay] = useState(false);
  const [buIncome, setBuIncome] = useState("");

  /* ===== BU RECHNER VORBELEGUNG ===== */

  useEffect(() => {
    if (baseData.gehalt) {
      setBuIncome(String(baseData.gehalt));
    } else {
      setBuIncome("");
    }
  }, [baseData.gehalt]);


  /* ================= PDF DATA ================= */

  const [pdfOverlay, setPdfOverlay] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(false); // ← DAS FEHLT

  console.log("pdfPreview:", pdfPreview);

  console.log({
    legalOverlay,
    contactOverlay,
    showResetConfirm,
    actionOverlay,
    pdfOverlay,
    calculatorOverlay,
    pdfPreview
  });
  const [pdfData, setPdfData] = useState({
    adresse: "",
    plz: "",
    ort: "",
    geburtsdatum: "",
    email: "",
    telefon: "",
    handy: "",
    rentenluecke: "",
    ktgEmpfehlung: "",
    buEmpfehlung: ""   // <-- NEU
  });

  /* ================= BASE FORM REFS ================= */

  const baseFormRefs = useMemo(() => ({
    anrede: React.createRef(),
    vorname: React.createRef(),
    nachname: React.createRef(),
    alter: React.createRef(),
    beziehungsstatus: React.createRef(),
    beruf: React.createRef(),
    krankenversicherung: React.createRef(),
    gehalt: React.createRef(),
    kinder: React.createRef(),
    kinderKrankenversicherung: React.createRef(),
    kinderAnzahl: React.createRef(),
    tiere: React.createRef(),
    wohnen: React.createRef(),
    kfz: React.createRef(),
    kfzAnzahl: React.createRef(),
  }), []);


  /* ================= BASE INPUT ORDER ================= */

  const baseInputOrder = useMemo(() => [
    baseFormRefs.anrede,
    baseFormRefs.vorname,
    baseFormRefs.nachname,
    baseFormRefs.alter,
    baseFormRefs.beziehungsstatus,
    baseFormRefs.beruf,
    baseFormRefs.krankenversicherung,
    baseFormRefs.gehalt,
    baseFormRefs.kinder,
    baseFormRefs.kinderKrankenversicherung,
    baseFormRefs.kinderAnzahl,
    baseFormRefs.tiere,
    baseFormRefs.wohnen,
    baseFormRefs.kfz,
    baseFormRefs.kfzAnzahl,
  ], [baseFormRefs]);

  /* ================= FOCUS LOGIC ================= */

  function focusNext(currentRef) {
    const index = baseInputOrder.indexOf(currentRef);
    if (index === -1) return;

    const nextRef = baseInputOrder[index + 1];

    if (nextRef?.current) {
      nextRef.current.focus();
    }
  }

  /* ================= BACK WITHOUT RESET================= */

function goToBaseWithoutReset() {
  setCurrentCategoryIndex(0);
  setStep("base");
  scrollToTop();
}


  /* ================= DYNAMISCHE KATEGORIEN ================= */

  const categories = useMemo(() => {
    return Object.keys(CATEGORY_WEIGHTS).filter((cat) => {

      const relevantQuestions = Object.keys(QUESTIONS).filter((id) => {
        const q = QUESTIONS[id];

        if (q.category !== cat) return false;
        if (q.condition && !q.condition(baseData)) return false;

        return true;
      });

      return relevantQuestions.length > 0;
    });
  }, [baseData]);

  const currentCategory = categories[currentCategoryIndex];

  /* ================= FLOW-SCHUTZ ===== */

  useEffect(() => {
    if (step !== "category") return;

    if (currentCategoryIndex >= categories.length) {
      setCurrentCategoryIndex(0);
    }
  }, [categories, currentCategoryIndex, step]);

  // ================= SCROLL TO TOP HELPER =================
  const scrollToTop = () => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });

      if (screenRef?.current) {
        screenRef.current.scrollTo({
          top: 0,
          behavior: "auto"
        });
      }
    });
  };


  /* ================= RESET ================= */

  function resetAll() {
    setStep("welcome");
    setAnswers({});
    setBaseData({
      anrede: "",
      vorname: "",
      nachname: "",
      alter: "",
      beziehungsstatus: "",
      beruf: "",
      krankenversicherung: "",
      gehalt: "",
      kinder: "",
      kinderKrankenversicherung: "",
      kinderAnzahl: "",
      tiere: "",
      wohnen: "",
      kfz: "",
      kfzAnzahl: ""
    });

    setCurrentCategoryIndex(0);
    setAnimatedScore(0);
    setExpandedCategory(null);
    setLegalOverlay(null);
    setDisclaimerAccepted(false);

    // 🔥 DAS MUSS HIER REIN
    setPdfData({
      adresse: "",
      plz: "",
      ort: "",
      geburtsdatum: "",
      email: "",
      telefon: "",
      handy: "",
      rentenluecke: "",
      ktgEmpfehlung: "",
    });
     scrollToTop();
  }

  /* ================= ANSWER ================= */

  function answer(key, value) {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /* ================= SCORE ================= */

  function getScore(key) {

    const value = answers[key];
    const age = Number(baseData.alter);
    const income = Number(baseData.gehalt);
    const verheiratet = baseData.beziehungsstatus === "Verheiratet";
    const hatKinder = baseData.kinder === "Ja";
    const hatHaus = baseData.wohnen === "Eigentum Haus";

    if (value === undefined) return null;

    /* ========================================================= */
    /* ===== NICHT RELEVANTE FÄLLE NICHT WERTEN ================= */
    /* ========================================================= */

    if (key === "kinder_krankenzusatz" && !hatKinder) return null;

    // Wenn Kinder privat versichert sind → Zusatz nicht relevant
    if (
      key === "kinder_krankenzusatz" &&
      (
        baseData.kinderKrankenversicherung === "Privat versichert (PKV)" ||
        baseData.kinderKrankenversicherung === "Beihilfe + PKV"
      )
    ) return null;


    if ((key === "kasko" || key === "fahrerschutz" || key === "schutzbrief") && baseData.kfz !== "Ja") return null;
    if ((key === "tierhaft" || key === "tier_op") && (!baseData.tiere || baseData.tiere === "Keine Tiere")) return null;
    if ((key === "hausrat" || key === "elementar") && baseData.wohnen === "Wohne bei Eltern") return null;
    if (key === "gebaeude" && !hatHaus) return null;
    if (key === "ktg" && baseData.beruf === "Beamter") return null;
    if (key === "bu" && (baseData.beruf === "Beamter" || baseData.beruf === "Nicht berufstätig")) return null;
    if (key === "du" && baseData.beruf !== "Beamter") return null;
    // Wenn Erwachsener privat versichert ist → Krankenzusatz nicht relevant
    if (
      key === "krankenzusatz" &&
      (
        baseData.krankenversicherung === "Privat versichert (PKV)" ||
        baseData.krankenversicherung === "Heilfürsorge"
      )
    ) return null;


    /* ========================================================= */
    /* ===== RÜCKLAGEN ========================================= */
    /* ========================================================= */

    if (key === "ruecklagen") {
      if (value === "ja") return 100;

      // höheres Einkommen → höheres Risiko ohne Reserve
      if (income > 4000) return 0;
      if (income > 2500) return 20;

      return 30;
    }

    /* ========================================================= */
    /* ===== RISIKO LEBENSVERSICHERUNG ========================== */
    /* ========================================================= */

    if (key === "risiko_lv") {

      if (value === "ja") return 100;

      // Relevanz steigt bei Familie oder Immobilie
      if (verheiratet || hatKinder || hatHaus) return 0;

      // ohne Verpflichtungen weniger kritisch
      return 40;
    }

    /* ========================================================= */
    /* ===== PRIVATE RENTE ===================================== */
    /* ========================================================= */

    if (key === "private_rente") {

      if (value === "ja") return 100;

      if (age < 30) return 40;
      if (age < 45) return 20;

      return 0;
    }

    /* ========================================================= */
    /* ===== BETRIEBLICHE ALTERSVORSORGE ======================= */
    /* ========================================================= */

    if (key === "bav") {

      if (baseData.beruf !== "Angestellt") return null;

      if (value === "ja") return 100;

      return 40;
    }


    /* ========================================================= */
    /* ===== PFLEGE ============================================ */
    /* ========================================================= */

    if (key === "pflege") {

      if (value === "ja") return 100;

      if (age < 30) return 50;
      if (age < 50) return 25;

      return 0;
    }

    /* ========================================================= */
    /* ===== KRANKENZUSATZ (GEWICHTET) ========================= */
    /* ========================================================= */

    if (key === "krankenzusatz") {

      const gewichtung = {
        "Stationär": 30,
        "Zähne": 25,
        "Ambulant": 20,
        "Krankenhaustagegeld": 15,
        "Brille": 10
      };

      let score = 0;

      Object.keys(gewichtung).forEach((bereich) => {
        if (answers["krankenzusatz_" + bereich]) {
          score += gewichtung[bereich];
        }
      });

      return score; // maximal 100
    }


    /* ========================================================= */
    /* ===== KINDER KRANKENZUSATZ (GEWICHTET) ================== */
    /* ========================================================= */

    if (key === "kinder_krankenzusatz") {

      const gewichtung = {
        "Stationär": 30,
        "Zähne": 25,
        "Ambulant": 20,
        "Krankenhaustagegeld": 15,
        "Brille": 10
      };

      let score = 0;

      Object.keys(gewichtung).forEach((bereich) => {
        if (answers["kinder_krankenzusatz_" + bereich]) {
          score += gewichtung[bereich];
        }
      });

      return score; // maximal 100
    }

    /* ========================================================= */
    /* ===== RECHTSSCHUTZ (GEWICHTET & RELEVANT) ================ */
    /* ========================================================= */

    if (key === "rechtsschutz") {

      const gewichtung = {
        "Privat": 30,
        "Beruf": 25,
        "Verkehr": 25,
        "Immobilie/Miete": 20
      };

      const relevant = {
        "Privat": true,
        "Beruf": baseData.beruf !== "Nicht berufstätig",
        "Verkehr": baseData.kfz === "Ja",
        "Immobilie/Miete": baseData.wohnen !== "Wohne bei Eltern"
      };

      let maxScore = 0;
      let score = 0;

      Object.keys(gewichtung).forEach((bereich) => {

        if (!relevant[bereich]) return;

        maxScore += gewichtung[bereich];

        if (answers["rechtsschutz_" + bereich]) {
          score += gewichtung[bereich];
        }

      });

      if (maxScore === 0) return 100;

      return Math.round((score / maxScore) * 100);
    }

    /* ========================================================= */
    /* ===== BU ================================================= */
    /* ========================================================= */

    if (key === "bu") {
      if (value === "ja") return 100;

      // höheres Einkommen = höherer Absicherungsbedarf
      if (income > 4000) return 0;
      if (income > 2500) return 10;

      return 20;
    }

    /* ========================================================= */
    /* ===== DU ================================================= */
    /* ========================================================= */

    if (key === "du") {
      if (value === "ja") return 100;
      return 0;
    }

    /* ========================================================= */
    /* ===== MOBILITÄT – INTELLIGENTE GEWICHTUNG =============== */
    /* ========================================================= */

    if (key === "kasko" || key === "fahrerschutz" || key === "schutzbrief") {

      const kasko = answers.kasko;
      const fahrer = answers.fahrerschutz;
      const schutz = answers.schutzbrief;

      let maxScore = 0;
      let score = 0;

      // KASKO (Kernschutz)
      if (kasko) {
        maxScore += 100;

        if (kasko === "vollkasko") score += 100;
        else if (kasko === "teilkasko") score += 70;
      }

      // FAHRERSCHUTZ (Kernschutz)
      if (fahrer) {
        maxScore += 100;
        if (fahrer === "ja") score += 100;
      }

      // SCHUTZBRIEF (Komfort)
      if (schutz) {
        maxScore += 60;
        if (schutz === "ja") score += 60;
      }

      if (maxScore === 0) return null;

      return Math.round((score / maxScore) * 100);
    }


    /* ========================================================= */
    /* ===== STANDARD JA / NEIN ================================ */
    /* ========================================================= */

    if (value === "ja") return 100;
    return 0;

  }

  /* ================= CATEGORY SCORES ================= */

  const categoryScores = useMemo(() => {

    return categories.reduce((acc, cat) => {

      const relevantQuestions = Object.keys(QUESTIONS)
        .filter((id) => {
          const q = QUESTIONS[id];
          if (q.category !== cat) return false;
          if (q.condition && !q.condition(baseData)) return false;
          if (answers[id] === undefined) return false;
          return true;
        });

      const scores = relevantQuestions
        .map((id) => getScore(id))
        .filter((score) => score !== null);

      // Wenn keine bewertbaren Fragen existieren → null
      if (scores.length === 0) {
        acc[cat] = null;
        return acc;
      }


      const sum = scores.reduce((total, s) => total + s, 0);
      acc[cat] = Math.round(sum / scores.length);

      return acc;

    }, {});

  }, [answers, baseData, categories]);


  /* ================= TOTAL SCORE ================= */

  const totalScore = useMemo(() => {

    const answeredRelevantQuestions = Object.keys(QUESTIONS).filter((id) => {
      const q = QUESTIONS[id];

      if (q.condition && !q.condition(baseData)) return false;
      if (answers[id] === undefined) return false;

      const score = getScore(id);
      return score !== null;
    });

    // Dynamische Mindestanzahl: mindestens 40% der relevanten Fragen beantwortet

    const totalRelevantQuestions = Object.keys(QUESTIONS).filter((id) => {
      const q = QUESTIONS[id];
      if (q.condition && !q.condition(baseData)) return false;

      const score = getScore(id);
      return score !== null;
    }).length;

    if (totalRelevantQuestions === 0) return 0;

    const answeredCount = answeredRelevantQuestions.length;
    const minimumRequired = Math.ceil(totalRelevantQuestions * 0.4);

    if (answeredCount < minimumRequired) {
      return 0;
    }

    const activeCategories = Object.keys(CATEGORY_WEIGHTS).filter((cat) => {

      const hasRelevant = Object.keys(QUESTIONS).some((id) => {
        const q = QUESTIONS[id];

        if (q.category !== cat) return false;
        if (q.condition && !q.condition(baseData)) return false;

        const score = getScore(id);
        return score !== null;
      });

      return hasRelevant;

    });

    const totalWeight = activeCategories.reduce(
      (sum, cat) => sum + CATEGORY_WEIGHTS[cat],
      0
    );

    if (totalWeight === 0) return 0;

    const weightedScore = activeCategories.reduce((sum, cat) => {
      return sum + (categoryScores[cat] || 0) * CATEGORY_WEIGHTS[cat];
    }, 0);

    let finalScore = Math.round(weightedScore / totalWeight);
    const existenzScore = categoryScores["existenz"];


    /* ===== KOMFORT-DECKELUNG ===== */

    // Kategorien mit eher "Komfort-/Optimierungscharakter"
    const komfortKategorien = ["wohnen", "mobilitaet", "gesundheit"];

    let komfortBoost = 0;

    komfortKategorien.forEach((cat) => {
      const score = categoryScores[cat];

      if (score !== null && score !== undefined) {
        komfortBoost += score * CATEGORY_WEIGHTS[cat];
      }
    });

    /* ===== KOMFORT-DECKEL (HYBRID) ===== */

    if (existenzScore !== null && existenzScore < 90) {

      if (komfortBoost > 5) {
        const reduzierung = Math.min(komfortBoost - 5, 3);
        finalScore = Math.max(finalScore - reduzierung, 0);
      }

    }

    /* ===== EXISTENZIELLE DECKELUNG ===== */

    let kritisch = false;
    let sehrKritisch = false;


    if (existenzScore !== null && existenzScore !== undefined) {
      if (existenzScore < 25) sehrKritisch = true;
      else if (existenzScore < 40) kritisch = true;
    }

    if (sehrKritisch) {
      finalScore = Math.min(finalScore, 55);
    } else if (kritisch) {
      finalScore = Math.min(finalScore, 70);
    }

    /* ===== HAFTPFLICHT-MINIMUM ===== */

    if (answers.haftpflicht === "nein") {
      finalScore = Math.min(finalScore, 60);
    }

    /* ===== HARTE EXISTENZ-LOGIK ===== */

    const hatBU =
      answers.bu === "ja" ||
      answers.du === "ja";

    const hatRuecklagen =
      answers.ruecklagen === "ja";

    if (!hatBU && !hatRuecklagen) {
      finalScore = Math.min(finalScore, 50);
    }

    /* ===== IMMOBILIEN-RISIKO LOGIK ===== */

    const hatHaus = baseData.wohnen === "Eigentum Haus";

    const hatFamilie =
      baseData.beziehungsstatus === "Verheiratet" ||
      baseData.kinder === "Ja";

    const hatRisikoLV = answers.risiko_lv === "ja";

    if (hatHaus && !hatRisikoLV) {

      if (hatFamilie) {
        finalScore = Math.min(finalScore, 65);
      } else {
        finalScore = Math.min(finalScore, 75);
      }

    }

    /* ===== MEHRERE KINDER + KEINE RÜCKLAGEN ===== */

    const kinderAnzahl = Number(baseData.kinderAnzahl) || 0;

    if (kinderAnzahl >= 2 && !hatRuecklagen) {
      finalScore = Math.min(finalScore, 60);
    }

    /* ===== HOHES EINKOMMEN + KEINE BU ===== */

    const income = Number(baseData.gehalt);

    if (income >= 4000 && !hatBU) {

      if (hatFamilie) {
        finalScore = Math.min(finalScore, 60);
      } else {
        finalScore = Math.min(finalScore, 65);
      }

      /* ===== NICHT-LINEARE PROGRESSION (HYBRID) ===== */

      if (finalScore > 90) {
        finalScore = 90 + (finalScore - 90) * 0.7;
      }

      if (finalScore > 98) {
        finalScore = 98 + (finalScore - 98) * 0.4;
      }

      finalScore = Math.round(finalScore);

    }

    /* ===== NICHT-LINEARE PROGRESSION (HYBRID FIX) ===== */

    if (finalScore > 92 && finalScore < 100) {
      finalScore = 92 + (finalScore - 92) * 0.85;
    }

    if (finalScore > 99 && finalScore < 100) {
      finalScore = 99 + (finalScore - 99) * 0.6;
    }

    finalScore = Math.round(finalScore);



    /* ===== 100%-REGEL (HYBRID – ECHTE 100% ERLAUBT) ===== */

    if (finalScore >= 100) {

      const haftungScore = categoryScores["haftung"];
      const aktiveKategorien = Object.values(categoryScores)
        .filter(v => v !== null).length;

      const hatBU = answers.bu === "ja" || answers.du === "ja";
      const hatRuecklagen = answers.ruecklagen === "ja";

      const komplexeLebenslage =
        baseData.beziehungsstatus === "Verheiratet" ||
        baseData.kinder === "Ja" ||
        baseData.wohnen === "Eigentum Haus";

      let darf100 = true;

      /* ===== KOMPLEXE LEBENSLAGE ===== */

      if (komplexeLebenslage) {
        if (
          !existenzScore || existenzScore < 90 ||
          !haftungScore || haftungScore < 85 ||
          (!hatBU && !hatRuecklagen)
        ) {
          darf100 = false;
        }
      } else {
        if (!existenzScore || existenzScore < 85) {
          darf100 = false;
        }
      }

      /* ===== MINDESTSTRUKTUR ===== */

      if (aktiveKategorien < 3) {
        darf100 = false;
      }

      /* ===== ENDERGEBNIS ===== */

      if (!darf100) {
        finalScore = 97;
      } else {
        finalScore = 100;
      }

    }
    return finalScore;


  }, [categoryScores, baseData, answers]);

  const hasValidScoreData = useMemo(() => {

    const answeredRelevantQuestions = Object.keys(QUESTIONS).filter((id) => {
      const q = QUESTIONS[id];

      if (q.condition && !q.condition(baseData)) return false;
      if (answers[id] === undefined) return false;

      const score = getScore(id);
      return score !== null;
    });

    let minimumRequired = 5;

    if (baseData.beziehungsstatus === "Verheiratet") minimumRequired++;
    if (baseData.kinder === "Ja") minimumRequired++;
    if (baseData.wohnen === "Eigentum Haus") minimumRequired++;
    if (baseData.beruf === "Selbstständig") minimumRequired++;
    if (Number(baseData.gehalt) > 4000) minimumRequired++;

    return answeredRelevantQuestions.length >= minimumRequired;

  }, [answers, baseData]);

  const isPdfValid = useMemo(() => {

    const hatAdresse =
      pdfData.adresse?.trim() &&
      pdfData.plz?.trim() &&
      pdfData.ort?.trim();

    const hatGeburtsdatum =
      pdfData.geburtsdatum?.trim();

    const hatEmail =
      pdfData.email?.trim() &&
      pdfData.email.includes("@");

    const hatTelefon =
      pdfData.telefon?.trim() ||
      pdfData.handy?.trim();

    return Boolean(
      hatAdresse &&
      hatGeburtsdatum &&
      hatEmail &&
      hatTelefon
    );

  }, [pdfData]);



  /* ===== SCORE ANIMATION ===== */

  useEffect(() => {

    if (step !== "dashboard") return;

    // Wenn keine validen Daten existieren → keine Animation
    if (!hasValidScoreData) {
      setAnimatedScore(0);
      return;
    }

    let current = 0;
    setAnimatedScore(0);

    const interval = setInterval(() => {
      current++;

      if (current >= totalScore) {
        current = totalScore;
        clearInterval(interval);
      }

      setAnimatedScore(current);
    }, 8);

    return () => clearInterval(interval);

  }, [totalScore, step, hasValidScoreData]);



  /* ===== CATEGORY SCROLL FIX – FINAL STABLE ===== */

  useEffect(() => {

    if (step !== "category") return;

    if (screenRef.current) {
      screenRef.current.scrollTo({
        top: 0,
        behavior: "auto"   // wichtig: kein smooth hier!
      });
    }

  }, [currentCategoryIndex, step]);


  /* ===== OVERLAY SCROLL LOCK (FIXED) ===== */

  useEffect(() => {

    const overlayOpen =
      Boolean(legalOverlay) ||
      Boolean(contactOverlay) ||
      Boolean(showResetConfirm) ||
      Boolean(actionOverlay) ||
      Boolean(pdfOverlay) ||
      Boolean(calculatorOverlay) ||
      Boolean(pdfPreview);

    if (overlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };

  }, [
    legalOverlay,
    contactOverlay,
    showResetConfirm,
    actionOverlay,
    pdfOverlay,
    calculatorOverlay,
    pdfPreview
  ]);


  /* ===== GLOBAL FOCUS SMOOTH SCROLL ===== */

  useEffect(() => {

    const handleFocus = (e) => {

      if (!e || !e.target) return;

      const el = e.target;

      if (typeof el.scrollIntoView !== "function") return;

      // 🔥 Nur reagieren wenn Overlay aktiv ist
      const overlayOpen =
        Boolean(legalOverlay) ||
        Boolean(contactOverlay) ||
        Boolean(showResetConfirm) ||
        Boolean(actionOverlay) ||
        Boolean(pdfOverlay) ||
        Boolean(calculatorOverlay) ||
        Boolean(pdfPreview);

      if (!overlayOpen) return;

      setTimeout(() => {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 120);
    };


    document.addEventListener("focusin", handleFocus);

    return () => {
      document.removeEventListener("focusin", handleFocus);
    };

  }, [
    legalOverlay,
    contactOverlay,
    showResetConfirm,
    actionOverlay,
    pdfOverlay,
    calculatorOverlay,
    pdfPreview
  ]);


  /* ================= TOP 3 HANDLUNGSFELDER ================= */

  const topRecommendations = useMemo(() => {

    if (step !== "dashboard") return [];

    const EXCLUDED_FROM_TOP3 = [
      "elementar",
      "schutzbrief"
    ];

    const hatKinder = baseData.kinder === "Ja";
    const verheiratet = baseData.beziehungsstatus === "Verheiratet";
    const hatHaus = baseData.wohnen === "Eigentum Haus";
    const income = Number(baseData.gehalt);
    const age = Number(baseData.alter);

    const existenzProdukte = [
      "bu", "du", "haftpflicht",
      "risiko_lv", "ruecklagen"
    ];

    const kinderProdukte = [
      "kinder_unfall",
      "kinder_vorsorge",
      "kinder_krankenzusatz"
    ];

    const komfortProdukte = [
      "kasko",
      "krankenzusatz",
      "hausrat"
    ];

    const allRecommendations = Object.keys(QUESTIONS)
      .filter((id) => {

        if (!CORE_PRODUCTS.includes(id)) return false;
        if (EXCLUDED_FROM_TOP3.includes(id)) return false;

        const q = QUESTIONS[id];
        if (q.condition && !q.condition(baseData)) return false;

        const score = getScore(id);
        if (score === null) return false;
        if (score >= 100) return false;

        // Vollkasko nie empfehlen
        if (id === "kasko" && answers[id] === "vollkasko") return false;

        const text = getStrategicRecommendation(id);
        if (!text) return false;

        /* ===== HARTE EXISTENZ-SPERRE ===== */

        const existenzScore = categoryScores["existenz"];

        const komfortProdukte = [
          "kasko",
          "krankenzusatz",
          "hausrat"
        ];

        if (
          existenzScore !== null &&
          existenzScore < 50 &&
          komfortProdukte.includes(id)
        ) {
          return false;
        }

        return true;
      })


      .map((id) => {

        let dynamicPriority = PRIORITY_MAP[id] || 1;

        const score = getScore(id);
        const text = getStrategicRecommendation(id);

        if (score === null || score === undefined) return null;
        if (!text) return null;

        const existenzScore = categoryScores["existenz"];

        const hatBU = answers.bu === "ja" || answers.du === "ja";
        const hatRuecklagen = answers.ruecklagen === "ja";
        const hatHaftpflicht = answers.haftpflicht === "ja";
        const hatRisikoLV = answers.risiko_lv === "ja";

        const hatHaus = baseData.wohnen === "Eigentum Haus";
        const hatFamilie =
          baseData.beziehungsstatus === "Verheiratet" ||
          baseData.kinder === "Ja";

        /* ================= SCORE-SCHWEREGRAD ================= */

        if (score <= 20) {
          dynamicPriority += 2;
        } else if (score <= 40) {
          dynamicPriority += 1;
        }

        /* ================= EXISTENZ VOR KOMFORT (dein Original) ================= */

        if (existenzProdukte.includes(id)) {
          dynamicPriority += 2;
        }

        /* ================= HARTE EXISTENZ-LOGIK ================= */

        if (!hatBU && !hatRuecklagen) {
          if (["bu", "du", "ruecklagen"].includes(id)) {
            dynamicPriority += 4;
          }
        }

        /* ================= HAFTPFLICHT KRITISCH ================= */

        if (!hatHaftpflicht && id === "haftpflicht") {
          dynamicPriority += 4;
        }

        /* ================= EXISTENZ SCORE < 40 ================= */

        if (existenzScore !== null && existenzScore < 40) {
          if (["bu", "du", "ruecklagen", "risiko_lv"].includes(id)) {
            dynamicPriority += 2;
          }
        }

        /* ================= FAMILIEN-BOOST (dein Original) ================= */

        if (hatKinder || verheiratet) {

          if (["bu", "du", "risiko_lv", "ruecklagen"].includes(id)) {
            dynamicPriority += 2;
          }

          if (kinderProdukte.includes(id)) {
            dynamicPriority += 1.5;
          }
        }

        /* ================= IMMOBILIEN-BOOST (verstärkt) ================= */

        if (hatHaus) {

          if (["gebaeude", "risiko_lv", "ruecklagen"].includes(id)) {
            dynamicPriority += 2;
          }

          if (!hatRisikoLV && id === "risiko_lv") {
            dynamicPriority += hatFamilie ? 3 : 2;
          }
        }

        /* ================= EINKOMMENS-HEBEL (dein Original) ================= */

        if (income >= 4000) {

          if (["bu", "du", "private_rente", "ruecklagen"].includes(id)) {
            dynamicPriority += 1;
          }
        }

        /* ================= ALTER-LOGIK (dein Original) ================= */

        if (age < 30) {

          if (["bu", "bav", "private_rente"].includes(id)) {
            dynamicPriority += 1;
          }
        }

        if (age >= 45) {

          if (["pflege", "private_rente"].includes(id)) {
            dynamicPriority += 1;
          }
        }

        /* ================= KOMFORT DECKEL ================= */

        if (komfortProdukte.includes(id)) {
          dynamicPriority = Math.min(dynamicPriority, 4);
        }

        return {
          id,
          text,
          priority: dynamicPriority,
          score
        };

      })
      .filter(Boolean)
      .sort((a, b) => {

        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }

        return a.score - b.score;
      });
    return allRecommendations.slice(0, 3);

  }, [answers, baseData, step, categoryScores])

  /* ================= PRODUKTSEITE ================= */

  if (step === "products") {
    return (
      <div className="screen" ref={screenRef}>

        <Header
          goBase={goToBaseWithoutReset}
          back={() => setStep("dashboard")}
        />


        <h2>Abschlussmöglichkeiten</h2>

        <div className="categoryList">
          {Object.keys(PRODUCT_STRUCTURE).map((key) => {
            const category = PRODUCT_STRUCTURE[key];
            const isOpen = expandedProductCategory === key;

            return (
              <div key={key}>

                {/* Kategorie Kopf */}
                <div
                  className="categoryRow"
                  onClick={() =>
                    setExpandedProductCategory(isOpen ? null : key)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <span>{category.label}</span>

                  <div
                    className="categoryChevron"
                    style={{
                      transform: isOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Produkte */}
                {isOpen && (
                  <div className="categoryDetails open">

                    {category.products.map((product, index) => (
                      <div key={index} className="productRow">

                        <div className="productName">
                          {product.name}
                        </div>

                        <button
                          className="productButton"
                          onClick={() =>
                            window.open(product.url, "_blank", "noopener,noreferrer")
                          }
                        >
                          jetzt Online absichern
                        </button>

                      </div>
                    ))}

                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Footer gehört UNTER die gesamte Liste */}
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

        <ResetOverlayComponent />
        <LegalOverlayComponent />
        <ContactOverlayComponent />

      </div>
    );
  }

  /* ===== DYNAMISCHER DASHBOARD-HINWEIS ===== */

  function getDynamicHint() {

    const age = Number(baseData.alter);
    const verheiratet = baseData.beziehungsstatus === "Verheiratet";

    // Pflege-Risiko
    if (answers.pflege !== "ja") {

      if (age >= 50)
        return "Mit steigendem Alter wird Pflegeabsicherung zunehmend relevanter – und teurer.";

      if (age >= 30)
        return "Pflegeabsicherung wird mit zunehmendem Alter deutlich kostenintensiver.";
    }

    // Altersvorsorge
    if (answers.private_rente !== "ja") {

      if (age >= 50)
        return "Im späteren Erwerbsleben sind Vorsorgelücken schwerer auszugleichen.";

      if (age >= 30)
        return "Je früher Altersvorsorge startet, desto geringer ist der monatliche Aufwand.";
    }

    // Verheiratet & BU
    if (verheiratet && answers.bu !== "ja")
      return "Als verheiratete Person spielt Einkommensabsicherung eine zentrale Rolle.";

    // Standard
    return "Dein Ergebnis zeigt eine strukturierte Übersicht deiner aktuellen Absicherung.";
  }

  /* ===== STRATEGISCHE EMPFEHLUNGEN ===== */

  function getStrategicRecommendation(id) {

    // 🔒 KASKO FIX
    if (id === "kasko" && answers[id] === "vollkasko") {
      return null;
    }

    const value = answers[id];
    const age = Number(baseData.alter);
    const verheiratet = baseData.beziehungsstatus === "Verheiratet";

    if (!value) return null;

    // NICHT RELEVANTE FÄLLE NICHT EMPFEHLEN
    if (getScore(id) === null) return null;

    const unsicher = value === "unbekannt";

    switch (id) {

      /* ================= BU ================= */

      case "bu": {

        if (value === "ja") return null;

        const income = Number(baseData.gehalt);
        const age = Number(baseData.alter);
        const hatKinder = baseData.kinder === "Ja";
        const hatHaus = baseData.wohnen === "Eigentum Haus";
        const verheiratet = baseData.beziehungsstatus === "Verheiratet";

        if (unsicher)
          return "Ob deine aktuelle Einkommensabsicherung im Ernstfall wirklich ausreicht, lässt sich oft erst bei genauer Prüfung feststellen. Eine strukturierte Analyse schafft hier Klarheit.";

        // Hohe Verantwortung (Familie oder Immobilie)
        if (hatKinder || hatHaus || verheiratet)
          return "Dein Einkommen sichert nicht nur dich selbst. Bei Familie oder finanziellen Verpflichtungen kann ein längerer Ausfall die gesamte Planung gefährden. Eine stabile Absicherung schützt eure wirtschaftliche Basis.";

        // Hohes Einkommen
        if (income >= 3500)
          return "Mit steigendem Einkommen wächst auch das finanzielle Risiko bei längerer Krankheit. Ohne Absicherung entsteht schnell eine erhebliche Einkommenslücke.";

        // Jünger = Gesundheitsargument
        if (age && age < 30)
          return "In jungen Jahren ist eine Absicherung meist günstiger und gesundheitlich leichter zugänglich. Frühzeitige Planung sichert langfristige Stabilität.";

        // Standardfall
        return "Deine Arbeitskraft ist dein größtes finanzielles Kapital. Fällt sie weg, entsteht sofort eine Einkommenslücke. Eine passende Absicherung schützt deinen Lebensstandard nachhaltig.";
      }

      /* ================= DU ================= */

      case "du": {

        if (value === "ja") return null;

        const income = Number(baseData.gehalt);
        const age = Number(baseData.alter);
        const hatKinder = baseData.kinder === "Ja";
        const hatHaus = baseData.wohnen === "Eigentum Haus";
        const verheiratet = baseData.beziehungsstatus === "Verheiratet";

        if (unsicher)
          return "Ob deine aktuelle Dienstunfähigkeitsabsicherung im Ernstfall tatsächlich ausreicht, lässt sich häufig erst bei genauer Prüfung feststellen. Eine strukturierte Analyse schafft hier Klarheit über Versorgungslücken.";

        // Hohe Verantwortung
        if (hatKinder || hatHaus || verheiratet)
          return "Dein Einkommen trägt Verantwortung – besonders bei Familie oder finanziellen Verpflichtungen. Wird eine Dienstunfähigkeit ausgesprochen, kann die staatliche Versorgung deutlich geringer ausfallen als erwartet. Eine ergänzende Absicherung schützt eure wirtschaftliche Stabilität.";

        // Höheres Einkommen = höherer Versorgungsbedarf
        if (income >= 3500)
          return "Mit steigendem Einkommen wächst auch die Versorgungslücke im Fall einer Dienstunfähigkeit. Die staatliche Absicherung orientiert sich nicht automatisch an deinem aktuellen Lebensstandard.";

        // Jünger = Gesundheitsargument
        if (age && age < 35)
          return "In jungen Jahren ist eine Dienstunfähigkeitsabsicherung meist günstiger und gesundheitlich leichter zugänglich. Eine frühzeitige Lösung sichert langfristige Planungssicherheit.";

        // Standardfall
        return "Als Beamter ersetzt die Dienstunfähigkeitsversicherung die klassische Berufsunfähigkeitsabsicherung. Sie schützt dein Einkommen, falls dich dein Dienstherr wegen Dienstunfähigkeit in den Ruhestand versetzt.";
      }

      /* ================= PRIVATE RENTE ================= */

      case "private_rente": {

        if (value === "ja") return null;

        const income = Number(baseData.gehalt);
        const age = Number(baseData.alter);
        const hatKinder = baseData.kinder === "Ja";
        const hatHaus = baseData.wohnen === "Eigentum Haus";
        const verheiratet = baseData.beziehungsstatus === "Verheiratet";
        const kenntLuecke = answers.rentenluecke === "ja";

        if (unsicher)
          return "Ob deine aktuelle Altersvorsorge ausreicht, lässt sich häufig erst bei einer strukturierten Ruhestandsanalyse feststellen. Eine Prüfung schafft Klarheit über mögliche Versorgungslücken.";

        // Verantwortungssituation
        if (hatKinder || hatHaus || verheiratet)
          return "Mit familiärer Verantwortung oder finanziellen Verpflichtungen wird eine planbare Altersvorsorge besonders wichtig. Die gesetzliche Rente allein reicht in diesen Konstellationen meist nicht aus, um den gewohnten Lebensstandard zu sichern.";

        // Höheres Einkommen = größere Lücke
        if (income >= 3500)
          return "Mit steigendem Einkommen wächst in der Regel auch die spätere Rentenlücke. Wer heute gut verdient, sollte frühzeitig strategisch vorsorgen, um den Lebensstandard im Ruhestand zu erhalten.";

        // Rentenlücke noch nicht bekannt
        if (!kenntLuecke)
          return "Ohne Kenntnis der eigenen Rentenlücke bleibt unklar, wie hoch der tatsächliche Vorsorgebedarf ist. Eine transparente Analyse bildet die Grundlage für eine fundierte Entscheidung.";

        // Alterslogik
        if (age >= 50)
          return "Je näher der Ruhestand rückt, desto geringer ist der zeitliche Spielraum zum Ausgleich möglicher Vorsorgelücken. Eine strukturierte Planung gewinnt jetzt an Bedeutung.";

        if (age >= 30)
          return "Je früher private Altersvorsorge beginnt, desto geringer ist der monatliche Aufwand bei gleicher Zielrente. Zeit ist hier der größte Hebel.";

        // Jüngere Zielgruppe
        return "Ein früher Vorsorgebeginn schafft langfristige finanzielle Freiheit und nutzt den Zinseszinseffekt optimal aus.";
      }


      /* ================= PFLEGE ================= */

      case "pflege": {

        if (value === "ja") return null;

        const age = Number(baseData.alter);
        const income = Number(baseData.gehalt);
        const hatKinder = baseData.kinder === "Ja";
        const verheiratet = baseData.beziehungsstatus === "Verheiratet";
        const hatHaus = baseData.wohnen === "Eigentum Haus";

        if (value === "unbekannt")
          return "Ob eine private Pflegeabsicherung besteht, sollte geprüft werden. Die gesetzliche Pflegepflichtversicherung deckt in der Regel nur einen Teil der tatsächlichen Kosten ab.";

        // 50+ → deutlich relevanter
        if (age >= 50)
          return "Mit zunehmendem Alter steigen Eintrittswahrscheinlichkeit und Beitragshöhe deutlich. Gleichzeitig können Eigenanteile im Pflegefall mehrere tausend Euro monatlich betragen.";

        // 30–49 → strategische Phase
        if (age >= 30) {

          if (hatKinder || verheiratet)
            return "Pflegebedürftigkeit kann auch Angehörige finanziell belasten. Eine private Absicherung schützt Partner und Familie vor zusätzlichen Verpflichtungen.";

          if (hatHaus)
            return "Ohne private Absicherung kann im Pflegefall unter Umständen auf Vermögen oder Immobilieneigentum zurückgegriffen werden.";

          return "Eine frühzeitige Absicherung sichert langfristig stabile Beiträge und schützt vor hohen Eigenanteilen im Pflegefall.";
        }

        // Unter 30 → Beitragsvorteil-Argument
        if (age < 30)
          return "Ein früher Abschluss sichert besonders günstige Beiträge und langfristige Planbarkeit.";

        // Einkommen hoch → Eigenanteil tragbar aber trotzdem sinnvoll
        if (income >= 4000)
          return "Auch bei höherem Einkommen können langfristige Pflegekosten erhebliche Vermögenswerte binden. Eine strukturierte Vorsorge schafft finanzielle Stabilität.";

        return "Die gesetzliche Pflegepflichtversicherung deckt meist nur einen Teil der tatsächlichen Kosten. Eine ergänzende Absicherung schafft finanzielle Sicherheit.";
      }

      /* ================= KRANKENZUSATZ ================= */

      case "krankenzusatz": {

        const income = Number(baseData.gehalt);
        const age = Number(baseData.alter);
        const kvArt = baseData.krankenversicherung;

        // PKV oder Heilfürsorge → keine klassische Zusatz
        if (kvArt !== "Gesetzlich versichert (GKV)")
          return null;

        // Keine Zusatzversicherung
        if (value === "nein") {

          if (income > 4000)
            return "Als gesetzlich Versicherter kann eine Zusatzversicherung helfen, Leistungsunterschiede zur privaten Versorgung auszugleichen und medizinische Wahlfreiheit zu erweitern.";

          if (age >= 40)
            return "Mit zunehmendem Alter steigen statistisch medizinische Eigenanteile. Eine ergänzende Absicherung kann finanzielle Belastungen reduzieren.";

          return "Eine Krankenzusatzversicherung kann Eigenanteile bei Zahnbehandlungen, stationären Aufenthalten oder ambulanten Leistungen deutlich reduzieren.";
        }

        // Unbekannt
        if (value === "unbekannt")
          return "Eine Überprüfung deines Leistungsumfangs kann helfen, mögliche Versorgungslücken frühzeitig zu erkennen.";

        // Zusatz vorhanden → prüfen Umfang
        if (value !== "ja") return null;

        const gewichtung = {
          "Stationär": 30,
          "Zähne": 25,
          "Ambulant": 20,
          "Krankenhaustagegeld": 15,
          "Brille": 10
        };

        const fehlend = Object.keys(gewichtung).filter(
          bereich => !answers["krankenzusatz_" + bereich]
        );

        if (fehlend.length === 0) return null;

        if (fehlend.includes("Zähne"))
          return "Zahnleistungen verursachen häufig hohe Eigenanteile. Eine Ergänzung in diesem Bereich kann langfristig sinnvoll sein.";

        if (fehlend.includes("Stationär"))
          return "Stationäre Zusatzleistungen ermöglichen im Ernstfall mehr Wahlfreiheit bei Unterbringung und Behandlung.";

        return "Eine umfassende Gesundheitsabsicherung sollte mehrere relevante Leistungsbereiche abdecken.";
      }

      /* ================= KINDER KRANKENZUSATZ ================= */

      case "kinder_krankenzusatz": {

        const income = Number(baseData.gehalt);
        const kinderAnzahl = Number(baseData.kinderAnzahl) || 1;
        const kvArt = baseData.kinderKrankenversicherung;

        // Wenn KV-System unklar
        if (kvArt === "Weiß nicht")
          return "Die Krankenversicherung deiner Kinder sollte zunächst geklärt werden, um mögliche Versorgungslücken realistisch einschätzen zu können.";

        // Nur relevant bei gesetzlich versicherten Kindern
        if (kvArt !== "Gesetzlich versichert (GKV)")
          return null;

        // Keine Zusatzversicherung vorhanden
        if (value === "nein") {

          if (kinderAnzahl >= 2)
            return "Bei mehreren gesetzlich versicherten Kindern können sich Eigenanteile (z. B. Zahnbehandlungen oder stationäre Leistungen) finanziell deutlich summieren.";

          if (income > 4000)
            return "Eine ergänzende Gesundheitsabsicherung kann Leistungsunterschiede zur privaten Versorgung reduzieren und medizinische Optionen erweitern.";

          return "Für gesetzlich versicherte Kinder kann eine ergänzende Gesundheitsabsicherung sinnvoll sein, um Leistungsunterschiede auszugleichen.";
        }

        // Unbekannt
        if (value === "unbekannt")
          return "Eine Überprüfung des Leistungsumfangs kann helfen, mögliche Lücken frühzeitig zu erkennen.";

        // Zusatz vorhanden → prüfen ob vollständig
        if (value !== "ja") return null;

        const gewichtung = {
          "Stationär": 30,
          "Zähne": 25,
          "Ambulant": 20,
          "Krankenhaustagegeld": 15,
          "Brille": 10
        };

        const fehlend = Object.keys(gewichtung).filter(
          bereich => !answers["kinder_krankenzusatz_" + bereich]
        );

        if (fehlend.length === 0) return null;

        if (fehlend.includes("Zähne"))
          return "Zahnleistungen verursachen bei Kindern häufig hohe Eigenanteile. Eine Ergänzung kann langfristig sinnvoll sein.";

        if (fehlend.includes("Stationär"))
          return "Stationäre Zusatzleistungen ermöglichen im Ernstfall bessere Wahlmöglichkeiten bei Unterbringung und Behandlung.";

        return "Eine umfassende Gesundheitsabsicherung für Kinder sollte mehrere Leistungsbereiche abdecken.";
      }

      /* ================= KINDER VORSORGE ================= */

      case "kinder_vorsorge": {

        if (value === "ja") return null;

        const income = Number(baseData.gehalt);
        const kinderAnzahl = Number(baseData.kinderAnzahl) || 1;
        const hatHaus = baseData.wohnen === "Eigentum Haus";

        if (value === "unbekannt")
          return "Ob bereits strukturiert für dein Kind vorgesorgt wird, sollte geprüft werden. Frühzeitige Planung schafft langfristige finanzielle Vorteile.";

        if (kinderAnzahl >= 2)
          return "Bei mehreren Kindern summieren sich spätere Ausbildungs- oder Startkosten erheblich. Eine strukturierte Vorsorge schafft Planungssicherheit.";

        if (hatHaus)
          return "Neben Immobilienfinanzierung und laufenden Verpflichtungen sollte auch die langfristige Zukunft deines Kindes strukturiert geplant werden.";

        if (income >= 3500)
          return "Mit höherem Einkommen lassen sich frühzeitig Vermögenswerte für Ausbildung, Studium oder Startkapital aufbauen.";

        return "Eine frühzeitige Vorsorge für dein Kind nutzt den langfristigen Zinseszinseffekt und schafft finanzielle Freiheit für Ausbildung oder Start ins Berufsleben.";
      }

      /* ================= KINDER UNFALL ================= */

      case "kinder_unfall": {

        if (value === "ja") return null;

        const income = Number(baseData.gehalt);
        const kinderAnzahl = Number(baseData.kinderAnzahl) || 1;

        if (value === "unbekannt")
          return "Ob für dein Kind eine eigenständige Unfallabsicherung besteht, sollte geprüft werden. Gerade bei dauerhaften Unfallfolgen entstehen langfristige finanzielle Belastungen.";

        if (kinderAnzahl >= 2)
          return "Bei mehreren Kindern steigt das Risiko statistisch. Eine Unfallabsicherung schützt vor finanziellen Folgen bei dauerhaften Beeinträchtigungen.";

        if (income >= 3500)
          return "Eine Kinder-Unfallversicherung kann finanzielle Folgen bei Invalidität absichern und zusätzliche Therapien oder Umbauten ermöglichen.";

        return "Eine Unfallversicherung für dein Kind schützt bei dauerhaften körperlichen Beeinträchtigungen und sichert finanzielle Unterstützung für Therapien oder Anpassungen.";
      }

      /* ================= HAUSRAT ================= */

      case "hausrat": {

        if (value === "ja") return null;

        const wohnen = baseData.wohnen;
        const hatKinder = baseData.kinder === "Ja";
        const income = Number(baseData.gehalt);

        if (value === "unbekannt")
          return "Die Versicherungssumme sollte regelmäßig geprüft werden, um Unterversicherung im Schadenfall zu vermeiden.";

        if (wohnen === "Miete Wohnung" || wohnen === "Miete Haus") {
          if (hatKinder)
            return "Gerade mit Familie summiert sich der Hausrat schnell auf hohe Werte. Eine ausreichende Absicherung schützt vor finanziellen Belastungen im Schadenfall.";

          if (income >= 3500)
            return "Bei höherem Lebensstandard steigt meist auch der Wert des Hausrats. Eine passende Absicherung schützt vor unerwarteten Ersatzkosten.";

          return "Der gesamte bewegliche Besitz – Möbel, Kleidung, Technik – sollte zum Neuwert abgesichert sein.";
        }

        return "Der Schutz des eigenen Hausrats sollte regelmäßig überprüft und am aktuellen Neuwert ausgerichtet sein.";
      }

      /* ================= ELEMENTAR ================= */

      case "elementar": {

        if (value === "ja") return null;

        const wohnen = baseData.wohnen;
        const hatHaus = wohnen === "Eigentum Haus";

        if (value === "unbekannt")
          return "Elementarschäden wie Starkregen oder Überschwemmung sind häufig nicht automatisch mitversichert.";

        if (hatHaus)
          return "Als Eigentümer trägst du das volle Risiko bei Naturereignissen. Elementarschutz schützt vor existenziellen Schäden am Gebäude.";

        return "Naturereignisse wie Starkregen oder Überschwemmung treten zunehmend auf. Eine Ergänzung um Elementarschutz kann sinnvoll sein.";
      }

      /* ================= GEBÄUDE ================= */

      case "gebaeude": {

        if (value === "ja") return null;

        const hatKinder = baseData.kinder === "Ja";
        const income = Number(baseData.gehalt);

        if (value === "unbekannt")
          return "Die Wohngebäudeversicherung sollte vollständig und aktuell sein, um existenzielle Schäden abzusichern.";

        if (hatKinder)
          return "Als Eigentümer mit Familie ist der Schutz der Immobilie zentral für die finanzielle Stabilität.";

        if (income >= 3500)
          return "Immobilieneigentum bindet erhebliche Vermögenswerte. Eine vollständige Absicherung schützt langfristig dein Kapital.";

        return "Als Eigentümer ist eine vollständige Wohngebäudeabsicherung essenziell.";
      }
      /* ================= HAFTPFLICHT ================= */

      case "haftpflicht": {

        if (value === "ja") return null;

        const hatKinder = baseData.kinder === "Ja";
        const verheiratet = baseData.beziehungsstatus === "Verheiratet";

        if (value === "unbekannt")
          return "Die private Haftpflicht sollte eine ausreichend hohe Deckungssumme enthalten (mind. 10 Mio. €).";

        if (hatKinder)
          return "Mit Kindern steigt das Haftungsrisiko deutlich. Eine private Haftpflicht schützt vor existenzbedrohenden Schadenersatzforderungen.";

        if (verheiratet)
          return "Als verheiratete Person schützt eine Haftpflichtversicherung euch beide vor hohen Schadenersatzansprüchen.";

        return "Ein einzelner Haftpflichtschaden kann existenzielle Folgen haben. Diese Absicherung gehört zur absoluten Basis.";
      }

      /* ================= RECHTSSCHUTZ ================= */

      case "rechtsschutz": {

        const beruf = baseData.beruf;
        const hatKFZ = baseData.kfz === "Ja";
        const wohntSelbst = baseData.wohnen && baseData.wohnen !== "Wohne bei Eltern";
        const hatKinder = baseData.kinder === "Ja";

        if (value !== "ja") {

          if (value === "unbekannt")
            return "Eine Überprüfung deiner Rechtsschutzabsicherung kann sinnvoll sein, da rechtliche Konflikte in vielen Lebensbereichen entstehen können.";

          // keine Rechtsschutzversicherung
          if (beruf && beruf !== "Nicht berufstätig")
            return "Arbeitsrechtliche Auseinandersetzungen können schnell hohe Kosten verursachen. Ohne Rechtsschutz trägst du Anwalts- und Gerichtskosten selbst.";

          if (hatKFZ)
            return "Im Straßenverkehr entstehen häufig rechtliche Streitigkeiten. Eine Verkehrsrechtsschutz-Komponente kann finanzielle Risiken reduzieren.";

          if (wohntSelbst)
            return "Streitigkeiten rund um Miet- oder Immobilienfragen können hohe Kosten verursachen. Eine passende Rechtsschutzabsicherung schafft Planungssicherheit.";

          return "Rechtliche Auseinandersetzungen können erhebliche Kosten verursachen. Eine strukturierte Absicherung kann finanzielle Risiken begrenzen.";
        }

        /* ===== Wenn vorhanden → prüfen, ob Lücken bestehen ===== */

        const gewichtung = {
          "Privat": 30,
          "Beruf": 25,
          "Verkehr": 25,
          "Immobilie/Miete": 20
        };

        const relevant = {
          "Privat": true,
          "Beruf": beruf && beruf !== "Nicht berufstätig",
          "Verkehr": hatKFZ,
          "Immobilie/Miete": wohntSelbst
        };

        const relevanteBereiche = Object.keys(gewichtung).filter(
          key => relevant[key]
        );

        const fehlend = relevanteBereiche.filter(
          key => !answers["rechtsschutz_" + key]
        );

        if (fehlend.length === 0) return null;

        // gezielte Lückenkommunikation
        if (fehlend.includes("Beruf"))
          return "Der berufliche Bereich ist nicht abgesichert. Arbeitsrechtliche Streitigkeiten zählen zu den häufigsten Konflikten.";

        if (fehlend.includes("Verkehr"))
          return "Im Verkehrsbereich entstehen besonders häufig Streitigkeiten. Eine Ergänzung kann finanzielle Risiken reduzieren.";

        if (fehlend.includes("Immobilie/Miete"))
          return "Rechtsstreitigkeiten rund um Miete oder Immobilieneigentum können kostspielig werden.";

        return "Eine vollständige Rechtsschutzabsicherung sollte alle für dich relevanten Lebensbereiche abdecken.";
      }

      /* ================= ANWARTSCHAFT ================= */

      case "anwartschaft": {

        const age = Number(baseData.alter);
        const income = Number(baseData.gehalt);

        if (value === "Große Anwartschaft")
          return null;

        if (value === "Kleine Anwartschaft") {

          if (age < 35)
            return "Eine große Anwartschaft sichert neben dem Gesundheitszustand auch dein heutiges Eintrittsalter. Gerade in jüngeren Jahren kann das langfristig deutliche Beitragsvorteile bringen.";

          return "Eine große Anwartschaft sichert zusätzlich dein aktuelles Eintrittsalter und kann langfristig zu stabileren Beiträgen in der privaten Krankenversicherung führen.";
        }

        if (value === "Weiß nicht")
          return "Bei Heilfürsorge ist eine Anwartschaft entscheidend, um später ohne erneute Gesundheitsprüfung in die private Krankenversicherung wechseln zu können. Eine Klärung schafft hier Planungssicherheit.";

        // Keine Anwartschaft
        if (income > 3500)
          return "Ohne Anwartschaft kann bei einem späteren Wechsel in die private Krankenversicherung eine erneute Gesundheitsprüfung erfolgen – mit möglichen Risikozuschlägen oder Leistungsausschlüssen.";

        return "Ohne Anwartschaft ist ein späterer Wechsel in die private Krankenversicherung regelmäßig mit erneuter Gesundheitsprüfung verbunden. Bestehende Vorerkrankungen können dann relevant werden.";
      }

      /* ================= RISIKO-LEBENSVERSICHERUNG ================= */

      case "risiko_lv": {

        if (value === "ja") return null;

        const income = Number(baseData.gehalt);
        const hatKinder = baseData.kinder === "Ja";
        const hatHaus = baseData.wohnen === "Eigentum Haus";
        const verheiratet = baseData.beziehungsstatus === "Verheiratet";
        const age = Number(baseData.alter);

        if (value === "unbekannt")
          return "Ob bereits eine ausreichende Absicherung im Todesfall besteht, sollte geprüft werden. Gerade bei familiären oder finanziellen Verpflichtungen kann hier ein erhebliches Risiko entstehen.";

        // Hohe Verantwortungssituation
        if (hatKinder && hatHaus)
          return "Bei Familie und Immobilienfinanzierung trägt dein Einkommen eine zentrale Verantwortung. Eine Risikolebensversicherung schützt Hinterbliebene vor finanziellen Belastungen im Todesfall.";

        if (hatKinder || verheiratet)
          return "Mit familiärer Verantwortung gewinnt die finanzielle Absicherung im Todesfall deutlich an Bedeutung. Ziel ist es, Partner oder Kinder wirtschaftlich abzusichern.";

        if (hatHaus)
          return "Bei Immobilienfinanzierung sollte geprüft werden, ob Darlehensverpflichtungen im Todesfall vollständig abgesichert sind.";

        // Höheres Einkommen = größere wirtschaftliche Lücke
        if (income >= 4000)
          return "Mit steigendem Einkommen wächst auch die wirtschaftliche Verantwortung. Eine Absicherung verhindert, dass im Ernstfall größere Versorgungslücken entstehen.";

        // Jüngere ohne Verpflichtung
        if (age < 30)
          return "Auch ohne aktuelle Verpflichtungen kann eine frühe Absicherung gesundheitliche Vorteile bieten und langfristig günstige Konditionen sichern.";

        return "Eine Risikolebensversicherung sichert finanzielle Verpflichtungen und schützt nahestehende Personen vor wirtschaftlichen Engpässen.";
      }

      /* ================= RÜCKLAGEN ================= */

      case "ruecklagen": {

        if (value === "ja") return null;

        const income = Number(baseData.gehalt);
        const hatKinder = baseData.kinder === "Ja";
        const hatHaus = baseData.wohnen === "Eigentum Haus";
        const verheiratet = baseData.beziehungsstatus === "Verheiratet";

        if (value === "unbekannt")
          return "Eine klare Übersicht über deine verfügbare Liquiditätsreserve ist entscheidend, um finanzielle Engpässe realistisch einschätzen zu können.";

        // Hohe Fixkosten-Situation
        if (hatHaus && hatKinder)
          return "Mit Immobilie und familiärer Verantwortung steigen laufende Fixkosten erheblich. Eine ausreichende Liquiditätsreserve schützt vor finanziellen Engpässen bei unerwarteten Ereignissen.";

        if (hatHaus)
          return "Immobilien verursachen laufende Verpflichtungen und potenzielle Reparaturkosten. Eine stabile Rücklage schafft finanzielle Sicherheit.";

        if (hatKinder)
          return "Mit Kindern erhöhen sich laufende Ausgaben und unvorhersehbare Kosten. Eine Reserve sorgt für Stabilität in Übergangsphasen.";

        // Einkommensskalierung
        if (income >= 4000)
          return "Bei höherem Einkommen steigt meist auch der Lebensstandard und damit das finanzielle Risiko bei Einkommensausfall. Eine Reserve von mindestens 3–6 Monatsnettoeinkommen schafft Planungssicherheit.";

        if (income >= 2500)
          return "Eine Liquiditätsreserve von mehreren Monatsnettoeinkommen schützt vor finanziellen Engpässen bei Krankheit oder Arbeitsplatzwechsel.";

        return "Eine Notfallreserve schützt vor kurzfristigen finanziellen Belastungen und schafft Unabhängigkeit von Krediten oder Dispo.";
      }

      /* ================= BETRIEBLICHE ALTERSVORSORGE ================= */

      case "bav": {

        if (value === "ja") return null;

        const income = Number(baseData.gehalt);
        const age = Number(baseData.alter);
        const hatKinder = baseData.kinder === "Ja";
        const verheiratet = baseData.beziehungsstatus === "Verheiratet";

        if (value === "unbekannt")
          return "Ob bereits eine betriebliche Altersvorsorge genutzt wird, sollte geprüft werden. Arbeitgeberzuschüsse und steuerliche Vorteile können die Effektivität deutlich erhöhen.";

        // Höheres Einkommen → größerer Steuervorteil
        if (income >= 4000)
          return "Bei höherem Einkommen wirkt die steuerliche Förderung besonders stark. In Kombination mit einem Arbeitgeberzuschuss entsteht ein struktureller Renditevorteil.";

        // Familienverantwortung
        if (hatKinder || verheiratet)
          return "Mit familiärer Verantwortung gewinnt zusätzliche Altersvorsorge an Bedeutung. Eine betriebliche Altersvorsorge kann hier eine stabile Grundstruktur bilden.";

        // Jüngere profitieren vom Zinseszinseffekt
        if (age < 30)
          return "Ein früher Einstieg in die betriebliche Altersvorsorge nutzt den langfristigen Zinseszinseffekt und reduziert den späteren Sparaufwand erheblich.";

        // Standard
        return "Die betriebliche Altersvorsorge verbindet steuerliche Förderung mit Arbeitgeberzuschüssen und stellt für Angestellte eine solide Ergänzung zur gesetzlichen Rente dar.";
      }


      /* ================= FAHRERSCHUTZ ================= */

      case "fahrerschutz": {

        if (baseData.kfz !== "Ja") return null;

        if (value === "ja") return null;

        const fahrzeuge = Number(baseData.kfzAnzahl) || 1;

        if (value === "unbekannt")
          return "Der Fahrerschutz schützt dich als Fahrer bei selbstverschuldeten Unfällen vor finanziellen Folgen wie Verdienstausfall oder Folgekosten. Eine Klärung ist sinnvoll.";

        if (fahrzeuge > 1)
          return "Bei mehreren Fahrzeugen steigt statistisch das Unfallrisiko. Der Fahrerschutz schützt den Fahrer bei selbstverschuldeten Schäden.";

        return "Bei selbstverschuldeten Unfällen leistet die Kfz-Haftpflicht nicht für den eigenen Fahrer. Der Fahrerschutz schließt diese Absicherungslücke.";
      }


      case "kasko": {

        const income = Number(baseData.gehalt);

        if (value === "vollkasko") return null;

        if (value === "unbekannt")
          return "Der passende Kaskoschutz hängt vom Fahrzeugwert, einer Finanzierung und deiner persönlichen Risikobereitschaft ab.";

        if (value === "keine") {

          if (income > 4000)
            return "Bei höherwertigen Fahrzeugen kann fehlender Kaskoschutz im Schadenfall zu erheblichen finanziellen Belastungen führen.";

          return "Ohne Kaskoversicherung trägst du Schäden am eigenen Fahrzeug selbst. Ob das wirtschaftlich sinnvoll ist, hängt vom Fahrzeugwert ab.";
        }

        if (value === "teilkasko")
          return "Teilkasko deckt bestimmte Risiken ab (z. B. Diebstahl, Sturm, Glasbruch). Bei neueren oder finanzierten Fahrzeugen kann Vollkasko sinnvoller sein.";

        return null;
      }


      case "schutzbrief": {

        const fahrzeugAnzahl = Number(baseData.kfzAnzahl) || 1;

        if (value === "ja") return null;

        if (value === "unbekannt")
          return "Ein Schutzbrief kann organisatorische Hilfe bei Pannen oder Unfällen bieten. Ob er sinnvoll ist, hängt von deinem Mobilitätsbedarf ab.";

        if (fahrzeugAnzahl > 1)
          return "Bei mehreren Fahrzeugen kann ein Schutzbrief zusätzlichen organisatorischen Schutz bei Pannen oder Ausfällen bieten.";

        return "Ein Schutzbrief bietet Hilfeleistungen bei Pannen, Abschleppkosten oder Mobilitätsausfällen. Er ist kein existenzieller Schutz, kann aber organisatorische Sicherheit erhöhen.";
      }

      default:
        return null;
    }
  }

  /* ================= LEGAL OVERLAY ================= */

  function LegalOverlayComponent() {
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
                BarmeniaGothaer VZ Südbaden
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
                Florian Löffler ist als gebundener Versicherungsvertreter gemäß
                § 34d Abs. 7 GewO tätig und vermittelt ausschließlich die Produkte
                folgender Gesellschaften:
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

            </>
          )}

          {legalOverlay === "datenschutz" && (
            <>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
                Datenschutzhinweis
              </p>

              <p style={{ fontSize: 13, opacity: 0.8 }}>
                Diese Anwendung speichert keine personenbezogenen Daten auf Servern.
                Alle Eingaben erfolgen ausschließlich lokal in deinem Browser.
              </p>

              <p style={{ fontSize: 13, opacity: 0.8 }}>
                Es findet keine automatische Übertragung deiner eingegebenen Daten
                an Dritte statt.
              </p>

              <p style={{ fontSize: 13, opacity: 0.8 }}>
                Beim Klick auf externe Links (z. B. Online-Abschluss,
                Terminvereinbarung oder externe Rechner) verlässt du diese Anwendung.
                Für die Datenverarbeitung der jeweiligen Anbieter gelten deren
                eigene Datenschutzbestimmungen.
              </p>

              <p style={{ fontSize: 13, opacity: 0.8 }}>
                Sofern eine PDF-Auswertung erzeugt wird, erfolgt diese ausschließlich
                lokal in deinem Browser ohne Speicherung auf externen Servern.
              </p>
            </>
          )}

          {legalOverlay === "hinweis" && (
            <>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
                Hinweis zur Nutzung
              </p>

              <p style={{ fontSize: 13, opacity: 0.8 }}>
                Der 360° Absicherungscheck ist ein digitales Analyse-Tool zur
                strukturierten Selbsteinschätzung deiner aktuellen Absicherung.
              </p>

              <p style={{ fontSize: 13, opacity: 0.8 }}>
                Die Auswertung basiert ausschließlich auf deinen eigenen Angaben
                und stellt keine individuelle Versicherungsberatung im Sinne des
                Versicherungsvertragsgesetzes (VVG) dar.
              </p>

              <p style={{ fontSize: 13, opacity: 0.8 }}>
                Die angezeigten Ergebnisse stellen eine algorithmusbasierte Orientierung dar.
                Sofern Handlungsfelder oder Abschlussmöglichkeiten angezeigt werden,
                erfolgt dies ohne individuelle Bedarfsanalyse im Sinne des § 6 VVG.
              </p>

              <p style={{ fontSize: 13, opacity: 0.8 }}>
                Ein Beratungsverhältnis entsteht erst im Rahmen eines persönlichen Gesprächs.
                Die Nutzung von Abschluss- oder Terminlinks erfolgt eigenverantwortlich.
              </p>
            </>
          )}


        </div>
      </div>
    );
  }

  /* ================= RESET OVERLAY ================= */

  function ResetOverlayComponent() {
    if (!showResetConfirm) return null;

    return (
      <div
        className="infoOverlay"
        onClick={() => setShowResetConfirm(false)}
      >
        <div
          className="infoBox"
          onClick={(e) => e.stopPropagation()}
        >
          <p>Möchtest du von vorne beginnen?</p>

          <div className="overlayButtons">
            <button
              className="overlayBtn primary"
              onClick={() => {
                setShowResetConfirm(false);
                resetAll();
              }}
            >
              Ja
            </button>

            <button
              className="overlayBtn secondary"
              onClick={() => setShowResetConfirm(false)}
            >
              Nein
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= Contact Overlay ================= */

  function ContactOverlayComponent() {
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

  /* ================= ACTION OVERLAY ================= */

  function ActionOverlayComponent() {
    if (!actionOverlay) return null;

    const action = ACTION_MAP[actionOverlay];
    if (!action) return null;

    return (
      <div
        className="infoOverlay"
        onClick={() => setActionOverlay(null)}
      >
        <div
          className="infoBox"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="overlayClose"
            onClick={() => setActionOverlay(null)}
          >
            ×
          </button>
          <h3 style={{ marginBottom: 12 }}>
            {QUESTIONS[actionOverlay]?.label}
          </h3>

          <div className="overlayButtons">

            {/* Beratungstermin */}
            <button
              className="overlayBtn primary"
              onClick={() =>
                window.open(
                  action.calendar,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Termin vereinbaren
            </button>

            {/* Kontakt anzeigen */}
            <button
              className="overlayBtn secondary"
              onClick={() => {
                setActionOverlay(null);
                setContactOverlay(true);
              }}
            >
              Kontakt anzeigen
            </button>

          </div>
        </div>
      </div>
    );
  }


  /* ================= WELCOME ================= */

  if (step === "welcome") {
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

        <ResetOverlayComponent />
        <LegalOverlayComponent />
        <ContactOverlayComponent />

      </div>
    );
  }

  /* ================= DISCLAIMER ================= */

  if (step === "disclaimer") {
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

  /* ================= BASISDATEN ================= */

  if (step === "base") {

    return (
      <div className="screen">
        <Header
          goBase={goToBaseWithoutReset}
        />



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
          options={[
            "Ledig",
            "Partnerschaft",
            "Verheiratet"
          ]}
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
          label="Besitzt du ein Fahrzeug? (z. B. Auto, Motorrad, Roller, Mofa)"
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
          onClick={() => {
            setStep("category");
            scrollToTop();
          }}
        >
          Weiter
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

        <ResetOverlayComponent />
        <LegalOverlayComponent />
        <ContactOverlayComponent />

      </div>
    );
  }

  /* ================= KATEGORIEN ================= */

  if (step === "category") {

    const questionsOfCategory = Object.keys(QUESTIONS).filter((id) => {
      const q = QUESTIONS[id];

      if (q.category !== currentCategory) return false;
      if (q.condition && !q.condition(baseData)) return false;

      return true;
    });

    return (
      <div className="screen" ref={screenRef}>

        <Header
          back={() => {
            if (currentCategoryIndex > 0) {
              setCurrentCategoryIndex((prev) => prev - 1);
            } else {
              setStep("base");
            }

            scrollToTop();
          }}

          goBase={goToBaseWithoutReset}
        />



        {/* Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            Kategorie {currentCategoryIndex + 1} von {categories.length}
          </div>

          <div style={{ fontSize: 20, fontWeight: "bold" }}>
            {CATEGORY_LABELS[currentCategory]}
          </div>

          <div
            style={{
              height: 6,
              background: "#1a2a36",
              borderRadius: 6,
              marginTop: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${((currentCategoryIndex + 1) / categories.length) * 100}%`,
                height: "100%",
                background: "linear-gradient(135deg, #8B7CF6, #5E4AE3)",
                transition: "0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Fragen */}
        {questionsOfCategory.map((id) => {
          const q = QUESTIONS[id];

          return (
            <div key={id} className="questionCard dark">
              <div className="questionHeader">
                <div className="questionText">
                  {q.label}
                </div>

                {q.info && (
                  <span
                    className="floatingInfoSquare"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInfo(q.info);
                    }}
                  >
                    i
                  </span>
                )}

                {q.link && (
                  <a
                    href={q.link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="calculatorIcon"
                    title={q.link.label}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4" y="2" width="16" height="20" rx="3" />
                      <line x1="8" y1="6" x2="16" y2="6" />
                      <line x1="8" y1="10" x2="8" y2="14" />
                      <line x1="12" y1="10" x2="12" y2="14" />
                      <line x1="16" y1="10" x2="16" y2="14" />
                      <line x1="8" y1="17" x2="16" y2="17" />
                    </svg>
                  </a>
                )}

              </div>


              {/* SELECT */}
              {q.type === "select" && (
                <Select
                  label=""
                  options={q.options}
                  value={
                    id === "kasko"
                      ? answers[id] === "keine"
                        ? "Keine"
                        : answers[id] === "teilkasko"
                          ? "Teilkasko"
                          : answers[id] === "vollkasko"
                            ? "Vollkasko"
                            : answers[id] === "unbekannt"
                              ? "Weiß nicht"
                              : ""
                      : answers[id] || ""
                  }
                  onChange={(v) => {
                    if (id === "kasko") {
                      if (v === "Keine") answer(id, "keine");
                      else if (v === "Teilkasko") answer(id, "teilkasko");
                      else if (v === "Vollkasko") answer(id, "vollkasko");
                      else answer(id, "unbekannt");
                    } else {
                      answer(id, v === "Weiß nicht" ? "unbekannt" : v);
                    }
                  }}
                />
              )}

              {/* YES / NO */}
              {q.type === "yesno" && (
                <>
                  <div className="buttonRow">
                    {["ja", "nein", "unbekannt"].map((v) => {
                      const isActive = answers?.[id] === v;

                      return (
                        <button
                          key={v}
                          type="button"
                          className={`answerBtn ${isActive ? "active" : ""}`}
                          onClick={() => answer(id, v)}
                        >
                          {v === "ja"
                            ? "Ja"
                            : v === "nein"
                              ? "Nein"
                              : "Weiß ich nicht"}
                        </button>
                      );
                    })}
                    {/* FLOATING INFO ICON */}
                    {q.info && (
                      <button
                        type="button"
                        className="floatingInfoSquare"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowInfo(q.info);
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="infoIconSvg"
                        >
                          {/* Punkt */}
                          <circle cx="12" cy="6" r="1" />

                          {/* Längerer Strich mit mehr Abstand */}
                          <line x1="12" y1="10" x2="12" y2="21" />
                        </svg>
                      </button>
                    )}

                  </div>


                  {/* RECHTSSCHUTZ SUBOPTIONEN */}

                  {id === "rechtsschutz" && answers[id] === "ja" && (
                    <div className="subOptions">
                      {["Privat", "Beruf", "Verkehr", "Immobilie/Miete"].map(
                        (opt) => (
                          <Checkbox
                            key={opt}
                            label={opt}
                            checked={answers["rechtsschutz_" + opt]}
                            onChange={(e) =>
                              answer(
                                "rechtsschutz_" + opt,
                                e.target.checked
                              )
                            }
                          />
                        )
                      )}
                    </div>
                  )}

                  {/* KRANKENZUSATZ SUBOPTIONEN */}

                  {id === "krankenzusatz" && answers[id] === "ja" && (
                    <div className="subOptions">
                      {[
                        "Ambulant",
                        "Stationär",
                        "Zähne",
                        "Brille",
                        "Krankenhaustagegeld",
                      ].map((opt) => (
                        <Checkbox
                          key={opt}
                          label={opt}
                          checked={answers["krankenzusatz_" + opt]}
                          onChange={(e) =>
                            answer(
                              "krankenzusatz_" + opt,
                              e.target.checked
                            )
                          }
                        />
                      ))}
                    </div>
                  )}

                  {/* KINDER KRANKENZUSATZ SUBOPTIONEN */}

                  {id === "kinder_krankenzusatz" &&
                    answers[id] === "ja" && (
                      <div className="subOptions">
                        {[
                          "Ambulant",
                          "Stationär",
                          "Zähne",
                          "Brille",
                          "Krankenhaustagegeld",
                        ].map((opt) => (
                          <Checkbox
                            key={opt}
                            label={opt}
                            checked={
                              answers[
                              "kinder_krankenzusatz_" + opt
                              ]
                            }
                            onChange={(e) =>
                              answer(
                                "kinder_krankenzusatz_" + opt,
                                e.target.checked
                              )
                            }
                          />
                        ))}
                      </div>
                    )}
                </>
              )}
            </div>
          );
        })}

        {/* ===== NAVIGATION BUTTON ===== */}

        <button
          type="button"
          className="primaryBtn big"
          onClick={() => {

            if (currentCategoryIndex < categories.length - 1) {
              setCurrentCategoryIndex((prev) => prev + 1);
            } else {
              setStep("dashboard");
            }

            scrollToTop();

          }}

        >
          {currentCategoryIndex < categories.length - 1
            ? "Weiter"
            : "Auswertung"}
        </button>



        {showInfo && (
          <div
            className="infoOverlay"
            onClick={() => setShowInfo(null)}
          >
            <div
              className="infoBox"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                type="button"
                className="overlayClose"
                onClick={() => setShowInfo(null)}
              >
                ×
              </button>


              {/* TEXT HANDLING – STRING ODER OBJEKT */}
              {(typeof showInfo === "string"
                ? showInfo.split("\n")
                : showInfo.text || []
              ).map((line, i) => (
                <p key={i}>{line}</p>
              ))}

              {/* OPTIONALER RECHNER LINK */}
              {typeof showInfo === "object" && showInfo.link && (
                <>
                  <p style={{ marginTop: 14, fontWeight: 500 }}>
                    ➜ {showInfo.link.label}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 12
                    }}
                  >
                    <a
                      href={showInfo.link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="calculatorIcon"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="2" width="16" height="20" rx="3" />
                        <line x1="8" y1="6" x2="16" y2="6" />
                        <line x1="8" y1="10" x2="8" y2="14" />
                        <line x1="12" y1="10" x2="12" y2="14" />
                        <line x1="16" y1="10" x2="16" y2="14" />
                        <line x1="8" y1="17" x2="16" y2="17" />
                      </svg>
                    </a>
                  </div>
                </>
              )}

            </div>
          </div>
        )}

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

        <ResetOverlayComponent />
        <LegalOverlayComponent />
        <ContactOverlayComponent />

      </div>
    );
  }

  /* =================  DASHBOARD  ================= */

  if (step === "dashboard") {
    return (
      <div className="screen" ref={screenRef}>

        <Header
          goBase={goToBaseWithoutReset}
          back={() => {
            setStep("category");
            scrollToTop();
          }}
        />


        <h2 className="dashboardTitle">
          {baseData.vorname
            ? `${baseData.vorname}, dein Absicherungs-Status`
            : "Dein Absicherungs-Status"}
        </h2>

        {/* ================= SCORE RING – PREMIUM FINAL ================= */}

        <div className="ringWrap">

          {(() => {

            const circumference = 2 * Math.PI * 95;
            const normalizedScore = Math.min(animatedScore, 100);

            const dashOffset =
              normalizedScore === 100
                ? 0
                : circumference - (normalizedScore / 100) * circumference;

            let gradientStart = "#5E4AE3";
            let gradientEnd = "#8B7CF6";
            let statusLabel = "Handlungsbedarf";
            let glowStrength = 0.16;

            if (animatedScore >= 60) {
              gradientStart = "#6E5CF0";
              gradientEnd = "#A99BFF";
              statusLabel = "Gute Basis";
              glowStrength = 0.32;
            }

            if (animatedScore >= 80) {
              gradientStart = "#8B7CF6";
              gradientEnd = "#C4BAFF";
              statusLabel = "Sehr solide";
              glowStrength = 0.48;
            }

            if (animatedScore === 100) {
              glowStrength = 0.65;
            }

            return (
              <>
                {/* WEICHER OUTER GLOW */}
                {hasValidScoreData && (
                  <div
                    className="ringGlow"
                    style={{
                      background: `radial-gradient(circle,
        rgba(139,124,246,0) 0%,
        rgba(139,124,246,${glowStrength * 0.35}) 40%,
        rgba(139,124,246,${glowStrength * 0.7}) 60%,
        rgba(139,124,246,${glowStrength * 0.35}) 75%,
        rgba(139,124,246,${glowStrength * 0.1}) 88%,
        transparent 100%)`
                    }}
                  />
                )}

                <svg width="260" height="260" viewBox="0 0 260 260">

                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={gradientStart} />
                      <stop offset="100%" stopColor={gradientEnd} />
                    </linearGradient>
                  </defs>

                  {/* Hintergrundring */}
                  <circle
                    cx="130"
                    cy="130"
                    r="95"
                    stroke="#1A2A36"
                    strokeWidth="18"
                    fill="none"
                  />

                  {/* Aktiver Ring */}
                  {hasValidScoreData ? (
                    <circle
                      cx="130"
                      cy="130"
                      r="95"
                      stroke="url(#scoreGrad)"
                      strokeWidth="18"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      strokeLinecap={normalizedScore === 100 ? "butt" : "round"}
                      transform="rotate(-90 130 130)"
                      style={{
                        filter: `drop-shadow(0 0 10px rgba(139,124,246,${glowStrength}))`,
                        transition: "0.9s ease"
                      }}
                    />
                  ) : null}

                </svg>

                <div className="ringCenter">
                  {hasValidScoreData ? (
                    <>
                      <div className="ringScore">{animatedScore}%</div>
                      <div className="ringStatus">
                        {animatedScore === 100
                          ? "Sehr solide"
                          : animatedScore >= 80
                            ? "Sehr solide"
                            : animatedScore >= 60
                              ? "Gute Basis"
                              : "Handlungsbedarf"}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="ringScore">–</div>
                      <div
                        className="ringStatus"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Beantworte weitere Fragen für dein Ergebnis
                      </div>
                    </>
                  )}
                </div>
              </>
            );
          })()}

        </div>

        {/* ================= SCORE STATUS ================= */}

        <div className="scoreLabel" style={{ textAlign: "center" }}>
          <p>
            {animatedScore === 100
              ? "Makellos strukturiert"
              : animatedScore >= 95
                ? "Nahezu optimal abgesichert"
                : animatedScore >= 80
                  ? "Sehr gut abgesichert"
                  : animatedScore >= 60
                    ? "Solide Basis"
                    : "Optimierung sinnvoll"}
          </p>


          <p
            style={{
              fontSize: 14,
              opacity: 0.75,
              marginTop: 6,
              textAlign: "center",
              maxWidth: 320,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.5
            }}
          >
            {getDynamicHint()}
          </p>

        </div>

        {/* ================= DYNAMISCHE STATUS-TEXTE ================= */}

        {animatedScore < 60 && (
          <div className="riskWarning" style={{ textAlign: "center" }}>
            <strong>Handlungsbedarf:</strong> Es bestehen mehrere relevante
            Absicherungslücken, die wir zeitnah gemeinsam anschauen sollten.
          </div>
        )}

        {animatedScore >= 60 && animatedScore < 80 && (
          <div className="upgradeHint" style={{ textAlign: "center" }}>
            Gute Basis. Mit ein paar gezielten Anpassungen lässt sich dein
            Schutz deutlich stabiler und langfristig sinnvoller aufstellen.
          </div>
        )}

        {animatedScore >= 80 && animatedScore < 90 && (
          <div className="upgradeHint" style={{ textAlign: "center" }}>
            Du bist bereits gut abgesichert. Einzelne Bausteine können noch
            sinnvoll ergänzt oder optimiert werden.
          </div>
        )}

        {animatedScore >= 90 && animatedScore < 100 && (
          <div className="upgradeHint" style={{ textAlign: "center" }}>
            Sehr stark aufgestellt. Deine Struktur ist durchdacht und
            deckt die wesentlichen Risiken ab. Mit wenigen strategischen
            Feinjustierungen lässt sich das Gesamtbild weiter abrunden.
          </div>
        )}

        {animatedScore >= 100 && (
          <div className="upgradeHint" style={{ textAlign: "center" }}>
            Exzellent aufgestellt.
            Das Fundament steht. Jetzt geht es nicht mehr um Lücken –
            sondern um strategische Feinjustierung.
          </div>
        )}


        {/* ================= TOP 3 HANDLUNGSFELDER ================= */}
        {(topRecommendations.length > 0 || animatedScore === 100) && (
          <div className="categoryList" style={{ marginTop: 20 }}>

            <h3 className="top3Headline">
              {animatedScore < 60
                ? "Hier sollten wir gezielt nachschärfen"
                : animatedScore < 80
                  ? "Hier steckt noch echtes Potenzial"
                  : animatedScore < 95
                    ? "Sehr gute Basis – jetzt geht es um den Feinschliff"
                    : animatedScore < 100
                      ? "Exzellent aufgestellt – strategische Feinjustierung"
                      : "Exzellent aufgestellt – aktuell kein Handlungsbedarf"}
            </h3>

            {/* Normale Empfehlungen */}
            {animatedScore < 100 && topRecommendations.map((item) => {

              const action = ACTION_MAP[item.id];

              return (
                <div key={item.id} className="recommendationItem">
                  <strong>{QUESTIONS[item.id]?.label}</strong>
                  <p>{item.text}</p>

                  {action && (
                    <button
                      className="recommendationBtn"
                      style={{ marginTop: 10 }}
                      onClick={() => {
                        if (action.type === "abschluss") {
                          window.open(
                            action.url,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }

                        if (action.type === "beratung") {
                          setActionOverlay(item.id);
                        }
                      }}
                    >
                      {action.type === "abschluss"
                        ? "jetzt Online absichern"
                        : "jetzt Beratung vereinbaren"}
                    </button>
                  )}
                </div>
              );
            })}

            {/* 100%-Zustand */}
            {animatedScore === 100 && (
              <div
                className="recommendationItem"
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  opacity: 0.85
                }}
              >
                Deine Absicherungsstruktur ist aktuell vollständig und durchdacht aufgebaut.
                Es bestehen keine prioritären Handlungsfelder.
              </div>
            )}

          </div>
        )}


        {/* Kategorien Übersicht */}
        <div className="categoryList">
          {categories.map((cat) => {
            const questionsInCat = Object.keys(QUESTIONS).filter((id) => {
              const q = QUESTIONS[id];

              if (q.category !== cat) return false;
              if (q.condition && !q.condition(baseData)) return false;
              if (answers[id] === undefined) return false;

              return true;
            });

            const needsOptimization = questionsInCat.filter((id) => {
              const recommendation = getStrategicRecommendation(id);
              return recommendation !== null && recommendation !== undefined;
            });

            const isOpen = expandedCategory === cat;

            return (
              <div key={cat}>
                <div
                  className="categoryRow"
                  onClick={() =>
                    setExpandedCategory(isOpen ? null : cat)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <span>{CATEGORY_LABELS[cat]}</span>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{categoryScores[cat] || 0}%</span>

                    <div
                      className="categoryChevron"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="categoryDetails open">
                    {needsOptimization.length > 0 ? (
                      needsOptimization.map((id) => {

                        const action = ACTION_MAP[id];

                        return (
                          <div key={id} className="recommendationItem">
                            <strong>{QUESTIONS[id].label}</strong>
                            <p>{getStrategicRecommendation(id)}</p>

                            {action && (
                              <button
                                className="recommendationMiniBtn"
                                onClick={() => {

                                  if (action.type === "abschluss") {
                                    window.open(
                                      action.url,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  }

                                  if (action.type === "beratung") {
                                    setActionOverlay(id);
                                  }

                                }}
                              >
                                {action.type === "abschluss"
                                  ? "jetzt Online absichern"
                                  : "jetzt Beratung vereinbaren"}
                              </button>
                            )}

                          </div>
                        );

                      })
                    ) : (
                      <p className="noIssues">
                        Kein unmittelbarer Optimierungsbedarf.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ================= STRATEGIE CTA ================= */}

        <div className="conversionBox">

          <h3>Persönliche Strategie-Empfehlung</h3>

          <p>
            In einem kurzen, unverbindlichen Gespräch analysieren wir gemeinsam,
            welche Maßnahmen deinen Absicherungs-Score gezielt verbessern
            und wirtschaftlich sinnvoll sind.
          </p>

          <button
            className="primaryBtn big"
            onClick={() =>
              window.open(
                "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0SLsLLWwpYi9zGo3jKaW9aH-njqaoyXli9aNibLRwSZn0jO4CdgL0-7yCHXsXNJMLAWgvFZi1N",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Kostenloses Strategiegespräch sichern
          </button>

          <p className="ctaSubline">
            100 % unverbindlich · Keine Verpflichtung · Persönlich & transparent
          </p>

          {/* ===== SEKUNDÄRE AKTIONEN ===== */}

          <div className="secondaryActions">

            <button
              className="secondaryMiniBtn"
              onClick={() => setCalculatorOverlay(true)}
            >
              Rechner öffnen
            </button>

            <button
              className="secondaryMiniBtn"
              onClick={() => {
                setShowResetConfirm(false);
                setPdfPreview(false);
                setPdfOverlay(true);
              }}
            >
              PDF-Auswertung erstellen
            </button>

          </div>

        </div>

        {/* ================= SEKUNDÄR – TARIFOPTIONEN ================= */}

        <button
          className="outlineBtn"
          onClick={() => setStep("products")}
        >
          Alle Tarifoptionen anzeigen
        </button>



        {/* ================= LEGAL FOOTER ================= */}

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
          onReset={() => {
            setContactOverlay(false);
            setLegalOverlay(null);
            setPdfOverlay(false);
            setCalculatorOverlay(false);
            setPdfPreview(false);
            setActionOverlay(null);
            setShowResetConfirm(true);
          }}
          onContact={() => {
            setShowResetConfirm(false);
            setLegalOverlay(null);
            setPdfOverlay(false);
            setCalculatorOverlay(false);
            setPdfPreview(false);
            setActionOverlay(null);
            setContactOverlay(true);
          }}
        />

        <CalculatorOverlayComponent
          calculatorOverlay={calculatorOverlay}
          setCalculatorOverlay={setCalculatorOverlay}
          buIncome={buIncome}
          setBuIncome={setBuIncome}
        />

        <PdfOverlayComponent
          pdfOverlay={pdfOverlay}
          setPdfOverlay={setPdfOverlay}
          pdfData={pdfData}
          setPdfData={setPdfData}
          isPdfValid={isPdfValid}
          baseData={baseData}
          buIncome={buIncome}
          setPdfPreview={setPdfPreview}
        />

        {pdfPreview && (
          <PdfPreviewComponent
            pdfPreview={pdfPreview}
            setPdfPreview={setPdfPreview}
            totalScore={totalScore}
            topRecommendations={topRecommendations}
            categoryScores={categoryScores}
            baseData={baseData}
            pdfData={pdfData}
            buIncome={buIncome}
            answers={answers}
          />
        )}

        <ActionOverlayComponent />
        <ResetOverlayComponent />
        <LegalOverlayComponent />
        <ContactOverlayComponent />

      </div>
    );
  }

}


/* ================= UI COMPONENTS ================= */

function Header({ back, goBase }) {
  return (
    <div className="header">
      <img
        src="/logo.jpg"
        className="logo small"
        onClick={goBase}
        alt="Logo"
      />

      {back && (
        <button className="backBtn" onClick={back}>
          <span className="arrowIcon"></span>
        </button>
      )}
    </div>
  );
}


function Input({
  label,
  type = "text",
  value,
  onChange,
  inputRef,
  onEnter,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  const isNumber = type === "number";

  const increase = () => {
    const current = parseInt(value) || 0;
    onChange(current + 1);
  };

  const decrease = () => {
    const current = parseInt(value) || 0;
    onChange(Math.max(0, current - 1));
  };

  return (
    <div className="field">
      {label && <label>{label}</label>}

      <div className={isNumber ? "numberField" : ""}>
        <input
          ref={inputRef}
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {isNumber && (
          <div className="numberStepper">
            <button type="button" onClick={increase}>
              +
            </button>
            <button type="button" onClick={decrease}>
              −
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
function Select({
  label,
  options,
  value,
  onChange,
  selectRef,
  onEnter,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="field">
      {label && <label>{label}</label>}

      <select
        ref={selectRef}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      >
        <option value="">Bitte wählen</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
  inputRef,
  onEnter,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <label className="checkbox">
      <input
        ref={inputRef}
        type="checkbox"
        checked={!!checked}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      {label}
    </label>
  );
}

/* ================= Contact Button ================= */

function ContactButton({ onReset, onContact }) {
  return (
    <div className="contactFixed">
      <button
        className="contactBtn"
        onClick={onContact}
      >
        Beratung sichern
      </button>

      <button
        className="contactBtn secondary"
        onClick={onReset}
      >
        Neustart
      </button>
    </div>
  );
}

/* ================= CALCULATOR OVERLAY ================= */

const CalculatorOverlayComponent = React.memo(function CalculatorOverlayComponent({
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

/* ================= PDF OVERLAY COMPONENT ================= */

function PdfOverlayComponent({
  pdfOverlay,
  setPdfOverlay,
  pdfData,
  setPdfData,
  baseData,
  buIncome,
  setPdfPreview
}) {

  const [infoField, setInfoField] = React.useState(null);

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
              Für Selbstständige und privat Versicherte ist das
              Krankentagegeld essenziell, da keine Lohnfortzahlung
              durch den Arbeitgeber erfolgt.
              <br /><br />
              Bei Angestellten in der PKV wird die Höhe aus Netto,
              Brutto sowie Kranken- und Pflegeversicherungsbeitrag
              berechnet.
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

/* ================= PDF PREVIEW COMPONENT ================= */

function PdfPreviewComponent({
  pdfPreview,
  setPdfPreview,
  totalScore,
  topRecommendations,
  categoryScores,
  baseData,
  pdfData,
  buIncome,
  answers
}) {

  const wrapperRef = React.useRef(null);
  const actionsRef = React.useRef(null);
  const [showScrollButton, setShowScrollButton] = React.useState(true);

  const scrollToBottom = () => {
    if (!wrapperRef.current || !actionsRef.current) return;

    const wrapper = wrapperRef.current;
    const target = actionsRef.current;

    // Position relativ zum Wrapper berechnen
    const targetPosition =
      target.offsetTop - wrapper.offsetTop;

    wrapper.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  };

  /* ===== SCROLL BUTTON VISIBILITY (OVERLAY INTERN) ===== */

  React.useEffect(() => {

    if (!pdfPreview) return;   // <-- hier absichern

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {

      const scrollPosition = wrapper.scrollTop + wrapper.clientHeight;
      const scrollHeight = wrapper.scrollHeight;

      if (scrollPosition >= scrollHeight - 40) {
        setShowScrollButton(false);
      } else {
        setShowScrollButton(true);
      }
    };

    wrapper.addEventListener("scroll", handleScroll);

    return () => {
      wrapper.removeEventListener("scroll", handleScroll);
    };

  }, [pdfPreview]);

  if (!pdfPreview) return null;


  /* ================= DATEN EINFRIEREN ================= */

  const stableData = React.useMemo(() => ({
    totalScore,
    topRecommendations,
    categoryScores,
    baseData,
    pdfData,
    buIncome,
    answers
  }), [
    totalScore,
    topRecommendations,
    categoryScores,
    baseData,
    pdfData,
    buIncome,
    answers
  ]);

  const finalBU = React.useMemo(() => {

    const manualValue = stableData.pdfData?.buEmpfehlung;

    if (manualValue && String(manualValue).trim() !== "") {
      return manualValue;
    }

    const income =
      stableData.buIncome ||
      stableData.baseData?.gehalt;

    if (!income) return "";

    return Math.round(Number(income) * 0.8);

  }, [
    stableData.pdfData?.buEmpfehlung,
    stableData.buIncome,
    stableData.baseData?.gehalt
  ]);


  const groupedAnswers = Object.entries(stableData.answers || {}).reduce((acc, [key, value]) => {

    if (
      value === false ||
      value === null ||
      value === "" ||
      value === undefined
    ) return acc;

    let question = QUESTIONS[key];
    let category = null;
    let label = null;

    if (question) {
      category = question.category;
      label = question.label;
    } else {
      // Suboptionen erkennen (z.B. rechtsschutz_Privat)
      const mainKey = key.split("_")[0];
      const mainQuestion = QUESTIONS[mainKey];

      if (!mainQuestion) return acc;

      category = mainQuestion.category;
      label = key.replace(mainKey + "_", mainQuestion.label + " – ");
    }

    if (!acc[category]) acc[category] = [];

    acc[category].push({
      label,
      value
    });

    return acc;

  }, {});


  const handlePrint = () => {

    const printContent = document.querySelector(".printArea").innerHTML;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <html>
      <head>
        <title>360° Absicherungsanalyse</title>
<style>

  @page {
    size: A4;
    margin: 16mm;
  }

  body {
    font-family: "Helvetica Neue", Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: white;
    color: black;
  }

  .printWrapper {
    max-width: 188mm;
    margin: 0 auto;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 6px;
  }

  /* ===== TYPOGRAFIE ===== */

  .pdfPreview {
    font-size: 13px;
    line-height: 1.4;
  }

  .pdfSection {
    margin-bottom: 18px;
  }

  .pdfSection h3 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid #000;
  }

  .pdfCategoryRow {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3px;
  }

  .pdfCategoryRow strong {
    font-weight: 600;
  }

  .pdfRecommendation {
    margin-bottom: 8px;
    padding-left: 10px;
    border-left: 3px solid #000;
  }

  .pdfFooter {
    margin-top: 25px;
    font-size: 11px;
    color: #666;
    line-height: 1.3;
  }

  /* ===== SEITENUMBRUCH-STEUERUNG ===== */

  .pageBreak {
    break-before: page;
    page-break-before: always;
  }

  .pdfSection,
  .pdfCategoryRow,
  .pdfRecommendation {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .pdfSection h3 {
    break-after: avoid;
    page-break-after: avoid;
  }

  /* ===== CONTACT BLOCK ===== */

  .pdfContactBlock {
    margin-top: 30px;
    padding-top: 14px;
    border-top: 1px solid #000;

    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 30px;
  }

  .pdfContactLeft {
    font-size: 12px;
    line-height: 1.4;
  }

  .pdfContactTitle {
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 4px;
  }

  .pdfContactRight {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pdfContactRight img {
    width: 85px;
    height: 85px;
    margin-bottom: 4px;
  }

  .pdfQrLabel {
    font-size: 10px;
    color: #666;
    text-align: center;
  }

</style>

      </head>
<body>
  <div class="printWrapper">
    ${printContent}
  </div>
</body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };


  /* ================= DOKUMENT-INHALT ================= */

  const pdfDocument = (
    <div className="printArea">
      <div className="pdfPreview">

        {/* ================= HEADER ================= */}
        <div className="pdfHeader">
          <h1>360° Absicherungsanalyse</h1>
          <div className="pdfScoreValue">
            {stableData.totalScore}%
          </div>
          <div className="pdfScoreLabel">
            Gesamt-Absicherungsstatus
          </div>
        </div>

        <hr style={{ margin: "30px 0" }} />

        {/* ================= PERSÖNLICHE ANGABEN ================= */}

        <div className="pdfSection">
          <h3>Persönliche Angaben</h3>

          <div className="pdfCategoryRow">
            <strong>Anrede:</strong> {stableData.baseData?.anrede || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Vorname:</strong> {stableData.baseData?.vorname || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Nachname:</strong> {stableData.baseData?.nachname || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Familienstand:</strong> {stableData.baseData?.beziehungsstatus || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Alter:</strong> {stableData.baseData?.alter || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Berufliche Situation:</strong> {stableData.baseData?.beruf || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Krankenversicherung:</strong> {stableData.baseData?.krankenversicherung || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Monatliches Netto-Gehalt:</strong> {stableData.baseData?.gehalt || "-"} €
          </div>

          <div className="pdfCategoryRow">
            <strong>Kinder vorhanden:</strong> {stableData.baseData?.kinder || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Kinder krankenversichert:</strong> {stableData.baseData?.kinderKrankenversicherung || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Anzahl Kinder:</strong> {stableData.baseData?.kinderAnzahl || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Haustiere:</strong> {stableData.baseData?.tiere || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Wohnsituation:</strong> {stableData.baseData?.wohnen || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Fahrzeug vorhanden:</strong> {stableData.baseData?.kfz || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Anzahl Fahrzeuge:</strong> {stableData.baseData?.kfzAnzahl || "-"}
          </div>

          <hr style={{ margin: "20px 0" }} />

          {/* ================= ADRESSE & KONTAKT ================= */}

          <div className="pdfCategoryRow">
            <strong>Adresse:</strong> {stableData.pdfData?.adresse || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>PLZ / Ort:</strong> {stableData.pdfData?.plz || "-"} {stableData.pdfData?.ort || ""}
          </div>

          <div className="pdfCategoryRow">
            <strong>E-Mail:</strong> {stableData.pdfData?.email || "-"}
          </div>

          <div className="pdfCategoryRow">
            <strong>Telefon:</strong> {stableData.pdfData?.telefon || stableData.pdfData?.handy || "-"}
          </div>

        </div>

        <hr style={{ margin: "30px 0" }} />

        {/* ================= ERGÄNZENDE WERTE ================= */}

        <div className="pdfSection">
          <h3>Ergänzende Werte/Lücken</h3>

          {finalBU && (
            <div className="pdfCategoryRow">
              <strong>BU-Rente:</strong> {finalBU} €
            </div>
          )}

          {stableData.pdfData?.rentenluecke && (
            <div className="pdfCategoryRow">
              <strong>Altersrententenlücke:</strong> {stableData.pdfData.rentenluecke} €
            </div>
          )}

          {stableData.pdfData?.ktgEmpfehlung && (
            <div className="pdfCategoryRow">
              <strong>Krankentagegeld:</strong> {stableData.pdfData.ktgEmpfehlung} €
            </div>
          )}
        </div>

        {/* ================= KATEGORIEÜBERSICHT ================= */}
        <div className="pageBreak" />

        <div className="pdfSection">
          <h3>Kategorieübersicht</h3>
          {Object.keys(stableData.categoryScores || {}).map((cat) => (
            <div key={cat} className="pdfCategoryRow">
              {CATEGORY_LABELS[cat] || cat} – {stableData.categoryScores[cat] ?? 0}%
            </div>
          ))}
        </div>

        <hr style={{ margin: "30px 0" }} />

        {/* ================= HANDLUNGSFELDER ================= */}

        <div className="pdfSection">
          <h3>Priorisierte Handlungsfelder</h3>

          {stableData.topRecommendations?.length === 0 && (
            <p>Keine unmittelbaren Optimierungsfelder.</p>
          )}

          {stableData.topRecommendations?.slice(0, 3).map((item, index) => (
            <div key={item.id} className="pdfRecommendation">
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                #{index + 1} Priorität
              </div>
              <div>{item.text}</div>
            </div>
          ))}
        </div>

        <hr style={{ margin: "30px 0" }} />

        {/* ================= DETAILS ================= */}

        <div className="pdfSection">
          <h3>Deine Angaben im Detail</h3>

          {Object.keys(groupedAnswers || {})
            .filter(category => groupedAnswers[category].length > 0)
            .map((category) => (
              <div key={category} style={{ marginBottom: 16 }}>
                <strong>
                  {CATEGORY_LABELS[category] || category}
                </strong>

                {groupedAnswers[category].map((item, i) => (
                  <div key={i} className="pdfCategoryRow">
                    {item.label}:{" "}
                    {item.value === true
                      ? "✓"
                      : item.value === "ja"
                        ? "Ja"
                        : item.value === "nein"
                          ? "Nein"
                          : item.value}
                  </div>
                ))}
              </div>
            ))}
        </div>

        <hr style={{ margin: "30px 0" }} />


        <div className="pageBreak" />

        <div className="pdfContactBlock">

          <div className="pdfContactLeft">

            <div className="pdfContactTitle">
              BarmeniaGothaer – Florian Löffler
            </div>

            <div>Breisacher Str. 145b</div>
            <div>79110 Freiburg</div>

            <div className="pdfContactSpacer" />

            <div>Mail: florian.loeffler@barmenia.de</div>
            <div>Tel.: 0761 2027423</div>

          </div>

          <div className="pdfContactRight">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=https://agentur.barmenia.de/florian_loeffler"
              alt="QR Code Website"
            />
            <div className="pdfQrLabel">Agentur online aufrufen</div>
          </div>

        </div>

        <div className="pdfFooter">
          Diese Analyse basiert auf deinen eigenen Angaben und stellt keine
          individuelle Beratung im Sinne des VVG dar.
        </div>

      </div>
    </div>
  );

  return (
    <div
      className="infoOverlay"
      onClick={() => setPdfPreview(false)}
    >
      <div
        ref={wrapperRef}
        className="pdfPreviewWrapper"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="overlayClose"
          onClick={() => setPdfPreview(false)}
        >
          ×
        </button>

        {pdfDocument}

        <div className="pdfActions" ref={actionsRef}>
          <button
            className="primaryBtn"
            onClick={handlePrint}
          >
            Drucken / Als PDF speichern
          </button>

          <button
            className="secondaryBtn"
            onClick={() => setPdfPreview(false)}
          >
            Schließen
          </button>
        </div>

        {showScrollButton && (
          <button
            className="scrollDownBtn"
            onClick={scrollToBottom}
          >
            ↓
          </button>
        )}


      </div>
    </div>
  );
}
