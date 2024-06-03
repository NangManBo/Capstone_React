import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/profile_style.css';
import './styles/userAuthentication_style.css';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
function UserAuthenticationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userId,
    isLoggedIn,
    jwtToken,
    nickname,
    mbti,
    keyId,
  } = location.state;
  const [inputPassword, setInputPassword] = useState('');

  const handleAuthenticationPassword = async () => {
    if (!inputPassword.trim()) {
      alert('알림: 비밀번호를 입력해주세요.'); // Using standard alert for web
      return;
    }

    try {
      const response = await axios.post(
        'https://dovote.p-e.kr/auth/patch/check',
        {
          uid: userId,
          password: inputPassword,
        },
        {
          headers: {
            'content-type': 'application/json',
            Authorization: jwtToken,
          },
        }
      );
      console.log(response.data); // Logging the response
      if (response.status === 200) {
        alert('알림: 본인인증 완료');
        navigate('/profileupdate', {
          state: {
            isLoggedIn,
            userId,
            jwtToken,
            nickname,
            mbti,
          },
        });
      } else {
        alert('알림: 본인인증에 실패했습니다');
      }
    } catch (error) {
      alert(
        '알림: 본인인증에 실패했습니다.\n네트워크 상태를 확인해주세요.'
      );
    }
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
            navigate('/', {
              state: {
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
                keyId,
              },
            })
          }
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />{' '}
          이전 페이지로
        </h2>
        <div className="retangle_page">
          <div className="text-container">
            <p className="password">
              회원정보 수정을 위해서 비밀번호를 한 번
              입력해야 합니다.
            </p>
            <p className="password">
              현재 사용중인 비밀번호를 입력해주세요.
            </p>
          </div>
          <div className="text-input-container">
            <label className="password">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="사용중인 비밀번호 입력"
              value={inputPassword}
              onChange={(e) =>
                setInputPassword(e.target.value)
              }
            />
          </div>
          <div className="update-button-container">
            <button
              className="updatebutton"
              onClick={handleAuthenticationPassword}
            >
              본인인증하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAuthenticationPage;
