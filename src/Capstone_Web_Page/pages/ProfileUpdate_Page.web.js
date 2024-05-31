import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import './styles/profile_style.css';

function ProfileUpdatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userId,
    isLoggedIn,
    nickname,
    jwtToken,
    mbti,
    keyId,
  } = location.state || {};

  const [newPassword, setNewPassword] = useState('');
  const [newMbti, setNewMbti] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [currentNickname, setCurrentNickname] =
    useState('');
  const [jwtToken1, setJwtToken1] = useState(
    jwtToken || ''
  );

  const mbtis = [
    { label: 'INFP', value: 'INFP' },
    { label: 'INFJ', value: 'INFJ' },
    { label: 'INTP', value: 'INTP' },
    { label: 'INTJ', value: 'INTJ' },
    { label: 'ISFP', value: 'ISFP' },
    { label: 'ISFJ', value: 'ISFJ' },
    { label: 'ISTP', value: 'ISTP' },
    { label: 'ISTJ', value: 'ISTJ' },
    { label: 'ENFP', value: 'ENFP' },
    { label: 'ENFJ', value: 'ENFJ' },
    { label: 'ENTP', value: 'ENTP' },
    { label: 'ENTJ', value: 'ENTJ' },
    { label: 'ESFP', value: 'ESFP' },
    { label: 'ESFJ', value: 'ESFJ' },
    { label: 'ESTP', value: 'ESTP' },
    { label: 'ESTJ', value: 'ESTJ' },
  ];

  const handleChangeInformation = async () => {
    try {
      const response = await axios.patch(
        'https://dovote.p-e.kr/auth/patch/' + userId,
        {
          nickname: newNickname,
          mbti: newMbti,
          password: newPassword,
        },
        {
          headers: {
            'content-type': 'application/json',
            Authorization: jwtToken1,
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem(
          '@jwtToken',
          response.data.token
        );
        console.log('응답 데이터' + response.data);
        setJwtToken1(response.data.token);
        setNewNickname('');
        setCurrentNickname(newNickname);

        alert('정보 수정 완료');
      } else {
        alert('정보 수정에 실패했습니다');
      }
    } catch (error) {
      alert('알림', '정보 수정에 실패했습니다.');
    }
  };

  const goBack = () => {
    console.log(currentNickname, jwtToken1, keyId);
    navigate('/profile', {
      state: {
        userId,
        isLoggedIn,
        nickname: currentNickname,
        jwtToken: jwtToken1,
        keyId: keyId,
      },
    });
  };
  return (
    <div className="profile_page">
      {MainBanner(jwtToken, isLoggedIn, userId, nickname)}
      <LeftBar />
      <div className="right_page">
        <h2
          className="goBackButton"
          onClick={() => goBack()}
        >
          이전 페이지로
        </h2>

        <div className="retangle_page">
          <div className="form_group">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="변경할 비밀번호를 입력해주세요"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />
          </div>

          <div className="form_group">
            <label>MBTI</label>
            <select
              id="mbti"
              value={newMbti}
              onChange={(e) => setNewMbti(e.target.value)}
            >
              <option value="">MBTI</option>
              {mbtis.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form_group">
            <label>변경할 닉네임</label>
            <input
              placeholder="변경하고 싶은 닉네임을 넣어주세요"
              value={newNickname}
              onChange={(e) =>
                setNewNickname(e.target.value)
              }
            />
          </div>
          <button
            className="profileUPdate_button"
            onClick={handleChangeInformation}
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
