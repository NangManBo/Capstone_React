import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchVotes } from '../functions/fetchVote_function';

function CategoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoggedIn,
    userId,
    jwtToken,
    nickname,
    category,
    filteredVotes,
  } = location.state || {
    isLoggedIn: false,
    userId: '',
    jwtToken: '',
    nickname: 'manager',
  };

  const [votes, setVotes] = useState([]);
  const [standard, setStandard] = useState('');
  const [sortedVotes, setSortedVotes] = useState([
    ...filteredVotes,
  ]);

  const standards = [
    { label: '시간 순', value: '시간' },
    { label: '인기 순', value: '인기' },
  ];
  const sortVotes = () => {
    const updatedSortedVotes = [...filteredVotes];
    if (standard === '인기') {
      updatedSortedVotes.sort(
        (a, b) => b.likesCount - a.likesCount
      );
    } else if (standard === '시간') {
      updatedSortedVotes.sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    setSortedVotes(updatedSortedVotes);
  };
  useEffect(() => {
    sortVotes();
    fetchVotes(setVotes, jwtToken);
  }, [standard, filteredVotes]);
  return (
    <div>
      <div>
        <div>
          <button
            onClick={() =>
              navigate('/', {
                state: {
                  isLoggedIn,
                  userId,
                  jwtToken,
                  nickname,
                },
              })
            }
          >
            뒤로가기
          </button>
        </div>
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
                isLoggedIn,
                userId,
                jwtToken,
                nickname
              )
            }
          >
            <div>
              <p>{JSON.parse(vote.title).title}</p>
              <p>{JSON.parse(vote.question).question}</p>
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
