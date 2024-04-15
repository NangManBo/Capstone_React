import React from 'react';
import './styles/poplularBanner_style.css';
import { renderPostPress } from '../functions/renderPostPress_function';

const fillEmptyVotes = (votes, count) => {
  while (votes.length < count) {
    votes.push({
      title: '없음',
      createdBy: '없음',
      createdAt: '',
      likesCount: 0,
      category: '없음',
    });
  }
  return votes;
};

export const PopularVoteBanner = (
  votes,
  nickname,
  jwtToken,
  isLoggedIn,
  userId,
  navigate
) => {
  const weekAgo = new Date(
    new Date().setDate(new Date().getDate() - 7)
  );

  const recentVotes = votes.filter((vote) => {
    const createdAt = new Date(vote.createdAt);
    return createdAt >= weekAgo;
  });

  const sortedVotes = recentVotes.sort(
    (a, b) => b.likesCount - a.likesCount
  );
  const topThreeVotes = fillEmptyVotes(
    sortedVotes.slice(0, 3),
    3
  );

  return (
    <div className="popular_banner">
      <div className="popular_banner_title">
        요즘 핫한 게시글은?
      </div>
      <div className="popular_banner_content">
        {topThreeVotes.map((vote, index) => (
          <div
            key={index}
            className="vote_item"
            onClick={() =>
              vote.title !== '없음' &&
              renderPostPress(
                vote,
                navigate,
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
                false
              )
            }
          >
            <h3>{vote.title}</h3>
            <p>
              {vote.category !== '없음'
                ? vote.category
                : ''}
            </p>
            <p>좋아요: {vote.likesCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
