import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function VoteBeforePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userId, vote, jwtToken, nickname } =
    location.state;

  const [pollOptions, setPollOptions] = useState([]);

  useEffect(() => {
    if (vote.choice && Array.isArray(vote.choice)) {
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

  const handleVote = async () => {
    const selectedOption = pollOptions.find(
      (option) => option.isSelected
    );
    if (!selectedOption) {
      window.alert('알림', '투표항목을 선택해주세요');
      return;
    }

    const VoteDto = {
      pollId: vote.id,
      choiceId: selectedOption.id,
      nickname: nickname,
    };

    try {
      const response = await axios.post(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/votes',
        VoteDto,
        { headers: { 'AUTH-TOKEN': jwtToken } }
      );
      if (response.status === 201) {
        console.log('투표 성공:', response.data);
        // Navigate to VoteAfter page with updated state
        navigate('/voteafter', {
          state: {
            isLoggedIn,
            userId,
            vote,
            jwtToken,
            nickname,
            userVotes: response.data,
          },
        });
      } else {
        console.error('투표 실패:', response.data);
      }
    } catch (error) {
      console.error('서버랑 오류 :', error);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div>
      <div>
        <button onClick={handleGoBack}>Go Back</button>
      </div>
      <div>
        <h1>{JSON.parse(vote.title).title}</h1>
        <p>투표 기간 설정: {vote.createdAt}</p>
        <p>주최자 : {vote.createdBy}</p>
        <p>{JSON.parse(vote.question).question}</p>
        {vote.mediaUrl && (
          <img src={vote.mediaUrl} alt="Vote" />
        )}
        {pollOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleVoteOption(option.id)}
          >
            {option.isSelected ? '✓ ' : ''}
            {option.text}
          </button>
        ))}
        <p>댓글</p>
        <p>투표 후 댓글 작성 및 보기가 가능합니다</p>
        <button onClick={handleVote}>
          선택한 버튼으로 투표하기
        </button>
      </div>
    </div>
  );
}

export default VoteBeforePage;
