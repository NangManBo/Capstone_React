import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchComments } from '../functions/fetchComment_function';
import axios from 'axios';
import './styles/voteEnd_style.css';
import './styles/vote_style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';

const calculateTotalComments = (comments) => {
  let totalComments = 0;

  comments.forEach((comment) => {
    totalComments += 1; // 본 댓글
    if (
      comment.childrenComment &&
      comment.childrenComment.length > 0
    ) {
      totalComments += comment.childrenComment.length; // 대댓글
    }
  });

  return totalComments;
};

function VoteEndPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoggedIn,
    userId,
    vote,
    jwtToken,
    nickname,
    isCategory,
    category,
    matchingVotes,
    userVotes,
    keyId,
  } = location.state || { isCategory: false };

  const standards = [
    { label: '최신 순', value: '시간' },
    { label: '인기 순', value: '인기' },
  ];
  const [sameOption, setSameOption] = useState([]);
  const videoRef = useRef(null);
  const [heartType, setHeartType] = useState('empty');
  const [comments, setComments] = useState([]); // 댓글
  const [sortedComments, setSortedComments] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReply, setShowReply] = useState({});
  const [sortingStandard, setSortingStandard] =
    useState('시간'); // 초기 정렬 기준을 '시간'으로 설정
  const [pollOptions, setPollOptions] = useState([]);
  const [pollResult, setPollResult] = useState(null);
  const [showPollResult, setShowPollResult] =
    useState(false);
  const totalComments = calculateTotalComments(comments);

  //게시글 좋아요
  const handleHeartClick = async () => {
    console.log('투표 값' + vote);
    const data = {
      pollId: vote.id,
      nickname: nickname,
    };

    console.log(data);

    try {
      const response = await axios.post(
        'https://dovote.p-e.kr/polls/likes',
        data,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);

        setHeartType((prev) =>
          prev === 'empty' ? 'filled' : 'empty'
        );
      } else {
        console.error('Failed to likes:', response.data);
      }
    } catch (error) {
      console.error('게시글 좋아요 :', error);
    }
  };
  // 댓글에서 쪽지 보내기
  const handlemessge = (comment) => {
    navigate('/dmautosend', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,

        receiverName: comment.nickname,
      },
    });
  };
  // 대댓글에서 쪽지 보내기
  const handlemessge1 = (childComment) => {
    console.log('쪽지 보내기~' + childComment);
    navigate('/dmautosend', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,

        receiverName: childComment.nickname,
      },
    });
  };
  //댓글 출력 창
  const Comment = ({ comment, index }) => {
    const handlePlayPause = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
    const showReplyPress = () => {
      setShowReply((prevShowReply) => ({
        ...prevShowReply,
        [comment.id]: !prevShowReply[comment.id],
      }));
    };

    return (
      <div className="comment_body" key={index}>
        <div className="comment_box">
          <div className="commnet_box_user">
            <span>작성자 : {comment.userNickname}</span>
            <span>작성시간: {comment.time}</span>
          </div>

          <div>
            <p>{comment.content}</p>

            {comment.mediaUrl && (
              <div>
                {comment.mediaUrl.endsWith('.mp4') ? (
                  <button onClick={() => handlePlayPause()}>
                    <video
                      ref={videoRef}
                      src={comment.mediaUrl}
                      controls
                      loop
                      className="comment_image"
                    />
                  </button>
                ) : (
                  <img
                    className="comment_image"
                    src={comment.mediaUrl}
                    alt="comment media"
                  />
                )}
              </div>
            )}
          </div>
          <div className="comment_like_reply_box">
            <div className="comment_like_button">
              <FontAwesomeIcon icon={faThumbsUp} />
              <span className="comment_like_count">
                {comment.likes}
              </span>
            </div>
            <div>
              {sameOption.some((option) =>
                option.userNames.includes(comment.nickname)
              ) && <p>(나와 동일한 선택지를 골랐습니다)</p>}
            </div>
            <div className="comment_reply">
              {comment.childrenComment &&
                comment.childrenComment.length > 0 && (
                  <FontAwesomeIcon
                    onClick={() => showReplyPress()}
                    icon={faMessage}
                  />
                )}

              <FontAwesomeIcon
                onClick={() => handlemessge(comment)}
                icon={faPaperPlane}
              />
            </div>
          </div>
        </div>

        {/* Rendering child comments, if any */}
        {showReply[comment.id] &&
          comment.childrenComment &&
          comment.childrenComment.map(
            (childComment, childIndex) => (
              <div key={childIndex}>
                <div className="replycomment_box">
                  <div className="commnet_box_user">
                    <span>
                      작성자 : {childComment.userNickname}
                    </span>
                    <span>
                      작성시간: {childComment.time}
                    </span>
                  </div>
                  <div>
                    <p>{childComment.content}</p>
                    {childComment.mediaUrl && (
                      <div>
                        {childComment.mediaUrl.endsWith(
                          '.mp4'
                        ) ? (
                          <video
                            className="comment_image"
                            src={childComment.mediaUrl}
                            controls
                            loop
                          />
                        ) : (
                          <img
                            className="comment_image"
                            src={childComment.mediaUrl}
                            alt="child comment media"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="comment_like_reply_box">
                    <div className="comment_like_button">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      <span>{childComment.likes}</span>
                    </div>
                    <div>
                      {sameOption.some((option) =>
                        option.userNames.includes(
                          childComment.nickname
                        )
                      ) && (
                        <p>
                          (나와 동일한 선택지를 골랐습니다)
                        </p>
                      )}
                    </div>
                    <div className="comment_reply">
                      <FontAwesomeIcon
                        onClick={() =>
                          handlemessge1(childComment)
                        }
                        icon={faPaperPlane}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    );
  };

  // 정렬
  const sortComments = (sortingStandard) => {
    if (comments && comments.length > 0) {
      let sorted = [...comments];
      if (sortingStandard === '') {
        sorted.sort(
          (a, b) => new Date(a.time) - new Date(b.time)
        );
        setSortedComments(sorted);
      } else if (sortingStandard === '시간') {
        sorted.sort(
          (a, b) => new Date(a.time) - new Date(b.time)
        );
        setSortedComments(sorted.reverse());
      } else if (sortingStandard === '인기') {
        sorted.sort((a, b) => b.likes - a.likes);
        setSortedComments(sorted);
      }
    }
  };
  // 댓글 카운터 계산
  const countData = async () => {
    console.log('투표 카운트 데이터', vote);

    try {
      const response = await axios.get(
        'https://dovote.p-e.kr/votes/selected-choices/' +
          vote.id,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 200) {
        const selectedVotes = response.data;
        console.log(
          '투표 카운트 응답 데이터',
          selectedVotes
        );
        // 투표 선택지 업데이트
        setPollOptions(
          vote.choice.map((choice) => {
            const voteData =
              selectedVotes.find(
                (data) =>
                  data.choice_id === choice.id &&
                  data.text === choice.text
              ) || {};
            return {
              id: choice.id,
              text: choice.text,
              votes: voteData.count || 0,
              isSelected: voteData.count !== undefined,
            };
          })
        );
      } else {
        console.error(
          '투표 카운트 가져오기 실패',
          response.data
        );
      }
    } catch (error) {
      console.error('투표 카운트 가져오기 오류:', error);
    }
  };
  //투표 분석 결과
  const getPollResult = async () => {
    try {
      const response = await axios.get(
        'https://dovote.p-e.kr/votes/result/' + vote.id,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 200) {
        const selectedVotes = response.data;
        console.log('투표 결과', selectedVotes);
        setPollResult(selectedVotes);
        setShowPollResult(!showPollResult);
      } else {
        console.error(
          '투표 결과 가져오기 실패',
          response.data
        );
      }
    } catch (error) {
      console.error('투표 결과 가져오기 오류:', error);
    }
  };
  useEffect(() => {
    fetchComments(vote.id, jwtToken, setComments);
  }, [vote, jwtToken]);
  useEffect(() => {
    if (
      vote.likedUsers &&
      vote.likedUsers.includes(nickname)
    ) {
      setHeartType('filled');
    }
  }, [vote, nickname]);
  useEffect(() => {
    sortComments(sortingStandard);
  }, [comments, sortingStandard]);
  useEffect(() => {
    // Assuming vote.choices is an array of choice objects received from the server
    if (vote.choice && Array.isArray(vote.choice)) {
      setPollOptions(
        vote.choice.map((choice) => ({
          id: choice.id,
          text: choice.text,
          votes: 0,
          isSelected: false,
        }))
      );
    } else {
      // Handle the case where vote.choices is not an array or is undefined
      console.error(
        'ERROR: vote.choices is not an array or is undefined'
      );
      // You might want to set a default value for pollOptions or handle it accordingly
    }
    countData();
  }, [vote]);

  const goToMain = () => {
    navigate('/', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        keyId,
      },
    });
  };
  const goToCategory = () => {
    navigate('/category', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        category,
        matchingVotes,
      },
    });
  };

  return (
    <div className="vote_page">
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
            isCategory ? goToCategory() : goToMain()
          }
        >
          이전 페이지로
        </h2>

        <div>
          <div className="vote_header">
            {/* Content */}
            <h1>{vote.title}</h1>
            <div className="vote_userInfo">
              <p>
                투표 기간 설정: {vote && vote.createdAt}
              </p>
              <p>주최자 : {vote && vote.createdBy}</p>
            </div>
          </div>
          <div className="vote_qustion">
            <p>{vote.question}</p>
          </div>
          {vote?.mediaUrl &&
            (vote.mediaUrl.endsWith('.mp4') ? (
              <video
                src={vote.mediaUrl}
                controls
                className="vote_image"
              />
            ) : (
              <img
                src={vote.mediaUrl}
                alt="Media"
                className="vote_image"
              />
            ))}

          <div>
            {pollOptions.map((option, index) => (
              <div
                key={index}
                className={`VoteButton ${
                  option.votes ===
                  Math.max(
                    ...pollOptions.map((o) => o.votes)
                  )
                    ? 'VoteButton--highlighted'
                    : ''
                }`}
              >
                <p
                  className={`VoteText ${
                    option.votes ===
                    Math.max(
                      ...pollOptions.map((o) => o.votes)
                    )
                      ? 'VoteText--highlighted'
                      : ''
                  }`}
                >
                  {option.text}
                </p>
                <p
                  className={`VoteCount ${
                    option.votes ===
                    Math.max(
                      ...pollOptions.map((o) => o.votes)
                    )
                      ? 'VoteCount--bold'
                      : ''
                  }`}
                >
                  투표자수 : {option.votes}
                </p>
              </div>
            ))}
          </div>
          <div className="comment_header">
            <p className="comment_header_text">
              댓글 {totalComments}
            </p>
            <div>
              <button onClick={getPollResult}>
                투표 결과 보기
              </button>
              <select
                className="comment_header_select"
                value={sortingStandard}
                onChange={(e) =>
                  setSortingStandard(e.target.value)
                }
              >
                {standards.map((standard, index) => (
                  <option
                    key={index}
                    value={standard.value}
                  >
                    {standard.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="comment_body_box">
            {sortedComments.map((comment, index) => (
              <Comment
                key={index}
                comment={comment}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoteEndPage;
