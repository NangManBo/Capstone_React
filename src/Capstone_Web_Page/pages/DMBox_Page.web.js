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
  const exampleMessages = [
    {
      username: 'user1',
      time: moment()
        .subtract(1, 'hours')
        .format('YYYY-MM-DD HH:mm'),
      title: 'Message content 1',
      isRead: false,
      messageId1: 1,
      commentId: null,
    },
    {
      username: 'user2',
      time: moment()
        .subtract(2, 'hours')
        .format('YYYY-MM-DD HH:mm'),
      title: 'Message content 2',
      isRead: true,
      messageId1: 2,
      commentId: null,
    },
    {
      username: 'user3',
      time: moment()
        .subtract(3, 'hours')
        .format('YYYY-MM-DD HH:mm'),
      title: 'Message content 3',
      isRead: false,
      messageId1: 3,
      commentId: null,
    },
    {
      username: 'user4',
      time: moment()
        .subtract(4, 'hours')
        .format('YYYY-MM-DD HH:mm'),
      title: 'Message content 4',
      isRead: true,
      messageId1: 4,
      commentId: null,
    },
    {
      username: 'user5',
      time: moment()
        .subtract(5, 'hours')
        .format('YYYY-MM-DD HH:mm'),
      title: 'Message content 5',
      isRead: false,
      messageId1: 5,
      commentId: null,
    },
    {
      username: 'user6',
      time: moment()
        .subtract(6, 'hours')
        .format('YYYY-MM-DD HH:mm'),
      title: 'Message content 6',
      isRead: true,
      messageId1: 6,
      commentId: null,
    },
    {
      username: 'user7',
      time: moment()
        .subtract(7, 'hours')
        .format('YYYY-MM-DD HH:mm'),
      title: 'Message content 7',
      isRead: false,
      messageId1: 7,
      commentId: null,
    },
    {
      username: 'user8',
      time: moment()
        .subtract(8, 'hours')
        .format('YYYY-MM-DD HH:mm'),
      title: 'Message content 8',
      isRead: true,
      messageId1: 8,
      commentId: null,
    },
    {
      username: 'user9',
      time: moment()
        .subtract(9, 'hours')
        .format('YYYY-MM-DD HH:mm'),
      title: 'Message content 9',
      isRead: false,
      messageId1: 9,
      commentId: null,
    },
    {
      username: 'user10',
      time: moment()
        .subtract(10, 'hours')
        .format('YYYY-MM-DD HH:mm'),
      title: 'Message content 10',
      isRead: true,
      messageId1: 10,
      commentId: null,
    },
  ];

  const [messages, setMessages] = useState(exampleMessages);
  //const [messages, setMessages] = useState([]);
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
      <MainBanner
        jwtToken={jwtToken}
        isLoggedIn={isLoggedIn} // 또는 조건에 따라 변하는 값
        userId={userId}
        nickname={nickname}
      />
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
