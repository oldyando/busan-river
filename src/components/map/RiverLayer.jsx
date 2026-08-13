import { useEffect } from 'react';
import { getStoredPhotos } from '../../data/riverPhotoVerificationData';

/**
 * 🏞️ RiverLayer 컴포넌트
 * - 인공적인 Polyline 하천 선 그리기를 완전히 제거하고, 카카오맵 본래의 실제 하천 지형을 100% 그대로 활용합니다.
 * - 하천 대표 위치에 커스텀 마커(CustomOverlay: 🌊 하천명)를 표시하고, 클릭 시 지도 이동 및 상세 정보를 엽니다.
 * - 시민 인증 사진 데이터가 있는 경우 해당 위치에 시민 인증 마커(📍)를 지도 위에 표시합니다.
 */
function RiverLayer({ map, riverList = [], onSelectRiver, selectedRiverId }) {
  useEffect(() => {
    if (!map || !window.kakao || !window.kakao.maps) return;

    const overlays = [];

    // 1. 하천 대표 위치 커스텀 마커 생성 (Polyline 생성 제거)
    riverList.forEach((river) => {
      const isSelected = river.id === selectedRiverId;

      if (river.center) {
        const content = document.createElement('div');
        content.className = `river-map-marker ${isSelected ? 'active' : ''}`;
        content.innerHTML = `
          <div className="river-marker-pin">🌊</div>
          <div className="river-marker-label">${river.name}</div>
        `;

        content.addEventListener('click', (e) => {
          e.stopPropagation();

          // 지도 중심을 대표 위치로 부드럽게 이동 (panTo)
          const moveLatLon = new window.kakao.maps.LatLng(river.center.lat, river.center.lng);
          map.panTo(moveLatLon);

          if (onSelectRiver) onSelectRiver(river);
        });

        const overlay = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(river.center.lat, river.center.lng),
          content: content,
          xAnchor: 0.5,
          yAnchor: 1.2
        });

        overlay.setMap(map);
        overlays.push(overlay);
      }
    });

    // 2. 시민 인증 사진 위치 마커 오버레이 (탭 3 데이터 연동)
    try {
      const photos = getStoredPhotos();
      photos.forEach((photo) => {
        // 해당 하천의 대표 위치 근처 오프셋 마커 배치
        const matchedRiver = riverList.find((r) => r.name === photo.riverName);
        if (matchedRiver && matchedRiver.center) {
          const content = document.createElement('div');
          content.className = 'citizen-map-marker';
          content.innerHTML = `
            <div className="citizen-marker-pin" title="${photo.location}">📍</div>
          `;

          content.addEventListener('click', (e) => {
            e.stopPropagation();
            const moveLatLon = new window.kakao.maps.LatLng(matchedRiver.center.lat, matchedRiver.center.lng);
            map.panTo(moveLatLon);
            if (onSelectRiver) onSelectRiver(matchedRiver);
          });

          const overlay = new window.kakao.maps.CustomOverlay({
            position: new window.kakao.maps.LatLng(matchedRiver.center.lat, matchedRiver.center.lng),
            content: content,
            xAnchor: -0.2,
            yAnchor: 1.0
          });

          overlay.setMap(map);
          overlays.push(overlay);
        }
      });
    } catch (e) {
      console.warn('Citizen markers render error:', e);
    }

    return () => {
      overlays.forEach((o) => o.setMap(null));
    };
  }, [map, riverList, selectedRiverId, onSelectRiver]);

  return null;
}

export default RiverLayer;
