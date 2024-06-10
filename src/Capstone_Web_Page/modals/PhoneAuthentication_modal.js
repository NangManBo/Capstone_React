import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/modal_style.css';

function PhoneAuthenticationModal({
  onClose,
  onSuccess,
  nextphone,
}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] =
    useState('');
  const [isSend, setIsSend] = useState(false);
  // 초 단위로 초기 시간 설정 (3분 = 180초)
  const [seconds, setSeconds] = useState(1);
  const [message, setMessage] = useState('');

  const sendPhoneNumber = async () => {
    try {
      const response = await axios.post(
        'https://dovote.p-e.kr/sms/send',
        {
          phoneNum: phoneNumber,
        },
        {
          headers: {
            'Content-type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setIsSend(true);
      } else {
        alert('잘못된 번호입니다');
      }
    } catch (error) {
      setIsSend(true);
    }
  };

  const verifyCode = async () => {
    try {
      const response = await axios.post(
        'https://dovote.p-e.kr/sms/verify',
        {
          phoneNum: phoneNumber,
          certificationCode: verificationCode,
        },
        {
          header: {
            'Content-type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        nextphone(phoneNumber);
        onSuccess(); // useNavigate로 페이지 이동, state를 통해 데이터 전달
      } else {
        alert('번호를 잘못 입력하셨습니다');
      }
    } catch (error) {
      alert('번호를 잘못 입력하셨습니다');
    }
  };

  useEffect(() => {
    setSeconds(180);
  }, [isSend]);
  useEffect(() => {
    // 타이머가 0이 될 때까지 매 초마다 초를 감소시키는 타이머 설정
    if (seconds > 0) {
      const timerId = setTimeout(
        () => setSeconds(seconds - 1),
        1000
      );
      return () => clearTimeout(timerId);
    } else {
      // 타이머가 0에 도달하면 메시지 업데이트
      setMessage('다시 요청해주세요');
    }
  }, [seconds]);
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
            <div className="time-message-box">
              {message ? (
                <p>{message}</p>
              ) : (
                <p>
                  남은 시간: {Math.floor(seconds / 60)}분{' '}
                  {seconds % 60}초
                </p>
              )}
            </div>
          )}
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
