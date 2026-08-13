import React, { useState, useEffect } from 'react';
import { analyzeRiverWithAI } from '../../ai/riverAI';
import {
  RIVERS_LIST,
  getStoredReviews,
  enrichReviewData
} from '../../data/riverEvaluationData';

/**
 * 🤖 RiverAIAnalysis 컴포넌트
 * 시민들의 평가 및 한줄평 데이터를 바탕으로 Google Gemini AI 분석을 실행하고 결과를 보여주는 UI입니다.
 */
function RiverAIAnalysis({ selectedRiverId }) {
  const [targetRiverId, setTargetRiverId] = useState(selectedRiverId || 'R003');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [emptyNotice, setEmptyNotice] = useState(null);

  // 상위 prop 변경 시 하천 선택 상태 동기화
  useEffect(() => {
    if (selectedRiverId) {
      setTargetRiverId(selectedRiverId);
    }
  }, [selectedRiverId]);

  const selectedRiverObj = RIVERS_LIST.find((r) => r.id === targetRiverId) || RIVERS_LIST[0];

  const handleAnalyze = async () => {
    setEmptyNotice(null);
    setErrorMsg(null);

    // 1. 데이터 검증 (선택한 하천에 시민 평가 데이터가 있는지 확인)
    const storedReviews = getStoredReviews();
    const riverReviews = storedReviews.filter((r) => r.riverId === targetRiverId);

    if (riverReviews.length === 0) {
      setEmptyNotice(`⚠️ 아직 [${selectedRiverObj.name}]에 등록된 시민 평가 데이터가 부족합니다.`);
      setAiResult(null);
      return;
    }

    // 2. AI 분석 호출 (loading = true)
    setLoading(true);
    try {
      const result = await analyzeRiverWithAI(targetRiverId, storedReviews);
      setAiResult(result);
    } catch (err) {
      console.error('❌ AI 분석 실행 중 오류 발생:', err);
      setErrorMsg('AI 분석을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.');
      setAiResult(null);
    } finally {
      setLoading(false);
    }
  };

  // 우선순위 뱃지 헬퍼 (high: 🔴, medium: 🟡, low: 🟢)
  const renderPriorityBadge = (priority) => {
    const p = String(priority).toLowerCase();
    if (p === 'high') {
      return <span className="priority-tag high">🔴 높은 우선순위</span>;
    } else if (p === 'medium') {
      return <span className="priority-tag medium">🟡 중간 우선순위</span>;
    }
    return <span className="priority-tag low">🟢 낮은 우선순위</span>;
  };

  return (
    <div className="ai-analysis-card">
      <div className="ai-header">
        <div className="ai-title-group">
          <span className="ai-icon">🤖</span>
          <h4>AI 하천 종합 분석</h4>
          <span className="ai-badge">Gemini Powered</span>
        </div>
        <p className="ai-subtitle">
          시민들의 평가 점수와 한줄평, 공감 수(좋아요)를 Gemini AI가 분석하여 하천의 주요 문제점과 개선 방향을 제안합니다.
        </p>
      </div>

      {/* 하천 선택 및 분석 실행 컨트롤 */}
      <div className="ai-controls-box">
        <div className="ai-select-group">
          <label className="ai-label">분석할 하천 선택</label>
          <select
            value={targetRiverId}
            onChange={(e) => setTargetRiverId(e.target.value)}
            className="toss-select"
            disabled={loading}
          >
            {RIVERS_LIST.map((r) => (
              <option key={r.id} value={r.id}>
                🌊 {r.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="toss-btn-primary ai-analyze-btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? '🤖 시민 평가 데이터를 분석하고 있습니다...' : '🤖 AI 분석하기'}
        </button>
      </div>

      {/* 데이터 부족 안내 */}
      {emptyNotice && (
        <div className="ai-notice-box empty">
          <span>{emptyNotice}</span>
        </div>
      )}

      {/* 에러 발생 안내 */}
      {errorMsg && (
        <div className="ai-notice-box error">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      {/* 로딩 표시 */}
      {loading && (
        <div className="ai-loading-box">
          <div className="spinner"></div>
          <p>🤖 Gemini AI가 시민 평가와 좋아요 데이터를 바탕으로 리포트를 생성하고 있습니다...</p>
        </div>
      )}

      {/* AI 분석 결과 화면 */}
      {aiResult && !loading && (
        <div className="ai-result-content">
          <div className="result-main-title">
            🌊 <h3>{aiResult.riverName || selectedRiverObj.name} AI 리포트</h3>
          </div>

          {/* 1. 종합 분석 요약 (summary) */}
          <div className="ai-section summary-section">
            <h5 className="ai-section-title">📌 종합 분석</h5>
            <p className="summary-text">{aiResult.summary}</p>
          </div>

          {/* 2. 긍정 평가 부분 (strengths) */}
          {aiResult.strengths && aiResult.strengths.length > 0 && (
            <div className="ai-section strengths-section">
              <h5 className="ai-section-title">🟢 시민들이 긍정적으로 평가한 부분</h5>
              <ul className="bullet-list">
                {aiResult.strengths.map((str, idx) => (
                  <li key={idx}>• {str}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. 주요 문제점 및 개선 우선순위 (mainIssues) */}
          {aiResult.mainIssues && aiResult.mainIssues.length > 0 && (
            <div className="ai-section issues-section">
              <h5 className="ai-section-title">🔴 주요 문제점 및 개선 우선순위</h5>
              <div className="issues-list">
                {aiResult.mainIssues.map((item, idx) => (
                  <div className="issue-card-item" key={idx}>
                    <div className="issue-card-header">
                      {renderPriorityBadge(item.priority)}
                      <strong className="issue-title">{item.issue}</strong>
                    </div>
                    <p className="issue-reason">
                      <strong>판단 근거:</strong> {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. 시민 의견 감정 분석 (sentiment) */}
          {aiResult.sentiment && (
            <div className="ai-section sentiment-section">
              <h5 className="ai-section-title">📊 시민 의견 감정 분석</h5>
              <div className="sentiment-gauges">
                <div className="sentiment-bar-container">
                  <div className="sentiment-segment positive" style={{ width: `${aiResult.sentiment.positive}%` }}>
                    긍정 {aiResult.sentiment.positive}%
                  </div>
                  <div className="sentiment-segment neutral" style={{ width: `${aiResult.sentiment.neutral}%` }}>
                    중립 {aiResult.sentiment.neutral}%
                  </div>
                  <div className="sentiment-segment negative" style={{ width: `${aiResult.sentiment.negative}%` }}>
                    부정 {aiResult.sentiment.negative}%
                  </div>
                </div>
                <div className="sentiment-labels">
                  <span className="pos-label">🟢 긍정 {aiResult.sentiment.positive}%</span>
                  <span className="neu-label">⚪ 중립 {aiResult.sentiment.neutral}%</span>
                  <span className="neg-label">🔴 부정 {aiResult.sentiment.negative}%</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. AI 개선 제언 (improvementSuggestions) */}
          {aiResult.improvementSuggestions && aiResult.improvementSuggestions.length > 0 && (
            <div className="ai-section suggestions-section">
              <h5 className="ai-section-title">💡 AI 개선 제언</h5>
              <ul className="bullet-list suggestions">
                {aiResult.improvementSuggestions.map((sug, idx) => (
                  <li key={idx}>• {sug}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RiverAIAnalysis;
