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

    const body = document.body;
    const html = document.documentElement;

    // helpers for cleanup
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const prevWidth = body.style.width;

    const prevHtmlOverscroll = html.style.overscrollBehaviorY;

    if (overlayOpen) {
      // Prevent layout shift when scrollbar disappears (desktop)
      const scrollBarWidth = window.innerWidth - html.clientWidth;
      if (scrollBarWidth > 0) {
        body.style.paddingRight = `${scrollBarWidth}px`;
      }

      // Lock scroll (works reliably incl. iOS when combined with fixed positioning)
      const scrollY = window.scrollY || window.pageYOffset || 0;

      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.width = "100%";

      // Reduce scroll chaining / overscroll
      html.style.overscrollBehaviorY = "none";
    } else {
      // restore
      const top = body.style.top;
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      body.style.position = prevPosition;
      body.style.top = prevTop;
      body.style.width = prevWidth;

      html.style.overscrollBehaviorY = prevHtmlOverscroll;

      // restore scroll position after fixed lock
      const y = top ? Math.abs(parseInt(top, 10)) : 0;
      if (y) window.scrollTo(0, y);
    }

    return () => {
      // hard cleanup
      const top = body.style.top;

      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      body.style.position = prevPosition;
      body.style.top = prevTop;
      body.style.width = prevWidth;

      html.style.overscrollBehaviorY = prevHtmlOverscroll;

      const y = top ? Math.abs(parseInt(top, 10)) : 0;
      if (overlayOpen && y) window.scrollTo(0, y);
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