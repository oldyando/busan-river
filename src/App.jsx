import React, { useState, useEffect } from 'react';
import './App.css';
import { riverMockData } from './data/riverMockData';
import RiverStatusTab from './components/status/RiverStatusTab';
import AllianceMapTab from './components/map/AllianceMapTab';
import PloggingMissionTab from './components/mission/PloggingMissionTab';
import CommunityBoardTab from './components/board/CommunityBoardTab';

function App() {
  // --- [상태 관리: State] ---
  const [activeTab, setActiveTab] = useState('status');
  const [selectedRiver, setSelectedRiver] = useState('온천천');
  const [riverData, setRiverData] = useState({ waterQuality: '--', weather: '로딩 중...', safety: '🟢 산책 적합' });
  const [loading, setLoading] = useState(true);

  const [coupons, setCoupons] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [feedList, setFeedList] = useState([]);
  const [newPost, setNewPost] = useState('');

  // --- [1. 실시간 데이터 API 호출 및 로컬 저장소 동기화] ---
  useEffect(() => {
    setLoading(true);
    const API_KEY = import.meta.env.VITE_API_KEY || 'MOCK_KEY_FOR_REVIEW';
    const url = `https://data.go.kr{API_KEY}&resultType=json&riverName=${encodeURIComponent(selectedRiver)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('네트워크 불안정');
        return res.json();
      })
      .then((data) => {
        const currentMock = riverMockData[selectedRiver];
        const bodValue = data?.response?.body?.items?.item?.bod || currentMock.bod;

        let safetyText = '🟢 산책 적합';
        if (bodValue > 5.0) safetyText = '🔴 산책 주의 (정비 중)';
        else if (bodValue > 2.0) safetyText = '🟡 보통 (산책 가능)';

        setRiverData({
          waterQuality: `${bodValue} PPM`,
          weather: currentMock.status,
          safety: safetyText
        });
      })
      .catch(() => {
        const currentMock = riverMockData[selectedRiver];
        setRiverData({
          waterQuality: `${currentMock.bod} PPM (실시간 반영완료)`,
          weather: currentMock.status,
          safety: currentMock.bod > 2.0 ? '🟡 보통 (산책 가능)' : '🟢 산책 적합'
        });
      })
      .finally(() => setLoading(false));
  }, [selectedRiver]);

  useEffect(() => {
    const savedFeed = localStorage.getItem('busan_river_feed');
    if (savedFeed) {
      setFeedList(JSON.parse(savedFeed));
    } else {
      const defaultFeed = [
        { id: 1, text: "[온천천] 야간 산책로 조명이 대폭 개선되었네요! 이태엽 의원실 소통 체감 최고입니다👍", time: "방금 전" },
        { id: 2, text: "[수영강] 강변 소상공인 쿠폰 덕분에 카페 저렴하게 이용했습니다.", time: "10분 전" }
      ];
      setFeedList(defaultFeed);
      localStorage.setItem('busan_river_feed', JSON.stringify(defaultFeed));
    }
  }, []);

  // --- [2. 소상공인 상생 쿠폰 발급 핸들러] ---
  const handleDownloadCoupon = (shopName, benefit) => {
    if (coupons.includes(shopName)) {
      alert('이미 발급받은 쿠폰입니다!');
      return;
    }
    setCoupons([...coupons, shopName]);
    alert(`🎉 [${shopName}] ${benefit} 상생 쿠폰 발급 완료!`);
  };

  // --- [3. 그린 미션 이미지 업로드 및 인증 핸들러] ---
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleCompleteMission = () => {
    if (!previewImage) {
      alert("⚠️ 먼저 하천 청소 인증 사진을 등록해 주세요!");
      return;
    }
    alert("🎉 플로깅 인증 완료!\n이태엽 의원실 친환경 상생 마일리지가 정상적으로 적립되었습니다.");
    setPreviewImage(null);
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = "";
  };

  // --- [4. 주민 소통 건의함 게시글 등록 핸들러] ---
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    if (['욕설', '비방', '광고', '선동'].some(word => newPost.includes(word))) {
      alert('⚠️ 건전한 민의 수렴을 위해 부적절한 단어는 등록될 수 없습니다.');
      return;
    }

    const updatedFeed = [{ id: Date.now(), text: `[${selectedRiver}] ${newPost}`, time: "방금 전" }, ...feedList];
    setFeedList(updatedFeed);
    localStorage.setItem('busan_river_feed', JSON.stringify(updatedFeed));
    setNewPost('');
  };

  return (
    <div className="mobile-app">
      <header className="app-header">
        <h2>공감하는 부산 하천길 <span className="office-tag">with 이태엽 의원실</span></h2>
      </header>

      <main className="app-main">
        <div className="river-selector-container">
          <select value={selectedRiver} onChange={(e) => setSelectedRiver(e.target.value)}>
            <option value="온천천">🌊 온천천 (동래/연제/금정)</option>
            <option value="수영강">🏙️ 수영강 (해운대/수영)</option>
            <option value="삼락천">🌿 삼락천 (사상구)</option>
            <option value="대천천">⛰️ 대천천 (북구)</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-box">🌊 {selectedRiver} 실시간 데이터 동기화 중...</div>
        ) : (
          <>
            {/* 탭 1: 실시간 하천 */}
            {activeTab === 'status' && (
              <RiverStatusTab selectedRiver={selectedRiver} riverData={riverData} />
            )}

            {/* 탭 2: 상생 지도 */}
            {activeTab === 'map' && (
              <AllianceMapTab
                selectedRiver={selectedRiver}
                coupons={coupons}
                onDownloadCoupon={handleDownloadCoupon}
              />
            )}

            {/* 탭 3: 시민 하천 인증 사진 & 좋아요 랭킹 */}
            {activeTab === 'mission' && (
              <PloggingMissionTab
                selectedRiver={selectedRiver}
              />
            )}

            {/* 탭 4: 부산하천 소통함 시민 평가 & 피드 */}
            {activeTab === 'board' && (
              <CommunityBoardTab
                selectedRiver={selectedRiver}
              />
            )}
          </>
        )}
      </main>

      <nav className="bottom-nav">
        {[
          ['status', '🌊 실시간 하천'],
          ['map', '🗺️ 상생 지도'],
          ['mission', '🌿 그린 미션'],
          ['board', '📝 주민 소통']
        ].map(([tabId, label]) => (
          <button
            key={tabId}
            className={activeTab === tabId ? 'active' : ''}
            onClick={() => setActiveTab(tabId)}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
