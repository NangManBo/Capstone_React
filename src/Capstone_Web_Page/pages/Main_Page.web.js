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
      jwtToken: '',
      isLoggedIn: false,
      userId: '',
      nickname: null,
    };
  const [isMain, setIsMain] = useState(true);
  const [unreadMessageCount, setUnreadMessageCount] =
    useState(0);
  const [votes, setVotes] = useState([]); // 상태 추가
  const [messages, setMessages] = useState([]);
  const [popularPoint, setPopularPoint] = useState(0);

  const getPopularPoint = async () => {
    try {
      const popularPointResponse = await axios.get(
        'https://dovote.p-e.kr/polls/popular-point/' +
          nickname,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (popularPointResponse.status === 200) {
        setPopularPoint(popularPointResponse.data);
        console.log(popularPointResponse.data);
      } else {
      }
    } catch {}
  };

  // 쪽지 데이터 받기
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://dovote.p-e.kr/message/read/all/${nickname}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: jwtToken,
          },
        }
      );

      if (response.status === 200) {
        // Assuming the response data is an array of messages
        const messagesData = response.data;
        console.log(messagesData);
        // Extracting and mapping relevant data from the response
        const formattedMessages = messagesData.map(
          (message) => ({
            messageId: message.messageId,
            username: message.sender,
            time: message.sendTime,
            title: message.content,
            isRead: message.readStatus,
            commentId: message.commentId || null,
          })
        );
        setMessages(formattedMessages);
      } else {
      }
    } catch (error) {}
  };

  const fetchwebsocket = async () => {
    try {
      const response = await axios.get(
        `https://dovote.p-e.kr/message/count/${nickname}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
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
      fetchData();
      getPopularPoint();
      fetchwebsocket();
    }
  }, []);

  return (
    <div className="Page">
      {MainBanner(
        jwtToken,
        isLoggedIn, // 또는 조건에 따라 변하는 값
        userId,
        nickname,
        keyId,
        isMain
      )}
      <div className="main_page">
        <div className="main_page_header">
          {UserBox(
            isLoggedIn,
            userId,
            jwtToken,
            nickname,
            keyId,
            popularPoint
          )}

          {AlarmBox(
            isLoggedIn,
            userId,
            jwtToken,
            nickname,
            keyId,
            messages
          )}

          {GetManagerVotes(
            votes,
            nickname,
            jwtToken,
            isLoggedIn,
            userId,
            navigate,
            keyId
          )}
        </div>
        {PopularVoteBanner(
          votes,
          nickname,
          jwtToken,
          isLoggedIn,
          userId,
          navigate,
          keyId
        )}
        <div>
          <div>
            <div className="category_sub_title_box">
              {GetCategoryVotes(
                votes,
                nickname,
                jwtToken,
                isLoggedIn,
                userId,
                navigate,
                keyId
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
