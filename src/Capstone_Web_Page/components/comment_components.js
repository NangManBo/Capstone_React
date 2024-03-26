import React, { useState, useRef } from 'react';

const CommentComponent = ({
  comment,
  index,
  sameOption,
}) => {
  const [showReply, setShowReply] = useState({});
  const [sameOption, setSameOption] = useState([]);
  // 댓글 좋아요
  const commentLike = async (comment, index) => {
    console.log('comment ', comment.id);
    try {
      const response = await axios.post(
        `https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/api/comments/like/${userId}/${vote.id}/${comment.id}`,
        {}, // Empty object as the request body
        {
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
        }
      );
      // Increment updateDM by 1
      setUpdateDM5(updateDM5 + 1);

      console.log('변경 전', updateDM5);
      if (response.status === 200) {
        console.log('변경 후', updateDM5);
        console.log(
          '댓글 좋아요 성공',
          JSON.stringify(response.data, null, 2)
        );
      } else {
        console.error('댓글 좋아요 실패', response.data);
      }
    } catch (error) {
      console.error('댓글 좋아요 보내기:', error);
    }
  };
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
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
  // 대댓글
  const handleReplyPress = (comment, index) => {
    if (replyingIndex === index) {
      // If the reply button is pressed again, reset to a regular comment
      setReplyingIndex(null);
      setReplyText('');
      setIsReplyMode(false); // Turn off reply mode
    } else {
      // Set the replying index and pre-fill the reply input with the username
      setReplyingIndex(index);
      setReplyText(`@${comment.nickname} `);
      setIsReplyMode(true); // Turn on reply mode
    }
    setShowReplyInput(true);
    setCommentText(''); // Reset regular comment text
  };
  // 댓글에서 쪽지 보내기
  const handlemessge = (comment) => {
    navigate('/', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        updateDM2,
        commentId: comment.id,
        receiverName: comment.nickname,
      },
    });
  };
  return (
    <div key={index}>
      <div>
        <div>
          <span>작성자 : {comment.nickname}</span>
          <span>작성시간: {comment.time}</span>
        </div>

        <div>
          <div>
            <p>{comment.content}</p>
          </div>

          {comment.mediaUrl && (
            <div>
              {comment.mediaUrl.endsWith('.mp4') ? (
                <button onClick={handlePlayPause}>
                  <video
                    ref={videoRef}
                    src={comment.mediaUrl}
                    controls
                    loop
                    style={{
                      display: isPlaying ? 'block' : 'none',
                    }} // isPlaying 상태에 따라 display 처리
                  />
                </button>
              ) : (
                <img
                  src={comment.mediaUrl}
                  alt="Comment Media"
                />
              )}
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => commentLike(comment, index)}
          >
            <span role="img" aria-label="like">
              👍
            </span>{' '}
            {/* AntDesign 'like2' 아이콘 대체 */}
          </button>
          <span>{comment.likes}</span>
          {sameOption.some((option) =>
            option.userNames.includes(comment.nickname)
          ) && (
            <span>(나와 동일한 선택지를 골랐습니다)</span>
          )}
          <div>
            <div>
              {comment.childrenComment &&
                comment.childrenComment.length > 0 && (
                  <button onClick={showReplyPress}>
                    <span role="img" aria-label="comment">
                      💬
                    </span>{' '}
                    {/* MaterialIcons 'comment' 아이콘 대체 */}
                  </button>
                )}
              <button
                onClick={() =>
                  handleReplyPress(comment, index)
                }
              >
                <span role="img" aria-label="add comment">
                  ➕💬
                </span>{' '}
                {/* MaterialIcons 'add-comment' 아이콘 대체 */}
              </button>
              <button onClick={() => handlemessge(comment)}>
                <span role="img" aria-label="send">
                  📤
                </span>{' '}
                {/* Feather 'send' 아이콘 대체 */}
              </button>
            </div>
          </div>
        </div>
      </div>
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
                        alt="Child Comment Media"
                      />
                    )}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() =>
                    commentLike(
                      childComment,
                      index,
                      childIndex
                    )
                  }
                >
                  <span role="img" aria-label="like">
                    👍
                  </span>{' '}
                  {/* AntDesign 'like2' 아이콘 대체 */}
                </button>
                <span>{childComment.likes}</span>
                {sameOption.some((option) =>
                  option.userNames.includes(
                    childComment.nickname
                  )
                ) && (
                  <span>
                    나와 동일한 선택지 를 골랐습니다
                  </span>
                )}
                <button
                  onClick={() =>
                    handlemessge1(childComment)
                  }
                >
                  <span role="img" aria-label="send">
                    📤
                  </span>{' '}
                  {/* Feather 'send' 아이콘 대체 */}
                </button>
              </div>
            </div>
          )
        )}
    </div>
  );
};

export default CommentComponent;
