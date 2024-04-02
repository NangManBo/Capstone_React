import axios from 'axios';
import moment from 'moment';

export const fetchSearch = async (
  jwtToken,
  searchQuery,
  setSearchResults
) => {
  try {
    const response = await axios.get(
      `https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/polls/search?title=${searchQuery}`,
      {
        headers: {
          'AUTH-TOKEN': jwtToken,
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
      setSearchResults(formattedVotes);
    } else {
      console.error(
        'Failed to fetch messages:',
        response.data
      );
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};
