import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/login_style.css';
import BasicBanner from '../components/basicBanner_components';

function LogInPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const userData = {
      uid: id,
      password: password,
    };
    try {
      const response = await axios.post(
        'https://dovote.p-e.kr/auth/signin',
        userData,
        {
          headers: {
            'Content-type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        navigate('/', {
          state: {
            isLoggedIn: true,
            userId: id,
            jwtToken: response.data.token,
            nickname: response.data.nickname,
            keyId: response.data.keyId,
          },
        });
      } else if (response.status === 403) {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else {
      }
    } catch (error) {
      if (error.response) {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else if (error.request) {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    }
  };

  return (
    <div className="Page">
      <BasicBanner />
      <div className="title_form">
        <h2 className="first-title">
          다른사람의 생각이 궁금하다면?<br></br>
          <span className="second-title">Do표</span>
        </h2>
      </div>
      <div className="login-form">
        <h3 className="login-title">투표는 DO표</h3>
        <input
          className="email-input"
          type="email"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          className="password-input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="login-button"
          onClick={handleLogin}
        >
          로그인
        </button>

        <p className="explain">처음 사용하시나요?</p>

        <div>
          <p
            className="signup-text"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogInPage;
