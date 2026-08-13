/**
 * 🌊 부산 대표 하천 10개 정밀 데이터 (RIVER_DATA)
 * 
 * - 하천의 center 좌표는 카카오맵 이동(panTo) 및 마커 노출용 정밀 WGS84 좌표입니다.
 * - 하천의 실제 물줄기 및 지형은 카카오 지도 자체의 기본 지도를 활용합니다.
 * - 각 하천 주변에서 사용할 수 있는 하천별 맞춤 소상공인 쿠폰(shops)이 내장되어 있습니다.
 */

export const RIVER_DATA = [
  {
    id: 'oncheoncheon',
    name: '온천천',
    center: { lat: 35.19778, lng: 129.08383 },
    level: 5,
    rating: 4.8,
    image: '/images/rivers/oncheoncheon.jpg',
    description: '금정구, 동래구, 연제구를 가로지르는 부산의 대표적인 도심 생태하천입니다. 봄철 벚꽃 산책로와 수변 자전거 도로가 시민들의 활력소가 되고 있습니다.',
    waterLevel: '보통',
    odorLevel: '쾌적',
    floodRisk: '안전',
    shops: [
      { name: '온천천 카페거리 멜로우 로스터리', benefit: '아메리카노 1,000원 즉시 할인' },
      { name: '온천천 수변 자전거 쉼터 수제 국수', benefit: '식사 주문 시 수제 만두 무료' },
      { name: '동래 벚꽃길 동네 베이커리', benefit: '당일 제빵 전 품목 10% 우대 할인' },
      { name: '온천천 플로깅 수변 용품점', benefit: '친환경 장갑 및 텀블러 15% 할인' }
    ]
  },
  {
    id: 'suyeonggang',
    name: '수영강',
    center: { lat: 35.1725, lng: 129.1258 },
    level: 5,
    rating: 4.6,
    image: '/images/rivers/suyeonggang.jpg',
    description: '회동수원지에서 출발하여 해운대와 수영만을 잇는 웅장한 하천입니다. APEC 나루공원 및 수변 공원과 연계되어 탁 트인 도시 경관을 자랑합니다.',
    waterLevel: '보통',
    odorLevel: '쾌적',
    floodRisk: '안전',
    shops: [
      { name: 'APEC 나루공원 센텀 강변 카페', benefit: '음료 주문 시 프리미엄 디저트 10% 할인' },
      { name: '수영강 보행교 자전거 라운지', benefit: '자전거 정비 및 렌탈 2,000원 할인' },
      { name: '민락 수변 전통 횟집 상생 가맹점', benefit: '모듬회 주문 시 음료 1병 서비스' },
      { name: '수영강 야경 브런치 앤 다이닝', benefit: '식사 세트 구매 시 15% 우대 할인' }
    ]
  },
  {
    id: 'nakdonggang',
    name: '낙동강',
    center: { lat: 35.1580, lng: 128.9720 },
    level: 6,
    rating: 4.7,
    image: '/images/rivers/samnakcheon.jpg',
    description: '부산의 젖줄이자 최대 국가하천으로, 을숙도 철새 도래지와 삼락생태공원이 위치한 대한민국 대표 생태의 보고입니다.',
    waterLevel: '양호',
    odorLevel: '쾌적',
    floodRisk: '안전',
    shops: [
      { name: '을숙도 생태공원 수변 쉼터 카페', benefit: '아메리카노 1,000원 현장 할인' },
      { name: '삼락 강변 자전거 렌탈샵', benefit: '자전거 대여 1시간 추가 무료' },
      { name: '낙동강 구포 전통 국수 맛집', benefit: '구포국수 주문 시 주먹밥 서비스' },
      { name: '낙동강 노을 피크닉 기어 렌탈', benefit: '피크닉 매트 세트 20% 할인' }
    ]
  },
  {
    id: 'dongcheon',
    name: '동천',
    center: { lat: 35.1455, lng: 129.0625 },
    level: 5,
    rating: 4.2,
    image: '/images/rivers/oncheoncheon.jpg',
    description: '부산진구와 남구를 가로지르는 도심 하천으로, 해수 도수관 작업과 생태 복원을 통해 깨끗한 도심 친수 공간으로 거듭나고 있습니다.',
    waterLevel: '보통',
    odorLevel: '보통',
    floodRisk: '관심',
    shops: [
      { name: '문현금융단지 동천 로스팅 카페', benefit: '모든 커피 메뉴 1,000원 할인' },
      { name: '서면 동천 소상공인 착한 파스타', benefit: '파스타 주문 시 마늘빵 무료' },
      { name: '동천 힐링 수변 샌드위치 숍', benefit: '샌드위치 구매 시 아메리카노 50% 할인' },
      { name: '부산진구 상생 수제 베이킹', benefit: '당일 생산 빵 10% 할인' }
    ]
  },
  {
    id: 'samnakcheon',
    name: '삼락천',
    center: { lat: 35.1633, lng: 128.9814 },
    level: 5,
    rating: 4.3,
    image: '/images/rivers/samnakcheon.jpg',
    description: '사상구 삼락생태공원과 인접한 생태 정화 하천입니다. 습지 생태계 보존 구역으로 철새들과 다양한 수생 생물의 터전입니다.',
    waterLevel: '주의',
    odorLevel: '보통',
    floodRisk: '관심',
    shops: [
      { name: '사상 삼락천 생태공원 수변 카페', benefit: '아메리카노 1,000원 할인' },
      { name: '삼락 자전거 동호회 쉼터', benefit: '자전거 세차 및 정비 2,000원 할인' },
      { name: '사상 전통시장 상생 과일 주스', benefit: '생과일 주스 500원 우대 할인' }
    ]
  },
  {
    id: 'daecheoncheon',
    name: '대천천',
    center: { lat: 35.2345, lng: 129.0230 },
    level: 5,
    rating: 4.7,
    image: '/images/rivers/daecheoncheon.jpg',
    description: '금정산 고당봉 청정 계곡수에서 발원하여 화명동을 거쳐 낙동강으로 흐르는 맑고 깨끗한 힐링 계곡 하천입니다. 여름철 피서지로 각광받고 있습니다.',
    waterLevel: '양호',
    odorLevel: '최상',
    floodRisk: '안전',
    shops: [
      { name: '금정산 대천천 계곡 힐링 찻집', benefit: '한방차 및 전통차 10% 할인' },
      { name: '화명동 대천천 수변 산채 비빔밥', benefit: '식사 주문 시 수제 도토리묵 무료' },
      { name: '대천천 계곡 피서 베이커리', benefit: '전 품목 10% 할인 쿠폰' }
    ]
  },
  {
    id: 'gayacheon',
    name: '가야천',
    center: { lat: 35.1552, lng: 129.0385 },
    level: 4,
    rating: 4.1,
    image: '/images/rivers/oncheoncheon.jpg',
    description: '부산진구 가야동 지역을 흐르는 지방 소하천으로 주민 산책로와 보행 환경 정비 사업이 활발히 진행 중인 친근한 마을 하천입니다.',
    waterLevel: '보통',
    odorLevel: '보통',
    floodRisk: '안전',
    shops: [
      { name: '가야천 수변 감성 마을 카페', benefit: '아메리카노 1,000원 할인' },
      { name: '가야 동네 착한 소상공인 분식', benefit: '떡볶이 주문 시 모듬 튀김 서비스' }
    ]
  },
  {
    id: 'bujeoncheon',
    name: '부전천',
    center: { lat: 35.1578, lng: 129.0592 },
    level: 4,
    rating: 4.4,
    image: '/images/rivers/suyeonggang.jpg',
    description: '부산 서면 중심가와 부전시장을 잇는 하천으로 도심 수변 보행길 복원 사업이 지속적으로 추진되고 있는 도심 명소입니다.',
    waterLevel: '보통',
    odorLevel: '보통',
    floodRisk: '안전',
    shops: [
      { name: '서면 부전천 복개길 에스프레소 바', benefit: '에스프레소 메뉴 10% 할인' },
      { name: '부전시장 상생 전통 떡집', benefit: '수제 떡 구매 시 2,000원 할인' }
    ]
  },
  {
    id: 'jeonpocheon',
    name: '전포천',
    center: { lat: 35.1540, lng: 129.0645 },
    level: 4,
    rating: 4.5,
    image: '/images/rivers/oncheoncheon.jpg',
    description: '전포 카페거리 인근을 지나 동천으로 합류하는 소하천으로 젊은 층과 관광객들이 찾는 이색 수변 문화 골목입니다.',
    waterLevel: '보통',
    odorLevel: '쾌적',
    floodRisk: '안전',
    shops: [
      { name: '전포 카페거리 전포천 로스터리', benefit: '드립 커피 1,000원 즉시 할인' },
      { name: '전포 수변 샌드위치 & 샐러드', benefit: '음료 세트 구매 시 10% 할인' }
    ]
  },
  {
    id: 'hogyecheon',
    name: '호계천',
    center: { lat: 35.1415, lng: 129.0520 },
    level: 4,
    rating: 4.2,
    image: '/images/rivers/samnakcheon.jpg',
    description: '범천동 주거지역을 감싸 안고 흐르는 아담한 소하천으로 수변 조경과 주민 쉼터가 정비되어 조용한 산책길을 제공합니다.',
    waterLevel: '보통',
    odorLevel: '보통',
    floodRisk: '안전',
    shops: [
      { name: '범천동 호계천 수변 마을 카페', benefit: '아메리카노 1,000원 할인' },
      { name: '범천 상생 착한 전통 국밥집', benefit: '국밥 주문 시 시원한 음료 서비스' }
    ]
  }
];

export function getRiverByName(name) {
  return RIVER_DATA.find((r) => r.name === name) || RIVER_DATA[0];
}

export function getRiverById(id) {
  return RIVER_DATA.find((r) => r.id === id) || RIVER_DATA[0];
}
