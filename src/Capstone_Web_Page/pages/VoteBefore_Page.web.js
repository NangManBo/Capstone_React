import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function VoteBeforePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoggedIn,
    userId,
    vote,
    jwtToken,
    nickname,
    isCategory,
    category,
    matchingVotes,
  } = location.state || { isCategory: false };

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
        'https://ec2-43-200-126-104.ap-northeast-2.compute.amazonaws.com/votes',
        VoteDto,
        { headers: { 'AUTH-TOKEN': jwtToken } }
      );
      if (response.status === 201) {
        console.log('투표 성공:', response.data);
        // Navigate to VoteAfter page with updated state
        goToVoteAfter(vote);
      } else {
        console.error('투표 실패:', response.data);
      }
    } catch (error) {
      console.error('서버랑 오류 :', error);
    }
  };

  const goToVoteAfter = async (vote) => {
    try {
      // Fetch user votes from the backend
      const response = await axios.get(
        'https://ec2-43-200-126-104.ap-northeast-2.compute.amazonaws.com/votes/ok/' +
          nickname,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
        }
      );

      if (response.status === 200) {
        //console.log('내가 투표한 데이터', response.data);
        const userVotes = response.data;

        navigate('/voteafter', {
          state: {
            vote: vote,
            isLoggedIn,
            userId,
            jwtToken,
            nickname,
            userVotes,
          },
        });
      } else {
        console.error(
          '투표 들어가려는데 실패:',
          response.data
        );
      }
    } catch (error) {
      console.error('투표 들어가려는데 오류:', error);
    }
  };
  const goToMain = () => {
    navigate('/', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
      },
    });
  };
  const goToCategory = () => {
    navigate('/category', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        category,
        matchingVotes,
      },
    });
  };

  return (
    <div>
      <div>
        <button
          onClick={() =>
            isCategory ? goToCategory() : goToMain()
          }
        >
          뒤로가기
        </button>
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
