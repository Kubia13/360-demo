import { resetAppState } from "../logic/resetAppState";
import { scrollToTop } from "../utils/scrollHelpers";

export function useAppReset({
  screenRef,
  setStep,
  setAnswers,
  setBaseData,
  setCurrentCategoryIndex,
  setAnimatedScore,
  setExpandedCategory,
  setLegalOverlay,
  setDisclaimerAccepted,
  setPdfData
}) {
  return () =>
    resetAppState({
      setStep,
      setAnswers,
      setBaseData,
      setCurrentCategoryIndex,
      setAnimatedScore,
      setExpandedCategory,
      setLegalOverlay,
      setDisclaimerAccepted,
      setPdfData,
      scrollToTop: () => scrollToTop(screenRef)
    });
}