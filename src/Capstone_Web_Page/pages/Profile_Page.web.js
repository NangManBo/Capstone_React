import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Banner from '../components/basicBanner_components';

function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, isLoggedIn, jwtToken, nickname } =
    location.state;

  const [participatedVoteCount, setParticipatedVoteCount] =
    useState(0);
  const [generatedVoteCount, setGeneratedVoteCount] =
    useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [popularPoint, setPopularPoint] = useState(0);
  const [getMbti, setGetMbti] = useState('');

  useEffect(() => {
    getUserData();
  }, [nickname]);

  const getUserData = async () => {
    try {
      // 참가한 투표 수와 생성한 투표 수를 받아오는 각각의 요청
      const participatedVotesResponse = await axios.get(
        'https://dovote.p-e.kr/polls/participated-count/' +
          nickname,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
        }
      );
      const generatedVotesResponse = await axios.get(
        'https://dovote.p-e.kr/polls/created-count/' +
          nickname,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
        }
      );
      const commentResponse = await axios.get(
        'https://dovote.p-e.kr/auth/profile/' + userId,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
        }
      );

      const popularPointResponse = await axios.get(
        'https://dovote.p-e.kr/polls/popular-point/' +
          nickname,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
        }
      );
      const get_mbti = await axios.get(
        'https://dovote.p-e.kr/auth/mbti/' + nickname
      );

      if (get_mbti.status === 200) {
        setGetMbti(get_mbti.data);
      } else {
        console.log('Mbti 실패했습니다');
      }

      if (participatedVotesResponse.status === 200) {
        setParticipatedVoteCount(
          participatedVotesResponse.data
        );
      } else {
        console.log(
          '참가한 투표 수를 가져오는 데 실패했습니다'
        );
      }

      console.log(
        'Generated Votes Response:',
        generatedVotesResponse
      );
      if (generatedVotesResponse.status === 200) {
        setGeneratedVoteCount(generatedVotesResponse.data);
      } else {
        console.log(
          '생성한 투표 수를 가져오는 데 실패했습니다'
        );
      }

      if (commentResponse.status === 200) {
        setCommentCount(commentResponse.data.commentCount);
      } else {
        console.log(
          '참가한 투표 수를 가져오는 데 실패했습니다'
        );
      }

      if (popularPointResponse.status === 200) {
        setPopularPoint(popularPointResponse.data);
      } else {
        console.log('포인트를 가져오는 데 실패했습니다');
      }
    } catch (error) {
      console.error(
        '사용자 데이터를 가져오는 데 실패했습니다:',
        error
      );
    }
  };

  const handleLogout = () => {
    navigate('/', {
      isLoggedIn: false,
    });
  };
  const handleProfileChange = () => {
    navigate('/userauthentication', {
      state: {
        userId,
        isLoggedIn,
        jwtToken,
        nickname,
        mbti: getMbti,
      },
    });
  };
  return (
    <div className="container">
      <Banner />
      <div>
        <h1>개인 프로필</h1>
        <button onClick={handleLogout}>로그아웃</button>
        <button onClick={handleProfileChange}>
          프로필 변경
        </button>
      </div>
      <div className="profileInfos">
        {/* SafeAreaView 및 View 대신 div 사용 */}
        <div className="image" />
        <div className="nameSection">
          <span>닉네임: {nickname}</span>
          <div>
            <span>아이디: {userId}</span>
          </div>
          <div>
            <span>MBTI: {getMbti}</span>
          </div>
        </div>
      </div>
      <div>
        <h2>{participatedVoteCount}</h2>
        <h2>{generatedVoteCount}</h2>
        <h2>{commentCount}</h2>
        <h2>{popularPoint}</h2>
        <h2>
          포인트는 투표 종료 시점에 다수가 투표한 항목에
          투표했을 시 부여됩니다.
        </h2>
      </div>
    </div>
  );
}

export default ProfilePage;
