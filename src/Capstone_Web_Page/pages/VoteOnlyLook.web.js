import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import './styles/vote_style.css';

function VoteOnlyLookPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { vote, isCategory, category, matchingVotes } =
    location.state || { isCategory: false };

  const [pollOptions, setPollOptions] = useState([]);

  useEffect(() => {
    if (vote && vote.choice && Array.isArray(vote.choice)) {
      setPollOptions(
        vote.choice.map((choice) => ({
          id: choice.id,
          text: choice.text,
          votes: 0,
          isSelected: false,
        }))
      );
    } else {
      console.error(
        'ERROR: vote.choices is not an array or is undefined'
      );
    }
  }, [vote]);

  const handleVoteOption = (optionId) => {
    const updatedOptions = pollOptions.map((option) => ({
      ...option,
      isSelected: option.id === optionId,
    }));
    setPollOptions(updatedOptions);
  };

  const goToMain = () => {
    navigate('/');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToCategory = () => {
    navigate('/category', {
      state: {
        isCategory,
        category,
        matchingVotes,
      },
    });
  };

  return (
    <div className="vote_page">
      {MainBanner('', false, '', '')}
      {LeftBar('', false, '', null, null)}
      <div className="right_page">
        <h2
          className="goBackButton"
          onClick={() =>
            isCategory ? goToCategory() : goToMain()
          }
        >
          이전 페이지로
        </h2>
        <div>
          <div className="vote_header">
            <>
              <h1>{vote.title}</h1>
            </>
            <div className="vote_userInfo">
              <p>
                투표 기간 설정: {vote && vote.createdAt}
              </p>
              <p>주최자 : {vote && vote.createdBy}</p>
            </div>
          </div>
          <div className="vote_qustion">
            <p>{vote.question}</p>
          </div>
          {vote?.mediaUrl &&
            (vote.mediaUrl.endsWith('.mp4') ? (
              <video
                src={vote.mediaUrl}
                controls
                className="vote_image"
              />
            ) : (
              <img
                src={vote.mediaUrl}
                alt="Media"
                className="vote_image"
              />
            ))}
          {pollOptions.map((option) => (
            <div className="vote_button" key={option.id}>
              <span className="vote_text">
                {option.text}
              </span>
            </div>
          ))}
          <div className="vote_button_box">
            <button
              onClick={goToLogin}
              className="vote_end_button"
            >
              투표 및 댓글을 확인하고 싶으시다면 로그인
              해주세요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoteOnlyLookPage;
