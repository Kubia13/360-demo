import React from "react";

export default function Input({
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
            <button type="button" onClick={increase}>+</button>
            <button type="button" onClick={decrease}>−</button>
          </div>
        )}
      </div>
    </div>
  );
}