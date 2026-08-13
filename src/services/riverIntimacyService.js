import { normalizeBOD, normalizeDO } from '../utils/waterQualityNormalizer.js';

/**
 * 🌊 7. 아직 실제 API가 없는 항목들의 하천별 데이터 공급 계층
 */

// 하천 냄새 - 황화수소(H₂S) 데이터 공급 서비스 (낮을수록 쾌적)
const H2S_MOCK_MAP = {
  '온천천': { value: 0.04, score: 92 },
  '수영강': { value: 0.06, score: 88 },
  '삼락천': { value: 0.12, score: 75 },
  '대천천': { value: 0.01, score: 98 },
  '동천': { value: 0.22, score: 62 },
  '낙동강': { value: 0.03, score: 95 },
  '가야천': { value: 0.10, score: 78 },
  '부전천': { value: 0.14, score: 72 },
  '전포천': { value: 0.08, score: 84 },
  '호계천': { value: 0.18, score: 66 },
};

// 산책로 정비 상태 데이터 공급 서비스
const TRAIL_MAINTENANCE_MAP = {
  '온천천': 88,
  '수영강': 85,
  '삼락천': 78,
  '대천천': 92,
  '동천': 72,
  '낙동강': 90,
  '가야천': 76,
  '부전천': 80,
  '전포천': 86,
  '호계천': 70,
};

// 야간안전 데이터 공급 서비스
const NIGHT_SAFETY_MAP = {
  '온천천': 90,
  '수영강': 92,
  '삼락천': 74,
  '대천천': 85,
  '동천': 68,
  '낙동강': 82,
  '가야천': 72,
  '부전천': 78,
  '전포천': 88,
  '호계천': 65,
};

/**
 * H₂S 냄새 데이터 조회 함수
 */
export function getH2SData(riverName) {
  return H2S_MOCK_MAP[riverName] || { value: 0.08, score: 80 };
}

/**
 * 산책로 정비 상태 점수 조회 함수
 */
export function getTrailMaintenanceScore(riverName) {
  return TRAIL_MAINTENANCE_MAP[riverName] ?? 80;
}

/**
 * 야간안전 점수 조회 함수
 */
export function getNightSafetyScore(riverName) {
  return NIGHT_SAFETY_MAP[riverName] ?? 80;
}

/**
 * 프로젝트 내부 API Route를 통해 부산 하천 수질 API 데이터 호출
 */
export async function fetchWaterQualityFromApi(riverName) {
  try {
    const res = await fetch(`/api/river-water-quality?riverName=${encodeURIComponent(riverName)}`);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `수질 데이터 응답 오류 (${res.status})`);
    }
    const json = await res.json();
    if (json.ok && json.data) {
      return json.data;
    } else {
      throw new Error(json.error || '수질 데이터를 찾을 수 없습니다.');
    }
  } catch (err) {
    console.warn(`[RiverIntimacyService] API fetch failed for ${riverName}:`, err.message);
    throw err;
  }
}

/**
 * 하천 친밀도 평가 통합 데이터 생성 및 가중치 점수 계산
 * 
 * 가중치:
 * - 하천 냄새(H₂S): 30% (0.30)
 * - 산책로 정비: 30% (0.30)
 * - 야간안전: 30% (0.30)
 * - BOD: 5% (0.05)
 * - DO: 5% (0.05)
 */
export function calculateRiverIntimacyData({ riverId, riverName, bodValue, doValue }) {
  const h2s = getH2SData(riverName);
  const trailScore = getTrailMaintenanceScore(riverName);
  const safetyScore = getNightSafetyScore(riverName);

  const bodScore = normalizeBOD(bodValue);
  const doScore = normalizeDO(doValue);

  // 가중치 합산 계산
  const weightedSum =
    h2s.score * 0.30 +
    trailScore * 0.30 +
    safetyScore * 0.30 +
    bodScore * 0.05 +
    doScore * 0.05;

  // 최종 점수 0~100 범위 보장 및 반올림 (소수점 1자리)
  const intimacyScore = Math.min(100, Math.max(0, Math.round(weightedSum * 10) / 10));

  return {
    riverId: riverId || riverName,
    riverName: riverName,
    h2s: {
      value: h2s.value,
      score: h2s.score
    },
    trailMaintenance: {
      score: trailScore
    },
    nightSafety: {
      score: safetyScore
    },
    waterQuality: {
      bod: {
        value: bodValue,
        score: bodScore
      },
      do: {
        value: doValue,
        score: doScore
      }
    },
    intimacyScore: intimacyScore
  };
}
