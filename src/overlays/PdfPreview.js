
import {
    calculateFinalBU,
    groupAnswersForPdf
} from "../logic/pdfDataEngine";

import React from "react";
import { QUESTIONS } from "../data/questions";
import { CATEGORY_LABELS } from "../config/categoryLabels";

export default function PdfPreview({


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
        return calculateFinalBU({
            pdfData: stableData.pdfData,
            buIncome: stableData.buIncome,
            baseData: stableData.baseData
        });
    }, [
        stableData.pdfData,
        stableData.buIncome,
        stableData.baseData
    ]);

    const groupedAnswers = React.useMemo(() => {
        return groupAnswersForPdf({
            answers: stableData.answers,
            QUESTIONS
        });
    }, [stableData.answers]);

    const handlePrint = () => {

        const printArea = document.querySelector(".printArea");
        if (!printArea) return;

        const printContent = printArea.innerHTML;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        /* ================= PDF PRINT ================= */

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
        margin-bottom: 8px;
        padding-bottom: 4px;
        border-bottom: 1px solid #000;
      }

/* ===== TABELLE IST / SOLL / DIFFERENZ ===== */

.pdfTable {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  margin-bottom: 14px;
}

.pdfTable th,
.pdfTable td {
  padding: 5px 0;
  font-size: 13px;
  vertical-align: top;
}

/* Kopfzeile */

.pdfTable th {
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #000;
  padding-bottom: 6px;
}

/* Zahlen-Spalten rechtsbündig (2,3,4) */

.pdfTable td:nth-child(2),
.pdfTable td:nth-child(3),
.pdfTable td:nth-child(4),
.pdfTable th:nth-child(2),
.pdfTable th:nth-child(3),
.pdfTable th:nth-child(4) {
  text-align: right;
}

/* Noch abzusichern etwas dezenter */

.pdfTable td:nth-child(4) {
  font-style: italic;
}

/* Zahlen sauber untereinander */

.pdfTable td {
  font-variant-numeric: tabular-nums;
}

/* Kein Bestand */

.mutedValue {
  font-style: italic;
  color: #666;
  font-size: 12px;
}

/* Zeilen nicht umbrechen lassen */

.pdfTable tr {
  break-inside: avoid;
  page-break-inside: avoid;
}
      /* ===== EMPFEHLUNGEN ===== */

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

      .pdfSection {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .pdfSection h3 {
        break-after: avoid;
        page-break-after: avoid;
      }
/* ===== DETAIL KATEGORIEN ===== */

.pdfDetailCategory {
  margin-top: 14px;
  padding-top: 8px;
  border-top: 1px solid #000;
}

.pdfDetailCategory:first-of-type {
  margin-top: 8px;
  border-top: none;
}

.pdfDetailCategoryTitle {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;
}
  /* ===== CONTACT BLOCK (PRINT FIXED) ===== */

.pdfContactBlock {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #000;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.pdfContactLeft {
  font-size: 13px;
  line-height: 1.6;
}

.pdfContactRight {
  display: flex;
  flex-direction: column;
  align-items: center;      /* QR + Text horizontal mittig */
  justify-content: flex-start;
  gap: 6px;
  text-align: center;       /* Text exakt unter QR-Code */
}

.pdfContactRight img {
  width: 90px;
  height: 90px;
  margin-bottom: 2px;
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

    // ================= BERECHNUNGEN =================

    // Hilfsfunktion
    const parseValue = (val) => {
        if (val === undefined || val === null || val === "") return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
    };

    // ================= BU =================

    const buIstRaw = parseValue(stableData.pdfData?.existingBU);
    const buSoll = Number(finalBU) || 0;

    const buIst = buIstRaw !== null ? buIstRaw : 0;
    const buDiff = Math.max(buSoll - buIst, 0);

    // ================= ALTERSVORSORGE =================

    const renteIstRaw = parseValue(stableData.pdfData?.existingRente);
    const renteSoll = Number(stableData.pdfData?.rentenluecke) || 0;

    const renteIst = renteIstRaw !== null ? renteIstRaw : 0;
    const renteDiff = Math.max(renteSoll - renteIst, 0);

    // ================= KRANKENTAGEGELD =================

    const ktgIstRaw = parseValue(stableData.pdfData?.existingKTG);
    const ktgSoll = Number(stableData.pdfData?.ktgEmpfehlung) || 0;

    const ktgIst = ktgIstRaw !== null ? ktgIstRaw : 0;
    const ktgDiff = Math.max(ktgSoll - ktgIst, 0);

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



                {/* ================= ERGÄNZENDE WERTE ================= */}

                <div className="pdfSection">
                    <h3>Strategisch empfohlene Zielwerte</h3>

                    <table className="pdfTable">
                        <thead>
                            <tr>
                                <th>Bereich</th>
                                <th>Dein aktueller Schutz</th>
                                <th>Empfohlene Höhe</th>
                                <th>Noch abzusichern</th>
                            </tr>
                        </thead>

                        <tbody>

                            {buSoll > 0 && (
                                <tr>
                                    <td>BU-Absicherung (mtl.)</td>

                                    <td>
                                        {buIstRaw === null ? (
                                            <span className="mutedValue">Kein Bestand angegeben</span>
                                        ) : buIst === 0 ? (
                                            <span className="mutedValue">Kein Schutz vorhanden</span>
                                        ) : (
                                            `${buIst} €`
                                        )}
                                    </td>

                                    <td>{buSoll} €</td>

                                    <td>
                                        {buDiff > 0
                                            ? `${buDiff} €`
                                            : "Bereits ausreichend abgesichert"}
                                    </td>
                                </tr>
                            )}

                            {renteSoll > 0 && (
                                <tr>
                                    <td>Altersvorsorge (mtl.)</td>

                                    <td>
                                        {renteIstRaw === null ? (
                                            <span className="mutedValue">Kein Bestand angegeben</span>
                                        ) : renteIst === 0 ? (
                                            <span className="mutedValue">Kein Schutz vorhanden</span>
                                        ) : (
                                            `${renteIst} €`
                                        )}
                                    </td>

                                    <td>{renteSoll} €</td>

                                    <td>
                                        {renteDiff > 0
                                            ? `${renteDiff} €`
                                            : "Bereits ausreichend abgesichert"}
                                    </td>
                                </tr>
                            )}

                            {ktgSoll > 0 && (
                                <tr>
                                    <td>Krankentagegeld (tgl.)</td>

                                    <td>
                                        {ktgIstRaw === null ? (
                                            <span className="mutedValue">Kein Bestand angegeben</span>
                                        ) : ktgIst === 0 ? (
                                            <span className="mutedValue">Kein Schutz vorhanden</span>
                                        ) : (
                                            `${ktgIst} €`
                                        )}
                                    </td>

                                    <td>{ktgSoll} €</td>

                                    <td>
                                        {ktgDiff > 0
                                            ? `${ktgDiff} €`
                                            : "Bereits ausreichend abgesichert"}
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
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


                {/* ================= DETAILS ================= */}

                <div className="pdfSection">
                    <h3>Deine Angaben im Detail</h3>

                    {Object.keys(groupedAnswers || {})
                        .filter(category => groupedAnswers[category].length > 0)
                        .map((category) => (
                            <div key={category} className="pdfDetailCategory">

                                <div className="pdfDetailCategoryTitle">
                                    {CATEGORY_LABELS[category] || category}
                                </div>

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
                        <div className="pdfQrWrapper">
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=https://agentur.barmenia.de/florian_loeffler"
                                alt="QR Code Website"
                            />
                            <div className="pdfQrLabel">
                                Agentur online aufrufen
                            </div>
                        </div>
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

