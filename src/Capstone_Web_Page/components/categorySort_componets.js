import { renderPostPress } from '../functions/renderPostPress_function';
import '../styles/category_style.css';
// 카테고리별로 투표를 필터링하고 정렬하는 함수
export const getCategoryVotes = (
  votes,
  nickname,
  jwtToken,
  isLoggedIn,
  userId,
  navigate
) => {
  const categories = [
    '시사',
    '정치',
    '게임',
    '스포츠',
    '음식',
    '반려동물',
  ];
  const fillEmptyVotes = (votes, count) => {
    while (votes.length < count) {
      votes.push({
        title: JSON.stringify({ title: '없음' }),
      }); // '없음'으로 채우기
    }
    return votes;
  };

  return categories.map((category) => {
    const matchingVotes = votes.filter(
      (vote) => vote.category === category
    );

    matchingVotes.sort(
      (a, b) => b.likesCount - a.likesCount
    );

    const topVotes = fillEmptyVotes(
      matchingVotes.slice(0, 3),
      3
    );

    const goToCategory = (category) => {
      navigate('/category', {
        state: {
          category,
          votes,
          isLoggedIn,
          userId,
          jwtToken,
          nickname,
          matchingVotes,
        },
      });
    };

    // 수정된 부분: 각 카테고리 컨테이너에 flex 스타일 적용
    return (
      <div className="category_sub_title_box">
        <div>
          <div
            onClick={() => goToCategory(category)}
            className="category_title_box"
          >
            <h3>{category}</h3>
          </div>
          <div className="category_sub_box_container">
            {topVotes.map((vote, index) => (
              <div
                key={`${category}-${
                  vote.title || ''
                }-${index}`}
                className="category_sub_box" // 스타일을 적용할 CSS 클래스
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
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  });
};
