import React from "react";

export default function Checkbox({
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