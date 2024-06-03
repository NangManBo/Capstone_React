import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { renderPostPress } from '../functions/renderPostPress_function';
import { MainBanner } from '../components/mainBanner_components';
import './styles/searchresult_style.css';
import { LeftBar } from '../components/leftBar_components';
import { fetchSearch } from '../functions/fetchSearch_function'; // fetchSearch 함수 임포트
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';

const exampleData = {
  keyId: 1,
  searchResults: [
    {
      id: 1,
      title: 'Breaking News in Politics',
      question: 'What are the latest updates in politics?',
      category: '정치',
      likesCount: 10,
      createdAt: '2024-06-01',
    },
    {
      id: 2,
      title: 'New Game Release',
      question:
        'What are the top features of the new game?',
      category: '게임',
      likesCount: 20,
      createdAt: '2024-05-30',
    },
    {
      id: 3,
      title: 'Pet Care Tips',
      question: 'How to take care of your new pet?',
      category: '반려동물',
      likesCount: 15,
      createdAt: '2024-06-02',
    },
    {
      id: 4,
      title: 'Cultural Festival Highlights',
      question:
        'What were the main attractions of the cultural festival?',
      category: '문화와예술',
      likesCount: 8,
      createdAt: '2024-06-01',
    },
    {
      id: 5,
      title: 'Economic Growth in 2024',
      question:
        'What are the key factors contributing to economic growth?',
      category: '경제',
      likesCount: 12,
      createdAt: '2024-05-28',
    },
  ],
  searchQuery: 'latest news',
  isLoggedIn: true,
  userId: 123,
  jwtToken: 'jwtToken123',
  nickname: 'User123',
};

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
  } = exampleData;
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
  const [selectedCategory, setSelectedCategory] =
    useState('모든 카테고리');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const [searchQuery2, setSearchQuery2] = useState('');

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
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <div
                key={result.id}
                className="search-result-view3"
              >
                <span className="search-result-title">
                  {result.title}
                </span>
                <span className="search-result-sub">
                  {result.question}
                </span>
                <div className="search-result-row">
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
      </div>
    </div>
  );
}

export default SerachResultPage;
