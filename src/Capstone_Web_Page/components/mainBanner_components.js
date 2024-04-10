import React, { useState } from 'react';
import './styles/banner_style.css'; // CSS 파일 임포트
import { useNavigate } from 'react-router-dom';
import { fetchSearch } from '../functions/fetchSearch_function'; // fetchSearch 함수 임포트
import '@fortawesome/fontawesome-free/css/all.min.css';

export const MainBanner = (
  jwtToken,
  isLoggedIn,
  userId,
  nickname
) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    const searchResults = await fetchSearch(
      jwtToken,
      searchQuery
    );

    navigate('/searchresult', {
      state: { searchResults, searchQuery },
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
      </div>
    </div>
  );
};
