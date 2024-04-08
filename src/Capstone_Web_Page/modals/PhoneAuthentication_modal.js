import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/modal_style.css';

function PhoneAuthenticationModal({
  onClose,
  onSuccess,
  nextphone,
}) {
  let navigate = useNavigate(); // useNavigate 사용
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] =
    useState('');
  const [isSend, setIsSend] = useState(false);

  const sendPhoneNumber = async () => {
    console.log('Sending Phone Number:', phoneNumber);
    try {
      const response = await axios.post(
        'https://dovote.p-e.kr/sms/send',
        {
          phoneNum: phoneNumber,
        }
      );

      if (response.status === 200) {
        setIsSend(true);
      } else {
        alert('Failed to send verification code');
      }
    } catch (error) {
      console.error(error);
      alert('Error occurred');
    }
  };

  const verifyCode = async () => {
    try {
      const response = await axios.post(
        'https://dovote.p-e.kr/sms/verify',
        {
          phoneNum: phoneNumber,
          certificationCode: verificationCode,
        }
      );

      if (response.status === 200) {
        // 성공 로직
        console.log('인증 성공');
        nextphone(phoneNumber);
        onSuccess(); // useNavigate로 페이지 이동, state를 통해 데이터 전달
      } else {
        alert('번호를 잘못 입력하셨습니다');
      }
    } catch (error) {
      console.error(error);
      alert('Error occurred');
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <button onClick={onClose}>x</button>
        <div className="section">
          <h1 className="title">휴대폰 인증 서비스</h1>
          <div className="mainRow">
            <label className="label">휴대폰 번호</label>
            <input
              placeholder=" - 없이 입력해주세요"
              onChange={(e) =>
                setPhoneNumber(e.target.value)
              }
              value={phoneNumber}
              type="number"
              className="inputField"
            />
          </div>
          <button
            className="sendButton"
            onClick={sendPhoneNumber}
          >
            인증번호 요청
          </button>

          {isSend && (
            <div className="mainRow">
              <label className="label">인증 번호</label>
              <input
                placeholder="인증 번호 입력"
                onChange={(e) =>
                  setVerificationCode(e.target.value)
                }
                value={verificationCode}
                type="number"
                className="inputField"
              />
            </div>
          )}
          {isSend && (
            <button
              className="verifyButton"
              onClick={verifyCode}
            >
              인증 확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhoneAuthenticationModal;
