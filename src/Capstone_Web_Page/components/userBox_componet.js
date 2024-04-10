import React from 'react';
import './styles/userBox_style.css';
import { useNavigate } from 'react-router-dom';

export const UserBox = (
  isLoggedIn,
  userId,
  jwtToken,
  nickname
) => {
  const navigate = useNavigate();
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
  return (
    <div>
      {
        (isLoggedIn = false ? (
          <div className="user_box">
            <button onClick={goToProfile}>프로필</button>
            <button onClick={goToDMPage}>
              DM 페이지로
            </button>
            <button onClick={goToVoteMake}>
              투표 생성
            </button>
          </div>
        ) : (
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
        ))
      }
    </div>
  );
};
