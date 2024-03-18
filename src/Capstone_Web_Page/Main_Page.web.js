import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

function MainPage() {
  const [votes, setVotes] = useState([]); // 상태 추가
  const isLoggedIn = false;
  const jwtToken = ''; // 실제 토큰 값을 여기에 넣어야 합니다.
  // 카테고리 상수
  const categories = [
    '시사',
    '정치',
    '게임',
    '스포츠',
    '음식',
    '반려동물',
  ];
  // 투표 데이터를 받아오는 함수
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await axios.get(
          'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/polls/all',
          {
            headers: {
              'AUTH-TOKEN': jwtToken,
            },
          }
        );
        if (response.status === 200) {
          const votesData = response.data;

          if (Array.isArray(votesData)) {
            const formattedVotes = votesData.map(
              (vote) => ({
                id: vote.id,
                mediaUrl: vote.mediaUrl,
                createdBy: vote.createdBy,
                voteStatus: vote.voteStatus,
                createdAt: moment
                  .utc(vote.createdAt)
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
              })
            );
            setVotes(formattedVotes); // 상태 업데이트
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
    fetchVotes();
  }, []); // jwtToken이 변경될 때만 투표 데이터를 다시 가져옵니다.

  // 카테고리별로 투표를 필터링하고 정렬하는 함수
  const getCategoryVotes = () => {
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
      const firstMatchingVote = matchingVotes.find(
        (vote) => {
          if (!shownTitles.has(vote.title)) {
            shownTitles.add(vote.title);
            return true;
          }
          return false;
        }
      );

      return (
        <button
          key={`${category}-${
            firstMatchingVote?.title || ''
          }`}
          className="category_sub_box" // 스타일을 적용할 CSS 클래스
          style={{ width: '200px', height: '100px' }}
        >
          <h4 className="category_sub_title_text">
            {firstMatchingVote?.title || '없음'}
          </h4>
        </button>
      );
    });
  };
  // 컴포넌트 렌더링 로직
  return (
    <div>
      <div style={{ overflowY: 'scroll' }}>
        <div className="main_Page">
          <div className="main_Row">
            <h1 className="main_title">투표는 DO표</h1>
            {isLoggedIn ? (
              // 로그인 후 표시할 내용
              <div className="after_login_view"></div>
            ) : (
              // 로그인 전 표시할 내용
              <div className="login_prompt_view"></div>
            )}
          </div>
          <div className="main_Row">
            <h2 className="popular_vote_title">
              인기 투표
            </h2>
          </div>

          <div className="main_Row">
            <h2 className="category_">카테고리별 투표</h2>
          </div>
          <div className="category_sub_title_box">
            {getCategoryVotes()}{' '}
            {/* 카테고리별 투표 렌더링 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
