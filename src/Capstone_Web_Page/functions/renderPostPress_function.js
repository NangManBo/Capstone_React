import axios from 'axios';

export const renderPostPress = async (
  firstMatchingVote,
  navigate,
  isLoggedIn,
  userId,
  jwtToken,
  nickname,
  category,
  matchingVotes
) => {
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
              category,
              matchingVotes,
              isCategory: true,
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
              category,
              matchingVotes,
              isCategory: true,
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
              category,
              matchingVotes,
              isCategory: true,
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
              category,
              matchingVotes,
              isCategory: true,
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
              category,
              matchingVotes,
              isCategory: true,
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
