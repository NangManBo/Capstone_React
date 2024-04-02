import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { useLocation } from 'react-router-dom'; // Assuming react-router-dom for location state

function UserAuthenticationPage() {
  // Assuming you're using react-router-dom v6 and passing props via location.state
  const { userId, isLoggedIn, jwtToken, nickname, mbti } =
    location.state;
  const [inputPassword, setInputPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Assuming you're using react-router-dom v6

  const handleAuthenticationPassword = async () => {
    if (!inputPassword.trim()) {
      alert('알림: 비밀번호를 입력해주세요.'); // Using standard alert for web
      return;
    }
    console.log(userId, jwtToken); // Logging for debugging
    try {
      const response = await axios.post(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/auth/patch/check',
        {
          uid: userId,
          password: inputPassword,
        },
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
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
      console.error('Authentication failed:', error);
      alert(
        '알림: 본인인증에 실패했습니다.\n네트워크 상태를 확인해주세요.'
      );
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>유저 인증</h1>
      <div className="text-container">
        <p>
          회원정보 수정을 위해서 비밀번호를 한 번 입력해야
          합니다.
        </p>
        <p>현재 사용중인 비밀번호를 입력해주세요.</p>
      </div>
      <div className="text-input-container">
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          placeholder="사용중인 비밀번호 입력"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
      </div>
      <div className="update-button-container">
        <button onClick={handleAuthenticationPassword}>
          본인인증하기
        </button>
      </div>
    </div>
  );
}

export default UserAuthenticationPage;
