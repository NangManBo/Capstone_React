import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/login_style.css';

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
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/auth/signin',
        userData
      );

      if (response.status === 201) {
        console.log('로그인 성공:', response.data);
        // 로그인 성공 시 필요한 정보를 state에 넣어서 navigate 함수를 사용
        navigate('/main', {
          state: {
            isLoggedIn: true,
            userId: response.data.userId, // 예시 값, 실제 응답에 맞게 조정 필요
            jwtToken: response.data.token, // 예시 값, 실제 응답에 맞게 조정 필요
            nickname: response.data.nickname, // 예시 값, 실제 응답에 맞게 조정 필요
          },
        });
      } else {
        // 201이 아닌 다른 성공 상태 코드일 때 처리 방식을 여기에 추가할 수 있습니다.
        console.error('로그인 실패:', response.data);
        alert('Invalid username or password');
      }
    } catch (error) {
      if (error.response) {
        console.error('서버 에러:', error.response.data);
        alert(
          `Error: ${error.response.status} - ${error.response.data.message}`
        );
      } else if (error.request) {
        console.error('응답을 받지 못함:', error.request);
        alert('No response received');
      } else {
        console.error('Error:', error.message);
        alert('Request error');
      }
    }
  };

  return (
    <div className="Page">
      <div>
        <h1>투표는 DO표</h1>
        <input
          type="email"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>
        <div>
          <p>처음 사용하시나요?</p>
        </div>
        <div>
          <button onClick={() => navigate('/signup')}>
            회원가입
          </button>
          <button onClick={() => navigate('/main')}>
            메인
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogInPage;
