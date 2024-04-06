import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchVotes } from '../functions/fetchVote_function';
import { fetchSearch } from '../functions/fetchSearch_function';
import { getCategoryVotes } from '../components/categorySort_componets';
import { renderPostPress } from '../functions/renderPostPress_function';

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
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/message/read/all/' +
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
      'wss://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/test?uid=' +
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
    <div>
      <header>
        <h1 className="main_title">투표는 DO표</h1>
      </header>
      <div style={{ overflowY: 'scroll' }}>
        <div className="main_Page">
          <div className="main_Row">
            <h2 className="popular_vote_title">
              인기 투표
            </h2>
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
              <h2>
                쪽지 안읽은 개수 : {unreadMessageCount}
              </h2>
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
              <div className="search-input-view">
                <input
                  className="search-input-box"
                  placeholder="두 글자 이상 입력해주세요!"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                />
                <button onClick={handleSearch}>검색</button>
              </div>
              {searchResults.length > 0 && (
                <div className="search-result-view2">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="search-result-view3"
                      onClick={() =>
                        renderPostPress(
                          result,
                          navigate,
                          isLoggedIn,
                          userId,
                          jwtToken,
                          nickname
                        )
                      }
                    >
                      <span className="search-result-title">
                        {JSON.parse(result.title).title}
                      </span>
                      <span
                        className="search-result-sub"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {
                          JSON.parse(result.question)
                            .question
                        }
                      </span>
                      <div className="search-result-row">
                        <span className="category-post-like-text">
                          {result.likesCount}
                        </span>
                        <span className="category-post-like-text1">
                          {result.createdAt}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.length === 0 &&
                searchQuery.trim() !== '' && (
                  <div className="search-result-view2">
                    <span className="search-result-title">
                      검색 결과가 없습니다.
                    </span>
                  </div>
                )}
            </div>

            <div>
              <div className="main_Row">
                <h2 className="category_">
                  카테고리별 투표
                </h2>
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
    </div>
  );
}

export default MainPage;
