import React from 'react';
import { riverMockData } from '../../data/riverMockData';
import RiverIntimacyCard from './RiverIntimacyCard';

/**
 * 🌊 탭 1: 실시간 하천 상태 및 환경 지수 (우리 하천 친밀도 적용)
 */
function RiverStatusTab({ selectedRiver, riverData }) {
  const currentMockInfo = riverMockData[selectedRiver]?.info || '';

  return (
    <div className="tab-panel">
      {/* 💙 핵심 영역: 우리 하천 친밀도 카드 */}
      <RiverIntimacyCard selectedRiver={selectedRiver} />

      {/* 실시간 주변 환경 및 정보 카드 */}
      <div className="card">
        <h3>📊 {selectedRiver} 실시간 주변 정보</h3>
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

