import axios from 'axios';
import moment from 'moment';

export const fetchVotes = async (
  setVotes = () => {}, // 기본값으로 빈 함수 설정
  setSearchResults = () => {} // 기본값으로 빈 함수 설정
) => {
  try {
    const response = await axios.get(
      'https://dovote.p-e.kr/polls/all',
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.status === 200) {
      const votesData = response.data;
      console.log(votesData);
      if (Array.isArray(votesData)) {
        const formattedVotes = votesData.map((vote) => ({
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
          choice: vote.choice
            ? vote.choice.map((choice) => ({
                id: choice.id,
                text: choice.text,
              }))
            : [],
        }));

        if (setVotes) setVotes(formattedVotes); // 상태 업데이트
        if (setSearchResults)
          setSearchResults(formattedVotes);
      } else {
      }
    } else {
    }
  } catch (error) {}
};
