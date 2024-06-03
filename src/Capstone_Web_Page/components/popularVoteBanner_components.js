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
      category: '카테고리',
    });
  }
  return votes;
};
const truncateTitle = (title, maxLength) => {
  if (title.length > maxLength) {
    return title.substring(0, maxLength) + '...';
  }
  return title;
};

export const PopularVoteBanner = (
  votes,
  nickname,
  jwtToken,
  isLoggedIn,
  userId,
  navigate,
  keyId
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
        {topThreeVotes.map((vote, index) => {
          return (
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
                  vote.category,
                  null,
                  false,
                  keyId
                )
              }
            >
              <div className="vote_detail_item">
                <div className="vote_detial_item_2">
                  <h3 className="vote_detail_item_title">
                    <h4>{truncateTitle(vote.title, 7)}</h4>
                  </h3>
                  <p className="vote_detail_item_category">
                    {vote.category !== '카테고리'
                      ? vote.category
                      : '카테고리'}
                  </p>
                </div>
                <div className="vote_detail_item_like">
                  <h3 className="vote_detail_item_like_text">
                    <i
                      style={{
                        color: 'black',
                        marginLeft: '10px',
                      }}
                      className="fa-regular fa-thumbs-up"
                    ></i>{' '}
                    {vote.likesCount}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
