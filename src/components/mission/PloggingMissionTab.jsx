import React from 'react';

/**
 * 🌿 탭 3: 친환경 그린 부산 플로깅 미션
 */
function PloggingMissionTab({ selectedRiver, previewImage, onImageUpload, onCompleteMission }) {
  return (
    <div className="tab-panel text-center">
      <h3>🌿 그린 부산 플로깅 미션</h3>
      <p className="sub-text">
        부산의 젖줄인 [{selectedRiver}]을 청정하게 보호해 주세요! 쓰레기 수거 인증샷 업로드 후 하단 인증 완료 버튼을 누르시면 골목 상권 우대 마일리지가 연동됩니다.
      </p>
      <div className="upload-container">
        {previewImage ? (
          <img src={previewImage} alt="인증샷 미리보기" className="preview-img" />
        ) : (
          <div className="upload-placeholder">📸 하천 청소 및 쓰레기 수거 인증 사진을 선택해 주세요</div>
        )}
        <input type="file" accept="image/*" id="file-upload" onChange={onImageUpload} />

        {!previewImage ? (
          <label htmlFor="file-upload" className="btn-upload">인증 사진 선택</label>
        ) : (
          <button onClick={onCompleteMission} className="btn-upload btn-success-confirm">
            인증 완료하기
          </button>
        )}
      </div>
    </div>
  );
}

export default PloggingMissionTab;
