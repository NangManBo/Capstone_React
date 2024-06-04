import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import './styles/profile_style.css';
import './styles/dmSend_style.css';

function DMPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoggedIn,
    userId,
    isRead,
    nickname,
    jwtToken,
    item,
    unreadMessageCount,
    keyId,
  } = location.state; // useLocation을 사용하여 state 접근

  useEffect(() => {
    console.log('쪽지 데이터', item);
  }, []);
  return (
    <div className="profile_page">
      {MainBanner(
        jwtToken,
        isLoggedIn,
        userId,
        nickname,
        keyId
      )}
      {LeftBar(
        jwtToken,
        isLoggedIn,
        userId,
        nickname,
        keyId
      )}
      <div className="right_page">
        <h2
          className="goBackButton"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />{' '}
          이전 페이지로
        </h2>
        <div className="dmSend_Page">
          <div>
            <span>{item.username}의 쪽지</span>
          </div>

          <div>
            <span>
              전송일시{' '}
              {new Date(item.time).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
          <div>
            <span>{item.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DMPage;
