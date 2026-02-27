  /* ================= RESET OVERLAY ================= */

import React from "react";

export default function ResetOverlay({
  showResetConfirm,
  setShowResetConfirm,
  resetAll
}) {
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