import React, { useState, useEffect } from 'react';
import KakaoMap from './KakaoMap';
import RiverLayer from './RiverLayer';
import RiverInfoCard from './RiverInfoCard';
import { RIVER_DATA, getRiverByName } from '../../data/riverData';
import { DEFAULT_MAP_CONFIG } from '../../config/mapConfig';

/**
 * 🗺️ 탭 2: 부산 하천 지도 & 소상공인 상생 쿠폰
 */
function AllianceMapTab({ selectedRiver, coupons, onDownloadCoupon }) {
  const [selectedRiverData, setSelectedRiverData] = useState(null);
  const [currentCenter, setCurrentCenter] = useState(DEFAULT_MAP_CONFIG.center);
  const [currentLevel, setCurrentLevel] = useState(DEFAULT_MAP_CONFIG.level);

  // 상단 하천 드롭다운 변경 시 해당 하천 데이터 선택 및 지도 이동
  useEffect(() => {
    if (selectedRiver) {
      const foundRiver = getRiverByName(selectedRiver);
      if (foundRiver) {
        setSelectedRiverData(foundRiver);
        if (foundRiver.center && foundRiver.level) {
          setCurrentCenter(foundRiver.center);
          setCurrentLevel(foundRiver.level);
        }
      }
    }
  }, [selectedRiver]);

  // 지도 위 하천 Polyline/마커 클릭 핸들러
  const handleSelectRiverOnMap = (river) => {
    setSelectedRiverData(river);
    if (river.center && river.level) {
      setCurrentCenter(river.center);
      setCurrentLevel(river.level);
    }
  };

  // 카드 닫기 핸들러
  const handleCloseCard = () => {
    setSelectedRiverData(null);
  };

  const defaultShops = [
    { name: `${selectedRiver || '부산 하천'} 수변 소상공인 카페`, benefit: '아메리카노 1,000원 즉시 할인' },
    { name: `${selectedRiver || '부산 하천'} 강변 착한 소상공인 국수집`, benefit: '식사 주문 시 사이드 만두 무료' },
    { name: `${selectedRiver || '부산 하천'} 골목 동네 상생 베이커리`, benefit: '당일 제빵 전 품목 10% 우대 할인' }
  ];

  const currentShops = selectedRiverData?.shops && selectedRiverData.shops.length > 0
    ? selectedRiverData.shops
    : defaultShops;

  return (
    <div className="tab-panel">
      {/* 부산 하천 지도 영역 */}
      <div className="map-section-container" style={{ position: 'relative' }}>
        <KakaoMap center={currentCenter} level={currentLevel} height="420px">
          {(map) => (
            <RiverLayer
              map={map}
              riverList={RIVER_DATA}
              onSelectRiver={handleSelectRiverOnMap}
              selectedRiverId={selectedRiverData?.id}
            />
          )}
        </KakaoMap>

        {/* 선택된 하천 정보 카드 오버레이 */}
        {selectedRiverData && (
          <RiverInfoCard river={selectedRiverData} onClose={handleCloseCard} />
        )}
      </div>

      {/* 하천 빠른 선택 뱃지 바 */}
      <div className="river-quick-selector">
        <span className="selector-title">📌 하천 선택:</span>
        <div className="river-badge-group">
          {RIVER_DATA.map((river) => (
            <button
              key={river.id}
              className={`river-chip ${selectedRiverData?.id === river.id ? 'active' : ''}`}
              onClick={() => handleSelectRiverOnMap(river)}
            >
              🌊 {river.name}
            </button>
          ))}
        </div>
      </div>

      <h3>🛍️ {selectedRiverData?.name || selectedRiver || '부산 하천'} 수변 소상공인 상생 우대 쿠폰</h3>
      <div className="coupon-list">
        {currentShops.map((shop, idx) => (
          <div className="coupon-item" key={idx}>
            <div>
              <strong>{shop.name}</strong>
              <p>{shop.benefit}</p>
            </div>
            <button onClick={() => onDownloadCoupon(shop.name, shop.benefit)}>
              {coupons.includes(shop.name) ? '발급 완료' : '쿠폰 받기'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllianceMapTab;
