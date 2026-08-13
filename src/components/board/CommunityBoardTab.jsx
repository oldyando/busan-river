import React, { useState, useEffect } from 'react';
import RiverEvaluationForm from './RiverEvaluationForm';
import RiverEvaluationResult from './RiverEvaluationResult';
import RiverComparisonTable from './RiverComparisonTable';
import {
  RIVERS_LIST,
  getStoredReviews,
  saveReviews
} from '../../data/riverEvaluationData';

/**
 * 📝 탭 4: 주민 소통 및 이태엽 의원실 통합 신문고 (부산하천 소통함 평가 기능)
 */
function CommunityBoardTab({ selectedRiver, feedList, newPost, setNewPost, onAddPost }) {
  const [subTab, setSubTab] = useState('form'); // 'form' | 'result' | 'comparison'
  const [reviewsList, setReviewsList] = useState([]);
  const [currentRiverId, setCurrentRiverId] = useState('R001');

  useEffect(() => {
    const loaded = getStoredReviews();
    setReviewsList(loaded);
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
    setSubTab('result'); // 제출 후 평가 결과 탭으로 자동 이동
  };

  const handleSelectRiverId = (riverId) => {
    setCurrentRiverId(riverId);
  };

  return (
    <div className="tab-panel">
      {/* 타이틀 및 통합 신문고 안심 안내 */}
      <div className="board-header-section">
        <h3>📝 부산하천 소통함 & 이태엽 의원실 신문고</h3>
        <div className="office-box">
          🔒 <strong>이태엽 의원실 통합 신문고 (민원 수렴 & 빅데이터)</strong>
          <p>
            시민 여러분의 개별 평가 데이터는 안전하게 보존되며, 향후 AI 기반 하천 문제점 분석 및 지자체 예산 투입 우선순위 결정의 핵심 자료로 활용됩니다.
          </p>
        </div>
      </div>

      {/* 소통함 서브 세그먼트 탭 메뉴 */}
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

      {/* 세그먼트별 메인 콘텐츠 */}
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

      {/* 기존 한줄 피드 및 제보 서식 유지 */}
      <div className="original-feed-section">
        <h4>💬 의원실 실시간 소통 한 줄 피드</h4>
        <form onSubmit={onAddPost} className="board-form">
          <input
            type="text"
            placeholder={`[${selectedRiver || '부산 하천'}] 제보 사항을 한 줄로 공유해 주세요!`}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            maxLength={100}
          />
          <button type="submit">등록</button>
        </form>
        <div className="feed-list">
          {feedList.map((post) => (
            <div className="feed-item" key={post.id}>
              <p>{post.text}</p>
              <span>{post.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityBoardTab;
