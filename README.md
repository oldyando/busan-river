# 🌊 공감하는 부산 하천길 (with 이태엽 의원실)

> **부산 대표 10대 하천(온천천·수영강·낙동강·동천·삼락천·대천천·가야천·부전천·전포천·호계천)의 실시간 환경 지수, 카카오맵 상생 지도, 시민 사진 인증 및 실시간 🏆 랭킹, 시민 평가 기반 🤖 Google Gemini AI 분석 플랫폼**

---

## 📌 프로젝트 소개 (About the Project)

**"공감하는 부산 하천길"**은 부산 시민들이 직접 부산의 각 하천을 방문하고 이용하면서 모이는 실시간 수질·환경 지수, 소상공인 상생 할인 쿠폰, 시민 현장 사진 인증 및 종합 시민 평가 빅데이터를 체계적으로 수집·분석하는 **토스(Toss) 스타일 주민 밀착형 통합 의정 웹 플랫폼**입니다.

축적된 시민 평가 데이터를 바탕으로 **Google Gemini AI(`gemini-2.5-flash`)**가 하천별 문제점과 예산 투입 우선순위를 정밀 분석하여 의정 활동 및 환경 정비 정책 수립에 반영합니다.

---

## ✨ 4대 탭 주요 기능 (Key Features)

### 🌊 1. 실시간 하천 (River Status)
- **실시간 데이터 동기화**: 공공데이터 API 기반 수질 지수(BOD PPM 수치) 및 동네 실시간 기상 상태 조회
- **생활 안전 등급 알림**: 수질 및 수위에 따른 3단계 산책 안전 상태 (🟢 산책 적합 / 🟡 보통 / 🔴 산책 주의)
- **기습 호우 대피 경보**: 하천 침수 및 교각 위험 발생 시 기습 대피 안심 배너 노출
- **구역별 의정 소식**: 해당 하천 지역구의 환경 정비 및 생태 복원 의정 소식 안내

### 🗺️ 2. 소상공인 상생 지도 (Alliance & Kakao River Map)
- **카카오맵 (Kakao Maps JS API) 연동**: 인공적인 Polyline 선을 배제하고 카카오맵 본래의 정밀한 하천 지형 및 수변 공간 연동
- **부산 10대 하천 중심 좌표 이동**: 온천천, 수영강, 낙동강, 동천, 삼락천, 대천천, 가야천, 부전천, 전포천, 호계천 원클릭 `panTo` 이동
- **하천 상세 카드 오버레이 (`RiverInfoCard`)**: 하천 대표 사진, 시민 선호도 평점 (⭐ 4.8), 생태 설명 팝업 카드 노출
- **하천별 맞춤 소상공인 우대 쿠폰**: 각 하천 수변 산책로 주변의 카페, 자전거 렌탈/정비소, 수제 베이커리, 전통 맛집 우대 할인 쿠폰 실시간 발급

### 📷 3. 시민 하천 인증 사진 & 🏆 실시간 좋아요 랭킹 (Photo Verification & Ranking)
- **시민 인증 사진 및 📍 위치 등록**:
  - 하천 선택 및 인증 사진 업로드 (`input type="file"`)
  - 실시간 미리보기 및 **사진 다시 선택** 지원
  - 📍 촬영 상세 위치 입력 (예: *부산 동래구 온천천 시민공원*) 및 유효성 검증
- **대화형 👍/👎 반응 시스템**:
  - 사진 카드별 👍 좋아요 / 👎 싫어요 토글 기능
  - 동일 사진에 좋아요와 싫어요를 동시에 선택할 수 없도록 상호 배타적 클릭 처리
- **🏆 실시간 좋아요 랭킹**:
  - 좋아요 수 기준 내림차순 정렬 및 **Top 3 뱃지 (🥇 1위, 🥈 2위, 🥉 3위)** 제공
  - 시민들의 좋아요 클릭 시 랭킹 순위 실시간 재정렬
- **AI 데이터와의 완벽한 분리**: 인증 사진 및 반응 데이터는 `busan_river_photo_verifications_v1` 키로 독점 관리되어 AI 분석 데이터와 분리 운영

### 📝 4. 부산하천 소통함 시민 평가 & 🤖 Gemini AI 분석 (Citizen Evaluation & AI Analysis)
- **4대 항목 대화형 별점 평가 (`RiverEvaluationForm`)**:
  - 물의 깨끗함 (수질 및 냄새), 둑과 바닥의 자연성, 함께 사는 생물 (생태계), 산책 및 휴식환경 (친수성) 별점(1~5점) 및 시민 한줄평 등록
- **📊 하천별 평가 집계 리포트 (`RiverEvaluationResult`)**:
  - 선택한 하천의 총 참여 수, 시민 종합 평점 (★ 4.8 / 5.0), 4개 항목별 별점 평균 프로그레스 바 제공
- **⚖️ 부산 하천 전체 평가 비교 매트릭스 (`RiverComparisonTable`)**:
  - 부산 전체 하천의 종합 평점 및 항목별 평점을 한눈에 비교하는 실시간 컬럼 오름차순/내림차순 정렬 테이블
