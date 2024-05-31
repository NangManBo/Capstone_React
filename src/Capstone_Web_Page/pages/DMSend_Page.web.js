import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './styles/dmSend_style.css';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';

function DMSendPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // location.state에서 필요한 값을 추출
  const { userId, isLoggedIn, jwtToken, nickname, keyId } =
    location.state || {}; // state가 없는 경우를 대비한 기본값 설정

  const [recipientId, setRecipientId] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = async () => {
    try {
      const messageData = {
        sender: nickname,
        receiver: recipientId,
        content: messageContent,
      };
      const response = await axios.post(
        'https://dovote.p-e.kr/message/send',
        messageData,
        {
          headers: {
            //'Content-Type': 'multipart/form-data',
            Authorization: jwtToken,
          },
        }
      );

      if (response.status === 201) {
        console.log('메시지 전송 성공:', response.data);
        // 메시지 전송 성공 후 처리 로직
      } else {
        console.error('메시지 전송 실패:', response.data);
        // 실패 처리 로직
      }
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
    }

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
    <div className="profile_page">
      {MainBanner(jwtToken, isLoggedIn, userId, nickname)}
      {LeftBar(
        jwtToken,
        isLoggedIn,
        userId,
        nickname,
        keyId
      )}
      <div className="right_page">
        <h2
          className="goBackButton"
          onClick={() =>
            navigate('/dmbox', {
              state: {
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
              },
            })
          }
        >
          이전 페이지로
        </h2>

        <div className="dmSend_Page">
          <button onClick={handleSendMessage}>
            보내기
          </button>
          <div>
            <span>수신인:</span>
            <input
              value={recipientId}
              onChange={(e) =>
                setRecipientId(e.target.value)
              }
              placeholder="수신인 닉네임을 적어주세요."
            />
          </div>
          <div>
            <span>쪽지 내용</span>
            <textarea
              value={messageContent}
              onChange={(e) =>
                setMessageContent(e.target.value)
              }
              placeholder="내용을 입력해주세요."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DMSendPage;
