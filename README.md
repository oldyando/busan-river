# 🌊 공감하는 부산 하천길 (with 이태엽 의원실)

> **부산시 4대 하천(온천천·수영강·삼락천·대천천)의 실시간 수질/안전 정보, 지역 소상공인 상생, 친환경 플로깅 미션 및 주민 소통을 통합 지원하는 모바일 웹 플랫폼입니다.**

---

## 📌 프로젝트 소개 (About the Project)

**"공감하는 부산 하천길"**은 부산 시민들이 자주 찾는 4대 주요 하천의 환경 및 안전 정보를 실시간으로 확인하고, 하천 주변 소상공인 상권 활성화와 주민 참여형 환경 보호(플로깅) 활동을 하나로 연결하는 **주민 밀착형 환경·상생 의정 플랫폼**입니다.

---

## ✨ 주요 기능 (Key Features)

| 기능 | 설명 |
| :--- | :--- |
| **🌊 실시간 하천 상태** | • 온천천, 수영강, 삼락천, 대천천 선택 지원<br>• 공공데이터 API 연동 수질 지수(BOD PPM), 날씨, 생활 안전 등급 조회<br>• 하천별 구역 의정 소식 및 기속 호우 시 안전 대피 안내 |
| **🗺️ 소상공인 상생 지도** | • 하천 주변 골목상권 소상공인 상생 클러스터 안내<br>• 카페, 국수집, 베이커리 등 소상공인 우대 할인 쿠폰 실시간 발급 |
| **🌿 그린 플로깅 미션** | • 하천 정화 및 쓰레기 수거 사진 인증 업로드<br>• 플로깅 완료 시 친환경 상생 마일리지 적립 연동 |
| **📝 주민 소통 신문고** | • 하천 이용 관련 제보 및 실시간 한 줄 피드 공유 (LocalStorage 연동)<br>• 비속어/광고 자동 필터링 기능 탑재 |

---

## 🛠️ 기술 스택 (Tech Stack)

* **Framework & Library**: React `v19.2`, JavaScript (ESNext)
* **Build Tool**: Vite `v8.2`
* **Linter**: Oxlint
* **Styling**: Vanilla CSS (Mobile Responsive Design)
* **State & Data**: React State / LocalStorage / Public Data API (`data.go.kr`)

---

## 🚀 시작하기 (Getting Started)

### 1. 프로젝트 클론 및 이동
```bash
git clone https://github.com/oldyando/busan-river.git
cd busan-river
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```
실행 후 브라우저에서 `http://localhost:5173` 주소로 접속합니다.

### 4. 프로덕션 빌드
```bash
npm run build
```

---

## 📂 프로젝트 구조 (Directory Structure)

```
busan-river/
├── public/              # 정적 리소스 파일
├── src/
│   ├── App.jsx          # 메인 애플리케이션 컴포넌트 (상태 관리, API, 탭 컨트롤)
│   ├── App.css          # 애플리케이션 및 모바일 웹 스타일링
│   ├── main.jsx         # React 앱 진입점
│   └── index.css        # 전역 기본 스타일
├── package.json         # 프로젝트 의존성 및 스크립트 설정
├── vite.config.js       # Vite 설정 파일
└── README.md            # 프로젝트 설명 문서
```
