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
    setIsSend(true);
    try {
      const response = await axios.post(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/auth/send',
        {
          to: phoneNumber,
        }
      );

      if (response.status === 201) {
        // 성공 로직
      } else {
        alert('Failed to send verification code');
      }
    } catch (error) {
      console.error(error);
      alert('Error occurred');
    }
  };

  const verifyCode = () => {
    console.log('Verifying Code:', verificationCode);
    nextphone(phoneNumber);
    onSuccess(); // useNavigate로 페이지 이동, state를 통해 데이터 전달
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <button onClick={onClose}>닫기</button>
        <div className="section">
          <div className="mainRow">
            <input
              placeholder="Phone Number"
              onChange={(e) =>
                setPhoneNumber(e.target.value)
              }
              value={phoneNumber}
              type="number"
              className="inputField"
            />
            <button
              className="sendButton"
              onClick={sendPhoneNumber}
            >
              인증번호 요청
            </button>
          </div>
          {isSend && (
            <p className="sendText">
              인증 번호를 보냈습니다.
            </p>
          )}
          {isSend && (
            <div className="mainRow">
              <input
                placeholder="Verification Code"
                onChange={(e) =>
                  setVerificationCode(e.target.value)
                }
                value={verificationCode}
                type="number"
                className="inputField"
              />
              <button
                className="sendButton"
                onClick={verifyCode}
              >
                인증
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhoneAuthenticationModal;
