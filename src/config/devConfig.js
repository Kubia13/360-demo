/* ================= DEV TOOL ================= */

export const DEV_BYPASS =
  new URLSearchParams(window.location.search).get("dev") === "1";