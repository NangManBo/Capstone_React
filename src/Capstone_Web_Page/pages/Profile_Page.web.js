import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  // useFocusEffect 대신 useEffect 사용
  useEffect(() => {
    getUserData();
  }, [nickname]);

  const getUserData = async () => {
    try {
      // 참가한 투표 수와 생성한 투표 수를 받아오는 각각의 요청
      const participatedVotesResponse = await axios.get(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/polls/participated-count/' +
          nickname,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
        }
      );
      const generatedVotesResponse = await axios.get(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/polls/created-count/' +
          nickname,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
        }
      );
      const commentResponse = await axios.get(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/auth/profile/' +
          userId,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
        }
      );

      const popularPointResponse = await axios.get(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/polls/popular-point/' +
          nickname,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
        }
      );
      const get_mbti = await axios.get(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/auth/mbti/' +
          nickname
      );

      //두 요청을 동시에 처리
      // const [participatedVotesResponse, generatedVotesResponse] =
      //   await Promise.all([participatedVotesRequest, generatedVotesRequest]);
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
    navigate('/Main', {
      isLoggedIn: false,
    });
  };
  return (
    <div className="container">
      <header className="header">
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
        <h1>개인 프로필</h1>
        <button onClick={handleLogout}>로그아웃</button>
      </header>

      <div className="profileInfos">
        {/* SafeAreaView 및 View 대신 div 사용 */}
        <div className="image" />
        <div className="nameSection">
          <span>닉네임: {nickname}</span>
          <div>
            <span>아이디: {userId}</span>
            <span>MBTI: {getMbti}</span>
          </div>
        </div>
      </div>

      {/* 나머지 UI 부분도 동일하게 div, span, button 등으로 구성 */}
    </div>
  );
}

export default ProfilePage;
