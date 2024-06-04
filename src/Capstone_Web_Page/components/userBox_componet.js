import React, { useState } from 'react';
import './styles/userBox_style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const UserBox = (
  isLoggedIn,
  userId,
  jwtToken,
  nickname,
  keyId,
  popularPoint
) => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login', {});
  };
  const goToSignup = () => {
    navigate('/signup', {});
  };
  const goToLogout = () => {
    navigate('/', {
      isLoggedIn: false,
      userId: '',
      jwtToken: '',
      nickname: null,
    });
  };
  const goToVoteMake = () => {
    navigate('/votemake', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        keyId,
      },
    });
  };

  return (
    <div className="user_box_center">
      {isLoggedIn ? (
        <div className="user_box">
          <div className="user_box_log">
            <h4 onClick={goToLogout}>로그아웃</h4>
          </div>
          <div className="user_box_header">
            <img
              src={require('../assets/user.png')}
              alt="프로필 이미지"
              style={{
                width: '80px',
                height: '80px',
              }}
            />
            <label className="user_box_header_label">
              {nickname} 님!
            </label>
          </div>
          <div className="user_box_point_box">
            <label>포인트: {popularPoint}</label>
          </div>
          <button
            className="votemake_button"
            onClick={goToVoteMake}
          >
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
            //onClick={goToProfileUpdate}
            //onClick={goToDMPage}
            onClick={() => goToLogin()}
          >
            로그인
          </button>
          <h4 className="user_box_explain">
            처음 방문하시나요?
          </h4>
          <h4
            className="user_box_signup"
            //onClick={goToVoteMake}
            onClick={() => goToSignup()}
          >
            회원가입
          </h4>
        </div>
      )}
    </div>
  );
};
