import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function VoteOnlyLookPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoggedIn,
    userId,
    vote,
    jwtToken,
    nickname,
    category,
    userVotes,
  } = location.state || {};
  useEffect(() => {
    console.log('vote', vote);
    console.log('userVotes', userVotes);
    console.log('category', category);
    console.log('isLoggedIn', isLoggedIn);
    console.log('userId', userId);
    console.log('jwtToken', jwtToken);
    console.log('nickname', nickname);
  }, []);

  return (
    <div>
      <button
        onClick={() =>
          navigate('/main', {
            state: {
              isLoggedIn,
              userId,
              jwtToken,
              nickname,
            },
          })
        }
      >
        뒤로가기
      </button>
      <h1>Vote Only Look Page</h1>
    </div>
  );
}

export default VoteOnlyLookPage;
