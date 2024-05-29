import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import './styles/profile_style.css';
import './styles/dmBox_style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

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
          `https://dovote.p-e.kr/message/read/all/${nickname}`,
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
    <div className="profile_page">
      {MainBanner(jwtToken, isLoggedIn, userId, nickname)}
      <LeftBar />

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
              },
            })
          }
        >
          이전 페이지로
        </h2>
        <div className="retangle_page">
          <div className="fixed_button">
            <FontAwesomeIcon
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
              icon={faPaperPlane}
            />
          </div>
          <div className="messages_container">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`message_item ${
                  item.isRead ? 'read' : 'unread'
                }`}
                onClick={() => handleItemClick(index)}
              >
                <div className="message_header">
                  <span className="message_username">
                    {item.username}
                  </span>
                  <span className="message_time">
                    {item.time}
                  </span>
                </div>
                <div className="message_body">
                  <p>{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DMboxPage;
