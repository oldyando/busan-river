import { GoogleGenAI, Type } from '@google/genai';
import { RIVER_ANALYSIS_PROMPT } from './riverAIPrompt';
import {
  RIVERS_LIST,
  getStoredReviews,
  enrichReviewData
} from '../data/riverEvaluationData';

/**
 * 🤖 Gemini API 키 가져오기 헬퍼
 * Vite 환경변수 (VITE_GEMINI_API_KEY 또는 GEMINI_API_KEY) 우선 사용
 */
function getGeminiApiKey() {
  const viteKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY : null;
  if (viteKey && viteKey !== 'YOUR_GEMINI_API_KEY') {
    return viteKey;
  }
  return null;
}

/**
 * 🤖 부산 하천 시민 평가 데이터 Gemini AI 분석 함수
 * 
 * @param {string} [riverIdOrName] 분석할 하천 ID ('R001', 'R003') 또는 하천명 ('온천천'). null 시 전체 하천.
 * @param {Array} [customReviews] 커스텀 리뷰 배열 (미지정 시 LocalStorage 저장 데이터 사용)
 * @returns {Promise<Object>} 구조화된 AI 분석 결과 JSON
 */
export async function analyzeRiverWithAI(riverIdOrName = null, customReviews = null) {
  // 1. 분석 대상 시민 평가 데이터 준비
  const rawReviews = customReviews || getStoredReviews();
  const enrichedReviews = rawReviews.map(enrichReviewData);

  // 특정 하천 필터링 (하천 ID 또는 하천명 기준)
  let targetRiverName = '부산 전체 하천';
  let targetReviews = enrichedReviews;

  if (riverIdOrName) {
    const matchedRiver = RIVERS_LIST.find(
      (r) => r.id === riverIdOrName || r.name === riverIdOrName
    );
    if (matchedRiver) {
      targetRiverName = matchedRiver.name;
      targetReviews = enrichedReviews.filter((r) => r.riverId === matchedRiver.id);
    }
  }

  // 데이터가 없을 때 폴백 결과
  if (targetReviews.length === 0) {
    return {
      riverName: targetRiverName,
      summary: `[${targetRiverName}] 분석할 시민 평가 데이터가 아직 충분히 등록되지 않았습니다.`,
      strengths: ['데이터가 추가되면 시민들이 생각하는 하천의 장점이 자동 분석됩니다.'],
      mainIssues: [
        {
          issue: '시민 평가 참여 필요',
          reason: '현재 분석에 필요한 최소 시민 한줄평 데이터가 부족합니다.',
          priority: 'medium'
        }
      ],
      sentiment: { positive: 0, neutral: 100, negative: 0 },
      improvementSuggestions: ['시민 평가 참여를 유도하여 데이터를 먼저 수집하세요.']
    };
  }

  // 2. API Key 검증
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn('⚠️ Gemini API 키가 .env.local에 설정되지 않았습니다. (GEMINI_API_KEY 또는 VITE_GEMINI_API_KEY 확인)');
    return {
      riverName: targetRiverName,
      summary: `[${targetRiverName}] Gemini API Key가 .env.local에 바인딩되지 않아 시뮬레이션 결과를 반환합니다.`,
      strengths: [
        `${targetRiverName} 수변 산책로 및 친수 공간에 대한 시민 만족도가 높음`,
        '지역 소상공인 쿠폰 및 상생 이벤트에 대한 높은 호응'
      ],
      mainIssues: [
        {
          issue: '여름철 정체 구간 하천 악취 발생',
          reason: '시민 공감도(좋아요 152개)가 가장 높은 주요 건의 사항임',
          priority: 'high'
        },
        {
          issue: '야간 산책로 조명 보강 필요',
          reason: '보행 안전 및 우범 지대 해소를 위한 반복 의견 접수',
          priority: 'medium'
        }
      ],
      sentiment: { positive: 55, neutral: 25, negative: 20 },
      improvementSuggestions: [
        '하천 정체 구역 유량 확보 및 준설 작업 우선 배정',
        '야간 산책로 LED 경관 조명 확대 설치'
      ]
    };
  }

  // 3. Gemini API 프롬프트 데이터 생성
  const riverDataPayload = {
    targetRiver: targetRiverName,
    totalCount: targetReviews.length,
    reviews: targetReviews.map((r) => ({
      id: r.id,
      riverName: r.riverName,
      comment: r.comment,
      averageScore: r.averageScore,
      likes: r.likes,
      createdAt: r.createdAt,
      scores: r.scores
    }))
  };

  const finalPrompt = RIVER_ANALYSIS_PROMPT.replace(
    '{{RIVER_DATA}}',
    JSON.stringify(riverDataPayload, null, 2)
  );

  // 4. Google Gemini API 호출 (Structured Output Schema)
  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: finalPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riverName: { type: Type.STRING, description: '분석 대상 하천명' },
            summary: { type: Type.STRING, description: '전체 시민 평가 종합 요약' },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '시민들이 긍정적으로 평가하는 강점 목록'
            },
            mainIssues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  issue: { type: Type.STRING, description: '문제점 요약' },
                  reason: { type: Type.STRING, description: '문제 판단 근거 (공감수/점수)' },
                  priority: {
                    type: Type.STRING,
                    enum: ['high', 'medium', 'low'],
                    description: '개선 우선순위'
                  }
                },
                required: ['issue', 'reason', 'priority']
              },
              description: '시민들이 지적한 주요 문제점 및 개선 우선순위'
            },
            sentiment: {
              type: Type.OBJECT,
              properties: {
                positive: { type: Type.NUMBER, description: '긍정 비율 (%)' },
                neutral: { type: Type.NUMBER, description: '중립 비율 (%)' },
                negative: { type: Type.NUMBER, description: '부정 비율 (%)' }
              },
              required: ['positive', 'neutral', 'negative'],
              description: '시민 감정 분석 비율'
            },
            improvementSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '지자체 예산 투입 및 행정 개선 제언'
            }
          },
          required: [
            'riverName',
            'summary',
            'strengths',
            'mainIssues',
            'sentiment',
            'improvementSuggestions'
          ]
        }
      }
    });

    const responseText = response.text;
    const resultJson = JSON.parse(responseText);
    return resultJson;
  } catch (error) {
    console.error('❌ Gemini AI 분석 API 호출 중 오류 발생:', error);
    return {
      riverName: targetRiverName,
      summary: `[${targetRiverName}] AI 분석 처리 중 오류가 발생하여 기본 분석을 반환합니다.`,
      strengths: ['시민들의 자발적 환경 보호 참여 활발'],
      mainIssues: [
        {
          issue: 'API 통신 오류',
          reason: String(error.message || error),
          priority: 'high'
        }
      ],
      sentiment: { positive: 50, neutral: 30, negative: 20 },
      improvementSuggestions: ['네트워크 연결 및 Gemini API Key 설정을 확인하세요.']
    };
  }
}
