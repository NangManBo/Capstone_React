import React, { useState } from 'react';
import './styles/userBox_style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const UserBox = (
  isLoggedIn,
  userId,
  jwtToken,
  nickname,
  keyId
) => {
  const [popularPoint, setPopularPoint] = useState(0);
  const navigate = useNavigate();
  // 이동 함수
  const goToDMPage = () => {
    navigate('/dmbox', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        keyId,
      },
    });
  };

  const goToProfileUpdate = () => {
    navigate('/profileupdate', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        keyId,
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
        keyId,
      },
    });
  };
  const goToMain = () => {
    navigate('/', {
      state: {
        isLoggedIn: false,
        userId: '',
        jwtToken: '',
        nickname: null,
        keyId,
      },
    });
  };

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
      } else {
        console.log('포인트를 가져오는 데 실패했습니다');
      }
    } catch {}
  };
  return (
    <div className="user_box_center">
      {isLoggedIn ? (
        <div className="user_box">
          <div className="user_box_header">
            <img
              src={require('../assets/user.png')}
              alt="프로필 이미지"
              style={{
                width: '80px',
                height: '80px',
              }}
            />
            <label>{nickname}</label>
          </div>
          <div className="point_box">
            <label>포인트: {popularPoint}</label>
          </div>
          <button onClick={goToVoteMake}>투표 생성</button>
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
