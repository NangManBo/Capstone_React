// 카테고리별로 투표를 필터링하고 정렬하는 함수
export const getCategoryVotes = (votes) => {
  // 카테고리 상수
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
