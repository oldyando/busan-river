/**
 * 🌊 부산 대표 하천 데이터 (RIVER_DATA)
 * 하천 추가/수정/삭제가 자유로운 배열 기반 데이터 구조입니다.
 * 향후 수위(waterLevel), 냄새(odorLevel), 범람위험(floodRisk) 등 다양한 확장 데이터를 유연하게 담을 수 있습니다.
 */

export const RIVER_DATA = [
  {
    id: 'oncheoncheon',
    name: '온천천',
    center: {
      lat: 35.19778,
      lng: 129.08383
    },
    level: 5,
    rating: 4.8,
    image: '/images/rivers/oncheoncheon.jpg',
    description: '금정구, 동래구, 연제구를 가로지르는 부산의 대표적인 도심 생태하천입니다. 봄철 벚꽃 산책로와 수변 자전거 도로가 시민들의 활력소가 되고 있습니다.',
    // 온천천 Polyline 좌표 배열
    path: [
      { lat: 35.2150, lng: 129.0880 },
      { lat: 35.2050, lng: 129.0850 },
      { lat: 35.19778, lng: 129.08383 },
      { lat: 35.1880, lng: 129.0980 },
      { lat: 35.1830, lng: 129.1120 }
    ],
    waterLevel: '보통',
    odorLevel: '쾌적',
    floodRisk: '안전',
    reports: [],
    aiAnalysis: '수질 지수 양호, 산책 환경 최상'
  },
  {
    id: 'suyeonggang',
    name: '수영강',
    center: {
      lat: 35.1725,
      lng: 129.1258
    },
    level: 5,
    rating: 4.6,
    image: '/images/rivers/suyeonggang.jpg',
    description: '회동수원지에서 출발하여 해운대와 수영만을 잇는 웅장한 하천입니다. APEC 나루공원 및 수변 공원과 연계되어 탁 트인 도시 경관을 자랑합니다.',
    path: [
      { lat: 35.2050, lng: 129.1200 },
      { lat: 35.1900, lng: 129.1220 },
      { lat: 35.1725, lng: 129.1258 },
      { lat: 35.1610, lng: 129.1300 }
    ],
    waterLevel: '보통',
    odorLevel: '쾌적',
    floodRisk: '안전',
    reports: [],
    aiAnalysis: '야간 산책로 조도 우수'
  },
  {
    id: 'samnakcheon',
    name: '삼락천',
    center: {
      lat: 35.1633,
      lng: 128.9814
    },
    level: 5,
    rating: 4.3,
    image: '/images/rivers/samnakcheon.jpg',
    description: '사상구 삼락생태공원과 인접한 생태 정화 하천입니다. 습지 생태계 보존 구역으로 철새들과 다양한 수생 생물의 터전입니다.',
    path: [
      { lat: 35.1800, lng: 128.9750 },
      { lat: 35.1633, lng: 128.9814 },
      { lat: 35.1500, lng: 128.9870 }
    ],
    waterLevel: '주의',
    odorLevel: '보통',
    floodRisk: '관심',
    reports: [],
    aiAnalysis: '자연 습지 보존 상태 양호'
  },
  {
    id: 'daecheoncheon',
    name: '대천천',
    center: {
      lat: 35.2155,
      lng: 129.0275
    },
    level: 5,
    rating: 4.7,
    image: '/images/rivers/daecheoncheon.jpg',
    description: '금정산 고당봉 청정 계곡수에서 발원하여 낙동강으로 흐르는 맑고 깨끗한 힐링 계곡 하천입니다. 여름철 시민들의 피서지로 각광받고 있습니다.',
    path: [
      { lat: 35.2300, lng: 129.0400 },
      { lat: 35.2155, lng: 129.0275 },
      { lat: 35.2100, lng: 129.0150 }
    ],
    waterLevel: '양호',
    odorLevel: '최상',
    floodRisk: '안전',
    reports: [],
    aiAnalysis: '1급수 생태 환경 유지 중'
  }
];

export function getRiverByName(name) {
  return RIVER_DATA.find((r) => r.name === name) || RIVER_DATA[0];
}

export function getRiverById(id) {
  return RIVER_DATA.find((r) => r.id === id) || RIVER_DATA[0];
}
