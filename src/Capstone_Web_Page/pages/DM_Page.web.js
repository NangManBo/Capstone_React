import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styles } from './style/styles'; // 웹에 맞는 CSS 스타일을 정의해야 합니다.

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
    console.log('messageId', item.username);
    console.log('보낸 시간 :', item.time);
    console.log('item 전체 :', item);
  };

  return (
    <div style={styles.main_page}>
      <div style={styles.main_Row15}>
        <div style={styles.back_view14}>
          <button onClick={hi} style={styles.button}>
            뒤로가기
          </button>
        </div>
        <div style={styles.dm_username}>
          <div style={styles.dm_username_view}>
            <span style={styles.dm_username_text}>
              {item.username}의 쪽지
            </span>
          </div>
          <div style={styles.dm_send_view}></div>
        </div>
        <div style={styles.dm_sendtime}>
          <span>전송일시 {item.time}</span>
        </div>
      </div>

      <div style={styles.dm_content}>
        <span style={styles.dm_content_text}>
          {item.title}
        </span>
      </div>
    </div>
  );
}

export default DMPage;
