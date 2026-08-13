import React, { useState, useEffect } from 'react';
import { RIVERS_LIST, RIVER_TYPES, EVALUATION_CRITERIA } from '../../data/riverEvaluationData';

/**
 * ✍️ RiverEvaluationForm 컴포넌트
 * 시민이 하천을 선택하고 유동적 평가 항목(1~5점) 및 한줄평을 작성하여 제출하는 대화형 폼입니다.
 */
function RiverEvaluationForm({ selectedRiverId, onSelectRiver, onSubmitReview }) {
  const activeCriteria = EVALUATION_CRITERIA.filter((c) => c.active);

  const [currentRiverId, setCurrentRiverId] = useState(selectedRiverId || 'R001');

  const [scores, setScores] = useState(() => {
    const initial = {};
    activeCriteria.forEach((c) => {
      initial[c.id] = 5;
    });
    return initial;
  });

  const [comment, setComment] = useState('');

  useEffect(() => {
    if (selectedRiverId) {
      setCurrentRiverId(selectedRiverId);
    }
  }, [selectedRiverId]);

  const handleRiverChange = (e) => {
    const newId = e.target.value;
    setCurrentRiverId(newId);
    if (onSelectRiver) onSelectRiver(newId);
  };

  const handleScoreChange = (criterionId, scoreValue) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: scoreValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert('⚠️ 시민 한줄평을 한 줄 이상 작성해 주세요.');
      return;
    }

    const newReview = {
      id: `REV-${Date.now()}`,
      riverId: currentRiverId,
      scores: activeCriteria.map((c) => ({
        criterionId: c.id,
        score: scores[c.id] || 5
      })),
      comment: comment.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onSubmitReview(newReview);
    setComment('');
    alert('🎉 시민 하천 평가 및 한줄평 제출이 완료되었습니다! 데이터가 축적되었습니다.');
  };

  const selectedRiverObj = RIVERS_LIST.find((r) => r.id === currentRiverId) || RIVERS_LIST[0];

  return (
    <div className="eval-form-card">
      <div className="eval-form-header">
        <h4>✍️ 부산 하천 시민 평가 작성하기</h4>
        <p>시민 여러분의 소중한 평가는 향후 부산 하천 관리 및 예산 투입의 중요 데이터로 활용됩니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="eval-main-form">
        <div className="form-group">
          <label className="form-label">하천 선택</label>
          <div className="river-select-wrapper">
            <select value={currentRiverId} onChange={handleRiverChange} className="toss-select">
              {RIVERS_LIST.map((river) => {
                const type = RIVER_TYPES.find((t) => t.id === river.riverTypeId);
                return (
                  <option key={river.id} value={river.id}>
                    🌊 {river.name} ({type ? type.name : '하천'})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="form-group criteria-group">
          <label className="form-label">
            [{selectedRiverObj.name}] 항목별 평가 (1 ~ 5점)
          </label>

          <div className="criteria-list">
            {activeCriteria.map((c) => {
              const currentScore = scores[c.id] || 5;
              return (
                <div className="criterion-item" key={c.id}>
                  <div className="criterion-info">
                    <strong>{c.name}</strong>
                    <span>{c.description}</span>
                  </div>

                  <div className="star-rating-box">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={`star-btn ${star <= currentScore ? 'active' : ''}`}
                        onClick={() => handleScoreChange(c.id, star)}
                      >
                        ★
                      </button>
                    ))}
                    <span className="score-num-badge">{currentScore}점</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">시민 한줄평</label>
          <textarea
            className="toss-textarea"
            placeholder={`${selectedRiverObj.name}에 대한 칭찬, 수질 냄새, 산책로 개선 건의 등 자유로운 한줄평을 남겨주세요.`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={200}
          />
        </div>

        <button type="submit" className="toss-btn-primary eval-submit-btn">
          ✨ {selectedRiverObj.name} 평가 제출하기
        </button>
      </form>
    </div>
  );
}

export default RiverEvaluationForm;
