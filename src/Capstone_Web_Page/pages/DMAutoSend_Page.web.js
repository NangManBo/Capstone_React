import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/message/send',
        messageData,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
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
    <div>
      <div>
        <div>
          <button onClick={() => navigate(-1)}>
            뒤로가기
          </button>
        </div>
        <div>
          <span>쪽지 쓰기</span>
        </div>
        <div>
          <button onClick={handleSendMessage}>
            보내기
          </button>
        </div>
      </div>

      <div>
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
  );
}

export default DMAutoSendPage;
