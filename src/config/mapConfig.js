/**
 * 🗺️ 카카오 지도 설정값 (부산 하천별 중심 좌표 및 기본 Zoom Level)
 * 향후 새로운 좌표나 마커 데이터를 추가하기 쉽게 설정값으로 분리했습니다.
 */

export const DEFAULT_MAP_CONFIG = {
  center: { lat: 35.1795543, lng: 129.0756416 }, // 부산광역시청 중심 좌표
  level: 4 // 기본 확대 수준
};

export const RIVER_MAP_CONFIG = {
  '온천천': {
    center: { lat: 35.19778, lng: 129.08383 },
    level: 4
  },
  '수영강': {
    center: { lat: 35.1725, lng: 129.1258 },
    level: 4
  },
  '삼락천': {
    center: { lat: 35.1633, lng: 128.9814 },
    level: 4
  },
  '대천천': {
    center: { lat: 35.2155, lng: 129.0275 },
    level: 4
  }
};
