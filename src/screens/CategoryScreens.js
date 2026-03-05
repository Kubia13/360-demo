import React from "react";
import { QUESTIONS } from "../data/questions";
import { CATEGORY_LABELS } from "../config/categoryLabels";
import { scrollToTop } from "../utils/scrollHelpers";

export default function CategoryScreen({
  screenRef,
  currentCategoryIndex,
  categories,
  currentCategory,
  baseData,
  answers,
  answer,
  setCurrentCategoryIndex,
  setStep,
  goToBaseWithoutReset,
  setShowInfo,
  showInfo,
  setLegalOverlay,
  setContactOverlay,
  setShowResetConfirm,
  Header,
  Select,
  Checkbox,
  ContactButton,
  devBypass
}) {
  React.useEffect(() => {
    scrollToTop(screenRef);
  }, [currentCategoryIndex]);
  /* ================= KATEGORIEN ================= */


  const questionsOfCategory = Object.keys(QUESTIONS).filter((id) => {
    const q = QUESTIONS[id];

    if (q.category !== currentCategory) return false;
    if (q.condition && !q.condition(baseData)) return false;

    return true;
  });

  const activeQuestionIds = Object.keys(QUESTIONS).filter((id) => {
    const q = QUESTIONS[id];
    if (!q) return false;
    if (q.category !== currentCategory) return false;
    if (q.condition && !q.condition(baseData)) return false;
    return true;
  });

  const isCategoryComplete = activeQuestionIds.every((id) => {

    // Hauptfrage muss beantwortet sein
    if (answers[id] === undefined) return false;

    // ===== SUB-LOGIK =====

    // Tier OP: wenn ja → type muss gesetzt sein
    if (id === "tier_op" && answers[id] === "ja") {
      if (!answers.tier_op_type) return false;
    }

    // Rechtsschutz: wenn ja → mindestens eine Option
    if (id === "rechtsschutz" && answers[id] === "ja") {
      const hasOption = Object.keys(answers).some(key =>
        key.startsWith("rechtsschutz_") && answers[key] === true
      );
      if (!hasOption) return false;
    }

    // Krankenzusatz: wenn ja → mindestens eine Option
    if (id === "krankenzusatz" && answers[id] === "ja") {
      const hasOption = Object.keys(answers).some(key =>
        key.startsWith("krankenzusatz_") && answers[key] === true
      );
      if (!hasOption) return false;
    }

    // Kinder-Krankenzusatz: wenn ja → mindestens eine Option
    if (id === "kinder_krankenzusatz" && answers[id] === "ja") {
      const hasOption = Object.keys(answers).some(key =>
        key.startsWith("kinder_krankenzusatz_") && answers[key] === true
      );
      if (!hasOption) return false;
    }

    return true;
  });
  const canProceed = devBypass || isCategoryComplete;

  return (
    <div className="screen" ref={screenRef}>

      <Header
        back={() => {
          if (currentCategoryIndex > 0) {
            setCurrentCategoryIndex((prev) => prev - 1);
          } else {
            setStep("base");
          }


        }}

        goBase={goToBaseWithoutReset}
      />

      {/* Progress */}
      <div className="progressBlock">
        <div className="progressMeta">
          Kategorie {currentCategoryIndex + 1} von {categories.length}
        </div>

        <div className="progressTitle">
          {CATEGORY_LABELS[currentCategory]}
        </div>

        <div className="progressBarWrapper">
          <div
            className="progressFill"
            style={{
              width: `${((currentCategoryIndex + 1) / categories.length) * 100}%`
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
                {/* TIER OP SUB OPTIONS – AUSSERHALB VON buttonRow */}
                {id === "tier_op" && answers?.[id] === "ja" && (
                  <div className="subOptions">
                    <label className="checkbox">
                      <input
                        type="radio"
                        name="tier_op_type"
                        checked={answers?.tier_op_type === "op"}
                        onChange={() => answer("tier_op_type", "op")}
                      />
                      <span>Nur OP-Versicherung</span>
                    </label>

                    <label className="checkbox">
                      <input
                        type="radio"
                        name="tier_op_type"
                        checked={answers?.tier_op_type === "voll"}
                        onChange={() => answer("tier_op_type", "voll")}
                      />
                      <span>Tierkrankenversicherung mit OP</span>
                    </label>
                  </div>
                )}

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
        disabled={!canProceed}
        style={{ opacity: canProceed ? 1 : 0.5 }}
        onClick={() => {

          if (!canProceed) return;

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
