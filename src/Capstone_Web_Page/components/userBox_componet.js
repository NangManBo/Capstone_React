import React from 'react';
import './styles/userBox_style.css';
import { useNavigate } from 'react-router-dom';

export const UserBox = (
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
        userId,
        jwtToken,
        nickname,
        keyId,
      },
    });
  };
  // 대댓글에서 쪽지 보내기
  const handlemessge1 = (childComment) => {
    console.log('쪽지 보내기~' + childComment);
    navigate('/dmautosend', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        receiverName: childComment.nickname,
        keyId,
      },
    });
  };
  const goToProfile = () => {
    navigate('/profile', {
      state: {
        isLoggedIn: true,
        userId: userId,
        jwtToken: jwtToken,
        nickname: nickname,
        keyId: keyId,
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

  return (
    <div className="user_box_center">
      {isLoggedIn ? (
        <div className="user_box">
          <button onClick={goToProfile}>프로필</button>
          <button onClick={goToDMPage}>DM 페이지로</button>
          <button onClick={goToVoteMake}>투표 생성</button>
          <button onClick={goToMain}>로그아웃</button>
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
