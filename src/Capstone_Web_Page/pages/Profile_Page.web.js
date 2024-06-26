import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import './styles/profile_style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';

function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, isLoggedIn, jwtToken, nickname, keyId } =
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
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const generatedVotesResponse = await axios.get(
        'https://dovote.p-e.kr/polls/created-count/' +
          nickname,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const commentResponse = await axios.get(
        'https://dovote.p-e.kr/auth/profile/' + userId,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: jwtToken,
          },
        }
      );

      const popularPointResponse = await axios.get(
        'https://dovote.p-e.kr/polls/popular-point/' +
          nickname,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const get_mbti = await axios.get(
        'https://dovote.p-e.kr/auth/mbti/' + nickname,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: jwtToken,
          },
        }
      );

      if (get_mbti.status === 200) {
        setGetMbti(get_mbti.data);
      } else {
      }

      if (participatedVotesResponse.status === 200) {
        setParticipatedVoteCount(
          participatedVotesResponse.data
        );
      } else {
      }

      if (generatedVotesResponse.status === 200) {
        setGeneratedVoteCount(generatedVotesResponse.data);
      } else {
      }

      if (commentResponse.status === 200) {
        setCommentCount(commentResponse.data.commentCount);
      } else {
      }

      if (popularPointResponse.status === 200) {
        setPopularPoint(popularPointResponse.data);
      } else {
      }
    } catch (error) {}
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
    <div className="profile_page">
      {MainBanner(
        jwtToken,
        isLoggedIn,
        userId,
        nickname,
        keyId
      )}
      {LeftBar(
        jwtToken,
        isLoggedIn,
        userId,
        nickname,
        keyId
      )}
      <div className="right_page">
        <h2
          className="goBackButton"
          onClick={() =>
            navigate('/', {
              state: {
                isLoggedIn: true,
                userId: userId,
                jwtToken: jwtToken,
                nickname: nickname,
                keyId: keyId,
              },
            })
          }
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />{' '}
        </h2>
        <div className="retangle_page">
          <div className="profile_header">
            <img
              src={require('../assets/user.png')}
              alt="프로필 이미지"
              style={{
                width: '80px',
                height: '80px',
              }}
            />
            <div className="profile_name">
              <p> {nickname}</p>
              <p> MBTI: {getMbti}</p>
            </div>
          </div>

          <button
            className="profile_button"
            onClick={handleProfileChange}
          >
            프로필 업데이트/확인
          </button>

          <div className="profile_middle">
            <p className="activity_title">내 활동 내역</p>
            <div className="activity_container">
              <div className="activity_item">
                <p>참가한 투표</p>
                <h2>{participatedVoteCount}</h2>
              </div>
              <div className="activity_item">
                <p>생성한 투표</p>
                <h2>{generatedVoteCount}</h2>
              </div>
              <div className="activity_item">
                <p>댓글</p>
                <h2>{commentCount}</h2>
              </div>
            </div>
          </div>
          <div className="profile_point">
            <p className="point_text">
              내가 쌓은 포인트는{' '}
              <span className="point_box">
                {popularPoint} 점
              </span>
            </p>
            <p className="point_ex">
              포인트는 투표 종료 시점에 다수가 투표한 항목에
              투표했을 시 부여됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
