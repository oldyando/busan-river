import React, { useEffect, useRef, useState } from 'react';

/**
 * 🗺️ KakaoMap 컴포넌트
 * - React + Vite 환경의 VITE_KAKAO_MAP_KEY 사용
 * - 카카오 지도 SDK 동적 로딩 및 실제 지도 객체 생성
 * - 지도 이동, 확대/축소, 반응형 크기 지원
 * - console 진단 로그 (1. 환경변수, 2. Script 로드, 3. window.kakao, 4. window.kakao.maps, 5. 지도 생성)
 */
function KakaoMap({ center = { lat: 35.1795543, lng: 129.0756416 }, level = 4, className = '', height = '380px' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. 환경변수 확인
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

    // 지도 생성 함수
    const initMap = () => {
      if (!mapContainerRef.current) return;

      // 3. window.kakao 검증
      const hasKakao = typeof window.kakao !== 'undefined';
      console.log(`[KakaoMap Diagnostic] 3단계: window.kakao 존재 확인 - ${hasKakao ? '성공' : '실패'}`);

      // 4. window.kakao.maps 검증
      const hasMaps = Boolean(hasKakao && window.kakao.maps);
      console.log(`[KakaoMap Diagnostic] 4단계: window.kakao.maps 존재 확인 - ${hasMaps ? '성공' : '실패'}`);

      if (!hasMaps) {
        const errMsg = 'window.kakao.maps API 객체를 찾을 수 없습니다.';
        console.error(`[KakaoMap Diagnostic] ❌ 4단계 실패: ${errMsg}`);
        setError(errMsg);
        setLoading(false);
        return;
      }

      // 5. kakao.maps.load 기반 지도 초기화
      window.kakao.maps.load(() => {
        try {
          const container = mapContainerRef.current;
          if (!container) return;

          const options = {
            center: new window.kakao.maps.LatLng(center.lat, center.lng),
            level: level
          };

          if (!mapInstanceRef.current) {
            const map = new window.kakao.maps.Map(container, options);
            mapInstanceRef.current = map;
            console.log('[KakaoMap Diagnostic] 🎉 5단계 성공: 실제 카카오 지도가 화면에 정상적으로 생성되었습니다!');
          } else {
            const moveLatLon = new window.kakao.maps.LatLng(center.lat, center.lng);
            mapInstanceRef.current.setCenter(moveLatLon);
            mapInstanceRef.current.setLevel(level);
            mapInstanceRef.current.relayout();
            console.log('[KakaoMap Diagnostic] 5단계: 지도 중심 및 Zoom level 업데이트 완료');
          }

          setLoading(false);
          setError(null);
        } catch (err) {
          console.error('[KakaoMap Diagnostic] ❌ 5단계 실패: 지도 초기화 중 예외가 발생했습니다.', err);
          setError('카카오 지도 생성 중 오류가 발생했습니다.');
          setLoading(false);
        }
      });
    };

    // 2. 카카오 지도 SDK script 로드 상태 확인 및 동적 로딩
    if (window.kakao && window.kakao.maps) {
      console.log('[KakaoMap Diagnostic] 2단계: 카카오 지도 SDK script가 이미 로드되어 있습니다.');
      initMap();
      return;
    }

    const existingScript = document.getElementById('kakao-map-sdk');
    if (existingScript) {
      console.log('[KakaoMap Diagnostic] 2단계: 기존 script 태그 감지, load 이벤트 수신 대기');
      existingScript.addEventListener('load', initMap);
      return () => existingScript.removeEventListener('load', initMap);
    }

    console.log('[KakaoMap Diagnostic] 2단계: 카카오 지도 SDK script 동적 삽입 시작...');
    const script = document.createElement('script');
    script.id = 'kakao-map-sdk';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log('[KakaoMap Diagnostic] ✅ 2단계 성공: 카카오 지도 SDK script가 성공적으로 로드되었습니다.');
      initMap();
    };

    script.onerror = (e) => {
      console.error('[KakaoMap Diagnostic] ❌ 2단계 실패: script 로드에 실패했습니다 (도메인 미등록 또는 네트워크/API 키 오류).', e);
      setError('카카오 지도 스크립트 로드 실패. Kakao Developers Web 플랫폼 도메인 등록 상태를 확인하세요.');
      setLoading(false);
    };

    document.head.appendChild(script);
  }, [center.lat, center.lng, level]);

  // Props 변경 시 중심 위치 및 확대 수준 변경
  useEffect(() => {
    if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
      const moveLatLon = new window.kakao.maps.LatLng(center.lat, center.lng);
      mapInstanceRef.current.panTo(moveLatLon);
      mapInstanceRef.current.setLevel(level);
    }
  }, [center.lat, center.lng, level]);

  // 브라우저 리사이즈 시 지도 크기 재계산
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
          <span>🌊 카카오 지도를 불러오는 중...</span>
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
    </div>
  );
}

export default KakaoMap;
