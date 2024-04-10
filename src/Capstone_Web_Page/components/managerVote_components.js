import { renderPostPress } from '../functions/renderPostPress_function';
import './styles/managerVote_style.css';
// 카테고리별로 투표를 필터링하고 정렬하는 함수
export const getManagerVotes = (
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
        title: JSON.stringify({ title: '없음' }),
      }); // '없음'으로 채우기
    }
    return votes;
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
            {topVotes.map((vote, index) => (
              <div
                key={`${name}-${vote.title || ''}-${index}`}
                className="manager_category_sub_box" // 스타일을 적용할 CSS 클래스
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
                <h4>{JSON.parse(vote.title).title}</h4>
                <h5>{name}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  });
};
