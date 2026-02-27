
  /* ===== SCORE ANIMATION ===== */

import { useEffect, useRef } from "react";

export function useScoreAnimation({
  step,
  totalScore,
  hasValidScoreData,
  setAnimatedScore
}) {
  const animationRef = useRef(null);

  useEffect(() => {
    if (step !== "dashboard") return;

    if (!hasValidScoreData) {
      setAnimatedScore(0);
      return;
    }

    let start = null;
    const duration = 600; // Dauer der Animation in ms
    const startValue = 0;
    const endValue = totalScore;

    setAnimatedScore(0);

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;

      const percentage = Math.min(progress / duration, 1);
      const currentValue = Math.floor(
        startValue + (endValue - startValue) * percentage
      );

      setAnimatedScore(currentValue);

      if (percentage < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [step, totalScore, hasValidScoreData, setAnimatedScore]);
}