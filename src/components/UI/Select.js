import React from "react";

export default function Select({
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