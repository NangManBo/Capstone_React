import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
    <div>
      <button
        onClick={isCategory ? goToCategory : goToMain}
      >
        <span>뒤로가기</span>
      </button>
      <div>
        <h1>{vote && vote.title}</h1>
        <p>투표 기간 설정: {vote && vote.createdAt}</p>
        <p>주최자 : {vote && vote.createdBy}</p>
        <p>{vote && vote.question}</p>

        {vote?.mediaUrl &&
          (vote.mediaUrl.endsWith('.mp4') ? (
            <video
              src={vote.mediaUrl}
              controls
              style={{
                width: '400px',
                height: '400px',
              }}
            />
          ) : (
            <img
              src={vote.mediaUrl}
              alt="Media"
              style={{
                width: '400px',
                height: '400px',
              }}
            />
          ))}
        {pollOptions.map((option) => (
          <div key={option.id}>
            <span>{option.text}</span>
          </div>
        ))}
        <p>댓글</p>
        <p>투표 후 댓글 작성 및 보기가 가능합니다</p>
        <button onClick={goToLogin}>
          투표 및 댓글을 확인하고 싶으시다면 로그인 해주세요
        </button>
      </div>
    </div>
  );
}

export default VoteOnlyLookPage;
