import axios from 'axios';

export const renderPostPress = async (
  firstMatchingVote,
  navigate,
  isLoggedIn,
  userId,
  jwtToken,
  nickname,
  category,
  matchingVotes,
  isCategory,
  keyId
) => {
  if (isLoggedIn === false) {
    navigate('/voteonlylook', {
      state: {
        vote: firstMatchingVote,
        category,
        matchingVotes,
        isCategory,
      },
    });
  } else {
    try {
      // Fetch user votes from the backend
      const response = await axios.get(
        'https://dovote.p-e.kr/votes/ok/' + keyId,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: jwtToken,
          },
        }
      );

      if (response.status === 200) {
        const userVotes = response.data;

        // Check if userVotes is null or empty
        if (!userVotes || userVotes.length === 0) {
          const isCreatedByUser =
            firstMatchingVote.keyId === keyId;

          // Check if the vote is closed
          const isVoteEnd =
            firstMatchingVote.voteStatus === 'CLOSED';

          // Navigate to the appropriate screen based on voting status, createdBy, and voteStatus
          if (isVoteEnd) {
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
                isCategory,
                keyId,
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
                isCategory,
                keyId,
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
                isCategory,
                keyId,
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
                isCategory,
                keyId,
              },
            }
          );
        }
      } else {
      }
    } catch (error) {}
  }
};
