import axios from 'axios';

// 서버에서 댓글 받아오기
export const fetchComments = async (
  voteId,
  jwtToken,
  setComments
) => {
  try {
    const response = await axios.get(
      `https://dovote.p-e.kr/comments/poll/${voteId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwtToken,
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
    }
  } catch (error) {}
};

// 같은 투표 그룹의 투표자들을 가져오는 함수
export const sameVoteGroup = async (
  vote,
  userVotes,
  keyId,
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
        `https://dovote.p-e.kr/votes/user-nicknames/${vote.id}/${customValue}/${keyId}`,
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
      .catch((error) => null);
  });

  const results = await Promise.all(promises);
  setSameOption(results.filter((result) => result != null));
};

export const getMessages = async (
  jwtToken,
  keyId,
  setMessageCount
) => {
  try {
    const response = await axios.get(
      'https://dovote.p-e.kr/message/count/' + keyId,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: jwtToken,
        },
      }
    );

    if (response.status === 200) {
      setMessageCount(response.data);
      console.log(response.data);
    } else {
    }
  } catch (error) {}
};
