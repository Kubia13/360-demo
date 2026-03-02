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

    // 1️⃣ Wenn screenRef existiert und scrollbar ist
    if (screenRef?.current) {
      screenRef.current.scrollTop = 0;
    }

    // 2️⃣ Immer zusätzlich window scrollen (Mobile Fallback)
    window.scrollTo({
      top: 0,
      behavior
    });

    // 3️⃣ iOS Safety (manchmal nötig)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  if (isInputFocused) {
    setTimeout(() => {
      requestAnimationFrame(() => {
        performScroll();
      });
    }, 250); // etwas mehr Delay für Mobile
  } else {
    performScroll();
  }
};