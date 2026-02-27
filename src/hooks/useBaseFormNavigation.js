import { useMemo, useCallback, createRef } from "react";

export function useBaseFormNavigation() {

  /* ================= BASE FORM REFS ================= */

  const baseFormRefs = useMemo(() => ({
    anrede: createRef(),
    vorname: createRef(),
    nachname: createRef(),
    alter: createRef(),
    beziehungsstatus: createRef(),
    beruf: createRef(),
    krankenversicherung: createRef(),
    gehalt: createRef(),
    kinder: createRef(),
    kinderKrankenversicherung: createRef(),
    kinderAnzahl: createRef(),
    tiere: createRef(),
    wohnen: createRef(),
    kfz: createRef(),
    kfzAnzahl: createRef(),
  }), []);

  /* ================= BASE INPUT ORDER ================= */

  const baseInputOrder = useMemo(() => [
    baseFormRefs.anrede,
    baseFormRefs.vorname,
    baseFormRefs.nachname,
    baseFormRefs.alter,
    baseFormRefs.beziehungsstatus,
    baseFormRefs.beruf,
    baseFormRefs.krankenversicherung,
    baseFormRefs.gehalt,
    baseFormRefs.kinder,
    baseFormRefs.kinderKrankenversicherung,
    baseFormRefs.kinderAnzahl,
    baseFormRefs.tiere,
    baseFormRefs.wohnen,
    baseFormRefs.kfz,
    baseFormRefs.kfzAnzahl,
  ], [baseFormRefs]);

  /* ================= FOCUS LOGIC ================= */

const focusNext = useCallback((currentRef) => {
  const index = baseInputOrder.indexOf(currentRef);
  if (index === -1) return;

  for (let i = index + 1; i < baseInputOrder.length; i++) {
    const nextRef = baseInputOrder[i];

    if (nextRef?.current && typeof nextRef.current.focus === "function") {
      const el = nextRef.current;

      el.focus();

      // 🔥 Smooth scroll nur wenn nötig
      setTimeout(() => {
        if (typeof el.scrollIntoView === "function") {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, 50);

      break;
    }
  }
}, [baseInputOrder]);

  return {
    baseFormRefs,
    focusNext
  };
}