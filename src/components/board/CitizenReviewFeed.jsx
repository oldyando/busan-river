import React from 'react';
import { EVALUATION_CRITERIA, enrichReviewData } from '../../data/riverEvaluationData';

/**
 * 💬 CitizenReviewFeed 컴포넌트
 * 시민들이 작성한 하천별 한줄평, 평균 점수, 좋아요(❤️) 수 및 작성일자를 피드 형태로 보여주며,
 * 1순위: 좋아요 수(공감 수), 2순위: 최신순으로 자동 정렬하여 상단에 노출합니다.
 */
function CitizenReviewFeed({ reviewsList = [], onToggleLike, likedReviewIds = new Set(), filterRiverId = null }) {
  // 1. 리뷰 데이터 확장 (하천명, 평균 점수 등 계산)
  const enrichedReviews = reviewsList.map(enrichReviewData);

  // 2. 하천 필터링 (선택된 하천이 있으면 해당 하천만, 없으면 전체 하천)
  const filtered = filterRiverId
    ? enrichedReviews.filter((r) => r.riverId === filterRiverId)
    : enrichedReviews;

  // 3. 1순위: 좋아요 수 내림차순, 2순위: 최신 작성일자 내림차순 정렬
  const sortedReviews = [...filtered].sort((a, b) => {
    if (b.likes !== a.likes) {
      return b.likes - a.likes; // 좋아요 많은 순
    }
    return new Date(b.createdAt) - new Date(a.createdAt); // 최신순
  });

  return (
    <div className="citizen-feed-container">
      <div className="citizen-feed-header">
        <h4>💬 시민 실시간 한줄평 ({sortedReviews.length}개)</h4>
        <span className="feed-sort-tip">🔥 공감(좋아요) 순 정렬 중</span>
      </div>

      {sortedReviews.length === 0 ? (
        <div className="empty-reviews-box">
          <span>🌊 아직 등록된 시민 한줄평이 없습니다. 첫 번째 시민 의견을 남겨보세요!</span>
        </div>
      ) : (
        <div className="citizen-feed-list">
          {sortedReviews.map((rev) => {
            const isLiked = likedReviewIds.has(rev.id);

            return (
              <div className="citizen-review-card" key={rev.id}>
                {/* 상단 뱃지: 하천명 */}
                <div className="card-top-bar">
                  <div className="river-name-chip">
                    🌊 <strong>{rev.riverName}</strong>
                  </div>
                  <div className="review-meta-date">{rev.createdAt}</div>
                </div>

                {/* 시민 한줄평 본문 */}
                <p className="citizen-comment-text">"{rev.comment}"</p>

                {/* 하단 바: 별점 평균, 좋아요 버튼, 작성일 */}
                <div className="card-bottom-bar">
                  <div className="score-summary-tag">
                    <span className="star-icon">⭐</span>
                    <span className="score-value">{rev.averageScore.toFixed(1)}</span>
                    <span className="score-max">/ 5.0</span>
                  </div>

                  {/* 세부 항목 점수 태그 */}
                  <div className="mini-scores-group">
                    {Object.entries(rev.scores || {}).map(([criterionId, scoreVal]) => {
                      const crit = EVALUATION_CRITERIA.find((c) => c.id === criterionId);
                      if (!crit || !crit.active) return null;
                      return (
                        <span className="mini-score-tag" key={criterionId}>
                          {crit.name}: {scoreVal}점
                        </span>
                      );
                    })}
                  </div>

                  {/* 인터랙티브 좋아요(❤️) 버튼 */}
                  <button
                    className={`like-action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={() => onToggleLike && onToggleLike(rev.id)}
                    title={isLiked ? '좋아요 취소' : '공감하기'}
                  >
                    <span className="heart-icon">{isLiked ? '❤️' : '♡'}</span>
                    <span className="like-count">{rev.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CitizenReviewFeed;
