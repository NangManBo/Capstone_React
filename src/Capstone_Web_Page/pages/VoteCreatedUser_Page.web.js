import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function VoteCreatedUserPage() {
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
          navigate('/', {
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
      <div>
        {vote.mediaUrl && (
          <div className="ivstyle">
            {' '}
            {/* Use className to apply CSS */}
            <img
              src={vote.mediaUrl}
              alt="Vote Media"
              className="Vote_Main_image"
            />
          </div>
        )}
        <p className="VoteCreatedUser_View2_Content">
          {' '}
          {/* Use className for styling */}
          {JSON.parse(vote.question).question}
        </p>
      </div>
    </div>
  );
}

export default VoteCreatedUserPage;
