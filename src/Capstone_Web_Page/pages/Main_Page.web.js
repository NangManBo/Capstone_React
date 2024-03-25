import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchVotes } from '../function/fetchVote_function';
import { getCategoryVotes } from '../function/categorySort_fuction';
import axios from 'axios';

function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userId, jwtToken, nickname } =
    location.state || {
      isLoggedIn: false,
    };
  const [unreadMessageCount, setUnreadMessageCount] =
    useState(0);
  const [votes, setVotes] = useState([]); // 상태 추가
  const [messages, setMessages] = useState([]);
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
    navigate('/', {});
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

        // 여기에 추가: isRead가 false인 메시지의 수를 세어 unreadMessageCount 상태를 업데이트
        const unreadMessagesCount =
          formattedMessages.filter(
            (message) => !message.isRead
          ).length;
        setUnreadMessageCount(unreadMessagesCount);
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
      // 메시지를 화면에 출력
      setMessages((prevMessages) => [
        ...prevMessages,
        receivedMessage,
      ]);
      //숫자를 추출하여 상태로 저장
      const match = receivedMessage.match(
        /읽지 않은 쪽지의 개수: (\d+)/
      );
      console.log('매치1:', match);

      if (match) {
        const count = parseInt(match[1], 10);
        console.log('매치2:', match);
        console.log('읽지 않은 쪽지의 개수:', count);
        setUnreadMessageCount(count);
      }
    };
  };

  // 투표 데이터를 받아오는 함수
  useEffect(() => {
    fetchVotes(setVotes, jwtToken);
    fetchData();
    fetchwebsocket();
  }, []);

  return (
    <div>
      <div style={{ overflowY: 'scroll' }}>
        <div className="main_Page">
          <div className="main_Row">
            <h1 className="main_title">투표는 DO표</h1>
            {isLoggedIn ? (
              // 로그인 후 표시할 내용
              <div className="after_login_view"></div>
            ) : (
              // 로그인 전 표시할 내용
              <div className="login_prompt_view"></div>
            )}
          </div>
          <div className="main_Row">
            <h2 className="popular_vote_title">
              인기 투표
            </h2>
          </div>
          {isLoggedIn ? (
            <div>
              <button onClick={() => goToProfile()}>
                프로필
              </button>
              <button onClick={goToDMPage}>
                DM 페이지로
              </button>
              <h2>{unreadMessageCount}</h2>
            </div>
          ) : (
            <button onClick={() => goToLogin()}>
              로그인
            </button>
          )}

          <div className="main_Row">
            <h2 className="category_">카테고리별 투표</h2>
          </div>
          <div className="category_sub_title_box">
            {getCategoryVotes(votes)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
