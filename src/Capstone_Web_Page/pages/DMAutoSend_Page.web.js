import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import './styles/dmSend_style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';

function DMAutoSendPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // location.state에서 필요한 값을 추출
  const {
    userId,
    isLoggedIn,
    jwtToken,
    nickname,
    commentId,
    receiverName,
    keyId,
  } = location.state || {}; // state가 없는 경우를 대비한 기본값 설정

  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = async () => {
    const messageData = {
      sender: nickname,
      receiver: receiverName,
      content: messageContent,
    };
    try {
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
        alert('메시지 전송에 성공했습니다.');
        navigate('/dmbox', {
          state: {
            userId,
            isLoggedIn,
            jwtToken,
            nickname,
          },
        });
      } else {
        alert('메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      alert('메시지 전송에 실패했습니다.');
    }
  };

  return (
    <div className="profile_page">
      {MainBanner(
        jwtToken,
        isLoggedIn,
        userId,
        nickname,
        keyId
      )}
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
            navigate('/', {
              state: {
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
                keyId,
              },
            })
          }
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />{' '}
        </h2>

        <div className="dmSend_Page">
          <button onClick={handleSendMessage}>
            보내기
          </button>
          <div>
            <span>수신인:</span>
            <p>{receiverName}</p>
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

export default DMAutoSendPage;
