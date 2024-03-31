import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { fetchComments } from '../functions/fetchComment_function';

function VoteCreatedUserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userId, vote, jwtToken, nickname } =
    location.state || {};
  const videoRef = useRef(null);
  const [comments, setComments] = useState([]); // 댓글
  const [sortedComments, setSortedComments] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReply, setShowReply] = useState({});
  const [sortingStandard, setSortingStandard] =
    useState('시간'); // 초기 정렬 기준을 '시간'으로 설정
  const [pollOptions, setPollOptions] = useState([]);
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
  useEffect(() => {
    fetchComments(vote.id, jwtToken, setComments);
  }, [vote, jwtToken]);

  useEffect(() => {
    sortComments(sortingStandard);
  }, [comments, sortingStandard]);

  const goToMain = () => {
    navigate('/', {
      state: { isLoggedIn, userId, jwtToken, nickname },
    });
  };
  return (
    <div>
      <button onClick={goToMain}>
        <span>Back</span>
      </button>
      <div>
        <h1>
          {vote &&
            vote.title &&
            JSON.parse(vote.title).title}
        </h1>
        <p>투표 기간 설정: {vote && vote.createdAt}</p>
        <p>주최자 : {vote && vote.createdBy}</p>
        <p>
          {vote &&
            vote.question &&
            JSON.parse(vote.question).question}
        </p>
        <p>
          사진 url : <span>{vote.mediaUrl}</span>
        </p>
        {vote && vote.mediaUrl && (
          <img
            src={vote.mediaUrl}
            alt="Media"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
        {pollOptions.map((option) => (
          <div key={option.id}>
            <span>{option.text}</span>
          </div>
        ))}
        <p>댓글 {comments.length}</p>
        <select
          value={sortingStandard}
          onChange={(e) =>
            setSortingStandard(e.target.value)
          }
        ></select>
        {sortedComments.map((comment, index) => (
          <Comment
            key={index}
            comment={comment}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default VoteCreatedUserPage;
