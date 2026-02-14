import React, { useState, useEffect, useMemo } from "react";
import "./index.css";

/* ================= KATEGORIE GEWICHTE ================= */

const CATEGORY_WEIGHTS = {
  existenz: 0.25,
  kinder: 0.1,
  haftung: 0.15,
  gesundheit: 0.15,
  wohnen: 0.1,
  mobilitaet: 0.1,
  vorsorge: 0.15,
};

const CATEGORY_LABELS = {
  existenz: "Existenz",
  haftung: "Haftung",
  gesundheit: "Gesundheit",
  wohnen: "Wohnen",
  mobilitaet: "Mobilität",
  vorsorge: "Vorsorge",
  kinder: "Kinder",
};

/* ================= PRIORITY MAP ================= */

const PRIORITY_MAP = {
  bu: 3,
  du: 3,
  anwartschaft: 3,
  haftpflicht: 3,
  pflege: 3,
  risiko_lv: 3,
  ruecklagen: 3,

  bav: 2,
  private_rente: 2,
  gebaeude: 2,
  rechtsschutz: 2,
  hausrat: 2,
  kfz_haftpflicht: 2,

  krankenzusatz: 1,
  kinder_krankenzusatz: 1,
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
  "kfz_haftpflicht",
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

  kfz_haftpflicht: {
    type: "abschluss",
    url: "https://ssl.barmenia.de/online-versichern/#/kfzversicherung/Fahrzeug?adm=00840513"
  },

  kasko: {
    type: "abschluss",
    url: "https://ssl.barmenia.de/online-versichern/#/kfzversicherung/Fahrzeug?adm=00840513"
  },

  schutzbrief: {
    type: "abschluss",
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

  kfz_haftpflicht: {
    label: "Haftpflichtversicherung für dein Fahrzeug vorhanden? (z. B. Auto, Motorrad, Roller, Mofa)",
    category: "mobilitaet",
    type: "yesno",
    condition: (baseData) => baseData.kfz === "Ja",
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

  /* ===== FLOW-SCHUTZ ===== */

  useEffect(() => {
    if (step !== "category") return;

    if (currentCategoryIndex >= categories.length) {
      setCurrentCategoryIndex(0);
    }
  }, [categories, currentCategoryIndex, step]);

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

    setDisclaimerAccepted(false); // <-- DAS HIER HINZUFÜGEN
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
  if ((key === "kasko" || key === "kfz_haftpflicht" || key === "schutzbrief") && baseData.kfz !== "Ja") return null;
  if ((key === "tierhaft" || key === "tier_op") && (!baseData.tiere || baseData.tiere === "Keine Tiere")) return null;
  if ((key === "hausrat" || key === "elementar") && baseData.wohnen === "Wohne bei Eltern") return null;
  if (key === "gebaeude" && !hatHaus) return null;
  if (key === "ktg" && baseData.beruf === "Beamter") return null;
  if (key === "bu" && (baseData.beruf === "Beamter" || baseData.beruf === "Nicht berufstätig")) return null;
  if (key === "du" && baseData.beruf !== "Beamter") return null;

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

  if (key === "betriebliche_altersvorsorge") {

    if (baseData.beruf !== "Angestellter") return null;

    if (value === "ja") return 100;

    return 0;
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
  /* ===== KASKO ============================================= */
  /* ========================================================= */

  if (key === "kasko") {
    if (value === "vollkasko") return 100;
    if (value === "teilkasko") return 50;
    return 0;
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

    const scores = Object.keys(QUESTIONS)
      .filter((id) => {
        const q = QUESTIONS[id];
        if (q.category !== cat) return false;
        if (q.condition && !q.condition(baseData)) return false;
        return true;
      })
      .map((id) => getScore(id))
      .filter((score) => score !== null);

    if (scores.length === 0) {
      acc[cat] = 0;
      return acc;
    }

    const sum = scores.reduce((total, s) => total + s, 0);

    acc[cat] = Math.round(sum / scores.length);

    return acc;

  }, {});

}, [answers, baseData, categories]);


/* ================= TOTAL SCORE ================= */

const totalScore = useMemo(() => {

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

  return Math.round(weightedScore / totalWeight);

}, [categoryScores, baseData]);


  /* ===== SCORE ANIMATION ===== */

  useEffect(() => {
    if (step !== "dashboard") return;

    let current = 0;

    const interval = setInterval(() => {
      current++;

      if (current >= totalScore) {
        current = totalScore;
        clearInterval(interval);
      }

      setAnimatedScore(current);
    }, 8);

    return () => clearInterval(interval);
  }, [totalScore, step]);

 /* ================= TOP 3 HANDLUNGSFELDER ================= */

const topRecommendations = useMemo(() => {

  if (step !== "dashboard") return [];

  const EXCLUDED_FROM_TOP3 = [
    "elementar",
    "schutzbrief"
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

      return true;

    })
    .map((id) => ({
      id,
      text: getStrategicRecommendation(id),
      priority: PRIORITY_MAP[id] || 1,
      score: getScore(id)
    }));


  allRecommendations.sort((a, b) => {

    // 1️⃣ Höhere Priorität zuerst
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }

    // 2️⃣ Schlechterer Score zuerst
    return a.score - b.score;
  });

  return allRecommendations.slice(0, 3);

}, [answers, baseData, step]);


  /* ================= PRODUKTSEITE ================= */

  if (step === "products") {
    return (
      <div className="screen">
        <Header reset={resetAll} back={() => setStep("dashboard")} />

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

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        <ResetOverlayComponent />
        <ActionOverlayComponent />
        <LegalOverlayComponent />
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

      case "bu":
        if (value === "ja") return null;
        if (unsicher)
          return "Hier besteht eventuell Optimierungsbedarf. Eine Prüfung deiner Einkommensabsicherung ist sinnvoll.";
        if (verheiratet)
          return "Als verheiratete Person trägt dein Einkommen besondere Verantwortung. Eine Berufsunfähigkeitsabsicherung schützt die wirtschaftliche Stabilität eurer Lebensplanung.";
        return "Die Absicherung der eigenen Arbeitskraft zählt zu den wichtigsten finanziellen Grundlagen.";

      /* ================= DU ================= */

      case "du":
        if (value === "ja") return null;

        if (unsicher)
          return "Hier besteht eventuell Optimierungsbedarf. Eine Überprüfung deiner Dienstunfähigkeitsabsicherung schafft Klarheit über deinen tatsächlichen Einkommensschutz.";

        if (verheiratet)
          return "Als verbeamtete und verheiratete Person trägt dein Einkommen besondere Verantwortung. Eine Dienstunfähigkeitsversicherung schützt eure wirtschaftliche Stabilität bei Versetzung in den Ruhestand wegen Dienstunfähigkeit.";

        return "Als Beamter ersetzt die Dienstunfähigkeitsversicherung die klassische Berufsunfähigkeitsabsicherung und sichert dein Einkommen bei vorzeitiger Dienstunfähigkeit.";


      /* ================= PRIVATE RENTE ================= */

      case "private_rente":
        if (value === "ja") return null;
        if (unsicher)
          return "Hier besteht eventuell Optimierungsbedarf. Eine strukturierte Ruhestandsplanung schafft Klarheit über Versorgungslücken.";
        if (age >= 50)
          return "Im fortgeschrittenen Erwerbsleben lassen sich Vorsorgelücken nur noch begrenzt aufholen.";
        if (age >= 30)
          return "Je früher private Altersvorsorge beginnt, desto geringer ist der monatliche Aufwand.";
        return "Früher Vorsorgebeginn schafft langfristige finanzielle Flexibilität.";

      /* ================= PFLEGE ================= */

      case "pflege":
        if (value === "ja") return null;
        if (unsicher)
          return "Hier besteht eventuell Optimierungsbedarf. Eine Prüfung der Pflegeabsicherung kann finanzielle Risiken reduzieren.";
        if (age >= 50)
          return "Mit steigendem Alter erhöhen sich Eintrittswahrscheinlichkeit und Beitragshöhe.";
        if (age >= 30)
          return "Pflegekosten können erhebliche Eigenanteile verursachen.";
        return "Frühe Gesundheitsabsicherung sichert langfristig günstige Beiträge.";

      /* ================= KRANKENZUSATZ ================= */

      case "krankenzusatz":

        if (value !== "ja") return value === "nein"
          ? "Eine Krankenzusatzversicherung kann Eigenkosten im Leistungsfall deutlich reduzieren."
          : null;

        const kzBereiche = [
          "Ambulant",
          "Stationär",
          "Zähne",
          "Brille",
          "Krankenhaustagegeld"
        ];

        const fehlendKZ = kzBereiche.filter(
          opt => !answers["krankenzusatz_" + opt]
        );

        if (fehlendKZ.length === 0) return null;

        return "Eine umfassende Gesundheitsabsicherung sollte mehrere Leistungsbereiche abdecken. Eine Überprüfung des Umfangs kann sinnvoll sein.";

      /* ================= KINDER KRANKENZUSATZ ================= */

      case "kinder_krankenzusatz":

        // Wenn Kinder-KV unklar ist → erst System klären
        if (baseData.kinderKrankenversicherung === "Weiß nicht")
          return "Die Krankenversicherung deiner Kinder sollte geklärt werden, um mögliche Versorgungslücken einschätzen zu können.";

        // Wenn keine Zusatz vorhanden
        if (value === "nein")
          return "Für gesetzlich versicherte Kinder kann eine ergänzende Gesundheitsabsicherung sinnvoll sein.";

        // Wenn nicht beantwortet
        if (value !== "ja") return null;

        const kinderBereiche = [
          "Ambulant",
          "Stationär",
          "Zähne",
          "Brille",
          "Krankenhaustagegeld"
        ];

        const fehlendKinder = kinderBereiche.filter(
          opt => !answers["kinder_krankenzusatz_" + opt]
        );

        if (fehlendKinder.length === 0) return null;

        return "Für Kinder kann eine umfassende Gesundheitsabsicherung sinnvoll sein. Eine Überprüfung des Leistungsumfangs schafft Transparenz.";

      /* ================= HAUSRAT ================= */

      case "hausrat":
        if (value === "ja") return null;
        if (unsicher)
          return "Hier besteht eventuell Optimierungsbedarf. Eine Überprüfung der Versicherungssumme schützt vor Unterversicherung.";
        return "Der Schutz deines beweglichen Eigentums sollte regelmäßig am Neuwert ausgerichtet sein.";

      /* ================= ELEMENTAR ================= */

      case "elementar":
        if (value === "ja") return null;
        if (unsicher)
          return "Hier besteht eventuell Optimierungsbedarf. Elementarschäden sind häufig nicht automatisch eingeschlossen.";
        return "Naturgefahren nehmen statistisch zu. Elementarschutz ergänzt die Wohnabsicherung sinnvoll.";

      /* ================= GEBÄUDE ================= */

      case "gebaeude":
        if (value === "ja") return null;
        if (unsicher)
          return "Hier besteht eventuell Optimierungsbedarf. Eine vollständige Gebäudeabsicherung ist essenziell.";
        return "Als Eigentümer ist eine vollständige Gebäudeabsicherung essenziell.";

      /* ================= HAFTPFLICHT ================= */

      case "haftpflicht":
        if (value === "ja") return null;
        if (unsicher)
          return "Hier besteht eventuell Optimierungsbedarf. Eine Überprüfung der Deckungssumme ist sinnvoll.";
        return "Die private Haftpflichtversicherung zählt zu den elementaren Basisabsicherungen.";

      /* ================= RECHTSSCHUTZ ================= */

      case "rechtsschutz":

        if (value !== "ja")
          return value === "nein"
            ? "Rechtliche Auseinandersetzungen können erhebliche Kosten verursachen."
            : null;

        const rsBereiche = [
          { key: "Privat", relevant: true },
          { key: "Beruf", relevant: baseData.beruf && baseData.beruf !== "Nicht berufstätig" },
          { key: "Verkehr", relevant: baseData.kfz === "Ja" },
          { key: "Immobilie/Miete", relevant: baseData.wohnen && baseData.wohnen !== "Wohne bei Eltern" }
        ];

        const relevante = rsBereiche.filter(b => b.relevant);

        const fehlendRS = relevante.filter(
          b => !answers["rechtsschutz_" + b.key]
        );

        if (fehlendRS.length === 0) return null;

        return "Eine vollständige Rechtsschutzabsicherung sollte alle relevanten Lebensbereiche abdecken.";

      /* ================= ANWARTSCHAFT ================= */

      case "anwartschaft":

        if (value === "Große Anwartschaft") return null;

        if (value === "Kleine Anwartschaft")
          return "Eine große Anwartschaft sichert zusätzlich das Eintrittsalter und kann langfristig Beitragssicherheit bieten.";

        if (value === "Weiß nicht")
          return "Bei Heilfürsorge ist eine Anwartschaft entscheidend, um später ohne erneute Gesundheitsprüfung in die private Krankenversicherung wechseln zu können.";

        return "Ohne Anwartschaft kann bei späterem Wechsel in die private Krankenversicherung eine erneute Gesundheitsprüfung erforderlich sein.";

        /* ================= RISIKO-LEBENSVERSICHERUNG ================= */

case "risiko_lv":

  if (value === "ja") return null;

  if (value === "unbekannt")
    return "Hier besteht möglicher Klärungsbedarf. Eine Risikolebensversicherung sichert Hinterbliebene oder finanzielle Verpflichtungen im Todesfall ab.";

  return "Eine Risikolebensversicherung schützt Familie, Partner oder laufende Darlehen im Todesfall und verhindert finanzielle Engpässe.";

  /* ================= RÜCKLAGEN ================= */

case "ruecklagen":

  if (value === "ja") return null;

  if (value === "unbekannt")
    return "Eine Überprüfung deiner Liquiditätsreserve kann sinnvoll sein.";

  return "Eine Notfallreserve von 3–6 Monatsnettoeinkommen schützt vor finanziellen Engpässen bei unerwarteten Ereignissen wie Jobverlust oder Reparaturen.";

  /* ================= BETRIEBLICHE ALTERSVORSORGE ================= */

case "betriebliche_altersvorsorge":

  if (value === "ja") return null;

  if (value === "unbekannt")
    return "Hier besteht möglicher Klärungsbedarf. Eine betriebliche Altersvorsorge kann staatliche Förderung und Arbeitgeberzuschüsse nutzen.";

  return "Die betriebliche Altersvorsorge ermöglicht staatlich geförderten Vermögensaufbau und sollte bei Angestellten geprüft werden.";


      /* ================= KFZ ================= */

      case "kfz_haftpflicht":
        if (value === "ja") return null;
        if (unsicher)
          return "Hier besteht eventuell Optimierungsbedarf. Die gesetzliche Haftpflicht sollte eindeutig geprüft werden.";
        return "Die KFZ-Haftpflicht schützt vor existenzbedrohenden Schadenersatzforderungen.";

      case "kasko":
        if (value === "ja") return null;
        if (unsicher)
          return "Hier besteht eventuell Optimierungsbedarf. Der passende Kaskoschutz hängt vom Fahrzeugwert ab.";
        return "Der passende Kaskoschutz hängt vom Fahrzeugwert und deiner Risikobereitschaft ab.";

      case "schutzbrief":
        if (value === "ja") return null;
        if (unsicher)
          return "Hier besteht eventuell Optimierungsbedarf. Ein Schutzbrief kann im Notfall organisatorische Sicherheit bieten.";
        return "Ein Schutzbrief reduziert organisatorische und finanzielle Belastungen im Notfall.";

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
          <h3 style={{ marginBottom: 12 }}>
            {legalOverlay === "impressum" ? "Impressum" : "Datenschutz"}
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
          <h3 style={{ marginBottom: 16 }}>
            Persönlicher Kontakt
          </h3>

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
          onClick={resetAll}
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

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        <ResetOverlayComponent />
        <LegalOverlayComponent />
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
        <Header reset={resetAll} back={() => setStep("welcome")} />

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
          onClick={() => setStep("category")}
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

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        <ResetOverlayComponent />
        <LegalOverlayComponent />
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
      <div className="screen">
        <Header
          reset={resetAll}
          back={() => {
            if (currentCategoryIndex > 0) {
              setCurrentCategoryIndex((prev) => prev - 1);
            } else {
              setStep("base");
            }
          }}
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
                          <circle cx="12" cy="6" r="1.3" />

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

        <button
          className="primaryBtn"
          onClick={() => {
            if (currentCategoryIndex < categories.length - 1) {
              setCurrentCategoryIndex((prev) => prev + 1);
            } else {
              setStep("dashboard");
            }
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

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        <ResetOverlayComponent />
        <LegalOverlayComponent />
      </div>
    );
  }

  /* =================  DASHBOARD  ================= */

  if (step === "dashboard") {
    return (
      <div className="screen">
        <Header reset={resetAll} back={() => setStep("category")} />

        <h2 className="dashboardTitle">
          {baseData.vorname
            ? `${baseData.vorname}, dein Status`
            : "Dein Status"}
        </h2>

        {/* Score Ring */}
        <div className="ringWrap">
          <svg width="220" height="220">
            <circle
              cx="110"
              cy="110"
              r="90"
              stroke="#1a2a36"
              strokeWidth="16"
              fill="none"
            />

            <circle
              cx="110"
              cy="110"
              r="90"
              stroke="url(#grad)"
              strokeWidth="16"
              fill="none"
              strokeDasharray="565"
              strokeDashoffset={565 - (565 * animatedScore) / 100}
              strokeLinecap="round"
              transform="rotate(-90 110 110)"
              style={{
                filter: "drop-shadow(0 0 12px rgba(139,124,246,0.6))",
                transition: "0.6s ease",
              }}
            />

            <defs>
              <linearGradient id="grad">
                <stop offset="0%" stopColor="#8B7CF6" />
                <stop offset="100%" stopColor="#5E4AE3" />
              </linearGradient>
            </defs>
          </svg>

          <div className="ringCenter">{animatedScore}%</div>
        </div>

        {/* Bewertung + Hinweis */}
        <div className="scoreLabel">
          <p>
            {animatedScore >= 80
              ? "Sehr gut abgesichert"
              : animatedScore >= 60
                ? "Solide Basis"
                : "Optimierung sinnvoll"}
          </p>

          <p style={{ fontSize: 14, opacity: 0.75, marginTop: 6 }}>
            {getDynamicHint()}
          </p>
        </div>

        {/* ================= TOP 3 HANDLUNGSFELDER ================= */}
        {topRecommendations.length > 0 && (
          <div className="categoryList" style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 12 }}>
              Deine wichtigsten Handlungsfelder
            </h3>

            {topRecommendations.map((item) => {

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

        <button
          className="primaryBtn"
          style={{ marginTop: 20 }}
          onClick={() => setStep("products")}
        >
          Alle Tarifoptionen anzeigen
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

        <ContactButton onReset={() => setShowResetConfirm(true)} />
        <ResetOverlayComponent />
        <ActionOverlayComponent />
        <LegalOverlayComponent />
        <ContactOverlayComponent />
      </div>
    );
  }

}


/* ================= UI COMPONENTS ================= */

function Header({ reset, back }) {
  return (
    <div className="header">
      <img
        src="/logo.jpg"
        className="logo small"
        onClick={reset}
        alt="Logo"
      />
      <button className="backBtn" onClick={back}>
        <span className="arrowIcon"></span>
      </button>
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

function ContactButton({ onReset }) {
  return (
    <div className="contactFixed">
      <button
        className="contactBtn"
        onClick={() =>
          window.open(
            "https://agentur.barmenia.de/florian_loeffler",
            "_blank"
          )
        }
      >
        Kontakt aufnehmen
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
