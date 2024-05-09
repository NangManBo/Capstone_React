import { renderPostPress } from '../functions/renderPostPress_function';
import './styles/managerVote_style.css';
// 카테고리별로 투표를 필터링하고 정렬하는 함수
export const GetManagerVotes = (
  votes,
  nickname,
  jwtToken,
  isLoggedIn,
  userId,
  navigate
) => {
  const managers = ['운영자'];
  const fillEmptyVotes = (votes, count) => {
    while (votes.length < count) {
      votes.push({
        title: '없음', // 객체로 직접 할당
        createdBy: '없음', // 객체로 직접 할당
        createdAt: '', // 객체로 직접 할당
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

    // 수정된 부분: 각 카테고리 컨테이너에 flex 스타일 적용
    return (
      <div className="manager_category_sub_title_box">
        <div>
          <div className="manager_category_title_box">
            <h3>
              {name} 주관투표{' '}
              <i class="fa-solid fa-chevron-right"></i>
            </h3>
          </div>
          <div className="manager_category_sub_box_container">
            {topVotes.map((vote, index) => {
              const hoursAgo = calculateTimeDiff(
                vote.createdAt
              ); // 직접 접근
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
                      {' '}
                      {isNaN(hoursAgo)
                        ? ''
                        : `${hoursAgo}시간 전`}{' '}
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
