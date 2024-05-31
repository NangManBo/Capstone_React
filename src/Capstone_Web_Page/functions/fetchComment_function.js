import axios from 'axios';

// 서버에서 댓글 받아오기
export const fetchComments = async (
  voteId,
  jwtToken,
  setComments
) => {
  try {
    const response = await axios.get(
      `https://dovote.p-e.kr/api/comments/poll/${voteId}`,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 200) {
      const commentData = response.data;

      const parentComments = commentData.filter(
        (comment) => comment.parentComment === null
      );
      const childComments = commentData.filter(
        (comment) => comment.parentComment !== null
      );

      const formattedComments = parentComments.map(
        (parentComment) => {
          parentComment.childrenComment =
            childComments.filter(
              (childComment) =>
                childComment.parentComment.id ===
                parentComment.id
            );
          return parentComment;
        }
      );

      setComments(formattedComments);
      // sortComments 함수 로직을 여기에 직접 구현하거나, sortStandard를 기반으로 정렬 로직을 추가합니다.
    }
  } catch (error) {
    console.error('댓글 조회하기 오류:', error);
  }
};

// 같은 투표 그룹의 투표자들을 가져오는 함수
export const sameVoteGroup = async (
  vote,
  userVotes,
  nickname,
  jwtToken,
  setSameOption
) => {
  const isSelectedByUserArray = vote.choice.map(
    (choice) => ({
      choiceId: choice.id,
      isSelectedByUser: userVotes.some(
        (userVote) => userVote.choiceId === choice.id
      ),
    })
  );

  const promises = isSelectedByUserArray.map((item) => {
    const customValue = item.isSelectedByUser
      ? item.choiceId
      : 0;
    return axios
      .get(
        `https://dovote.p-e.kr/votes/user-nicknames/${vote.id}/${customValue}/${nickname}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then((response) => ({
        choiceId: item.choiceId,
        userNames: response.data,
      }))
      .catch((error) => console.error('에러 발생:', error));
  });

  const results = await Promise.all(promises);
  setSameOption(results.filter((result) => result != null)); // 에러가 발생하지 않은 결과만 필터링
};
