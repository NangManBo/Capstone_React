import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { renderPostPress } from '../functions/renderPostPress_function';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import './styles/category_style.css';
import './styles/searchresult_style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

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
    keyId,
  } = location.state || {
    isLoggedIn: false,
    userId: '',
    jwtToken: '',
    nickname: null,
  };

  const isCategory = true;
  const [standard, setStandard] = useState('');
  const [sortedVotes, setSortedVotes] = useState([
    ...matchingVotes,
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const votesPerPage = 10;

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

  useEffect(() => {
    setSortedVotes(sortVotes(matchingVotes));
    setCurrentPage(1); // 정렬 기준이 바뀌면 첫 페이지로 이동
  }, [standard, matchingVotes]);

  // 현재 페이지에 표시할 투표 데이터 계산
  const indexOfLastVote = currentPage * votesPerPage;
  const indexOfFirstVote = indexOfLastVote - votesPerPage;
  const currentVotes = sortedVotes.slice(
    indexOfFirstVote,
    indexOfLastVote
  );

  // 페이지 네비게이션
  const totalPages = Math.ceil(
    sortedVotes.length / votesPerPage
  );
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="profile_page">
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
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />{' '}
          이전 페이지로
        </h2>
        <div className="category_page_header">
          <span>{category} 게시판</span>
        </div>
        <div className="category_page_header_select">
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
        <div className="category_box">
          {currentVotes.map((vote, index) => (
            <div
              key={index}
              className="search-result-view3"
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
                  isCategory,
                  (keyId = keyId)
                )
              }
            >
              <span className="search-result-title">
                {vote.title}
              </span>
              <span className="search-result-sub">
                {vote.question}
              </span>
              <div className="search-result-row">
                <FontAwesomeIcon
                  className="category-post-like-text"
                  icon={faThumbsUp}
                />{' '}
                <span className="category-post-like-text">
                  {vote.likesCount}
                </span>
                <span className="category-post-like-text1">
                  {vote.createdAt}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          {pageNumbers.map((number) => (
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

export default CategoryPage;
