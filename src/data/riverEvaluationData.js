/**
 * 🌊 부산하천 소통함 유동적 평가 데이터 구조 (riverEvaluationData.js)
 * 
 * 특정 평가 항목이나 하천을 코드에 고정하지 않고 데이터 기반으로 관리합니다.
 * 시민 한줄평, 평점, 좋아요(likes) 수 및 작성일자가 결합된 구조로 관리되며 AI 분석용 데이터를 축적합니다.
 */

// 1. 하천 유형 데이터 (동적 관리)
export const RIVER_TYPES = [
  { id: 'T001', name: '국가하천' },
  { id: 'T002', name: '지방하천' },
  { id: 'T003', name: '소하천' }
];

// 2. 부산 하천 목록 데이터 (동적 관리)
export const RIVERS_LIST = [
  { id: 'R001', name: '낙동강', riverTypeId: 'T001' },
  { id: 'R002', name: '수영강', riverTypeId: 'T002' },
  { id: 'R003', name: '온천천', riverTypeId: 'T002' },
  { id: 'R004', name: '동천', riverTypeId: 'T002' },
  { id: 'R005', name: '삼락천', riverTypeId: 'T002' },
  { id: 'R006', name: '대천천', riverTypeId: 'T002' },
  { id: 'R007', name: '가야천', riverTypeId: 'T003' },
  { id: 'R008', name: '부전천', riverTypeId: 'T003' },
  { id: 'R009', name: '전포천', riverTypeId: 'T003' },
  { id: 'R010', name: '호계천', riverTypeId: 'T003' }
];

// 3. 유동적 평가 항목 데이터 (동적 관리)
export const EVALUATION_CRITERIA = [
  {
    id: 'C001',
    name: '물의 깨끗함',
    description: '수질 및 냄새 상태',
    maxScore: 5,
    active: true
  },
  {
    id: 'C002',
    name: '둑과 바닥의 자연성',
    description: '인공화 방지 및 자연적 지형 보존',
    maxScore: 5,
    active: true
  },
  {
    id: 'C003',
    name: '함께 사는 생물',
    description: '어류, 조류, 식물 생태계 다양성',
    maxScore: 5,
    active: true
  },
  {
    id: 'C004',
    name: '산책 및 휴식환경',
    description: '친수성, 산책로, 조명 및 보행 편의',
    maxScore: 5,
    active: true
  }
];

// 4. 초기 시민 평가 데이터 (좋아요 수 포함 샘플 데이터 세트)
export const INITIAL_REVIEWS = [
  {
    id: 'REV-101',
    riverId: 'R003', // 온천천
    scores: [
      { criterionId: 'C001', score: 3 },
      { criterionId: 'C002', score: 2 },
      { criterionId: 'C003', score: 3 },
      { criterionId: 'C004', score: 5 }
    ],
    comment: '접근성과 산책 시설은 부산 최고지만 여름철 정체 구간 냄새 개선이 필요합니다.',
    likes: 152,
    createdAt: '2026-08-13 17:30'
  },
  {
    id: 'REV-102',
    riverId: 'R004', // 동천
    scores: [
      { criterionId: 'C001', score: 2 },
      { criterionId: 'C002', score: 2 },
      { criterionId: 'C003', score: 2 },
      { criterionId: 'C004', score: 3 }
    ],
    comment: '해수 도수관 작업 이후 수질이 다소 나아졌으나 지속적인 주거지 악취 관리와 예산 투입이 시급합니다.',
    likes: 98,
    createdAt: '2026-08-13 18:00'
  },
  {
    id: 'REV-103',
    riverId: 'R001', // 낙동강
    scores: [
      { criterionId: 'C001', score: 4 },
      { criterionId: 'C002', score: 4 },
      { criterionId: 'C003', score: 4 },
      { criterionId: 'C004', score: 5 }
    ],
    comment: '을숙도 수변 산책로가 아주 쾌적하고 강 폭이 넓어 가슴이 탁 트입니다.',
    likes: 67,
    createdAt: '2026-08-13 14:20'
  },
  {
    id: 'REV-104',
    riverId: 'R002', // 수영강
    scores: [
      { criterionId: 'C001', score: 4 },
      { criterionId: 'C002', score: 3 },
      { criterionId: 'C003', score: 4 },
      { criterionId: 'C004', score: 5 }
    ],
    comment: 'APEC 나루공원 야경과 수영강 보행교 조명이 정비되어 야간 산책하기 최고입니다.',
    likes: 45,
    createdAt: '2026-08-13 16:05'
  },
  {
    id: 'REV-105',
    riverId: 'R006', // 대천천
    scores: [
      { criterionId: 'C001', score: 5 },
      { criterionId: 'C002', score: 5 },
      { criterionId: 'C003', score: 4 },
      { criterionId: 'C004', score: 4 }
    ],
    comment: '계곡 물이 정말 맑고 1급수 생태계가 잘 살아있습니다. 피서철 관리가 잘되면 좋겠어요.',
    likes: 21,
    createdAt: '2026-08-13 18:45'
  },
  {
    id: 'REV-106',
    riverId: 'R005', // 삼락천
    scores: [
      { criterionId: 'C001', score: 3 },
      { criterionId: 'C002', score: 4 },
      { criterionId: 'C003', score: 4 },
      { criterionId: 'C004', score: 3 }
    ],
    comment: '자전거 타기는 좋은데 자연적인 습지 느낌을 지속적으로 유지해주면 좋겠습니다.',
    likes: 15,
    createdAt: '2026-08-13 19:10'
  }
];

