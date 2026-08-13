/**
 * 🌊 탭 3: 시민 하천 사진 인증 전용 데이터 및 로컬 저장소 관리 (riverPhotoVerificationData.js)
 * 
 * ⚠️ 중요: 이 데이터는 탭 4 및 Gemini AI 분석 데이터와 완전히 독립적으로 운영됩니다.
 */

// 1. 초기 시민 인증 사진 샘플 데이터셋
export const INITIAL_PHOTOS = [
  {
    id: 'PHOTO-001',
    riverName: '온천천',
    location: '부산 동래구 온천천 카페거리 수변길',
    imageUrl: '/images/rivers/oncheoncheon.jpg',
    likes: 128,
    dislikes: 4,
    createdAt: '2026-08-13 15:30'
  },
  {
    id: 'PHOTO-002',
    riverName: '수영강',
    location: '부산 수영구 APEC 나루공원 보행교',
    imageUrl: '/images/rivers/suyeonggang.jpg',
    likes: 96,
    dislikes: 2,
    createdAt: '2026-08-13 16:15'
  },
  {
    id: 'PHOTO-003',
    riverName: '낙동강',
    location: '부산 사상구 삼락생태공원 강변',
    imageUrl: '/images/rivers/samnakcheon.jpg',
    likes: 74,
    dislikes: 1,
    createdAt: '2026-08-13 17:40'
  },
  {
    id: 'PHOTO-004',
    riverName: '대천천',
    location: '부산 북구 화명동 대천천 계곡',
    imageUrl: '/images/rivers/daecheoncheon.jpg',
    likes: 42,
    dislikes: 0,
    createdAt: '2026-08-13 18:20'
  }
];

const PHOTOS_STORAGE_KEY = 'busan_river_photo_verifications_v1';
const REACTIONS_STORAGE_KEY = 'busan_river_photo_reactions_v1';

/**
 * 저장된 인증 사진 목록 가져오기
 */
export function getStoredPhotos() {
  try {
    const data = localStorage.getItem(PHOTOS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('LocalStorage read photos error:', e);
  }
  return INITIAL_PHOTOS;
}

/**
 * 인증 사진 목록 저장하기
 */
export function savePhotos(photos) {
  try {
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos));
  } catch (e) {
    console.error('LocalStorage save photos error:', e);
  }
}

/**
 * 사용자의 사진별 좋아요/싫어요 반응 상태 가져오기 ({ photoId: 'like' | 'dislike' })
 */
export function getUserPhotoReactions() {
  try {
    const data = localStorage.getItem(REACTIONS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('LocalStorage read reactions error:', e);
  }
  return {};
}

/**
 * 사용자의 사진 반응 상태 저장하기
 */
export function saveUserPhotoReactions(reactions) {
  try {
    localStorage.setItem(REACTIONS_STORAGE_KEY, JSON.stringify(reactions));
  } catch (e) {
    console.error('LocalStorage save reactions error:', e);
  }
}

/**
 * 좋아요(👍) 및 싫어요(👎) 상호 배타적 반응 토글 헬퍼
 */
export function togglePhotoReaction(photoId, reactionType, photos, currentReactions) {
  const currentReaction = currentReactions[photoId]; // 'like' | 'dislike' | undefined
  const updatedReactions = { ...currentReactions };

  let likeDelta = 0;
  let dislikeDelta = 0;

  if (currentReaction === reactionType) {
    // 1. 이미 같은 반응을 누른 경우 -> 취소
    delete updatedReactions[photoId];
    if (reactionType === 'like') likeDelta = -1;
    if (reactionType === 'dislike') dislikeDelta = -1;
  } else {
    // 2. 새로운 반응이거나 다른 반응으로 전환하는 경우
    if (currentReaction === 'like') likeDelta = -1;
    if (currentReaction === 'dislike') dislikeDelta = -1;

    if (reactionType === 'like') likeDelta += 1;
    if (reactionType === 'dislike') dislikeDelta += 1;

    updatedReactions[photoId] = reactionType;
  }

  const updatedPhotos = photos.map((p) => {
    if (p.id === photoId) {
      return {
        ...p,
        likes: Math.max(0, p.likes + likeDelta),
        dislikes: Math.max(0, p.dislikes + dislikeDelta)
      };
    }
    return p;
  });

  return {
    updatedPhotos,
    updatedReactions
  };
}
