import axios from 'axios';
import moment from 'moment';

export const fetchSearch = async (
  keyId,
  searchResults,
  searchQuery,
  isLoggedIn,
  userId,
  jwtToken,
  nickname
) => {
  try {
    const response = await axios.get(
      `https://dovote.p-e.kr/polls/search?title=${searchQuery}`,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 200) {
      const formattedVotes = response.data.map((vote) => ({
        id: vote.id,
        mediaUrl: vote.mediaUrl,
        createdBy: vote.createdBy,
        voteStatus: vote.voteStatus,
        createdAt: moment
          .utc(vote.createdAt, 'YYYY.MM.DD HH:mm:ss')
          .format('YYYY-MM-DD HH:mm'),
        category: vote.category,
        title: vote.title,
        question: vote.question,
        likesCount: vote.likesCount,
        likedUsers: vote.likedUsernames,
        choice: Array.isArray(vote.choice)
          ? vote.choice.map((choice) => ({
              id: choice.id,
              text: choice.text,
            }))
          : [],
      }));
      return formattedVotes; // 검색 결과를 반환합니다.
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
    return []; // 오류가 발생하면 빈 배열을 반환합니다.
  }
};
