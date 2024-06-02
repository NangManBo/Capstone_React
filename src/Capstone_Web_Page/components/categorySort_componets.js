import { renderPostPress } from '../functions/renderPostPress_function';
import './styles/category_style.css';
// 카테고리별로 투표를 필터링하고 정렬하는 함수
export const GetCategoryVotes = (
  votes,
  nickname,
  jwtToken,
  isLoggedIn,
  userId,
  navigate,
  keyId
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
        title: '제목', //JSON.stringify({ title: '제목' }),
        createdBy: '없음',
        createdAt: '',
        likesCount: 0,
      });
    }
    return votes;
  };

  const calculateTimeDiff = (createdAt) => {
    const voteDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - voteDate.getTime()) /
        (1000 * 60 * 60)
    );
    const days = Math.floor(diffInHours / 24);
    const hours = diffInHours % 24;

    if (days > 0) {
      return `${days}일 ${hours}시간 전`;
    } else {
      return `${hours}시간 전`;
    }
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
          keyId,
        },
      });
    };

    return (
      <div className="category_sub_title_box">
        <div>
          <div
            onClick={() => goToCategory(category)}
            className="category_title_box"
          >
            <h3>
              {category} 게시판{' '}
              <i className="fa-solid fa-chevron-right"></i>
            </h3>
          </div>
          <div className="category_sub_box_container">
            {topVotes.map((vote, index) => {
              const hoursAgo = calculateTimeDiff(
                vote.createdAt
              );

              return (
                <div
                  key={`${category}-${
                    vote.title || ''
                  }-${index}`}
                  className="category_sub_box"
                  onClick={() =>
                    vote.title &&
                    renderPostPress(
                      vote,
                      navigate,
                      isLoggedIn,
                      userId,
                      jwtToken,
                      nickname,
                      (keyId = keyId),
                      false
                    )
                  }
                >
                  <h4>{vote.title}</h4>
                  <h5>
                    {vote.createdBy}
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
