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

  const groupByCategory = (searchResults) => {
    return searchResults.reduce((acc, result) => {
      // result.category를 키로 사용하여 그룹화
      const category = result.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(result);
      return acc;
    }, {});
  };

  return (
    <div className="Page">
      <MainBanner
        jwtToken={jwtToken}
        isLoggedIn={isLoggedIn} // 또는 조건에 따라 변하는 값
        userId={userId}
        nickname={nickname}
      />
      <div>
        {Object.keys(categorizedResults).length > 0 ? (
          Object.entries(categorizedResults).map(
            ([category, results]) => (
              <div key={category}>
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
                      {/* 결과 렌더링 */}
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        ) : (
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
