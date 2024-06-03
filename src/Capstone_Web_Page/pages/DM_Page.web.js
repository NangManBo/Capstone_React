import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
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

  const hi = () => {
    navigate('/dmbox', {
      state: {
        userId,
        isLoggedIn,
        jwtToken,
        nickname,
        keyId,
      },
    });
  };

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
          onClick={() =>
            navigate('/dmbox', {
              state: {
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
              },
            })
          }
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />{' '}
          이전 페이지로
        </h2>
        <div>
          <div>
            <span>{item.username}의 쪽지</span>
          </div>
        </div>
        <div>
          <span>전송일시 {item.time}</span>
        </div>
      </div>

      <div>
        <span>{item.title}</span>
      </div>
    </div>
  );
}

export default DMPage;
