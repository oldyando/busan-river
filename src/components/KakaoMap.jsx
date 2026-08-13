import React, { useEffect, useRef, useState } from 'react';

/**
 * 🗺️ KakaoMap 컴포넌트
 * - React + Vite 환경의 VITE_KAKAO_MAP_KEY 사용
 * - 카카오 지도 SDK 동적 로딩 및 지도 객체 생성
 * - 지도 이동, 확대/축소, 반응형 크기 지원
 * - 자식 요소(children)나 콜백(onMapCreated)에 map 인스턴스 전달 지원
 */
function KakaoMap({
  center = { lat: 35.1795543, lng: 129.0756416 },
  level = 6,
  className = '',
  height = '420px',
  children,
  onMapCreated
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_KAKAO_MAP_KEY;
    const hasKey = Boolean(apiKey);
    const maskedKey = hasKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'N/A';

    console.log(`[KakaoMap Diagnostic] 1단계: VITE_KAKAO_MAP_KEY 로드 확인 - ${hasKey ? '성공' : '실패'} (마스킹 키: ${maskedKey})`);

    if (!apiKey) {
      const errMsg = 'VITE_KAKAO_MAP_KEY 환경 변수가 설정되지 않았습니다.';
      console.error(`[KakaoMap Diagnostic] ❌ 1단계 실패: ${errMsg}`);
      setError(errMsg);
      setLoading(false);
      return;
    }

    const initMap = () => {
      if (!mapContainerRef.current) return;

      const hasKakao = typeof window.kakao !== 'undefined';
      console.log(`[KakaoMap Diagnostic] 3단계: window.kakao 존재 확인 - ${hasKakao ? '성공' : '실패'}`);

      const hasMaps = Boolean(hasKakao && window.kakao.maps);
      console.log(`[KakaoMap Diagnostic] 4단계: window.kakao.maps 존재 확인 - ${hasMaps ? '성공' : '실패'}`);

      if (!hasMaps) {
        const errMsg = 'window.kakao.maps API 객체를 찾을 수 없습니다.';
        console.error(`[KakaoMap Diagnostic] ❌ 4단계 실패: ${errMsg}`);
        setError(errMsg);
        setLoading(false);
        return;
      }

      window.kakao.maps.load(() => {
        try {
          const container = mapContainerRef.current;
          if (!container) return;

          const options = {
            center: new window.kakao.maps.LatLng(center.lat, center.lng),
            level: level
          };

          if (!mapInstanceRef.current) {
            const createdMap = new window.kakao.maps.Map(container, options);
            mapInstanceRef.current = createdMap;
            setMap(createdMap);
            if (onMapCreated) onMapCreated(createdMap);
            console.log('[KakaoMap Diagnostic] 🎉 5단계 성공: 카카오 지도 객체 생성 완료!');
          } else {
            const moveLatLon = new window.kakao.maps.LatLng(center.lat, center.lng);
            mapInstanceRef.current.setCenter(moveLatLon);
            mapInstanceRef.current.setLevel(level);
            mapInstanceRef.current.relayout();
          }

          setLoading(false);
          setError(null);
        } catch (err) {
          console.error('[KakaoMap Diagnostic] ❌ 5단계 실패: 지도 초기화 오류:', err);
          setError('카카오 지도 생성 중 오류가 발생했습니다.');
          setLoading(false);
        }
      });
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    const existingScript = document.getElementById('kakao-map-sdk');
    if (existingScript) {
      existingScript.addEventListener('load', initMap);
      return () => existingScript.removeEventListener('load', initMap);
    }

    const script = document.createElement('script');
    script.id = 'kakao-map-sdk';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log('[KakaoMap Diagnostic] ✅ 2단계 성공: Kakao SDK script 로드 완료.');
      initMap();
    };

    script.onerror = (e) => {
      console.error('[KakaoMap Diagnostic] ❌ 2단계 실패: script 로드 실패.', e);
      setError('카카오 지도 스크립트 로드 실패. Web 플랫폼 도메인을 확인하세요.');
      setLoading(false);
    };

    document.head.appendChild(script);
  }, []);

  // Props 중심 좌표 및 zoom level 변경 시 지도 동동 이동
  useEffect(() => {
    if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
      const moveLatLon = new window.kakao.maps.LatLng(center.lat, center.lng);
      mapInstanceRef.current.panTo(moveLatLon);
      mapInstanceRef.current.setLevel(level);
    }
  }, [center.lat, center.lng, level]);

  // 창 크기 변경 대응
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.relayout();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`kakao-map-wrapper ${className}`} style={{ position: 'relative', width: '100%', height }}>
      {loading && (
        <div className="kakao-map-status-overlay">
          <span>🌊 부산 하천 지도를 불러오는 중...</span>
        </div>
      )}

      {error && (
        <div className="kakao-map-status-overlay error">
          <p>⚠️ {error}</p>
          <small>카카오 개발자 콘솔(developers.kakao.com)에서 Web 플랫폼 도메인(예: http://localhost:5173) 등록 여부를 확인해 주세요.</small>
        </div>
      )}

      <div
        ref={mapContainerRef}
        className="kakao-map-canvas"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 'var(--toss-radius-lg)',
          overflow: 'hidden'
        }}
      />

      {/* 자식 레이어 컴포넌트(RiverLayer 등)에 map 인스턴스 전달 */}
      {map && typeof children === 'function'
        ? children(map)
        : React.Children.map(children, (child) =>
            React.isValidElement(child) ? React.cloneElement(child, { map }) : child
          )}
    </div>
  );
}

export default KakaoMap;
