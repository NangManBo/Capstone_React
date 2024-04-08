import React, { useState } from 'react';
import '../styles/banner_style.css'; // CSS 파일 임포트
import { fetchSearch } from '../functions/fetchSearch_function'; // fetchSearch 함수 임포트
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

export const MainBanner = (
  jwtToken,
  isLoggedIn,
  userId,
  nickname
) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = () => {
    fetchSearch(jwtToken, searchQuery, setSearchResults);
    console.log('검색 누르기 : ' + searchResults);
    navigate('/searchresult', {
      state: {
        searchResults,
        searchQuery,
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
      },
    });
  };
  return (
    <div className="banner">
      <div className="search-container">
        <input
          className="search-input-box"
          placeholder="  두 글자 이상 입력해주세요!"
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
      </div>
    </div>
  );
};
