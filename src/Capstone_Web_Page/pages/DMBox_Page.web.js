import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { styles } from './style/styles'; // 웹용 스타일로 수정해야 합니다.

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
  }, [nickname, jwtToken, updateDM2]);

  const handleItemClick = async (index) => {
    const selectedMessage = messages[index];
    navigate('/dm', {
      state: {
        ...location.state,
        item: selectedMessage,
        messageId1: selectedMessage.messageId1,
        updateDM2: updateDM2 + 1,
      },
    });
  };

  const goToMain = () => {
    navigate('/main', {
      state: {
        isLoggedIn,
        userId,
        nickname,
        jwtToken,
      },
    });
  };

  return (
    <div style={styles.main_page}>
      <div style={styles.main_Row}>
        <button onClick={goToMain} style={styles.button}>
          뒤로가기
        </button>
        <div style={styles.back_title_view}>
          <span style={styles.back_text}>내 쪽지함</span>
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
          style={styles.button}
        >
          작성하기
        </button>
      </div>
      <div style={styles.DMboxScreen_DM_ScrollView}>
        {messages.map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(index)}
            style={styles.DMboxScreen_DM_View}
          >
            <div style={styles.DMboxScreen_DM_inner_View}>
              <div style={styles.DMboxScreen_DM_Name_View}>
                <span
                  style={styles.DMboxScreen_DM_Name_Text}
                >
                  {item.username}
                </span>
              </div>
              <div style={styles.DMboxScreen_DM_Time_View}>
                <span
                  style={styles.DMboxScreen_DM_Time_Text}
                >
                  {item.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DMboxPage;