// LocalStorage 저장/로드 헬퍼
const REVIEWS_STORAGE_KEY = 'busan_river_evaluations_v2';
const LIKED_STORAGE_KEY = 'busan_river_liked_reviews_v1';

export function getStoredReviews() {
  try {
    const data = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }
  return INITIAL_REVIEWS;
}

export function saveReviews(reviews) {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export function getLikedReviewIds() {
  try {
    const data = localStorage.getItem(LIKED_STORAGE_KEY);
    if (data) {
      return new Set(JSON.parse(data));
    }
  } catch (e) {
    console.error('Liked IDs read error:', e);
  }
  return new Set();
}

export function saveLikedReviewIds(likedSet) {
  try {
    localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(Array.from(likedSet)));
  } catch (e) {
    console.error('Liked IDs write error:', e);
  }
}

/**
 * 개별 리뷰 객체를 AI 축적용 완전체 구조로 포맷팅
 */
export function enrichReviewData(rev) {
  const riverObj = RIVERS_LIST.find((r) => r.id === rev.riverId);
  const riverName = riverObj ? riverObj.name : '부산 하천';

  // 개별 리뷰 평균 점수 계산
  const validScores = (rev.scores || []).filter((s) => s.score > 0);
  const sum = validScores.reduce((acc, s) => acc + s.score, 0);
  const averageScore = validScores.length > 0 ? Number((sum / validScores.length).toFixed(1)) : 5.0;

  // scores 맵핑 (AI 축적용)
  const scoresMap = {};
  (rev.scores || []).forEach((s) => {
    scoresMap[s.criterionId] = s.score;
  });

  return {
    id: rev.id,
    riverId: rev.riverId,
    riverName: riverName,
    comment: rev.comment,
    averageScore: averageScore,
    likes: rev.likes || 0,
    createdAt: rev.createdAt || new Date().toISOString().substring(0, 10),
    scores: scoresMap,
    rawScores: rev.scores
  };
}

/**
 * 특정 하천의 정밀 통계 계산 함수
 */
export function calculateRiverStats(riverId, reviews = [], criteria = EVALUATION_CRITERIA) {
  const activeCriteria = criteria.filter((c) => c.active);
  const riverReviews = reviews.filter((r) => r.riverId === riverId);

  const totalCount = riverReviews.length;

  if (totalCount === 0) {
    const emptyAverages = {};
    activeCriteria.forEach((c) => {
      emptyAverages[c.id] = 0;
    });
    return {
      totalCount: 0,
      criterionAverages: emptyAverages,
      overallAverage: 0,
      reviews: []
    };
  }

  const scoreSums = {};
  const scoreCounts = {};

  activeCriteria.forEach((c) => {
    scoreSums[c.id] = 0;
    scoreCounts[c.id] = 0;
  });

  riverReviews.forEach((rev) => {
    (rev.scores || []).forEach((s) => {
      if (scoreSums[s.criterionId] !== undefined) {
        scoreSums[s.criterionId] += s.score;
        scoreCounts[s.criterionId] += 1;
      }
    });
  });

  const criterionAverages = {};
  let overallSum = 0;
  let activeCriterionCount = 0;

  activeCriteria.forEach((c) => {
    const count = scoreCounts[c.id] || 0;
    const avg = count > 0 ? Number((scoreSums[c.id] / count).toFixed(1)) : 0;
    criterionAverages[c.id] = avg;

    if (avg > 0) {
      overallSum += avg;
      activeCriterionCount += 1;
    }
  });

  const overallAverage =
    activeCriterionCount > 0
      ? Number((overallSum / activeCriterionCount).toFixed(1))
      : 0;

  return {
    totalCount,
    criterionAverages,
    overallAverage,
    reviews: riverReviews.map(enrichReviewData)
  };
}

/**
 * 부산 전체 하천 비교 매트릭스 데이터 생성 함수
 */
export function calculateComparisonMatrix(rivers = RIVERS_LIST, reviews = [], criteria = EVALUATION_CRITERIA) {
  return rivers.map((river) => {
    const stats = calculateRiverStats(river.id, reviews, criteria);
    const riverType = RIVER_TYPES.find((t) => t.id === river.riverTypeId);

    return {
      id: river.id,
      name: river.name,
      typeName: riverType ? riverType.name : '하천',
      totalCount: stats.totalCount,
      overallAverage: stats.overallAverage,
      criterionAverages: stats.criterionAverages
    };
  });
}
