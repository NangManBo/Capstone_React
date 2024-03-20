import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchVotes } from '../function/fetchVote_function';
import { getCategoryVotes } from '../function/categorySort_fuction';

function MainPage() {
  const [votes, setVotes] = useState([]); // 상태 추가
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userId, jwtToken, nickname } =
    location.state || {
      isLoggedIn: false,
      userId: '',
      jwtToken: '',
      nickname: '',
    }; // state가 undefined일 수 있으니 기본값 처리
  // 투표 데이터를 받아오는 함수
  useEffect(() => {
    fetchVotes(setVotes, jwtToken);
  }, []);

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
          <button
            onClick={() =>
              navigate('/main', {
                state: {
                  isLoggedIn: true,
                  userId: response.data.userId, // 예시 값, 실제 응답에 맞게 조정 필요
                  jwtToken: response.data.token, // 예시 값, 실제 응답에 맞게 조정 필요
                  nickname: response.data.nickname, // 예시 값, 실제 응답에 맞게 조정 필요
                },
              })
            }
          >
            프로필
          </button>
          <div className="main_Row">
            <h2 className="category_">카테고리별 투표</h2>
          </div>
          <div className="category_sub_title_box">
            {getCategoryVotes(votes)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
