/**
 * 🌊 수질 측정값 (BOD, DO) 0~100점 친밀도 점수 정규화 모듈
 * 
 * 대한민국 환경부 하천 수질 등급 기준을 반영하여 0~100점으로 정규화합니다.
 * - BOD (생물학적 산소요구량): 낮은 값일수록 높은 점수
 * - DO (용존산소량): 높은 값일수록 높은 점수
 */

// 1. BOD 점수 정규화 기준 설정값 (mg/L 기준)
export const BOD_SCORE_CONFIG = [
  { max: 1.0, baseScore: 100, minScore: 90 }, // 매우좋음 (Ia)
  { max: 2.0, baseScore: 89, minScore: 80 },  // 좋음 (Ib)
  { max: 3.0, baseScore: 79, minScore: 70 },  // 약간좋음 (II)
  { max: 5.0, baseScore: 69, minScore: 50 },  // 보통 (III)
  { max: 8.0, baseScore: 49, minScore: 30 },  // 약간나쁨 (IV)
  { max: 10.0, baseScore: 29, minScore: 10 }, // 나쁨 (V)
];

// 2. DO 점수 정규화 기준 설정값 (mg/L 기준)
export const DO_SCORE_CONFIG = [
  { min: 7.5, maxScore: 100, baseScore: 90 }, // 매우좋음/좋음 (Ia, Ib)
  { min: 5.0, maxScore: 89, baseScore: 70 },  // 약간좋음/보통 (II, III)
  { min: 2.0, maxScore: 69, baseScore: 30 },  // 약간나쁨/나쁨 (IV, V)
];

/**
 * BOD 측정치(mg/L)를 0~100점 점수로 정규화
 * @param {number} bod - BOD 수치
 * @returns {number} 0~100 점수
 */
export function normalizeBOD(bod) {
  if (bod === null || bod === undefined || isNaN(bod)) return 0;
  const num = Number(bod);
  if (num <= 0) return 100;

  if (num <= 1.0) {
    // 0 ~ 1.0 -> 100 ~ 90
    return Math.round(100 - num * 10);
  } else if (num <= 2.0) {
    // 1.0 ~ 2.0 -> 90 ~ 80
    return Math.round(90 - (num - 1.0) * 10);
  } else if (num <= 3.0) {
    // 2.0 ~ 3.0 -> 80 ~ 70
    return Math.round(80 - (num - 2.0) * 10);
  } else if (num <= 5.0) {
    // 3.0 ~ 5.0 -> 70 ~ 50
    return Math.round(70 - ((num - 3.0) / 2.0) * 20);
  } else if (num <= 8.0) {
    // 5.0 ~ 8.0 -> 50 ~ 30
    return Math.round(50 - ((num - 5.0) / 3.0) * 20);
  } else if (num <= 10.0) {
    // 8.0 ~ 10.0 -> 30 ~ 10
    return Math.round(30 - ((num - 8.0) / 2.0) * 20);
  } else {
    // 10.0 초과 -> 10 ~ 0
    return Math.max(0, Math.round(10 - (num - 10.0)));
  }
}

/**
 * DO 측정치(mg/L)를 0~100점 점수로 정규화
 * @param {number} doVal - DO 수치
 * @returns {number} 0~100 점수
 */
export function normalizeDO(doVal) {
  if (doVal === null || doVal === undefined || isNaN(doVal)) return 0;
  const num = Number(doVal);

  if (num >= 10.0) {
    return 100;
  } else if (num >= 7.5) {
    // 7.5 ~ 10.0 -> 90 ~ 100
    return Math.round(90 + ((num - 7.5) / 2.5) * 10);
  } else if (num >= 5.0) {
    // 5.0 ~ 7.5 -> 70 ~ 89
    return Math.round(70 + ((num - 5.0) / 2.5) * 19);
  } else if (num >= 2.0) {
    // 2.0 ~ 5.0 -> 30 ~ 69
    return Math.round(30 + ((num - 2.0) / 3.0) * 39);
  } else {
    // 2.0 미만 -> 0 ~ 29
    return Math.max(0, Math.round((num / 2.0) * 29));
  }
}
