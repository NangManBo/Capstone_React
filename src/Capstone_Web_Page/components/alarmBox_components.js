import React from 'react';
import './styles/alarmBox_style.css';
import { useNavigate } from 'react-router-dom';

export const AlarmBox = (
  isLoggedIn,
  userId,
  jwtToken,
  nickname,
  keyId
) => {
  const navigate = useNavigate();
  // 이동 함수
  const goToDMPage = () => {
    navigate('/dmbox', {
      state: {
        isLoggedIn,
        userId: '',
        jwtToken: '',
        nickname: null,
        keyId,
      },
    });
  };
  return (
    <div>
      {isLoggedIn ? (
        <div className="alarm_box">
          <h2
            className="alarm_box_title"
            onClick={goToDMPage}
          >
            <i class="fa-regular fa-bell"></i>
            <span> 알림</span>
          </h2>
          <div className="alarm_box_in">
            <h3 className="alarm_box_in_title">
              해당 기능은<br></br>아직 구현이 안된
              기능입니다
            </h3>
          </div>
        </div>
      ) : (
        <div className="alarm_box">
          <h2 className="alarm_box_title">
            <i class="fa-regular fa-bell"></i>
            <span> 알림</span>
          </h2>
          <div className="alarm_box_in">
            <h3 className="alarm_box_in_title">
              해당 기능은<br></br>로그인이 필요한 기능입니다
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};
