import { useMemo, useCallback, createRef } from "react";

export function usePdfFormNavigation() {

  const pdfFormRefs = useMemo(() => ({
    adresse: createRef(),
    plz: createRef(),
    ort: createRef(),
    geburtsdatum: createRef(),
    email: createRef(),
    telefon: createRef(),
    handy: createRef(),
    buEmpfehlung: createRef(),
    rentenluecke: createRef(),
    ktgEmpfehlung: createRef()
  }), []);

  const inputOrder = useMemo(() => [
    pdfFormRefs.adresse,
    pdfFormRefs.plz,
    pdfFormRefs.ort,
    pdfFormRefs.geburtsdatum,
    pdfFormRefs.email,
    pdfFormRefs.telefon,
    pdfFormRefs.handy,
    pdfFormRefs.buEmpfehlung,
    pdfFormRefs.rentenluecke,
    pdfFormRefs.ktgEmpfehlung
  ], [pdfFormRefs]);

  const focusNext = useCallback((currentRef) => {
    const index = inputOrder.indexOf(currentRef);
    if (index === -1) return;

    for (let i = index + 1; i < inputOrder.length; i++) {
      const nextRef = inputOrder[i];
      if (nextRef?.current?.focus) {
        nextRef.current.focus();
        nextRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        break;
      }
    }
  }, [inputOrder]);

  return {
    pdfFormRefs,
    focusNext
  };
}