  /* ================= ACTION OVERLAY ================= */

import React from "react";

export default function ActionOverlay({
  actionOverlay,
  setActionOverlay,
  setContactOverlay,
  ACTION_MAP,
  QUESTIONS
}) {
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