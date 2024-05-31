import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchVotes } from '../functions/fetchVote_function';
import { GetCategoryVotes } from '../components/categorySort_componets';
import { MainBanner } from '../components/mainBanner_components';
import axios from 'axios';
import './styles/main_style.css';
import { AlarmBox } from '../components/alarmBox_components';
import { UserBox } from '../components/userBox_componet';
import { PopularVoteBanner } from '../components/popularVoteBanner_components';
import { GetManagerVotes } from '../components/managerVote_components';

function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userId, jwtToken, nickname, keyId } =
    location.state || {
      isLoggedIn: false,
      userId: '',
      jwtToken: '',
      nickname: null,
    };

  const [unreadMessageCount, setUnreadMessageCount] =
    useState(0);
  const [votes, setVotes] = useState([]); // 상태 추가
  const [messages, setMessages] = useState([]);

  // 쪽지 데이터 받기
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://dovote.p-e.kr/message/read/all/${nickname}`,
        {
          header: {
            'content-type': 'multipart/form-data',
            Authorization: jwtToken,
          },
        }
      );

      if (response.status === 200) {
        // Assuming the response data is an array of messages
        const messagesData = response.data;
        console.log(JSON.stringify(response.data, null, 2));
        // Extracting and mapping relevant data from the response
        const formattedMessages = messagesData.map(
          (message) => ({
            username: message.sender,
            time: message.sendTime,
            title: message.content,
            isRead: message.readStatus,
            commentId: message.commentId || null,
          })
        );
        setMessages(formattedMessages);
      } else {
        console.error(
          'Failed to fetch messages:',
          response.data
        );
      }
    } catch (error) {
      console.error('쪽지 데이터 가져오기:', error);
    }
  };
  // 웹소켓
  const fetchwebsocket = async () => {
    try {
      const response = await axios.get(
        `https://dovote.p-e.kr/message/count/${nickname}`,
        {
          header: {
            'content-type': 'multipart/form-data',
            Authorization: jwtToken,
          },
        }
      );

      if (response.status === 200) {
        const response_data = response.data;
        setUnreadMessageCount(response_data);
      } else {
      }
    } catch (error) {}
  };

  // 투표 데이터를 받아오는 함수
  useEffect(() => {
    fetchVotes(setVotes);

    if (isLoggedIn) {
      console.log(
        '로그인 상태',
        isLoggedIn,
        nickname,
        userId,
        jwtToken,
        keyId
      );
      fetchData();
      fetchwebsocket();
    }
  }, []);

  return (
    <div className="Page">
      {MainBanner(
        jwtToken,
        isLoggedIn, // 또는 조건에 따라 변하는 값
        userId,
        nickname
      )}
      <div className="main_page">
        <div className="main_page_header">
          {/* <UserBox
            isLoggedIn={isLoggedIn}
            userId={userId}
            jwtToken={jwtToken}
            nickname={nickname}
          /> */}
          {UserBox(
            isLoggedIn,
            userId,
            jwtToken,
            nickname,
            keyId
          )}
          {/* <AlarmBox isLoggedIn={isLoggedIn} /> */}
          {AlarmBox(isLoggedIn)}
          {/* <GetManagerVotes
            votes={votes}
            isLoggedIn={isLoggedIn}
            userId={userId}
            jwtToken={jwtToken}
            nickname={nickname}
            navigate={navigate}
          /> */}
          {GetManagerVotes(
            votes,
            nickname,
            jwtToken,
            isLoggedIn,
            userId,
            navigate
          )}
        </div>
        {/* <PopularVoteBanner
          votes={votes}
          nickname={nickname}
          jwtToken={jwtToken}
          isLoggedIn={isLoggedIn}
          userId={userId}
          navigate={navigate}
        /> */}
        {PopularVoteBanner(
          votes,
          nickname,
          jwtToken,
          isLoggedIn,
          userId,
          navigate
        )}
        <div>
          <div>
            <div className="category_sub_title_box">
              {/* <GetCategoryVotes
                votes={votes}
                nickname={nickname}
                jwtToken={jwtToken}
                isLoggedIn={isLoggedIn}
                userId={userId}
                navigate={navigate}
              /> */}
              {GetCategoryVotes(
                votes,
                nickname,
                jwtToken,
                isLoggedIn,
                userId,
                navigate
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
