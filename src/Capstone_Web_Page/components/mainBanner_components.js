import React, { useState } from 'react';
import '../styles/banner_style.css'; // CSS 파일 임포트
import { fetchSearch } from '../functions/fetchSearch_function'; // fetchSearch 함수 임포트
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

function MainBanner({
  jwtToken,
  isLoggedIn,
  userId,
  nickname,
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = () => {
    if (searchQuery.length >= 2) {
      fetchSearch(jwtToken, searchQuery, setSearchResults);
    }
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
    // else {
    //   alert(
    //     '검색 오류',
    //     '검색어는 최소 2글자 이상이어야 합니다.',
    //     [{ text: '확인' }],
    //     { cancelable: false }
    //   );
    // }
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
}

export default MainBanner;
