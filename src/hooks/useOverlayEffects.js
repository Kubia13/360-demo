import { useEffect } from "react";

export function useOverlayEffects({
  step,
  currentCategoryIndex,
  screenRef,
  legalOverlay,
  contactOverlay,
  showResetConfirm,
  actionOverlay,
  pdfOverlay,
  calculatorOverlay,
  pdfPreview
}) {
  /* ===== CATEGORY SCROLL FIX ===== */

  useEffect(() => {
    if (step !== "category") return;

    if (screenRef?.current) {
      screenRef.current.scrollTo({
        top: 0,
        behavior: "auto"
      });
    }
  }, [step, currentCategoryIndex, screenRef]);

  /* ===== OVERLAY SCROLL LOCK ===== */

  useEffect(() => {
    const overlayOpen =
      Boolean(legalOverlay) ||
      Boolean(contactOverlay) ||
      Boolean(showResetConfirm) ||
      Boolean(actionOverlay) ||
      Boolean(pdfOverlay) ||
      Boolean(calculatorOverlay) ||
      Boolean(pdfPreview);

    if (overlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    legalOverlay,
    contactOverlay,
    showResetConfirm,
    actionOverlay,
    pdfOverlay,
    calculatorOverlay,
    pdfPreview
  ]);

  /* ===== GLOBAL FOCUS SMOOTH SCROLL ===== */

  useEffect(() => {
    const handleFocus = (e) => {
      if (!e?.target) return;

      const el = e.target;
      if (typeof el.scrollIntoView !== "function") return;

      const overlayOpen =
        Boolean(legalOverlay) ||
        Boolean(contactOverlay) ||
        Boolean(showResetConfirm) ||
        Boolean(actionOverlay) ||
        Boolean(pdfOverlay) ||
        Boolean(calculatorOverlay) ||
        Boolean(pdfPreview);

      if (!overlayOpen) return;

      setTimeout(() => {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 120);
    };

    document.addEventListener("focusin", handleFocus);

    return () => {
      document.removeEventListener("focusin", handleFocus);
    };
  }, [
    legalOverlay,
    contactOverlay,
    showResetConfirm,
    actionOverlay,
    pdfOverlay,
    calculatorOverlay,
    pdfPreview
  ]);
}