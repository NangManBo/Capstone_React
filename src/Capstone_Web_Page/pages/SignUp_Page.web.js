import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 불러오기
import axios from 'axios';
import PhoneAuthenticationModal from '../modals/PhoneAuthentication_modal'; // 모달 불러오기
import '../styles/signup_style.css';
function SignUpPage() {
  const [showPhoneAuthModal, setShowPhoneAuthModal] =
    useState(true);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [mbti, setMbti] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] =
    useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  let navigate = useNavigate(); // useNavigate 사용
  const isSelectedGender = (gender) =>
    selectedGender === gender;
  const handleGenderSelection = (gender) => {
    setSelectedGender(gender);
  };
  const placeholder = {
    label: 'MBTI',
    value: null,
  };
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

  const handleIdChange = (text) => {
    // 정규표현식을 사용하여 영어 대문자, 한글 여부 체크
    const pattern = /[A-Zㄱ-ㅎㅏ-ㅣ가-힣]/;

    if (pattern.test(text)) {
      // 영어 대문자나 한글이 포함되어 있으면 알람을 띄움
      alert(
        '알림',
        '영어 대문자나 한글은 사용할 수 없습니다.'
      );
    } else {
      // 영어 대문자와 한글이 없으면 상태 업데이트
      setId(text);
    }
  };

  const handleSignUp = async () => {
    if (isButtonDisabled) {
      return; // If button is disabled, prevent multiple requests
    }
    setIsButtonDisabled(true); // Disable the button immediately

    if (id === nickname) {
      if (id === '') {
        alert('오류', '입력해주세요!');
        setIsButtonDisabled(false);
      } else {
        alert(
          '오류',
          'ID와 닉네임이 중복됩니다. 다시 입력해주세요'
        );
        setNickname('');
        setIsButtonDisabled(false); // Re-enable the button
      }
      return;
    } else if (nickname.length < 2) {
      alert(
        '오류',
        '닉네임은 최소 2글자 이상이어야 합니다.'
      );
      setNickname('');
      setIsButtonDisabled(false); // Re-enable the button
      return;
    } else if (nickname.length > 7) {
      alert(
        '오류',
        '닉네임은 최대 8글자 이하이어야 합니다.'
      );
      setNickname('');
      setIsButtonDisabled(false); // Re-enable the button
    } else if (password !== passwordCheck) {
      alert('오류', '비밀번호가 다릅니다');
      setPasswordCheck('');
      setIsButtonDisabled(false); // Re-enable the button
      return;
    } else if (password.length < 8) {
      alert(
        '오류',
        '비밀번호는 최소 8글자 이상이어야 합니다.'
      );
      setPasswordCheck('');
      setIsButtonDisabled(false); // Re-enable the button
      return;
    } else if (password.length > 12) {
      alert(
        '오류',
        '비밀번호는 최대 12글자 이하이어야 합니다.'
      );
      setPasswordCheck('');
      setIsButtonDisabled(false); // Re-enable the button
      return;
    } else {
      const userData = {
        uid: id,
        password: password,
        nickname: nickname,
        gender: selectedGender,
        age: ageGroup,
        mbti: mbti,
        phoneNum: phoneNumber,
      };

      try {
        const response = await axios.post(
          'https://ec2-43-200-126-104.ap-northeast-2.compute.amazonaws.com/auth/signup',
          userData
        );
        if (response.status === 201) {
          console.log('회원가입 성공:', response.data);
          navigate('/');
        } else {
          console.error('회원가입 실패:', response.data);
        }
      } catch (error) {
        alert(
          '오류',
          '잘못 입력하거나 비어있는 곳이 있습니다.'
        );
        console.error('데이터', userData);
      } finally {
        setTimeout(() => {
          setIsButtonDisabled(false); // Re-enable the button after the delay
        }, 2000);
      }
    }
  };
  const handleClose = () => {
    setShowPhoneAuthModal(false);
    navigate(-1); // 모달 닫기 or 인증 실패 시 이전 페이지로
  };

  const handleSuccess = () => {
    setShowPhoneAuthModal(false); // 인증 성공 시 모달 닫기
    // 추가적인 성공 로직
  };
  return (
    <div className="Page">
      {showPhoneAuthModal && (
        <PhoneAuthenticationModal
          onClose={handleClose}
          onSuccess={handleSuccess}
          nextphone={setPhoneNumber}
        />
      )}
      <div className="signup-form">
        <h1 className="title">투표는 DO표</h1>
        <div className="form-group">
          <label className="label">아이디</label>
          <input
            className="input"
            placeholder="ID 입력 해주세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label className="label">비밀번호</label>
          <input
            className="input"
            type="password"
            placeholder="비밀번호는 8 ~ 12자리"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label className="label">재입력</label>
          <input
            className="input"
            type="password"
            placeholder="비밀번호 재입력"
            value={passwordCheck}
            onChange={(e) =>
              setPasswordCheck(e.target.value)
            }
          />
        </div>
        <div className="form-group">
          <label className="label">휴대폰 번호</label>
          <input
            className="input"
            placeholder="휴대폰 번호 입력"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="label">닉네임</label>
          <input
            className="input"
            placeholder="닉네임은 최대 7자리까지"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="label">성별</label>
          <button
            className={`gender-button ${
              isSelectedGender('M') ? 'selected' : ''
            }`}
            onClick={() => setSelectedGender('M')}
            disabled={
              isSelectedGender('M') && isButtonDisabled
            }
          >
            남
          </button>
          <button
            className={`gender-button ${
              isSelectedGender('W') ? 'selected' : ''
            }`}
            onClick={() => setSelectedGender('W')}
            disabled={
              isSelectedGender('W') && isButtonDisabled
            }
          >
            여
          </button>
        </div>
        <div className="form-group">
          <label className="label">나이대</label>
          <input
            className="input"
            placeholder="나이 입력 해주세요!"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            type="number"
          />
        </div>
        <div className="form-group">
          <label className="label">MBTI</label>
          <select
            className="mbti"
            value={mbti}
            onChange={(e) => setMbti(e.target.value)}
          >
            <option value="">{placeholder.label}</option>
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
        <button
          className="signup-button"
          onClick={handleSignUp}
          disabled={isButtonDisabled}
        >
          회원 가입하기
        </button>
      </div>
    </div>
  );
}

export default SignUpPage;
