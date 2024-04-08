import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { renderPostPress } from '../functions/renderPostPress_function';
import { MainBanner } from '../components/mainBanner_components';
import '../styles/searchresult_style.css';

function SerachResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
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
  return (
    <div className="Page">
      <MainBanner
        jwtToken={jwtToken}
        isLoggedIn={isLoggedIn} // 또는 조건에 따라 변하는 값
        userId={userId}
        nickname={nickname}
      />
      <div className="search-form">
        {categories.map((category) => {
          // 현재 카테고리에 해당하는 검색 결과가 있으면 렌더링
          const results = categorizedResults[category];
          if (results && results.length > 0) {
            return (
              <div
                key={category}
                className="category-section"
              >
                <h3>{category}</h3>
                <div className="search-result-view2">
                  {results.map((result) => (
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
                          nickname
                        )
                      }
                    >
                      <span className="search-result-title">
                        {JSON.parse(result.title).title}
                      </span>
                      <span
                        className="search-result-sub"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {
                          JSON.parse(result.question)
                            .question
                        }
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
                  ))}
                </div>
              </div>
            );
          }
          return null; // 현재 카테고리에 해당하는 결과가 없으면 null 반환
        })}
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
