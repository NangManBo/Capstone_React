import { renderPostPress } from '../functions/renderPostPress_function';

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
    const firstMatchingVote = matchingVotes.find((vote) => {
      if (!shownTitles.has(vote.title)) {
        shownTitles.add(vote.title);
        return true;
      }
      return false;
    });
    // JSON 문자열을 파싱하여 JavaScript 객체로 변환
    const titleObj = firstMatchingVote
      ? JSON.parse(firstMatchingVote.title)
      : null;

    // 객체에서 title 값을 추출하고, 없을 경우 '없음'을 기본값으로 사용
    const title = titleObj ? titleObj.title : '없음';
    const goToCategory = (category) => {
      // Filter votes for the selected category

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

    return (
      <div
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <div
          onClick={() => goToCategory(category)}
          style={{ marginRight: '20px' }}
        >
          <h3>{category}</h3>
        </div>
        <button
          onClick={() =>
            renderPostPress(
              firstMatchingVote,
              navigate,
              isLoggedIn,
              userId,
              jwtToken,
              nickname
            )
          }
          key={`${category}-${
            firstMatchingVote?.title || ''
          }`}
          className="category_sub_box" // 스타일을 적용할 CSS 클래스
          style={{ width: '100px', height: '60px' }}
        >
          <h4>{title}</h4>
        </button>
      </div>
    );
  });
};
//
