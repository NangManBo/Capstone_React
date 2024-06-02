import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchComments } from '../functions/fetchComment_function';
import axios from 'axios';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import './styles/vote_style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
function VoteCreatedUserPage() {
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
    keyId,
  } = location.state || { isCategory: false };
  const videoRef = useRef(null);
  const [comments, setComments] = useState([]); // 댓글
  const [sortedComments, setSortedComments] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReply, setShowReply] = useState({});
  const [sortingStandard, setSortingStandard] =
    useState('시간'); // 초기 정렬 기준을 '시간'으로 설정
  const standards = [
    { label: '최신 순', value: '시간' },
    { label: '인기 순', value: '인기' },
  ];
  const [pollOptions, setPollOptions] = useState([]);
  // 댓글에서 쪽지 보내기
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
            <div
              className="comment_like_button"
              onClick={() => commentLike(comment, index)}
            >
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
                      <FontAwesomeIcon
                        onClick={() =>
                          commentLike(
                            childComment,
                            index,
                            childIndex
                          )
                        }
                        icon={faThumbsUp}
                      />
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
  // 투표 종료
  const handleEndVote = async () => {
    const Data = {
      pollId: vote.id,
      nickname: nickname,
    };
    try {
      const response = await axios.post(
        'https://dovote.p-e.kr/polls/popularpoint',
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 200) {
        console.log('포인트 성공');
      } else {
        console.error('포인트 실패!', response.data);
      }
    } catch (error) {}
    try {
      const response = await axios.post(
        'https://dovote.p-e.kr/polls/close',
        {
          pollId: vote.id,
          nickname: nickname,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: jwtToken,
          },
        }
      );
      if (response.status === 200) {
        console.log('투표 종료!');
      } else {
        console.error('투표 종료 실패!', response.data);
      }
    } catch (error) {
      console.error('투표 종료 오류', error);
    }
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
  useEffect(() => {
    fetchComments(vote.id, jwtToken, setComments);
  }, [vote, jwtToken]);

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
  }, [vote]);
  const goToMain = () => {
    navigate('/', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
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
      {MainBanner(jwtToken, isLoggedIn, userId, nickname)}
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
          <h1>{vote.title}</h1>
          <p>투표 기간 설정: {vote.createdAt}</p>
          <p>주최자 : {vote.createdBy}</p>
          <p>{vote.question}</p>

          {vote?.mediaUrl &&
            (vote.mediaUrl.endsWith('.mp4') ? (
              <video
                src={vote.mediaUrl}
                controls
                style={{
                  width: '400px',
                  height: '400px',
                }}
              />
            ) : (
              <img
                src={vote.mediaUrl}
                alt="Media"
                style={{
                  width: '400px',
                  height: '400px',
                }}
              />
            ))}
          {pollOptions.map((option) => (
            <p key={option.id}>{option.text}</p>
          ))}
          <p>댓글 {comments.length}</p>
          <div>
            <button onClick={handleEndVote}>
              투표 종료
            </button>
          </div>
          <select
            value={sortingStandard}
            onChange={(e) =>
              setSortingStandard(e.target.value)
            }
          >
            {standards.map((standard, index) => (
              <option key={index} value={standard.value}>
                {standard.label}
              </option>
            ))}
          </select>
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
  );
}

export default VoteCreatedUserPage;
