import React, { useState, useEffect } from 'react';
import { RIVERS_LIST } from '../../data/riverEvaluationData';
import {
  getStoredPhotos,
  savePhotos,
  getUserPhotoReactions,
  saveUserPhotoReactions,
  togglePhotoReaction
} from '../../data/riverPhotoVerificationData';

/**
 * 📷 탭 3: 시민 하천 사진 인증 & 🏆 좋아요 랭킹
 */
function PloggingMissionTab({ selectedRiver }) {
  const [photos, setPhotos] = useState([]);
  const [userReactions, setUserReactions] = useState({});

  // 폼 상태
  const [inputRiver, setInputRiver] = useState('온천천');
  const [inputLocation, setInputLocation] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [formError, setFormError] = useState(null);

  // 로컬 저장소에서 데이터 로드
  useEffect(() => {
    setPhotos(getStoredPhotos());
    setUserReactions(getUserPhotoReactions());
  }, []);

  // 외부 상단 드롭다운(selectedRiver) 변경 시 하천 자동 동기화
  useEffect(() => {
    if (selectedRiver) {
      setInputRiver(selectedRiver);
    }
  }, [selectedRiver]);

  // 사진 파일 선택 및 미리보기 생성
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('⚠️ 이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // 사진 등록 제출 처리
  const handleSubmitPhoto = (e) => {
    e.preventDefault();

    if (!previewImage) {
      setFormError('⚠️ 하천 인증 사진을 첨부해 주세요.');
      return;
    }

    if (!inputLocation.trim()) {
      setFormError('⚠️ 촬영 또는 방문하신 상세 위치를 입력해 주세요. (예: 부산 동래구 온천천)');
      return;
    }

    const newPhoto = {
      id: `PHOTO-${Date.now()}`,
      riverName: inputRiver,
      location: inputLocation.trim(),
      imageUrl: previewImage,
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updatedPhotos = [newPhoto, ...photos];
    setPhotos(updatedPhotos);
    savePhotos(updatedPhotos);

    // 폼 초기화
    setPreviewImage(null);
    setInputLocation('');
    setFormError(null);

    const fileInput = document.getElementById('photo-upload-input');
    if (fileInput) fileInput.value = '';

    alert('🎉 시민 하천 인증 사진이 등록되었습니다! 다른 시민들의 좋아요 공감을 받아보세요.');
  };

  // 좋아요 / 싫어요 토글 처리
  const handleReaction = (photoId, type) => {
    const result = togglePhotoReaction(photoId, type, photos, userReactions);
    setPhotos(result.updatedPhotos);
    setUserReactions(result.updatedReactions);

    savePhotos(result.updatedPhotos);
    saveUserPhotoReactions(result.updatedReactions);
  };

  // 좋아요 랭킹 데이터 (좋아요 내림차순 정렬)
  const rankedPhotos = [...photos].sort((a, b) => b.likes - a.likes);

  // 랭킹 순위 뱃지 헬퍼
  const getRankBadge = (index) => {
    if (index === 0) return <span className="rank-badge gold">🥇 1위</span>;
    if (index === 1) return <span className="rank-badge silver">🥈 2위</span>;
    if (index === 2) return <span className="rank-badge bronze">🥉 3위</span>;
    return <span className="rank-badge normal">{index + 1}위</span>;
  };

  return (
    <div className="tab-panel">
      {/* 1. 타이틀 영역 */}
      <div className="board-header-section">
        <h3>📷 시민 하천 인증 사진 & 🏆 좋아요 랭킹</h3>
        <div className="office-box">
          📸 <strong>시민 하천 현장 인증 공간</strong>
          <p>
            시민 여러분이 직접 하천을 방문하여 촬영한 인증 사진을 공유하세요. 다른 시민들의 공감(좋아요) 수치에 따라 실시간 🏆 랭킹이 결정됩니다.
          </p>
        </div>
      </div>

      {/* 2. 사진 인증 등록 폼 서식 */}
      <div className="photo-upload-card">
        <div className="card-header-sm">
          <h4>✍️ 시민 하천 인증 사진 등록</h4>
        </div>

        <form onSubmit={handleSubmitPhoto} className="photo-form">
          {/* 하천 선택 */}
          <div className="form-group">
            <label className="form-label">하천 선택</label>
            <select
              value={inputRiver}
              onChange={(e) => setInputRiver(e.target.value)}
              className="toss-select"
            >
              {RIVERS_LIST.map((r) => (
                <option key={r.id} value={r.name}>
                  🌊 {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* 사진 업로드 및 미리보기 */}
          <div className="form-group">
            <label className="form-label">📷 인증 사진 업로드</label>
            <div className="photo-preview-box">
              {previewImage ? (
                <div className="preview-image-wrapper">
                  <img src={previewImage} alt="인증샷 미리보기" className="preview-img-full" />
                  <label htmlFor="photo-upload-input" className="reselect-btn">
                    🔄 사진 다시 선택
                  </label>
                </div>
              ) : (
                <div className="upload-placeholder-box">
                  <span className="upload-icon">📷</span>
                  <p>촬영하신 하천 현장 인증 사진을 첨부해 주세요</p>
                  <label htmlFor="photo-upload-input" className="toss-btn-secondary">
                    사진 선택하기
                  </label>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id="photo-upload-input"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* 방문 위치 입력 */}
          <div className="form-group">
            <label className="form-label">📍 상세 위치 입력</label>
            <input
              type="text"
              className="toss-input"
              placeholder="예: 부산 동래구 온천천 시민공원, APEC 나루공원 등"
              value={inputLocation}
              onChange={(e) => setInputLocation(e.target.value)}
              maxLength={60}
            />
          </div>

          {/* 검증 에러 알림 */}
          {formError && <div className="form-error-alert">{formError}</div>}

          <button type="submit" className="toss-btn-primary submit-photo-btn">
            📸 시민 인증 사진 등록하기
          </button>
        </form>
      </div>

      {/* 3. 🏆 좋아요 랭킹 섹션 */}
      <div className="photo-ranking-section">
        <div className="section-title-bar">
          <h4>🏆 시민 인증 좋아요 랭킹</h4>
          <span className="ranking-tip">좋아요 변경 시 실시간 반영</span>
        </div>

        <div className="ranking-carousel-list">
          {rankedPhotos.slice(0, 5).map((photo, idx) => (
            <div className="ranking-item-card" key={photo.id}>
              <div className="ranking-card-top">
                {getRankBadge(idx)}
                <span className="ranking-like-tag">👍 {photo.likes}</span>
              </div>
              <div className="ranking-thumb-box">
                <img src={photo.imageUrl} alt={photo.riverName} className="ranking-thumb-img" />
              </div>
              <div className="ranking-card-info">
                <strong>🌊 {photo.riverName}</strong>
                <p>📍 {photo.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 시민 인증 사진 피드 */}
      <div className="photo-feed-section">
        <div className="section-title-bar">
          <h4>🖼️ 시민 인증 사진 피드 ({photos.length}개)</h4>
        </div>

        {photos.length === 0 ? (
          <div className="empty-reviews-box">
            <span>📷 아직 등록된 시민 인증 사진이 없습니다. 첫 사진을 등록해보세요!</span>
          </div>
        ) : (
          <div className="photo-feed-grid">
            {photos.map((photo) => {
              const currentReaction = userReactions[photo.id]; // 'like' | 'dislike' | undefined

              return (
                <div className="photo-feed-card" key={photo.id}>
                  {/* 사진 이미지 */}
                  <div className="photo-card-img-wrapper">
                    <img src={photo.imageUrl} alt={photo.riverName} className="photo-card-img" />
                    <span className="photo-river-badge">🌊 {photo.riverName}</span>
                  </div>

                  {/* 사진 내용 정보 */}
                  <div className="photo-card-body">
                    <div className="photo-location-row">
                      <span>📍 {photo.location}</span>
                    </div>

                    <div className="photo-date-row">
                      <small>{photo.createdAt}</small>
                    </div>

                    {/* 👍 좋아요 / 👎 싫어요 대화형 버튼 */}
                    <div className="photo-reactions-row">
                      <button
                        className={`reaction-btn like ${currentReaction === 'like' ? 'active' : ''}`}
                        onClick={() => handleReaction(photo.id, 'like')}
                      >
                        <span className="reaction-icon">👍</span>
                        <span>좋아요 {photo.likes}</span>
                      </button>

                      <button
                        className={`reaction-btn dislike ${currentReaction === 'dislike' ? 'active' : ''}`}
                        onClick={() => handleReaction(photo.id, 'dislike')}
                      >
                        <span className="reaction-icon">👎</span>
                        <span>싫어요 {photo.dislikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PloggingMissionTab;
