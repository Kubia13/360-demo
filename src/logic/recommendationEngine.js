/* ===== STRATEGISCHE EMPFEHLUNGEN ===== */
import { getScore } from "./scoring";

export function getStrategicRecommendation(id, answers, baseData) {

    // 🔒 KASKO FIX
    if (id === "kasko" && answers[id] === "vollkasko") {
        return null;
    }

    const value = answers[id];
    const age = Number(baseData.alter);
    const verheiratet = baseData.beziehungsstatus === "Verheiratet";

    if (!value) return null;

    // NICHT RELEVANTE FÄLLE NICHT EMPFEHLEN
  const score = getScore(id, answers, baseData);
if (score === null) return null;

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

        /* ================= TIER OP / TIERKRANKEN ================= */

        case "tier_op": {

            const hatTier =
                baseData.tiere === "Hund" ||
                baseData.tiere === "Katze" ||
                baseData.tiere === "Hund und Katze";

            if (!hatTier) return null;

            const type = answers.tier_op_type;

            // Voll abgesichert → keine Empfehlung
            if (value === "ja" && type === "voll") {
                return null;
            }

            // Unbekannt
            if (value === "unbekannt") {
                return "Ob dein Tier medizinisch abgesichert ist, sollte geprüft werden. Tierarztkosten können schnell mehrere tausend Euro erreichen.";
            }

            // Kein Schutz
            if (value === "nein") {
                return "Tierarzt- oder OP-Kosten können schnell hohe Summen erreichen. Ohne Absicherung trägst du das volle finanzielle Risiko.";
            }

            // Nur OP
            if (value === "ja" && type === "op") {
                return "Eine reine OP-Versicherung deckt nur chirurgische Eingriffe ab. Ambulante Behandlungen oder chronische Erkrankungen bleiben ungeschützt.";
            }

            return null;
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
