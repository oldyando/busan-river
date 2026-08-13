import React from 'react';

/**
 * 📝 탭 4: 주민 소통 및 이태엽 의원실 통합 신문고
 */
function CommunityBoardTab({ selectedRiver, feedList, newPost, setNewPost, onAddPost }) {
  return (
    <div className="tab-panel">
      <h3>📝 부산 하천 주민 소통함</h3>
      <div className="office-box">
        🔒 <strong>이태엽 의원실 통합 신문고 (민원 수렴)</strong>
        <p>[{selectedRiver}] 이용 관련 정식 법적·행정적 건의 사항 및 불편 사항은 의원실 직통 데이터베이스로 안전하게 보호 수렴됩니다.</p>
      </div>
      <form onSubmit={onAddPost} className="board-form">
        <input 
          type="text" 
          placeholder={`${selectedRiver} 제보 사항을 한 줄로 공유해 주세요!`} 
          value={newPost} 
          onChange={(e) => setNewPost(e.target.value)} 
          maxLength={100} 
        />
        <button type="submit">등록</button>
      </form>
      <div className="feed-list">
        <h4>💬 실시간 한 줄 피드</h4>
        {feedList.map((post) => (
          <div className="feed-item" key={post.id}>
            <p>{post.text}</p>
            <span>{post.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityBoardTab;
