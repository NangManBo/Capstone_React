import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './styles/profile_style.css';
import './styles/dmSend_style.css';

function DMPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoggedIn,
    userId,
    nickname,
    jwtToken,
    keyId,
    item,
  } = location.state; // useLocation을 사용하여 state 접근

  // 쪽지 바로 보내기
  const handlemessge = (item) => {
    navigate('/dmautosend', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        keyId,
        receiverName: item.username,
      },
    });
  };

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

        <div className="dm_Page">
          <div className="fixed_button">
            <FontAwesomeIcon
              onClick={() => handlemessge(item)}
              icon={faPaperPlane}
            />
          </div>
          <div className="dmSend_Page_user">
            <span className="dmSend_Page_user_name">
              {item.username}의 쪽지
            </span>
            <span className="dmSend_Page_user_date">
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

          <div className="dmSend_Page_body">
            <span>{item.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DMPage;
