import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchVotes } from '../functions/fetchVote_function';
import { fetchSearch } from '../functions/fetchSearch_function';
import { getCategoryVotes } from '../components/categorySort_componets';
import { renderPostPress } from '../functions/renderPostPress_function';
import MainBanner from '../components/mainBanner_components';
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
  const handleSearch = () => {
    if (searchQuery.length >= 2) {
      fetchSearch(jwtToken, searchQuery, setSearchResults);
    } else {
      alert(
        '검색 오류',
        '검색어는 최소 2글자 이상이어야 합니다.',
        [{ text: '확인' }],
        { cancelable: false }
      );
    }
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
      <div className="main-page">
        <div className="main_Row">
          <h2 className="popular_vote_title">인기 투표</h2>
        </div>
        {isLoggedIn ? (
          <div>
            <button onClick={goToProfile}>프로필</button>
            <button onClick={goToDMPage}>
              DM 페이지로
            </button>
            <button onClick={goToVoteMake}>
              투표 생성
            </button>
            <h2>쪽지 안읽은 개수 : {unreadMessageCount}</h2>
          </div>
        ) : (
          <div>
            <button onClick={() => goToLogin()}>
              로그인
            </button>
            <button onClick={() => goToSignup()}>
              회원가입
            </button>
          </div>
        )}
        <div className="container">
          <div>
            <div className="main_Row">
              <h2 className="category_">카테고리별 투표</h2>
            </div>
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
