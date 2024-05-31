import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchVotes } from '../functions/fetchVote_function';
import './styles/leftBar_style.css';

export const LeftBar = (
  jwtToken,
  isLoggedIn,
  userId,
  nickname,
  keyId
) => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState([]);
  const [click, setClick] = useState(false);

  const categories = [
    '시사',
    '정치',
    '게임',
    '스포츠',
    '음식',
    '경제',
    '반려동물',
    '문화와예술',
  ];

  useEffect(() => {
    fetchVotes(setVotes);
  }, [click]);

  const handleClick = (category) => {
    setClick(!click);
    const matchingVotes = votes.filter(
      (vote) => vote.category === category
    );

    navigate('/category', {
      state: {
        category,
        votes,
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        matchingVotes,
        keyId,
      },
    });
  };

  return (
    <div className="left_bar">
      <div className="left_bar_text_box">
        <label className="left_bar_title">
          전체 카테고리
        </label>
        {categories.map((category, index) => (
          <div
            onClick={() => {
              handleClick(category);
            }}
            className="left_bar_category_box"
            key={index}
          >
            <label className="left_bar_category">
              {category} 게시판
            </label>
            <label className="left_bar_category_info">
              {getCategoryDescription(category)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const getCategoryDescription = (category) => {
  switch (category) {
    case '정치':
      return '최근 정치 이슈에 대한 의견';
    case '시사':
      return '시사문제에 관한 다양한 의견';
    case '스포츠':
      return '축구, 야구, 농구 등 다양한 스포츠';
    case '게임':
      return '게임에 대한 모든 이야기';
    case '반려동물':
      return '강아지, 고양이 !!';
    case '음식':
      return '오늘은 뭐 먹지?';
    case '문화와예술':
      return '최근 흥미로웠던 문화와 예술';
    case '경제':
      return '경제 관련 정보와 뉴스';
    default:
      return '다양한 주제에 대한 토론';
  }
};
