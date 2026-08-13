import React, { useState } from 'react';
import {
  RIVERS_LIST,
  RIVER_TYPES,
  EVALUATION_CRITERIA,
  calculateRiverStats
} from '../../data/riverEvaluationData';

/**
 * 📊 RiverEvaluationResult 컴포넌트
 * 선택된 하천의 총 평가 수, 유동적 항목별 실시간 별점 평균, 종합 평균 점수 및 시민 한줄평 목록을 표시합니다.
 */
function RiverEvaluationResult({ selectedRiverId, reviewsList = [], onSelectRiver }) {
  const [currentRiverId, setCurrentRiverId] = useState(selectedRiverId || 'R001');
  const activeCriteria = EVALUATION_CRITERIA.filter((c) => c.active);

  const selectedRiverObj =
    RIVERS_LIST.find((r) => r.id === currentRiverId) || RIVERS_LIST[0];
  const riverTypeObj = RIVER_TYPES.find(
    (t) => t.id === selectedRiverObj.riverTypeId
  );

  const stats = calculateRiverStats(currentRiverId, reviewsList, EVALUATION_CRITERIA);

  const handleRiverChange = (e) => {
    const newId = e.target.value;
    setCurrentRiverId(newId);
    if (onSelectRiver) onSelectRiver(newId);
  };

  const renderStars = (score) => {
    const filled = Math.round(score);
    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
  };

  return (
    <div className="eval-result-container">
      <div className="result-header-box">
        <div className="result-river-info">
          <span className="river-type-badge">
            {riverTypeObj ? riverTypeObj.name : '하천'}
          </span>
          <h3>{selectedRiverObj.name} 평가 집계 리포트</h3>
        </div>

        <div className="river-select-mini">
          <select
            value={currentRiverId}
            onChange={handleRiverChange}
            className="toss-select-sm"
          >
            {RIVERS_LIST.map((r) => (
              <option key={r.id} value={r.id}>
                🌊 {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-summary-card">
        <div className="overall-score-box">
          <span className="overall-label">시민 종합 평점</span>
          <div className="overall-value-group">
            <span className="overall-num">{stats.overallAverage.toFixed(1)}</span>
            <span className="overall-max">/ 5.0</span>
          </div>
          <span className="overall-stars">
            {renderStars(stats.overallAverage)}
          </span>
          <span className="total-count-tag">
            총 평가 참여: <strong>{stats.totalCount}</strong>개
          </span>
        </div>

        <div className="criteria-averages-box">
          <h5>항목별 세부 평점 (실시간 데이터 집계)</h5>

          {activeCriteria.map((c) => {
            const avg = stats.criterionAverages[c.id] || 0;
            const percentage = (avg / 5) * 100;

            return (
              <div className="criterion-avg-row" key={c.id}>
                <div className="criterion-avg-label">
                  <strong>{c.name}</strong>
                  <span>{c.description}</span>
                </div>

                <div className="criterion-avg-right">
                  <span className="stars-str">{renderStars(avg)}</span>
                  <span className="score-val">{avg.toFixed(1)}</span>
                </div>

                <div className="score-progress-bg">
                  <div
                    className="score-progress-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="reviews-feed-section">
        <h4>💬 시민 실시간 한줄평 ({stats.reviews.length}개)</h4>

        {stats.reviews.length === 0 ? (
          <div className="empty-reviews-box">
            <span>🌊 아직 {selectedRiverObj.name}에 등록된 시민 평가가 없습니다. 첫 평가를 남겨보세요!</span>
          </div>
        ) : (
          <div className="reviews-feed-list">
            {stats.reviews.map((rev) => {
              const revSum = rev.scores.reduce((acc, s) => acc + s.score, 0);
              const revAvg = rev.scores.length > 0 ? (revSum / rev.scores.length).toFixed(1) : '5.0';

              return (
                <div className="review-card-item" key={rev.id}>
                  <div className="review-card-top">
                    <div className="reviewer-info">
                      <span className="user-icon">👤</span>
                      <strong>부산 시민 피드</strong>
                      <span className="review-date">{rev.createdAt}</span>
                    </div>

                    <div className="review-score-badge">
                      <span className="star">★</span>
                      <strong>{revAvg}</strong>
                    </div>
                  </div>

                  <p className="review-comment-text">"{rev.comment}"</p>

                  <div className="review-scores-chips">
                    {rev.scores.map((s) => {
                      const crit = EVALUATION_CRITERIA.find(
                        (c) => c.id === s.criterionId
                      );
                      if (!crit || !crit.active) return null;
                      return (
                        <span key={s.criterionId} className="score-chip">
                          {crit.name}: {s.score}점
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RiverEvaluationResult;
