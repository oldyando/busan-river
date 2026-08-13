import React, { useState, useEffect } from 'react';
import RiverEvaluationForm from './RiverEvaluationForm';
import RiverEvaluationResult from './RiverEvaluationResult';
import RiverComparisonTable from './RiverComparisonTable';
import CitizenReviewFeed from './CitizenReviewFeed';
import {
  RIVERS_LIST,
  getStoredReviews,
  saveReviews,
  getLikedReviewIds,
  saveLikedReviewIds
} from '../../data/riverEvaluationData';

/**
 * 📝 탭 4: 부산하천 소통함 시민 평가 & 공감 피드
 * (의원실 피드는 완전히 제거되었으며, 좋아요 기반 시민 한줄평 피드로 대체되었습니다)
 */
function CommunityBoardTab({ selectedRiver }) {
  const [subTab, setSubTab] = useState('result'); // 'result' | 'form' | 'comparison'
  const [reviewsList, setReviewsList] = useState([]);
  const [likedReviewIds, setLikedReviewIds] = useState(new Set());
  const [currentRiverId, setCurrentRiverId] = useState('R001');

  useEffect(() => {
    const loadedReviews = getStoredReviews();
    const loadedLikes = getLikedReviewIds();
    setReviewsList(loadedReviews);
    setLikedReviewIds(loadedLikes);
  }, []);

  // 외부 selectedRiver 변경 시 하천 ID 맵핑
  useEffect(() => {
    if (selectedRiver) {
      const match = RIVERS_LIST.find((r) => r.name === selectedRiver);
      if (match) {
        setCurrentRiverId(match.id);
      }
    }
  }, [selectedRiver]);

  // 새로운 시민 평가 제출 처리
  const handleSubmitReview = (newReview) => {
    const updated = [newReview, ...reviewsList];
    setReviewsList(updated);
    saveReviews(updated);
    setSubTab('result'); // 제출 후 평가 결과 탭으로 이동
  };

  // 좋아요(❤️) 토글 처리 (중복 방지 및 수치 갱신)
  const handleToggleLike = (reviewId) => {
    const nextLiked = new Set(likedReviewIds);
    let isAddingLike = false;

    if (nextLiked.has(reviewId)) {
      nextLiked.delete(reviewId);
      isAddingLike = false;
    } else {
      nextLiked.add(reviewId);
      isAddingLike = true;
    }

    const updatedReviews = reviewsList.map((rev) => {
      if (rev.id === reviewId) {
        const currentLikes = rev.likes || 0;
        const newLikes = isAddingLike ? currentLikes + 1 : Math.max(0, currentLikes - 1);
        return { ...rev, likes: newLikes };
      }
      return rev;
    });

    setLikedReviewIds(nextLiked);
    setReviewsList(updatedReviews);

    saveLikedReviewIds(nextLiked);
    saveReviews(updatedReviews);
  };

  const handleSelectRiverId = (riverId) => {
    setCurrentRiverId(riverId);
  };

  return (
    <div className="tab-panel">
      {/* 1. 타이틀 및 안내 혜택 영역 */}
      <div className="board-header-section">
        <h3>📝 부산하천 소통함 시민 참여 피드</h3>
        <div className="office-box">
          🔒 <strong>부산 하천 빅데이터 소통 플랫폼</strong>
          <p>
            시민 여러분의 개별 평가와 공감(좋아요) 데이터는 안전하게 보존되어, 향후 AI 기반 하천 문제점 종합 분석 및 예산 투입 우선순위 결정의 핵심 자료로 축적됩니다.
          </p>
        </div>
      </div>

      {/* 2. 소통함 서브 세그먼트 탭 메뉴 */}
      <div className="eval-sub-nav">
        <button
          className={`eval-nav-btn ${subTab === 'form' ? 'active' : ''}`}
          onClick={() => setSubTab('form')}
        >
          ✍️ 하천 평가하기
        </button>
        <button
          className={`eval-nav-btn ${subTab === 'result' ? 'active' : ''}`}
          onClick={() => setSubTab('result')}
        >
          📊 하천별 평가 결과
        </button>
        <button
          className={`eval-nav-btn ${subTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setSubTab('comparison')}
        >
          ⚖️ 부산 하천 전체 비교
        </button>
      </div>

      {/* 3. 세그먼트별 상단 주요 영역 */}
      {subTab === 'form' && (
        <RiverEvaluationForm
          selectedRiverId={currentRiverId}
          onSelectRiver={handleSelectRiverId}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {subTab === 'result' && (
        <RiverEvaluationResult
          selectedRiverId={currentRiverId}
          reviewsList={reviewsList}
          onSelectRiver={handleSelectRiverId}
        />
      )}

      {subTab === 'comparison' && (
        <RiverComparisonTable
          reviewsList={reviewsList}
          onSelectRiver={(riverId) => {
            setCurrentRiverId(riverId);
            setSubTab('result');
          }}
        />
      )}

      {/* 4. 의원실 피드를 완전히 대체하는 확대된 시민 실시간 한줄평 피드 */}
      <div className="citizen-feed-section">
        <CitizenReviewFeed
          reviewsList={reviewsList}
          onToggleLike={handleToggleLike}
          likedReviewIds={likedReviewIds}
        />
      </div>
    </div>
  );
}

export default CommunityBoardTab;
