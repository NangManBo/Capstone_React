import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { renderPostPress } from '../functions/renderPostPress_function';
import { MainBanner } from '../components/mainBanner_components';
const SerachResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    searchResults,
    searchQuery,
    isLoggedIn,
    userId,
    jwtToken,
    nickname,
  } = location.state;
  return (
    <div>
      <MainBanner />
      <div>
        {searchResults.length > 0 && (
          <div className="search-result-view2">
            {searchResults.map((result) => (
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
                  {JSON.parse(result.question).question}
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
        )}
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
};

export default SerachResultPage;