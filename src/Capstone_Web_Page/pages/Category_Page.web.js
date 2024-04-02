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
    matchingVotes,
  } = location.state || {
    isLoggedIn: false,
    userId: '',
    jwtToken: '',
    nickname: 'manager',
  };

  const [votes, setVotes] = useState([]);
  const [standard, setStandard] = useState('');
  const [sortedVotes, setSortedVotes] = useState([
    ...matchingVotes,
  ]);

  const standards = [
    { label: '시간 순', value: '시간' },
    { label: '인기 순', value: '인기' },
  ];
  const sortVotes = () => {
    const updatedSortedVotes = [...matchingVotes];
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
  const renderPostPress = async (vote) => {
    try {
      // Fetch user votes from the backend
      const response = await axios.get(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/votes/ok/' +
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
        console.log('userVotes:', userVotes);

        // Check if userVotes is null or empty
        if (!userVotes || userVotes.length === 0) {
          const isCreatedByUser =
            firstMatchingVote.createdBy === nickname;

          // Check if the vote is closed
          const isVoteEnd =
            firstMatchingVote.voteStatus === 'CLOSED';
          console.log('first' + firstMatchingVote);
          if (nickname === 'manager') {
            navigate('/voteonlylook', {
              state: {
                vote: firstMatchingVote,
              },
            });
          }
          // Navigate to the appropriate screen based on voting status, createdBy, and voteStatus
          else if (isVoteEnd) {
            // If the vote is closed, navigate to 'VoteEnd'
            navigate('/voteend', {
              state: {
                vote: firstMatchingVote,
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
                userVotes,
              },
            });
          } else if (isCreatedByUser) {
            // If the user created the vote, navigate to 'VoteCreatedUser'
            navigate('/votecreateduser', {
              state: {
                vote: firstMatchingVote,
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
                userVotes,
              },
            });
          } else {
            // If userVotes is null or empty, navigate to 'VoteBefore'
            navigate('/votebefore', {
              state: {
                vote: firstMatchingVote,
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
              },
            });
          }
        } else {
          // Continue with the existing logic for non-empty userVotes
          const isCreatedByUser =
            firstMatchingVote.createdBy === nickname;

          // Check if the vote is closed
          const isVoteEnd =
            firstMatchingVote.voteStatus === 'CLOSED';
          // Ensure vote.category is defined
          const category = firstMatchingVote.category || '';
          // Check if the user has voted for the selected poll
          const hasVoted = userVotes.some(
            (userVote) =>
              userVote.pollId === firstMatchingVote.id
          );
          // Navigate to the appropriate screen based on voting status, createdBy, and voteStatus
          navigate(
            isVoteEnd
              ? '/voteend'
              : isCreatedByUser
              ? '/votecreateduser'
              : hasVoted
              ? '/voteafter'
              : '/votebefore',
            {
              state: {
                category,
                vote: firstMatchingVote,
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
                userVotes,
              },
            }
          );
        }
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
  useEffect(() => {
    sortVotes();
    fetchVotes(setVotes, jwtToken);
  }, [standard, matchingVotes]);
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
            onClick={() => renderPostPress(vote)}
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