- **💬 시민 실시간 한줄평 공감 피드 (`CitizenReviewFeed`)**:
  - 시민 한줄평 및 ❤️ 대화형 좋아요 공감 기능
  - 1순위 공감(좋아요) 많은 순, 2순위 최신순 실시간 자동 정렬
- **🤖 Google Gemini AI 하천 종합 분석 (`RiverAIAnalysis` & `riverAI.js`)**:
  - `@google/genai` SDK 및 `gemini-2.5-flash` 모델 기반
  - 시민 평가 점수, 한줄평, **좋아요(공감 수) 가중치**, 작성일을 JSON 데이터로 Gemini에 주입
  - **Structured Output JSON Schema 기반 정밀 분석 리포트 카드 노출**:
    - 📌 **종합 분석 리포트 (`summary`)**
    - 🟢 **시민 긍정 평가 요소 (`strengths`)**
    - 🔴 **주요 문제점 및 개선 우선순위 (`mainIssues`: 🔴 High / 🟡 Medium / 🟢 Low 뱃지)**
    - 📊 **시민 의견 감정 분석 (`sentiment`: 긍정/중립/부정 게이지 바)**
    - 💡 **AI 개선 제언 (`improvementSuggestions`)**

---

## 🛠️ 기술 스택 (Tech Stack)

* **Core**: React `v19.2`, JavaScript (ESNext)
* **Build Tool**: Vite `v8.2`
* **AI Engine**: `@google/genai` (`gemini-2.5-flash` 모델)
* **Map SDK**: Kakao Maps JavaScript API
* **Styling**: Vanilla CSS (Toss Design System, Glassmorphism, Responsive Mobile Web)
* **State & Storage**: React Hooks (`useState`, `useEffect`, `useRef`), `localStorage` Persistence

---

## 📂 프로젝트 구조 (Directory Structure)

```text
busan-river/
├── public/                     # 정적 이미지 및 파비콘 리소스
│   └── images/rivers/          # 부산 대표 하천 이미지 파일
├── src/
│   ├── ai/                     # 🤖 Gemini AI 분석 파이프라인
│   │   ├── riverAI.js          # Gemini API SDK 연동 및 JSON Schema 분석
│   │   └── riverAIPrompt.js    # 10가지 분석 기준 프롬프트 템플릿
│   ├── components/             # 4대 탭별 독립 컴포넌트 폴더
│   │   ├── status/             # 🌊 탭 1: 실시간 하천 상태
│   │   │   └── RiverStatusTab.jsx
│   │   ├── map/                # 🗺️ 탭 2: 소상공인 상생 지도 & 카카오맵
│   │   │   ├── AllianceMapTab.jsx
│   │   │   ├── KakaoMap.jsx
│   │   │   ├── RiverLayer.jsx
│   │   │   └── RiverInfoCard.jsx
│   │   ├── mission/            # 📷 탭 3: 시민 사진 인증 & 🏆 좋아요 랭킹
│   │   │   └── PloggingMissionTab.jsx
│   │   └── board/              # 📝 탭 4: 소통함 시민 평가 & 🤖 AI 분석
│   │       ├── CommunityBoardTab.jsx
│   │       ├── RiverEvaluationForm.jsx
│   │       ├── RiverEvaluationResult.jsx
│   │       ├── RiverComparisonTable.jsx
│   │       ├── CitizenReviewFeed.jsx
│   │       └── RiverAIAnalysis.jsx
│   ├── data/                   # 💾 데이터 정의 및 LocalStorage 동기화
│   │   ├── riverData.js        # 카카오맵 10대 하천 좌표 & 소상공인 쿠폰
│   │   ├── riverMockData.js    # 탭 1 환경 지수 데이터
│   │   ├── riverEvaluationData.js # 탭 4 평가 항목, 리뷰 축적 & AI 맵핑
│   │   └── riverPhotoVerificationData.js # 탭 3 사진 인증 & 반응 전용 데이터
│   ├── config/
│   │   └── mapConfig.js        # 카카오 지도 기본 좌표/옵션
│   ├── App.jsx                 # 메인 애플리케이션 및 하단 내비게이션
│   └── App.css                 # Toss 디자인 시스템 전용 통합 CSS
├── .env.local                  # KakaoMap & Gemini API 키 설정 파일
└── README.md                   # 프로젝트 통합 설명 문서
```

---

## ⚙️ 환경변수 설정 (.env.local)

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 아래 API 키를 설정합니다.

```env
VITE_KAKAO_MAP_KEY=YOUR_KAKAO_MAP_JAVASCRIPT_KEY
VITE_GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
```

---

## 🚀 시작하기 (Getting Started)

### 1. 프로젝트 클론 및 이동
```bash
git clone https://github.com/oldyando/busan-river.git
cd busan-river
```

### 2. 의존성 패키지 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 주소로 접속합니다.

### 4. 프로덕션 빌드 및 검증
```bash
npm run build
```

---

## 📄 라이선스 (License)

본 프로젝트는 오픈소스 파트너십 및 부산광역시 하천 환경 보호 및 상생 발전을 위해 제공됩니다.
