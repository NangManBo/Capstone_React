import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function ProfileUpdatePage({ history }) {
  // Assuming route.params are now props or context/state managed variables
  const [userId, isLoggedIn, nickname, jwtToken, mbti] =
    location.state || {};
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [newMbti, setNewMbti] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [currentNickname, setCurrentNickname] =
    useState(nickname);
  const [jwtToken1, setJwtToken1] = useState(jwtToken);
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
  const placeholder = {
    label: 'MBTI',
    value: null,
  };
  const handleChangePassword = async () => {
    const password = {
      password: newPassword,
      uid: userId,
    };
    if (newPassword === '') {
      alert('알림', '비밀번호를 입력해주세요');
      return;
    }
    console.log(password);
    try {
      // Call your API or service to change the password
      const response = await axios.patch(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/auth/patch/' +
          userId,
        password,
        {
          headers: {
            'AUTH-TOKEN': jwtToken1,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setNewPassword(''); // 성공한 후 입력 필드를 초기화
        // Assuming the API returns an object with a 'success' property
        alert('알림', '비밀번호 변경 완료');
      } else {
        alert('알림', '비밀번호 변경에 실패했습니다');
      }
    } catch (error) {
      console.error('Password change failed:', error);
      alert(
        '알림',
        '비밀번호 변경에 실패했습니다.\n네트워크 상태를 확인해주세요.'
      );
    }
  };

  const handleChangeMbti = async () => {
    const mbti = {
      uid: userId,
      mbti: newMbti,
    };
    if (newMbti === '') {
      alert('알림', 'MBTI를 입력해주세요');
      return;
    }
    try {
      const response = await axios.patch(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/auth/patch/' +
          userId,
        mbti,
        {
          headers: {
            'AUTH-TOKEN': jwtToken1,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setNewMbti(''); // 성공한 후 입력 필드를 초기화
        alert('알림', 'MBTI 변경 완료');
      } else {
        alert('알림', 'MBTI 변경에 실패했습니다');
      }
    } catch (error) {
      console.error('MBTI change failed:', error);
      alert(
        '알림',
        'MBTI 변경에 실패했습니다.\n네트워크 상태를 확인해주세요.'
      );
    }
  };

  const handleChangeNickname = async () => {
    const nickname = {
      uid: userId,
      nickname: newNickname,
    };
    const uid = userId;
    console.log('url에 들어가는', uid);
    console.log('닉네임 변경시 userID', userId);
    console.log('닉네임 변경', newNickname);
    if (newNickname === '') {
      alert('알림', '닉네임을 입력해주세요');
      return;
    }
    try {
      const response = await axios.patch(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/auth/patch/name/' +
          uid,
        nickname,
        {
          headers: {
            'AUTH-TOKEN': jwtToken1,
          },
        }
      );

      console.log(response.data); // 응답 확인

      if (response.status === 200) {
        console.log(response.data.token); // 토큰 값 출력
        await AsyncStorage.setItem(
          '@jwtToken',
          response.data.token
        ); // 새로운 토큰을 저장합니다.
        setJwtToken1(response.data.token); // 상태 변수 업데이트
        setNewNickname(''); // 성공한 후 입력 필드를 초기화
        setCurrentNickname(newNickname); // 상태 업데이트 부분 추가
        alert('알림', '닉네임 변경 완료');
      } else {
        alert('알림', '닉네임 변경에 실패했습니다');
      }
    } catch (error) {
      console.error('Nickname change failed:', error);
      alert(
        '알림',
        '닉네임 변경에 실패했습니다.\n네트워크 상태를 확인해주세요.'
      );
    }
  };

  return (
    <div className="container">
      <button onClick={() => history.goBack()}>Back</button>
      <h1>Profile Update</h1>
      <div>
        <label>Nickname</label>
        <input
          placeholder="새로운 닉네임을 넣어주세요"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
        />
        <button onClick={handleChangeNickname}>
          닉네임 변경하기
        </button>
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          placeholder="변경할 비밀번호를 입력해주세요"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}>
          비밀번호 변경하기
        </button>
      </div>
      <div>
        <label>MBTI</label>
        <select
          id="mbti"
          value={newMbti}
          onChange={(e) => setNewMbti(e.target.value)}
        >
          <option value="">{placeholder.label}</option>
          {mbtis.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button onClick={handleChangeMbti}>
          MBTI 변경하기
        </button>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
