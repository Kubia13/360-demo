import React from "react";

export default function Header({ back, goBase }) {
  return (
    <div className="header">
      <img
        src="/logo.jpg"
        className="logo small"
        onClick={goBase}
        alt="Logo"
      />

      {back && (
        <button className="backBtn" onClick={back}>
          <span className="arrowIcon"></span>
        </button>
      )}
    </div>
  );
}