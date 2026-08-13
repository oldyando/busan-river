import React, { useState, useEffect } from 'react';
import {
  fetchWaterQualityFromApi,
  calculateRiverIntimacyData
} from '../../services/riverIntimacyService';

/**
 * 🏞️ RiverIntimacyCard 컴포넌트
 * 선택된 하천의 「우리 하천 친밀도」 종합 점수 및 5개 세부 항목을 표시합니다.
 */
function RiverIntimacyCard({ selectedRiver, riverId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locInfo, setLocInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadData() {
      try {
        const apiResult = await fetchWaterQualityFromApi(selectedRiver);
        if (!isMounted) return;

        const calculated = calculateRiverIntimacyData({
          riverId: riverId || selectedRiver,
          riverName: selectedRiver,
          bodValue: apiResult.bod,
          doValue: apiResult.do
        });

        setData(calculated);
        setLocInfo({
          locName: apiResult.locName,
          inspecYm: apiResult.inspecYm
        });
      } catch (err) {
        if (!isMounted) return;
        console.error('River intimacy loading error:', err);
        setError('수질 데이터를 불러오지 못했습니다.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedRiver, riverId]);

  return (
    <div className="intimacy-card">
      <div className="intimacy-card-header">
        <h3 className="intimacy-card-title">💙 우리 하천 친밀도</h3>
        {locInfo?.locName && (
          <span className="intimacy-location-badge">📍 {locInfo.locName}</span>
        )}
      </div>

      {loading ? (
        <div className="intimacy-loading-box">
          <div className="intimacy-spinner"></div>
          <p>🌊 {selectedRiver} 수질 및 친밀도 데이터를 분석 중입니다...</p>
        </div>
      ) : error ? (
        <div className="intimacy-error-box">
          <p className="error-message">⚠️ {error}</p>
          <p className="error-sub text-muted">잠시 후 다시 시도해 주세요.</p>
        </div>
      ) : data ? (
        <div className="intimacy-content">
          {/* 종합 친밀도 점수 (가장 강조) */}
          <div className="overall-score-section">
            <span className="overall-score-label">종합 친밀도</span>
            <div className="overall-score-value-container">
              <span className="overall-score-number">
                {Math.round(data.intimacyScore)}
              </span>
              <span className="overall-score-unit">점</span>
            </div>
            <div className="overall-score-bar-bg">
              <div
                className="overall-score-bar-fill"
                style={{ width: `${Math.min(100, Math.max(0, data.intimacyScore))}%` }}
              ></div>
            </div>
          </div>

          {/* 세부 항목 리스트 */}
          <div className="intimacy-items-list">
            {/* 1. 하천 냄새 */}
            <div className="intimacy-item">
              <div className="intimacy-item-left">
                <span className="item-name">하천 냄새</span>
                <span className="item-measurement text-muted">
                  {data.h2s.value} ppm
                </span>
              </div>
              <div className="intimacy-item-right">
                <span className="item-score">{data.h2s.score}점</span>
                <span className="item-weight-chip">30%</span>
              </div>
            </div>

            {/* 2. 산책로 정비 */}
            <div className="intimacy-item">
              <div className="intimacy-item-left">
                <span className="item-name">산책로 정비</span>
                <span className="item-measurement text-muted">정비 상태</span>
              </div>
              <div className="intimacy-item-right">
                <span className="item-score">{data.trailMaintenance.score}점</span>
                <span className="item-weight-chip">30%</span>
              </div>
            </div>

            {/* 3. 야간안전 */}
            <div className="intimacy-item">
              <div className="intimacy-item-left">
                <span className="item-name">야간안전</span>
                <span className="item-measurement text-muted">안전 환경</span>
              </div>
              <div className="intimacy-item-right">
                <span className="item-score">{data.nightSafety.score}점</span>
                <span className="item-weight-chip">30%</span>
              </div>
            </div>

            {/* 4. BOD (수질) */}
            <div className="intimacy-item">
              <div className="intimacy-item-left">
                <span className="item-name">BOD (생물학적 산소요구량)</span>
                <span className="item-measurement text-muted">
                  {data.waterQuality.bod.value} mg/L
                </span>
              </div>
              <div className="intimacy-item-right">
                <span className="item-score">{data.waterQuality.bod.score}점</span>
                <span className="item-weight-chip water-chip">5%</span>
              </div>
            </div>

            {/* 5. DO (수질) */}
            <div className="intimacy-item">
              <div className="intimacy-item-left">
                <span className="item-name">DO (용존산소량)</span>
                <span className="item-measurement text-muted">
                  {data.waterQuality.do.value} mg/L
                </span>
              </div>
              <div className="intimacy-item-right">
                <span className="item-score">{data.waterQuality.do.score}점</span>
                <span className="item-weight-chip water-chip">5%</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default RiverIntimacyCard;
