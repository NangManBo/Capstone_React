import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
  fetchComments,
  sameVoteGroup,
} from '../functions/fetchComment_function';
import axios from 'axios';

function VoteAfterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoggedIn,
    userId,
    vote,
    jwtToken,
    nickname,
    userVotes,
    isCategory,
    category,
    matchingVotes,
  } = location.state || { isCategory: false };
  const [send, setSend] = useState(false);
  const [comments, setComments] = useState([]); // 댓글
  const [pollOptions, setPollOptions] = useState([]);
  const newChoices = vote.choice.map((choice) => ({
    id: choice.id,
    text: choice.text,
    votes: 0, // 초기 투표 수를 0으로 설정
  }));
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [heartType, setHeartType] = useState('empty');
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [showReplyInput, setShowReplyInput] =
    useState(false);
  const videoRef = useRef(null);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyingIndex, setReplyingIndex] = useState(null);
  const [sameOption, setSameOption] = useState([]);
  const [standard, setStandard] = useState('');
  const [sortingStandard, setSortingStandard] =
    useState('시간'); // 초기 정렬 기준을 '시간'으로 설정
  const [sortedComments, setSortedComments] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const placeholder = {
    label: '정렬 기준',
    value: null,
  };
  const standards = [
    { label: '최신 순', value: '시간' },
    { label: '인기 순', value: '인기' },
  ];
  useEffect(() => {
    fetchComments(vote.id, jwtToken, setComments);
    sameVoteGroup(
      vote,
      userVotes,
      nickname,
      jwtToken,
      setSameOption
    );
  }, [
    send,
    vote,
    userVotes,
    nickname,
    jwtToken,
    sortingStandard,
  ]);
  useEffect(() => {
    sortComments(sortingStandard);
  }, [comments, sortingStandard]);
  // Check if the current user's nickname is in the likedUsers array
  useEffect(() => {
    if (
      vote.likedUsers &&
      vote.likedUsers.includes(nickname)
    ) {
      setHeartType('filled');
    }
  }, [vote, nickname]);
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
  // 댓글 작성
  const handleCommentSubmit = async () => {
    setSend(true);
    console.log('vote', vote);
    console.log('comments', comments);
    try {
      if (!commentText.trim()) {
        alert('댓글 내용을 입력하세요.');
        return;
      }

      let formData = new FormData();

      // Add comment content as a string

      formData.append(
        'content',
        JSON.stringify({ content: commentText })
      );
      formData.append(
        'uid',
        JSON.stringify({ uid: userId })
      );
      formData.append(
        'pollId',
        JSON.stringify({ pollId: vote.id })
      );

      if (mediaFile) {
        formData.append('mediaData', mediaFile);
      }

      const response = await fetch(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/api/comments/' +
          userId +
          '/' +
          vote.id,
        {
          method: 'POST',
          headers: {
            //'Content-Type': 'multipart/form-data',
            'AUTH-TOKEN': jwtToken,
          },
          body: formData,
        }
      );

      const responseBody = await response.text();

      if (response.ok) {
        const contentType =
          response.headers.get('content-type');
        setSend(false);
        setSelectedMedia(null);
        if (
          contentType &&
          contentType.includes('application/json')
        ) {
          const data = JSON.parse(responseBody);

          console.log('댓글 작성 성공:', data);
        } else {
          console.log('댓글 작성 성공');
        }
        setCommentText('');
      } else {
        console.error('댓글 작성 실패:', response.status);
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error);
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
  // 사진 고른거 삭제
  const cancelImage = () => {
    setSelectedMedia(null);
  };
  // Modify handleImageChange to handle both images and videos
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type.split('/')[0]; // This will be 'image' or 'video'

      if (fileType === 'image' || fileType === 'video') {
        setSelectedMedia(URL.createObjectURL(file)); // Set preview URL
        setMediaFile(file); // Save the file for later use
      } else {
        alert('Only images and videos are allowed.');
        setSelectedMedia(null);
        setMediaFile(null);
      }
    }
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
            <button
              onClick={() => commentLike(comment, index)}
            >
              Like
            </button>
            <span>{comment.likes}</span>
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
          <button
            onClick={() => handleReplyPress(comment, index)}
          >
            답글 작성
          </button>
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
                  <button
                    onClick={() =>
                      commentLike(
                        childComment,
                        index,
                        childIndex
                      )
                    }
                  >
                    Like
                  </button>
                  <span>{childComment.likes}</span>
                  {/* Additional logic for child comment actions */}
                </div>
                <div>
                  {sameOption.some((option) =>
                    option.userNames.includes(
                      childComment.nickname
                    )
                  ) && (
                    <p>(나와 동일한 선택지를 골랐습니다)</p>
                  )}
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
  // 댓글 좋아요
  const commentLike = async (comment, index) => {
    setSend(true);
    console.log('comment ', comment.id);
    console.log('url ', comment.mediaUrl);
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

      if (response.status === 200) {
        console.log(
          '댓글 좋아요 성공',
          JSON.stringify(response.data, null, 2)
        );
        setSend(false);
      } else {
        console.error('댓글 좋아요 실패', response.data);
      }
    } catch (error) {
      console.error('댓글 좋아요 보내기:', error);
    }
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
  // 대댓글 작성
  const handleAddReplySubmit = async () => {
    setSend(true);
    try {
      if (replyText.trim() === '') {
        setCommentError('답글 내용을 입력하세요.');
        return;
      }
      if (!isReplyMode || replyingIndex === null) {
        console.error(
          'Invalid reply mode or replying index.'
        );
        return;
      }
      let formData = new FormData();
      const parentCommentId = comments[replyingIndex].id; // Get the parent comment ID

      formData.append(
        'content',
        JSON.stringify({ content: replyText })
      );
      if (selectedMedia) {
        const localUri = selectedMedia;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const type = match ? `image/${match[1]}` : 'image';

        const response = await fetch(localUri);
        const blob = await response.blob();

        // Append the image data to FormData with the key "mediaData"
        formData.append('mediaData', {
          uri: localUri,
          name: filename,
          type: type,
          blob: blob,
        });
      }
      const response = await fetch(
        `https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/api/comments/${userId}/${vote.id}/${parentCommentId}`,
        {
          method: 'POST',
          headers: {
            //'Content-Type': 'multipart/form-data',
            'AUTH-TOKEN': jwtToken,
          },
          body: formData,
        }
      );

      const responseBody = await response.text();

      if (response.ok) {
        const contentType =
          response.headers.get('content-type');
        setSend(false);
        setSelectedMedia(null);
        if (
          contentType &&
          contentType.includes('application/json')
        ) {
          const data = JSON.parse(responseBody);

          console.log('댓글 작성 성공:', data);
        } else {
          console.log('댓글 작성 성공');
        }

        setIsReplyMode(false);
        setCommentText('');
      } else {
        console.error('댓글 작성 실패:', response.status);
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error);
    }

    setShowReplyInput(false);
    setReplyingIndex(null);
    setCommentError('');
  };
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
    <div>
      <div>
        <button
          onClick={() =>
            isCategory ? goToCategory() : goToMain()
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
        {/* Choices */}
        {vote.choice.map((choice, index) => (
          <div
            key={index}
            style={{
              backgroundColor: userVotes.some(
                (userVote) =>
                  userVote.choiceId === choice.id
              )
                ? '#4B89DC'
                : 'transparent',
            }}
          >
            {choice.text}
          </div>
        ))}
        <p>댓글 {comments.length}</p>
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
        <div>
          {selectedMedia && (
            <img src={selectedMedia} alt="Selected media" />
          )}
          <input
            type="text"
            placeholder={
              isReplyMode
                ? '답글을 입력하세요.'
                : '댓글을 입력하세요.'
            }
            value={isReplyMode ? replyText : commentText}
            onChange={(e) =>
              isReplyMode
                ? setReplyText(e.target.value)
                : setCommentText(e.target.value)
            }
          />
          <button
            onClick={
              isReplyMode
                ? handleAddReplySubmit
                : handleCommentSubmit
            }
          >
            Submit
          </button>
          <input
            type="file"
            accept="image/*,video/*" // Accept both images and videos
            onChange={handleImageChange}
          />
          <button onClick={() => cancelImage()}>
            Cancel Image
          </button>
        </div>
        {sortedComments.map((comment, index) => (
          <Comment
            key={index}
            comment={comment}
            index={index}
          />
        ))}
        {commentError !== '' && <p>{commentError}</p>}
      </div>
    </div>
  );
}

export default VoteAfterPage;
