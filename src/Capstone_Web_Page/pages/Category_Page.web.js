import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { renderPostPress } from '../functions/renderPostPress_function';
import { MainBanner } from '../components/mainBanner_components';

function CategoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoggedIn,
    userId,
    jwtToken,
    nickname,
    category,
    matchingVotes,
  } = location.state || {
    isLoggedIn: false,
    userId: '',
    jwtToken: '',
    nickname: 'guest',
  };
  const isCategory = true;
  const [standard, setStandard] = useState('');
  const [sortedVotes, setSortedVotes] = useState([
    ...matchingVotes,
  ]);
  const standards = [
    { label: '시간 순', value: '시간' },
    { label: '인기 순', value: '인기' },
  ];
  const sortVotes = (votes) => {
    if (standard === '인기') {
      return [...votes].sort(
        (a, b) => b.likesCount - a.likesCount
      );
    } else if (standard === '시간') {
      return [...votes].sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    return votes;
  };
  // ㅋㅋ ㅈㄴ 하기싫네
  useEffect(() => {
    setSortedVotes(sortVotes(matchingVotes));
    console.log('카테고리 분류 데이터' + setSortedVotes);
  }, [standard, matchingVotes]);
  return (
    <div className="Page">
      {MainBanner(jwtToken, isLoggedIn, userId, nickname)}
      <div>
        <div>
          <span>{category}</span>
        </div>
        <div>
          <select
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
          >
            {standards.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ overflowY: 'scroll' }}>
        {sortedVotes.map((vote, index) => (
          <div
            key={index}
            onClick={() =>
              renderPostPress(
                vote,
                navigate,
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
                category,
                matchingVotes,
                isCategory
              )
            }
          >
            <div>
              <p>{vote.title}</p> <p>{vote.question}</p>{' '}
            </div>
            <div>
              <span>{vote.likesCount}</span>
              <span>{vote.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
