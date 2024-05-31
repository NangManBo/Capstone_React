import React, { useState } from 'react';
import './styles/banner_style.css'; // CSS 파일 임포트
import { useNavigate } from 'react-router-dom';
import { fetchSearch } from '../functions/fetchSearch_function'; // fetchSearch 함수 임포트
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaEnvelope } from 'react-icons/fa';

export const MainBanner = (
  jwtToken,
  isLoggedIn,
  userId,
  nickname,
  keyId
) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    const searchResults = await fetchSearch(
      jwtToken,
      searchQuery
    );

    navigate('/searchresult', {
      state: { searchResults, searchQuery, keyId },
    });
  };
  const goToProfile = () => {
    navigate('/profile', {
      state: {
        isLoggedIn: true,
        userId: userId,
        jwtToken: jwtToken,
        nickname: nickname,
        keyId: keyId,
      },
    });
  };
  const goToLogin = () => {
    navigate('/login', {});
  };
  const goToLogout = () => {
    navigate('/', {
      isLoggedIn: false,
      userId: '',
      jwtToken: '',
      nickname: null,
    });
  };
  const goToDMPage = () => {
    navigate('/dmbox', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        keyId,
      },
    });
  };
  return (
    <div className="banner">
      <div className="search-container">
        <input
          className="search-input-box"
          placeholder=""
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button
          className="search-button"
          onClick={handleSearch}
        >
          <i
            className="fas fa-search"
            style={{ color: 'black' }}
          ></i>
        </button>
        {isLoggedIn ? (
          <div className="banner_icon">
            <label onClick={goToDMPage}>
              <FaEnvelope size={40} color="white" />
            </label>
            <label
              className="banner_text"
              onClick={goToProfile}
            >
              내 정보
            </label>
            <label
              className="banner_text"
              onClick={goToLogout}
            >
              로그아웃
            </label>
          </div>
        ) : (
          <div>
            <label
              className="login_label"
              onClick={goToLogin}
            >
              로그인
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
