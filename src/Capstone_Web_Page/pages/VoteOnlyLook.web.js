import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function VoteOnlyLookPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { vote, updateDM2 } = location.state || {};

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

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <button onClick={handleGoBack}>
        <span>Back</span>
      </button>
      <div>
        <h1>
          {vote &&
            vote.title &&
            JSON.parse(vote.title).title}
        </h1>
        <p>투표 기간 설정: {vote && vote.createdAt}</p>
        <p>주최자 : {vote && vote.createdBy}</p>
        <p>
          {vote &&
            vote.question &&
            JSON.parse(vote.question).question}
        </p>
        {vote && vote.mediaUrl && (
          <img
            src={vote.mediaUrl}
            alt="Media"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
        {pollOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleVoteOption(option.id)}
          >
            <span>{option.isSelected ? '✓' : ''}</span>
            <span>{option.text}</span>
          </div>
        ))}
        <p>댓글</p>
        <p>투표 후 댓글 작성 및 보기가 가능합니다</p>
        <button onClick={handleGoLogin}>
          투표 및 댓글을 확인하고 싶으시다면 로그인 해주세요
        </button>
      </div>
    </div>
  );
}

export default VoteOnlyLookPage;
