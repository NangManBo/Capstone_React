import axios from 'axios';
import moment from 'moment';

export const fetchVotes = async (
  setVotes = () => {}, // 기본값으로 빈 함수 설정
  jwtToken,
  setSearchResults = () => {} // 기본값으로 빈 함수 설정
) => {
  try {
    const response = await axios.get(
      'https://ec2-43-200-126-104.ap-northeast-2.compute.amazonaws.com/polls/all',
      {
        headers: {
          'AUTH-TOKEN': jwtToken,
        },
      }
    );
    if (response.status === 200) {
      const votesData = response.data;

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
        console.error(
          'Invalid votes data format:',
          votesData
        );
      }
    } else {
      console.error(
        'Failed to fetch votes:',
        response.data
      );
    }
  } catch (error) {
    console.error('투표 데이터 가져오기:', error);
  }
};
