// import axios from 'axios';
// import moment from 'moment';

// export const fetchVotes = async (
//   setVotes = () => {}, // 기본값으로 빈 함수 설정
//   jwtToken,
//   setSearchResults = () => {} // 기본값으로 빈 함수 설정
// ) => {
//   try {
//     const response = await axios.get(
//       'https://dovote.p-e.kr/polls/all',
//       {
//         headers: {
//           'AUTH-TOKEN': jwtToken,
//         },
//       }
//     );
//     if (response.status === 200) {
//       const votesData = response.data;

//       if (Array.isArray(votesData)) {
//         const formattedVotes = votesData.map((vote) => ({
//           id: vote.id,
//           mediaUrl: vote.mediaUrl,
//           createdBy: vote.createdBy,
//           voteStatus: vote.voteStatus,
//           createdAt: moment
//             .utc(vote.createdAt, 'YYYY.MM.DD HH:mm:ss')
//             .format('YYYY-MM-DD HH:mm'),
//           category: vote.category,
//           title: vote.title,
//           question: vote.question,
//           likesCount: vote.likesCount,
//           likedUsers: vote.likedUsernames,
//           choice: vote.choice
//             ? vote.choice.map((choice) => ({
//                 id: choice.id,
//                 text: choice.text,
//               }))
//             : [],
//         }));
//         console.log('투표 데이터 확인:', formattedVotes); // 변환된 데이터 로그로 출력
//         if (setVotes) setVotes(formattedVotes); // 상태 업데이트
//         if (setSearchResults)
//           setSearchResults(formattedVotes);
//       } else {
//         console.error(
//           'Invalid votes data format:',
//           votesData
//         );
//       }
//     } else {
//       console.error(
//         'Failed to fetch votes:',
//         response.data
//       );
//     }
//   } catch (error) {
//     console.error('투표 데이터 가져오기:', error);
//   }
// };

import moment from 'moment';

export const fetchVotes = async (
  setVotes = () => {}, // 기본값으로 빈 함수 설정
  jwtToken,
  setSearchResults = () => {} // 기본값으로 빈 함수 설정
) => {
  try {
    // 예시 데이터
    const exampleVotesData = [
      {
        id: 1,
        mediaUrl: 'https://example.com/media1.jpg',
        createdBy: 'User1',
        voteStatus: 'open',
        createdAt: '2023.05.01 12:30:00',
        category: '스포츠',
        title: 'Title1',
        question: 'Question1?',
        likesCount: 10,
        likedUsernames: ['UserA', 'UserB'],
        choice: [
          { id: 1, text: 'Choice1' },
          { id: 2, text: 'Choice2' },
        ],
      },
      {
        id: 2,
        mediaUrl: 'https://example.com/media2.jpg',
        createdBy: 'User2',
        voteStatus: 'closed',
        createdAt: '2023.04.25 09:15:00',
        category: '시사',
        title: 'Title2',
        question: 'Question2?',
        likesCount: 20,
        likedUsernames: ['UserC', 'UserD'],
        choice: [
          { id: 1, text: 'Choice1' },
          { id: 2, text: 'Choice2' },
        ],
      },
      {
        id: 3,
        mediaUrl: 'https://example.com/media3.jpg',
        createdBy: 'User3',
        voteStatus: 'open',
        createdAt: '2023.03.10 14:45:00',
        category: '게임',
        title: 'Title3',
        question: 'Question3?',
        likesCount: 5,
        likedUsernames: ['UserE', 'UserF'],
        choice: [
          { id: 1, text: 'Choice1' },
          { id: 2, text: 'Choice2' },
        ],
      },
    ];

    const formattedVotes = exampleVotesData.map((vote) => ({
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

    console.log('투표 데이터 확인:', formattedVotes); // 변환된 데이터 로그로 출력
    if (setVotes) setVotes(formattedVotes); // 상태 업데이트
    if (setSearchResults) setSearchResults(formattedVotes);
  } catch (error) {
    console.error('투표 데이터 가져오기:', error);
  }
};
