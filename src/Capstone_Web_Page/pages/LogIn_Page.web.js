import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login_style.css';
import Banner from '../components/banner_components';

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
        'https://ec2-43-200-126-104.ap-northeast-2.compute.amazonaws.com/auth/signin',
        userData
      );

      if (response.status === 201) {
        console.log('로그인 성공:', response.data);

        // 로그인 성공 시 필요한 정보를 state에 넣어서 navigate 함수를 사용
        navigate('/', {
          state: {
            isLoggedIn: true,
            userId: id, // 예시 값, 실제 응답에 맞게 조정 필요
            jwtToken: response.data.token, // 예시 값, 실제 응답에 맞게 조정 필요
            nickname: response.data.nickname, // 예시 값, 실제 응답에 맞게 조정 필요
          },
        });
      } else {
        // 201이 아닌 다른 성공 상태 코드일 때 처리 방식을 여기에 추가할 수 있습니다.
        console.error('로그인 실패:', response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('서버 에러:', error.response.data);
      } else if (error.request) {
        console.error('응답을 받지 못함:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div className="Page">
      <Banner />
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
