import axios from 'axios';
import moment from 'moment';
import { useState } from 'react';

export const fetchSearch = async (
  isLoggedIn,
  userId,
  nickname,
  jwtToken,
  searchQuery
) => {
  const [searchResults, setSearchResults] = useState([]);
  try {
    console.log('검색한다 : ' + searchQuery);
    const response = await axios.get(
      `https://dovote.p-e.kr/polls/search?title=${searchQuery}`,
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
  navigate('/searchresult', {
    state: {
      searchResults,
      searchQuery,
      isLoggedIn,
      userId,
      jwtToken,
      nickname,
    },
  });
};
