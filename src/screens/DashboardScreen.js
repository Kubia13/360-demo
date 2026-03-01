/* =================  DASHBOARD  ================= */

export default function DashboardScreen({
  screenRef,
  Header,
  goToBaseWithoutReset,
  setStep,
  scrollToTop,
  baseData,
  animatedScore,
  hasValidScoreData,
  dynamicHint,
  topRecommendations,
  ACTION_MAP,
  QUESTIONS,
  setActionOverlay,
  categories,
  answers,
  getStrategicRecommendation,
  expandedCategory,
  setExpandedCategory,
  CATEGORY_LABELS,
  categoryScores,
  setCalculatorOverlay,
  setShowResetConfirm,
  setPdfPreview,
  pdfOverlay,
  setPdfOverlay,
  setContactOverlay,
  setLegalOverlay,
  ContactButton
}) {

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

              <svg width="280" height="280" viewBox="0 0 260 260">

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
          {dynamicHint}
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
                      ? "Zum Online-Antrag"
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
            const recommendation = getStrategicRecommendation(id, answers, baseData);
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
                  {(() => {
                    const score = categoryScores[cat] || 0;

                    return (
                      <span style={{ fontWeight: 600 }}>
                        {score}%
                        <small
                          style={{
                            marginLeft: 4,
                            opacity: 0.45,
                            fontWeight: 500
                          }}
                        >
                          abgesichert
                        </small>
                      </span>
                    );
                  })()}

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
                      stroke="#ffffff"
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
                          <p>{getStrategicRecommendation(id, answers, baseData)}</p>

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
                                ? "Zum Online-Antrag"
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
            className="secondaryActionBtn calculatorAction"
            onClick={() => setCalculatorOverlay(true)}
          >
            Rechner öffnen
          </button>

          <button
            className="secondaryActionBtn pdfAction"
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
        className="tertiaryBtn"
        onClick={() => setStep("products")}
      >
        Tarifübersicht öffnen
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
    </div>
  );
}
