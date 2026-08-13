import React, { useState, useEffect } from 'react';

/**
 * 🏞️ RiverInfoCard 컴포넌트
 * 선택된 부산 하천의 상세 정보(사진, 하천 이름, 평점, 설명)를 토스 스타일 카드 형태로 표시합니다.
 */
function RiverInfoCard({ river, onClose }) {
  const [imgError, setImgError] = useState(false);

  // 하천 변경 시 이미지 에러 상태 초기화
  useEffect(() => {
    setImgError(false);
  }, [river?.id]);

  if (!river) return null;

  // 디폴트 하천 SVG 그래픽 플레이스홀더 (사진 미존재 시 표시)
  const defaultPlaceholderSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%23eef5ff"/><path d="M0 160 Q 100 120 200 160 T 400 160 L 400 240 L 0 240 Z" fill="%233182f6" opacity="0.3"/><path d="M0 180 Q 100 150 200 180 T 400 180 L 400 240 L 0 240 Z" fill="%231b64da" opacity="0.4"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" fill="%231b64da">🌊 ${river.name}</text></svg>`;

  return (
    <div className="river-info-card-overlay">
      <div className="river-info-card">
        {/* 상단 닫기 버튼 */}
        <button className="card-close-badge" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        {/* 1. 하천 사진 */}
        <div className="river-card-image-container">
          <img
            src={imgError ? defaultPlaceholderSvg : river.image}
            alt={river.name}
            className="river-card-image"
            onError={() => setImgError(true)}
          />
          <div className="river-image-badge">부산 하천 명소</div>
        </div>

        {/* 2. 하천 이름 및 평점 */}
        <div className="river-card-content">
          <div className="river-card-header">
            <h3 className="river-card-title">{river.name}</h3>
            <div className="river-card-rating">
              <span className="star-icon">⭐</span>
              <span className="rating-value">{river.rating ? river.rating.toFixed(1) : '4.5'}</span>
              <span className="rating-sub">(시민 선호도)</span>
            </div>
          </div>

          {/* 3. 하천 설명 */}
          <p className="river-card-description">{river.description}</p>

          {/* 4. 하단 닫기 버튼 */}
          <div className="river-card-footer">
            <button className="river-card-close-btn" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiverInfoCard;
