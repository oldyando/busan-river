import { RIVER_DATA } from '../data/riverData';

/**
 * 🗺️ 지도 기본 설정값 (mapConfig.js)
 * 지도 자체의 기본 중심 좌표와 확대 레벨만 전담하여 관리합니다.
 */

export const DEFAULT_MAP_CONFIG = {
  center: { lat: 35.1795543, lng: 129.0756416 }, // 부산광역시청 중심 좌표 (부산 전역 조망)
  level: 6 // 부산 전체 하천이 한눈에 보이는 확대 레벨
};

/**
 * 하천별 중심 위치 상용 호환용 맵핑 (riverData.js 기반 참조)
 */
export const RIVER_MAP_CONFIG = RIVER_DATA.reduce((acc, river) => {
  acc[river.name] = {
    center: river.center,
    level: river.level
  };
  return acc;
}, {});
