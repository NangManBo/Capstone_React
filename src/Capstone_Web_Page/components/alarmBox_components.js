import React from 'react';
import './styles/alarmBox_style.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export const AlarmBox = (
  isLoggedIn,
  userId,
  jwtToken,
  nickname,
  keyId,
  messages
) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 가장 최근 메시지 3개 선택하기
  const recentMessages = messages
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 3);

  // 이동 함수
  const goToDMPage = () => {
    navigate('/dmbox', {
      state: {
        isLoggedIn: isLoggedIn,
        userId: userId,
        jwtToken: jwtToken,
        nickname: nickname,
        keyId: keyId,
      },
    });
  };

  const handleItemClick = async (index) => {
    const selectedMessage = messages[index];

    try {
      const messageResponse = await axios.get(
        'https://dovote.p-e.kr/message/read/' +
          selectedMessage.messageId,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwtToken,
          },
        }
      );

      if (messageResponse.status === 200) {
        const updatedMessage = messageResponse.data;
        console.log('Updated message:', updatedMessage);
        navigate('/dm', {
          state: {
            ...location.state,
            item: selectedMessage,
          },
        });
      } else {
        // 에러 처리
      }
    } catch (error) {
      // 에러 처리
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div className="alarm_box">
          <h2
            className="alarm_box_title"
            onClick={goToDMPage}
          >
            <i className="fa-regular fa-bell"></i>
            <span> 알림</span>
          </h2>
          <div className="alarm_box_in_true">
            {recentMessages.length > 0 ? (
              recentMessages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.isRead
                      ? 'alarm_message_true'
                      : 'alarm_message_false'
                  }
                  onClick={() => handleItemClick(index)}
                  style={{ cursor: 'pointer' }} // 클릭 가능한 커서 스타일 추가
                >
                  <p className="alarm_box_name">
                    <strong>{message.username}</strong> :{' '}
                    {message.title.length > 10
                      ? `${message.title.slice(0, 10)}..`
                      : message.title}
                  </p>
                  <p className="alarm_box_text">
                    {new Date(
                      message.time
                    ).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <div className="alarm_box">
          <h2 className="alarm_box_title">
            <i className="fa-regular fa-bell"></i>
            <span> 알림</span>
          </h2>
          <div className="alarm_box_in_false">
            <h3 className="alarm_box_in_title">
              해당 기능은<br></br>로그인이 필요한 기능입니다
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};
