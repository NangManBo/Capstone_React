import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchVotes } from '../functions/fetchVote_function';
import { getCategoryVotes } from '../components/categorySort_componets';
import { MainBanner } from '../components/mainBanner_components';
import axios from 'axios';
import './styles/main_style.css';
import { AlarmBox } from '../components/alarmBox_components';
import { UserBox } from '../components/userBox_componet';
import { PopularVoteBanner } from '../components/popularVoteBanner_components';
import { getManagerVotes } from '../components/managerVote_components';

function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userId, jwtToken, nickname } =
    location.state || {
      isLoggedIn: false,
      userId: '',
      jwtToken: '',
      nickname: 'manager',
    };
  const [unreadMessageCount, setUnreadMessageCount] =
    useState(0);
  const [votes, setVotes] = useState([]); // 상태 추가
  const [messages, setMessages] = useState([]);

  // 쪽지 데이터 받기
  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://dovote.p-e.kr/message/read/all/' +
          nickname,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
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
    const socket = new WebSocket(
      'wss://ec2-43-200-126-104.ap-northeast-2.compute.amazonaws.com/test?uid=' +
        userId
    );
    socket.onopen = () => {
      console.log('WebSocket 연결 성공');
    };
    socket.onmessage = (event) => {
      const receivedMessage = event.data;
      console.log(
        '서버로부터 받은 메시지 :',
        receivedMessage
      );

      // 메시지를 콜론을 기준으로 나눔
      const parts = receivedMessage.split(':');
      if (parts.length > 1) {
        // 콜론 뒤의 부분에서 숫자를 추출
        const count = parseInt(parts[1].trim(), 10);
        if (!isNaN(count)) {
          // 유효한 숫자인 경우 상태 업데이트
          console.log('읽지 않은 쪽지의 개수:', count);
          setUnreadMessageCount(count);
        }
      }
    };
  };

  // 투표 데이터를 받아오는 함수
  useEffect(() => {
    fetchVotes(setVotes, jwtToken);
    if (isLoggedIn) {
      fetchData();
      fetchwebsocket();
    }
  }, []);

  return (
    <div className="Page">
      <MainBanner
        jwtToken={jwtToken}
        isLoggedIn={isLoggedIn} // 또는 조건에 따라 변하는 값
        userId={userId}
        nickname={nickname}
      />
      <div className="main_page">
        {isLoggedIn ? (
          <div className="main_page_header">
            <UserBox
              isLoggedIn={isLoggedIn}
              userId={userId}
              jwtToken={jwtToken}
              nickname={nickname}
            ></UserBox>
            <AlarmBox isLoggedIn={isLoggedIn} />
            {getManagerVotes(
              votes,
              nickname,
              jwtToken,
              isLoggedIn,
              userId,
              navigate
            )}
          </div>
        ) : (
          <div className="main_page_header">
            <UserBox
              isLoggedIn={isLoggedIn}
              userId={userId}
              jwtToken={jwtToken}
              nickname={nickname}
            ></UserBox>
            <AlarmBox isLoggedIn={isLoggedIn} />
            {getManagerVotes(
              votes,
              nickname,
              jwtToken,
              isLoggedIn,
              userId,
              navigate
            )}
          </div>
        )}
        {PopularVoteBanner()}
        <div>
          <div>
            <div className="category_sub_title_box">
              {getCategoryVotes(
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
