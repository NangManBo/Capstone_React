import { renderPostPress } from '../functions/renderPostPress_function';
import './styles/managerVote_style.css';

export const GetManagerVotes = (
  data,
  nickname,
  jwtToken,
  isLoggedIn,
  userId,
  navigate
) => {
  // data 객체 내부의 votes 배열을 가져옴
  let votes = Array.isArray(data.votes) ? data.votes : [];

  if (!Array.isArray(votes)) {
    console.error(
      "Expected an array for 'votes', but got:",
      votes
    );
    votes = [];
  }

  const managers = ['운영자'];

  const fillEmptyVotes = (votes, count) => {
    while (votes.length < count) {
      votes.push({
        title: '없음',
        createdBy: '없음',
        createdAt: '',
        likesCount: 0,
      });
    }
    return votes;
  };

  // 시간 차이를 계산하는 함수
  const calculateTimeDiff = (createdAt) => {
    const voteDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - voteDate.getTime()) /
        (1000 * 60 * 60)
    );
    return diffInHours;
  };

  return managers.map((name) => {
    const matchingVotes = votes.filter(
      (vote) => vote.createdBy === name
    );

    matchingVotes.sort(
      (a, b) => b.likesCount - a.likesCount
    );

    const topVotes = fillEmptyVotes(
      matchingVotes.slice(0, 3),
      3
    );

    return (
      <div className="manager_category_sub_title_box">
        <div>
          <div className="manager_category_title_box">
            <h3>
              {name} 주관투표{' '}
              <i className="fa-solid fa-chevron-right"></i>
            </h3>
          </div>
          <div className="manager_category_sub_box_container">
            {topVotes.map((vote, index) => {
              const hoursAgo = calculateTimeDiff(
                vote.createdAt
              );

              return (
                <div
                  key={`${name}-${
                    vote.title || ''
                  }-${index}`}
                  className="manager_category_sub_box"
                  onClick={() =>
                    vote.title &&
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
                  <h4>{vote.title}</h4>
                  <h5>
                    {name}
                    <i
                      style={{
                        color: 'blue',
                        marginLeft: '10px',
                      }}
                      className="fa-regular fa-thumbs-up"
                    ></i>
                    <span> {vote.likesCount} </span>
                    <span className="vote_time">
                      {isNaN(hoursAgo)
                        ? ''
                        : `${hoursAgo}시간 전`}
                    </span>
                  </h5>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  });
};
