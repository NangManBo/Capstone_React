import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { renderPostPress } from '../functions/renderPostPress_function';
import { MainBanner } from '../components/mainBanner_components';
import './styles/searchresult_style.css';
import { LeftBar } from '../components/leftBar_components';
import { fetchSearch } from '../functions/fetchSearch_function'; // fetchSearch 함수 임포트
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

function SerachResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    keyId,
    searchResults,
    searchQuery,
    isLoggedIn,
    userId,
    jwtToken,
    nickname,
  } = location.state || {};

  const categories = [
    '모든 카테고리',
    '시사',
    '정치',
    '게임',
    '스포츠',
    '음식',
    '반려동물',
    '문화와예술',
    '경제',
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const [selectedCategory, setSelectedCategory] =
    useState('모든 카테고리');
  const [searchQuery2, setSearchQuery2] = useState('');

  const groupByCategory = (results) => {
    return results.reduce((acc, result) => {
      const category = result.category; // 가정: 각 결과에는 'category' 필드가 있음
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(result);
      return acc;
    }, {});
  };
  const goToMain = () => {
    navigate('/', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        keyId,
      },
    });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearch = async () => {
    const searchResults = await fetchSearch(
      jwtToken,
      searchQuery2
    );

    navigate('/searchresult', {
      state: {
        keyId,
        searchResults,
        searchQuery,
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
      },
    });
  };

  const filteredResults =
    selectedCategory === '모든 카테고리'
      ? searchResults
      : searchResults.filter(
          (result) => result.category === selectedCategory
        );
  const groupedResults = groupByCategory(searchResults);

  // 현재 페이지에 표시할 결과 계산
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult =
    indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  // 총 페이지 수 계산
  const totalPages = Math.ceil(
    filteredResults.length / resultsPerPage
  );

  return (
    <div className="search_page">
      {MainBanner(
        jwtToken,
        isLoggedIn,
        userId,
        nickname,
        keyId
      )}
      {LeftBar(
        jwtToken,
        isLoggedIn,
        userId,
        nickname,
        keyId
      )}
      <div className="right_page">
        <h2
          className="goBackButton"
          onClick={() => goToMain()}
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />{' '}
          이전 페이지로
        </h2>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="search_box">
          <input
            placeholder=""
            value={searchQuery2}
            onChange={(e) =>
              setSearchQuery2(e.target.value)
            }
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button onClick={handleSearch}>
            <i
              className="fas fa-search"
              style={{ color: 'black' }}
            ></i>
          </button>
        </div>
        <div className="search-form">
          {currentResults.length > 0 ? (
            currentResults.map((result) => (
              <div
                key={result.id}
                className="search-result-view3"
                onClick={() =>
                  renderPostPress(
                    result,
                    navigate,
                    isLoggedIn,
                    userId,
                    jwtToken,
                    nickname,
                    result.category,
                    searchResults,
                    true,
                    keyId
                  )
                }
              >
                <span className="search-result-title">
                  {result.title}
                </span>
                <span className="search-result-sub">
                  {result.question}
                </span>
                <div className="search-result-row">
                  <FontAwesomeIcon
                    className="category-post-like-text"
                    icon={faThumbsUp}
                  />{' '}
                  <span className="category-post-like-text">
                    {result.likesCount}
                  </span>
                  <span className="category-post-like-text1">
                    {result.createdAt}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="search-result-view2">
              <span className="search-result-title">
                검색 결과가 없습니다.
              </span>
            </div>
          )}
        </div>
        <div className="pagination">
          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={
                currentPage === number ? 'active' : ''
              }
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SerachResultPage;
