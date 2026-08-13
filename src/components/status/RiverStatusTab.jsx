import React from 'react';
import { riverMockData } from '../../data/riverMockData';

/**
 * 🌊 탭 1: 실시간 하천 상태 및 환경 지수
 */
function RiverStatusTab({ selectedRiver, riverData }) {
  const currentMockInfo = riverMockData[selectedRiver]?.info || '';

  return (
    <div className="tab-panel">
      <div className="safety-alert-banner">
        ⚠️ 기습 호우 시 하천 진입을 절대 자제하시고 즉시 가까운 교각 밑 지정 안전대피소로 이동 바랍니다.
      </div>
      <div className="card">
        <h3>📊 {selectedRiver} 실시간 환경 지수</h3>
        <div className="status-item">
          <span className="label">수질 지수 (BOD)</span>
          <span className="value badge-green">{riverData.waterQuality}</span>
        </div>
        <div className="status-item">
          <span className="label">동네 날씨/상황</span>
          <span className="value" style={{ fontSize: '13px' }}>{riverData.weather}</span>
        </div>
        <div className="status-item">
          <span className="label">생활 안전 등급</span>
          <span className="value">{riverData.safety}</span>
        </div>
      </div>
      <div className="card info-card">
        <h4>📌 {selectedRiver} 구역 주요 의정 소식</h4>
        <p>{currentMockInfo}</p>
      </div>
    </div>
  );
}

export default RiverStatusTab;
