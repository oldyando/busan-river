import React from 'react';

import KakaoMap from './KakaoMap';
import { RIVER_MAP_CONFIG, DEFAULT_MAP_CONFIG } from '../config/mapConfig';

/**
 * 🗺️ 탭 2: 소상공인 상생 지도 & 할인 쿠폰
 */
function AllianceMapTab({ selectedRiver, coupons, onDownloadCoupon }) {
  const mapConfig = RIVER_MAP_CONFIG[selectedRiver] || DEFAULT_MAP_CONFIG;

  const shopList = [
    { name: `${selectedRiver} 다리옆 소상공인 카페`, benefit: '아메리카노 1,000원 즉시 할인' },
    { name: `${selectedRiver} 강변 착한 소상공인 국수집`, benefit: '식사 주문 시 사이드 만두 무료' },
    { name: `${selectedRiver} 골목 동네 상생 베이커리`, benefit: '당일 제빵 전 품목 10% 우대 할인' }
  ];

  return (
    <div className="tab-panel">
      <div className="map-section-container">
        <KakaoMap
          center={mapConfig.center}
          level={mapConfig.level}
          height="380px"
        />
      </div>
      <h3>🛍️ {selectedRiver} 소상공인 상생 우대 쿠폰</h3>
      <div className="coupon-list">
        {shopList.map((shop, idx) => (
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

