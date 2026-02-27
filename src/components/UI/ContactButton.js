import React from "react";

export default function ContactButton({ onReset, onContact }) {
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