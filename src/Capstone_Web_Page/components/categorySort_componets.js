import axios from 'axios';

// 카테고리별로 투표를 필터링하고 정렬하는 함수
export const getCategoryVotes = (
  votes,
  nickname,
  jwtToken,
  isLoggedIn,
  userId,
  navigate
) => {
  const categories = [
    '시사',
    '정치',
    '게임',
    '스포츠',
    '음식',
    '반려동물',
  ];
  const renderPostPress = async (firstMatchingVote) => {
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

  return categories.map((category) => {
    // Filter votes that match the current category
    const matchingVotes = votes.filter(
      (vote) => vote.category === category
    );

    // Sort matching votes by createdAt in descending order
    matchingVotes.sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Use a Set to keep track of shown titles
    const shownTitles = new Set();

    // Find the first matching vote that has not been shown yet
    const firstMatchingVote = matchingVotes.find((vote) => {
      if (!shownTitles.has(vote.title)) {
        shownTitles.add(vote.title);
        return true;
      }
      return false;
    });
    // JSON 문자열을 파싱하여 JavaScript 객체로 변환
    const titleObj = firstMatchingVote
      ? JSON.parse(firstMatchingVote.title)
      : null;

    // 객체에서 title 값을 추출하고, 없을 경우 '없음'을 기본값으로 사용
    const title = titleObj ? titleObj.title : '없음';
    const goToCategory = (category) => {
      // Filter votes for the selected category

      navigate('/category', {
        state: {
          category,
          votes,
          isLoggedIn,
          userId,
          jwtToken,
          nickname,
          matchingVotes,
        },
      });
    };

    return (
      <div
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <div
          onClick={() => goToCategory(category)}
          style={{ marginRight: '20px' }}
        >
          <h3>{category}</h3>
        </div>
        <button
          onClick={() => renderPostPress(firstMatchingVote)}
          key={`${category}-${
            firstMatchingVote?.title || ''
          }`}
          className="category_sub_box" // 스타일을 적용할 CSS 클래스
          style={{ width: '100px', height: '60px' }}
        >
          <h4>{title}</h4>
        </button>
      </div>
    );
  });
};
