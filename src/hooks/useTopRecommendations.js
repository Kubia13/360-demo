import { useMemo } from "react";

export function useTopRecommendations({
    step,
    baseData,
    answers,
    QUESTIONS,
    CORE_PRODUCTS,
    PRIORITY_MAP,
    getScore,
    getStrategicRecommendation,
    categoryScores
}) {

    /* ================= TOP 3 HANDLUNGSFELDER ================= */

    return useMemo(() => {

        if (step !== "dashboard") return [];

        const EXCLUDED_FROM_TOP3 = [
            "elementar",
            "schutzbrief"
        ];

        const hatKinder = baseData.kinder === "Ja";
        const verheiratet = baseData.beziehungsstatus === "Verheiratet";
        const hatHaus = baseData.wohnen === "Eigentum Haus";
        const income = Number(baseData.gehalt);
        const age = Number(baseData.alter);

        const existenzProdukte = [
            "bu", "du", "haftpflicht",
            "risiko_lv", "ruecklagen"
        ];

        const kinderProdukte = [
            "kinder_unfall",
            "kinder_vorsorge",
            "kinder_krankenzusatz"
        ];

        const komfortProdukte = [
            "kasko",
            "krankenzusatz",
            "hausrat"
        ];

        const allRecommendations = Object.keys(QUESTIONS)
            .filter((id) => {

                if (!CORE_PRODUCTS.includes(id)) return false;
                if (EXCLUDED_FROM_TOP3.includes(id)) return false;

                const q = QUESTIONS[id];
                if (q.condition && !q.condition(baseData)) return false;

                const score = getScore(id, answers, baseData);
                if (score === null) return false;
                if (score >= 100) return false;

                // Vollkasko nie empfehlen
                if (id === "kasko" && answers[id] === "vollkasko") return false;

                const text = getStrategicRecommendation(id, answers, baseData);
                if (!text) return false;

                /* ===== HARTE EXISTENZ-SPERRE ===== */

                const existenzScore = categoryScores["existenz"];

                const komfortProdukte = [
                    "kasko",
                    "krankenzusatz",
                    "hausrat"
                ];

                if (
                    existenzScore !== null &&
                    existenzScore < 50 &&
                    komfortProdukte.includes(id)
                ) {
                    return false;
                }

                return true;
            })

            .map((id) => {

                let dynamicPriority = PRIORITY_MAP[id] || 1;

                const score = getScore(id, answers, baseData);
                const text = getStrategicRecommendation(id, answers, baseData);

                if (score === null || score === undefined) return null;
                if (!text) return null;

                const existenzScore = categoryScores["existenz"];

                const hatBU = answers.bu === "ja" || answers.du === "ja";
                const hatRuecklagen = answers.ruecklagen === "ja";
                const hatHaftpflicht = answers.haftpflicht === "ja";
                const hatRisikoLV = answers.risiko_lv === "ja";

                const hatHaus = baseData.wohnen === "Eigentum Haus";
                const hatFamilie =
                    baseData.beziehungsstatus === "Verheiratet" ||
                    baseData.kinder === "Ja";

                /* ================= SCORE-SCHWEREGRAD ================= */

                if (score <= 20) {
                    dynamicPriority += 2;
                } else if (score <= 40) {
                    dynamicPriority += 1;
                }

                /* ================= EXISTENZ VOR KOMFORT (dein Original) ================= */

                if (existenzProdukte.includes(id)) {
                    dynamicPriority += 2;
                }

                /* ================= HARTE EXISTENZ-LOGIK ================= */

                if (!hatBU && !hatRuecklagen) {
                    if (["bu", "du", "ruecklagen"].includes(id)) {
                        dynamicPriority += 4;
                    }
                }

                /* ================= HAFTPFLICHT KRITISCH ================= */

                if (!hatHaftpflicht && id === "haftpflicht") {
                    dynamicPriority += 4;
                }

                /* ================= EXISTENZ SCORE < 40 ================= */

                if (existenzScore !== null && existenzScore < 40) {
                    if (["bu", "du", "ruecklagen", "risiko_lv"].includes(id)) {
                        dynamicPriority += 2;
                    }
                }

                /* ================= FAMILIEN-BOOST (dein Original) ================= */

                if (hatKinder || verheiratet) {

                    if (["bu", "du", "risiko_lv", "ruecklagen"].includes(id)) {
                        dynamicPriority += 2;
                    }

                    if (kinderProdukte.includes(id)) {
                        dynamicPriority += 1.5;
                    }
                }

                /* ================= IMMOBILIEN-BOOST (verstärkt) ================= */

                if (hatHaus) {

                    if (["gebaeude", "risiko_lv", "ruecklagen"].includes(id)) {
                        dynamicPriority += 2;
                    }

                    if (!hatRisikoLV && id === "risiko_lv") {
                        dynamicPriority += hatFamilie ? 3 : 2;
                    }
                }

                /* ================= EINKOMMENS-HEBEL (dein Original) ================= */

                if (income >= 4000) {

                    if (["bu", "du", "private_rente", "ruecklagen"].includes(id)) {
                        dynamicPriority += 1;
                    }
                }

                /* ================= ALTER-LOGIK (dein Original) ================= */

                if (age < 30) {

                    if (["bu", "bav", "private_rente"].includes(id)) {
                        dynamicPriority += 1;
                    }
                }

                if (age >= 45) {

                    if (["pflege", "private_rente"].includes(id)) {
                        dynamicPriority += 1;
                    }
                }

                /* ================= KOMFORT DECKEL ================= */

                if (komfortProdukte.includes(id)) {
                    dynamicPriority = Math.min(dynamicPriority, 4);
                }

                return {
                    id,
                    text,
                    priority: dynamicPriority,
                    score
                };

            })
            .filter(Boolean)
            .sort((a, b) => {

                if (b.priority !== a.priority) {
                    return b.priority - a.priority;
                }

                return a.score - b.score;
            });

        return allRecommendations.slice(0, 3);

    }, [answers, baseData, step, categoryScores]);
}