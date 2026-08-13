import React from 'react';

/**
 * 🗺️ 탭 2: 소상공인 상생 지도 & 할인 쿠폰
 */
function AllianceMapTab({ selectedRiver, coupons, onDownloadCoupon }) {
  const shopList = [
    { name: `${selectedRiver} 다리옆 소상공인 카페`, benefit: '아메리카노 1,000원 즉시 할인' },
    { name: `${selectedRiver} 강변 착한 소상공인 국수집`, benefit: '식사 주문 시 사이드 만두 무료' },
    { name: `${selectedRiver} 골목 동네 상생 베이커리`, benefit: '당일 제빵 전 품목 10% 우대 할인' }
  ];

  return (
    <div className="tab-panel">
      <div className="map-placeholder">
        📍 [{selectedRiver}길 소상공인 상생 지도 상용화 영역]<br/>
        <span>카카오/구글 맵 지오펜싱 기반 골목 상권 클러스터 시각화</span>
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
