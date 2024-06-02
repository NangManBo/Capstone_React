import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { renderPostPress } from '../functions/renderPostPress_function';
import { MainBanner } from '../components/mainBanner_components';
import './styles/searchresult_style.css';

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

  const groupedResults = groupByCategory(searchResults);
  return (
    <div className="Page">
      {MainBanner(
        jwtToken,
        isLoggedIn,
        userId,
        nickname,
        keyId
      )}
      <div className="search-form">
        {categories.map((category) => (
          <div key={category}>
            {groupedResults[category] && (
              <>
                <h2>{category}</h2>
                <div className="search-result-view2">
                  {groupedResults[category].map(
                    (result) => (
                      <div
                        key={result.id}
                        className="search-result-view3"
                      >
                        {/* 검색 결과 렌더링 */}
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
                    )
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        {searchResults.length === 0 &&
          searchQuery.trim() !== '' && (
            <div className="search-result-view2">
              <span className="search-result-title">
                검색 결과가 없습니다.
              </span>
            </div>
          )}
      </div>
    </div>
  );
}

export default SerachResultPage;
