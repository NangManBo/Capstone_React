import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import './styles/vote_style.css';

function VoteBeforePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    keyId,
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
      alert('투표항목을 선택해주세요');
      return;
    }
    try {
      const response = await axios.post(
        'https://dovote.p-e.kr/votes',
        {
          pollId: vote.id,
          choiceId: selectedOption.id,
          nickname: nickname,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwtToken,
          },
        }
      );
      if (response.status === 201) {
        goToVoteAfter(vote);
      } else {
      }
    } catch (error) {}
  };

  const goToVoteAfter = async (vote) => {
    try {
      // Fetch user votes from the backend
      const response = await axios.get(
        'https://dovote.p-e.kr/votes/ok/' + keyId,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        const userVotes = response.data;

        navigate('/voteafter', {
          state: {
            keyId: keyId,
            vote: vote,
            isLoggedIn,
            userId,
            jwtToken,
            nickname,
            userVotes,
          },
        });
      } else {
      }
    } catch (error) {}
  };
  const goToMain = () => {
    navigate('/', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        keyId,
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
        keyId,
      },
    });
  };

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
        <div className="vote_button_back_like_box">
          <div
            className="goBackButton"
            onClick={() =>
              isCategory ? goToCategory() : goToMain()
            }
          >
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              style={{ fontSize: '36px' }}
            />{' '}
          </div>
          <div className="likeButton">
            <FontAwesomeIcon
              icon={faHeart}
              color="black"
              style={{ fontSize: '36px' }}
            />
          </div>
        </div>
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
          <div className="vote_choice_box">
            {pollOptions.map((option) => (
              <button
                className={`vote_select_button ${
                  option.isSelected ? 'selected' : ''
                }`}
                key={option.id}
                onClick={() => handleVoteOption(option.id)}
              >
                {option.isSelected ? '✓ ' : ''}
                {option.text}
              </button>
            ))}
          </div>
          <div className="vote_button_box">
            <button
              onClick={handleVote}
              className="vote_end_button"
            >
              선택한 버튼으로 투표하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoteBeforePage;
