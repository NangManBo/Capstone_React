import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

function DMboxPage() {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, isLoggedIn, jwtToken, nickname } =
    location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/message/read/all/${nickname}`,
          {
            headers: {
              'AUTH-TOKEN': jwtToken,
            },
          }
        );

        if (response.status === 200) {
          const formattedMessages = response.data.map(
            (message) => ({
              username: message.sender,
              time: moment(message.sendTime).format(
                'YYYY-MM-DD HH:mm'
              ),
              title: message.content,
              isRead: message.readStatus,
              messageId1: message.messageId,
              commentId: message.commentId || null,
            })
          );

          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchData();
  }, [nickname, jwtToken]);

  const handleItemClick = async (index) => {
    const selectedMessage = messages[index];
    navigate('/dm', {
      state: {
        ...location.state,
        item: selectedMessage,
        messageId1: selectedMessage.messageId1,
      },
    });
  };

  const goToMain = () => {
    navigate('/', {
      state: {
        isLoggedIn,
        userId,
        nickname,
        jwtToken,
      },
    });
  };

  return (
    <div>
      <div>
        <button onClick={goToMain}>뒤로가기</button>
        <div>
          <span>내 쪽지함</span>
        </div>
        <button
          onClick={() =>
            navigate('/dmsend', {
              state: {
                isLoggedIn,
                userId,
                nickname,
                jwtToken,
              },
            })
          }
        >
          작성하기
        </button>
      </div>
      <div>
        {messages.map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(index)}
          >
            <div>
              <span>{item.username}</span>
            </div>
            <div>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DMboxPage;
//야홋~
