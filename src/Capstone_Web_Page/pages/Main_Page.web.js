import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchVotes } from '../functions/fetchVote_function';
import { getCategoryVotes } from '../components/categorySort_componets';
import { MainBanner } from '../components/mainBanner_components';
import axios from 'axios';
import '../styles/main_style.css';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // 이동 함수
  const goToDMPage = () => {
    navigate('/dmbox', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
      },
    });
  };
  const goToProfile = () => {
    navigate('/profile', {
      state: {
        isLoggedIn: true,
        userId: userId, // 예시 값, 실제 응답에 맞게 조정 필요
        jwtToken: jwtToken, // 예시 값, 실제 응답에 맞게 조정 필요
        nickname: nickname, // 예시 값, 실제 응답에 맞게 조정 필요
      },
    });
  };
  const goToLogin = () => {
    navigate('/login', {});
  };
  const goToSignup = () => {
    navigate('/signup', {});
  };
  const goToVoteMake = () => {
    navigate('/votemake', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
      },
    });
  };
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
          <div>
            <div className="user_box">
              <button onClick={goToProfile}>프로필</button>
              <button onClick={goToDMPage}>
                DM 페이지로
              </button>
              <button onClick={goToVoteMake}>
                투표 생성
              </button>
              <h2>
                쪽지 안읽은 개수 : {unreadMessageCount}
              </h2>
            </div>
          </div>
        ) : (
          <div className="main_page_header">
            <div className="user_box">
              <h4 className="user_box_title">
                모든 서비스를 이용하려면 <br></br>로그인이
                필요합니다
              </h4>
              <button
                className="user_box_login"
                onClick={() => goToLogin()}
              >
                로그인
              </button>
              <h4 className="user_box_explain">
                처음 방문하시나요?
              </h4>
              <h4
                className="user_box_signup"
                onClick={() => goToSignup()}
              >
                회원가입
              </h4>
            </div>
            <div className="alarm_box">
              <h2 className="alarm_box_title">
                <i class="fa-regular fa-bell"></i>
                <span> 알림</span>
              </h2>
              <div className="alarm_box_in">
                <h3 className="alarm_box_in_title">
                  해당 기능은<br></br>로그인이 필요한
                  기능입니다
                </h3>
              </div>
            </div>
          </div>
        )}

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
