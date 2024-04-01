import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { fetchComments } from '../functions/fetchComment_function';
import axios from 'axios';

function VoteEndPage() {
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
  const placeholder = {
    label: '정렬 기준',
    value: null,
  };

  const standards = [
    { label: '최신 순', value: '시간' },
    { label: '인기 순', value: '인기' },
  ];

  const videoRef = useRef(null);
  const [heartType, setHeartType] = useState('empty');
  const [comments, setComments] = useState([]); // 댓글
  const [sortedComments, setSortedComments] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReply, setShowReply] = useState({});
  const [sortingStandard, setSortingStandard] =
    useState('시간'); // 초기 정렬 기준을 '시간'으로 설정
  const [pollOptions, setPollOptions] = useState([]);
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
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/polls/likes',
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
    console.log('쪽지 보내기~' + comment);
    // navigate('AutoSend', {
    //   isLoggedIn,
    //   userId,
    //   jwtToken,
    //   nickname,
    //   updateDM2,
    //   commentId: comment.id,
    //   receiverName: comment.nickname,
    // });
  };
  // 대댓글에서 쪽지 보내기
  const handlemessge1 = (childComment) => {
    console.log('쪽지 보내기~' + childComment);
    // navigation.navigate('AutoSend', {
    //   isLoggedIn,
    //   userId,
    //   jwtToken,
    //   nickname,
    //   updateDM2,
    //   commentId: childComment.id,
    //   receiverName: childComment.nickname,
    // });
  };

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
      <div key={index}>
        <div>
          <div>
            <span>작성자 : {comment.nickname}</span>
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
                    />
                  </button>
                ) : (
                  <img
                    src={comment.mediaUrl}
                    alt="comment media"
                  />
                )}
              </div>
            )}
          </div>
          <div>
            <p>
              좋아요 수 : <span>{comment.likes}</span>
            </p>
            {/* Additional UI elements and logic for replies and messaging */}
          </div>
        </div>
        <div>
          {comment.childrenComment &&
            comment.childrenComment.length > 0 && (
              <button onClick={() => showReplyPress()}>
                답글 보기
              </button>
            )}
          <button onClick={() => handlemessge(comment)}>
            쪽지 보내기
          </button>
        </div>

        {/* Rendering child comments, if any */}
        {showReply[comment.id] &&
          comment.childrenComment &&
          comment.childrenComment.map(
            (childComment, childIndex) => (
              <div key={childIndex}>
                <div>
                  <span>
                    작성자 : {childComment.nickname}
                  </span>
                  <span>작성시간: {childComment.time}</span>
                </div>
                <div>
                  <p>{childComment.content}</p>
                  {childComment.mediaUrl && (
                    <div>
                      {childComment.mediaUrl.endsWith(
                        '.mp4'
                      ) ? (
                        <video
                          src={childComment.mediaUrl}
                          controls
                          loop
                        />
                      ) : (
                        <img
                          src={childComment.mediaUrl}
                          alt="child comment media"
                        />
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <p>
                    좋아요 수 :
                    <span>{childComment.likes}</span>
                  </p>
                  {/* Additional logic for child comment actions */}
                </div>
                <div>
                  <button
                    onClick={() =>
                      handlemessge1(childComment)
                    }
                  >
                    쪽지 보내기
                  </button>
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

  const handleEndVote = async () => {
    const Data = {
      pollId: vote.id,
      nickname: nickname,
    };
    try {
      const response = await axios.post(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/polls/popularpoint',
        Data
      );
      if (response.status === 200) {
        console.log('포인트 성공');
      } else {
        console.error('포인트 실패!', response.data);
      }
    } catch (error) {}
    try {
      const response = await axios.post(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/polls/close',
        Data,
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
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
      },
    });
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
  return (
    <div>
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
        <button onClick={() => handleHeartClick()}>
          {heartType === 'empty'
            ? 'Heart Outlined Icon'
            : 'Heart Filled Icon'}
        </button>
      </div>
      <div>
        {/* Content */}
        <h1>
          {vote &&
            vote.title &&
            JSON.parse(vote.title).title}
        </h1>
        <p>투표 기간 설정: {vote.createdAt}</p>
        <p>주최자: {vote.createdBy}</p>
        <p>
          {vote &&
            vote.question &&
            JSON.parse(vote.question).question}
        </p>
        {vote.mediaUrl && (
          <img src={vote.mediaUrl} alt="Vote" />
        )}
      </div>
      <select
        value={sortingStandard}
        onChange={(e) => setSortingStandard(e.target.value)}
      >
        {standards.map((standard, index) => (
          <option key={index} value={standard.value}>
            {standard.label}
          </option>
        ))}
      </select>
      <div>
        {pollOptions.map((option, index) => (
          <div
            key={index}
            className={`VoteButton ${
              option.votes ===
              Math.max(...pollOptions.map((o) => o.votes))
                ? 'VoteButton--highlighted'
                : ''
            }`}
          >
            <p
              className={`VoteText ${
                option.votes ===
                Math.max(...pollOptions.map((o) => o.votes))
                  ? 'VoteText--highlighted'
                  : ''
              }`}
            >
              {option.text}
            </p>
            <p
              className={`VoteCount ${
                option.votes ===
                Math.max(...pollOptions.map((o) => o.votes))
                  ? 'VoteCount--bold'
                  : ''
              }`}
            >
              투표자수 : {option.votes}
            </p>
          </div>
        ))}
      </div>

      <div>
        {sortedComments.map((comment, index) => (
          <Comment
            key={index}
            comment={comment}
            index={index}
          />
        ))}
      </div>
      <div>
        <button onClick={handleEndVote}>투표 종료</button>
      </div>
    </div>
  );
}

export default VoteEndPage;
