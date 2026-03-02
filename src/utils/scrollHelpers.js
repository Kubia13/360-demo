export const scrollToTop = (screenRef, behavior = "auto") => {
  if (typeof window === "undefined") return;

  const active = document.activeElement;
  const isInputFocused =
    active &&
    (active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.isContentEditable);

  if (isInputFocused) {
    active.blur();
  }

  const performScroll = () => {
    if (screenRef?.current) {
      screenRef.current.scrollTo({ top: 0, behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  if (isInputFocused) {
    // Warten bis Keyboard wirklich weg ist
    setTimeout(() => {
      requestAnimationFrame(() => {
        performScroll();
      });
    }, 180); // etwas mehr als vorher
  } else {
    performScroll();
  }
};