import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function DMPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoggedIn,
    userId,
    isRead,
    nickname,
    jwtToken,
    item,
    unreadMessageCount,
  } = location.state; // useLocation을 사용하여 state 접근

  const hi = () => {
    navigate('/dmbox', {
      state: {
        userId,
        isLoggedIn,
        jwtToken,
        nickname,
      },
    });
  };

  return (
    <div>
      <div>
        <div>
          <button onClick={hi}>뒤로가기</button>
        </div>
        <div>
          <div>
            <span>{item.username}의 쪽지</span>
          </div>
        </div>
        <div>
          <span>전송일시 {item.time}</span>
        </div>
      </div>

      <div>
        <span>{item.title}</span>
      </div>
    </div>
  );
}

export default DMPage;
