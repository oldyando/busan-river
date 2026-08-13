import { useEffect } from 'react';

/**
 * 🏞️ RiverLayer 컴포넌트
 * Kakao Maps API의 Polyline 및 CustomOverlay/Marker를 이용해 부산 하천 레이어를 지도 위에 표시합니다.
 * 하천 선(Polyline) 또는 하천 명칭 뱃지를 클릭하면 해당 하천이 선택됩니다.
 */
function RiverLayer({ map, riverList = [], onSelectRiver, selectedRiverId }) {
  useEffect(() => {
    if (!map || !window.kakao || !window.kakao.maps || !riverList.length) return;

    const polylines = [];
    const overlays = [];

    riverList.forEach((river) => {
      const isSelected = river.id === selectedRiverId;

      // 1. 하천 Polyline 경로 생성
      if (river.path && river.path.length > 0) {
        const linePath = river.path.map(
          (coord) => new window.kakao.maps.LatLng(coord.lat, coord.lng)
        );

        const polyline = new window.kakao.maps.Polyline({
          map: map,
          path: linePath,
          strokeWeight: isSelected ? 8 : 6,
          strokeColor: isSelected ? '#F04438' : '#3182F6',
          strokeOpacity: isSelected ? 1.0 : 0.85,
          strokeStyle: 'solid'
        });

        window.kakao.maps.event.addListener(polyline, 'click', () => {
          if (onSelectRiver) onSelectRiver(river);
        });

        window.kakao.maps.event.addListener(polyline, 'mouseover', () => {
          if (river.id !== selectedRiverId) {
            polyline.setOptions({ strokeColor: '#1B64DA', strokeWeight: 8 });
          }
        });

        window.kakao.maps.event.addListener(polyline, 'mouseout', () => {
          if (river.id !== selectedRiverId) {
            polyline.setOptions({ strokeColor: '#3182F6', strokeWeight: 6 });
          }
        });

        polylines.push(polyline);
      }

      // 2. 하천 중심 위치 CustomOverlay 뱃지 생성
      if (river.center) {
        const content = document.createElement('div');
        content.className = `river-map-marker ${isSelected ? 'active' : ''}`;
        content.innerHTML = `
          <div className="river-marker-pin">🌊</div>
          <div className="river-marker-label">${river.name}</div>
        `;

        content.addEventListener('click', (e) => {
          e.stopPropagation();
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

    return () => {
      polylines.forEach((p) => p.setMap(null));
      overlays.forEach((o) => o.setMap(null));
    };
  }, [map, riverList, selectedRiverId, onSelectRiver]);

  return null;
}

export default RiverLayer;
