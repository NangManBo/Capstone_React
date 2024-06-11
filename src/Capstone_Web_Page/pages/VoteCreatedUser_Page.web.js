import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchComments,
  sameVoteGroup,
} from '../functions/fetchComment_function';
import axios from 'axios';
import { MainBanner } from '../components/mainBanner_components';
import { LeftBar } from '../components/leftBar_components';
import { ReportModal } from '../modals/Report_Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import './styles/vote_style.css';

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
    userVotes,
    keyId,
  } = location.state || { isCategory: false };
  const videoRef = useRef(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [send, setSend] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [comments, setComments] = useState([]); // 댓글
  const [sortedComments, setSortedComments] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReply, setShowReply] = useState({});
  const [sameOption, setSameOption] = useState([]);
  const [sortingStandard, setSortingStandard] =
    useState('시간'); // 초기 정렬 기준을 '시간'으로 설정
  const [replyText, setReplyText] = useState('');
  const [replyingIndex, setReplyingIndex] = useState(null);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [showReplyInput, setShowReplyInput] =
    useState(false);
  const [commentText, setCommentText] = useState('');
  const totalComments = calculateTotalComments(comments);
  const [mediaFile, setMediaFile] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const toggleModal = (id) => {
    setCommentId(id);
    setModalVisible(!isModalVisible);
  };
  const standards = [
    { label: '최신 순', value: '시간' },
    { label: '인기 순', value: '인기' },
  ];

  const [heartType, setHeartType] = useState('empty');
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
        keyId,
        receiverName: comment.userNickname,
      },
    });
  };

  // 댓글 좋아요
  const commentLike = async (comment, index) => {
    setSend(true);

    try {
      const response = await axios.post(
        `https://dovote.p-e.kr/comments/like/${userId}/${vote.id}/${comment.id}`,

        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      if (response.status === 200) {
        setSend(false);
      } else {
        alert('이미 좋아요를 눌렀습니다.');
      }
    } catch (error) {
      alert('이미 좋아요를 눌렀습니다.');
    }
  };
  // 사진 고른거 삭제
  const cancelImage = () => {
    setSelectedMedia(null);
  };
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type.split('/')[0]; // This will be 'image' or 'video'

      if (fileType === 'image' || fileType === 'video') {
        setSelectedMedia(URL.createObjectURL(file)); // Set preview URL
        setMediaFile(file); // Save the file for later use
      } else {
        alert('사진과 동영상만 가능합니다');
        setSelectedMedia(null);
        setMediaFile(null);
      }
    }
  };
  // 대댓글에서 쪽지 보내기
  const handlemessge1 = (childComment) => {
    navigate('/dmautosend', {
      state: {
        isLoggedIn,
        userId,
        jwtToken,
        nickname,
        keyId,
        receiverName: childComment.userNickname,
      },
    });
  };
  // 대댓글
  const handleReplyPress = (comment, index) => {
    if (replyingIndex === index) {
      // If the reply button is pressed again, reset to a regular comment
      setReplyingIndex(null);
      setReplyText('');
      setIsReplyMode(false); // Turn off reply mode
    } else {
      setReplyingIndex(comment.id);
      setReplyText(`@답글 `);
      setIsReplyMode(true); // Turn on reply mode
    }
    setShowReplyInput(true);
    setCommentText(''); // Reset regular comment text
  };
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
  }, [comments, sortingStandard, send]);
  // 댓글 신고
  const reportComment = async (commentId, reportReason) => {
    setSend(true);
    try {
      const response = await axios.post(
        `https://dovote.p-e.kr/comments/report/${userId}/${vote.id}/${commentId}`,
        {
          reportReason,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwtToken,
          },
        }
      );

      if (response.status === 200) {
        // 댓글 신고가 성공하면 바로 댓글을 갱신하도록 fetchComments를 호출
        await fetchComments(vote.id, jwtToken, setComments);
        setSend(false);
        alert('댓글 신고 성공:', response.data);
      } else {
        alert('댓글 신고 실패:', response.data);
      }
    } catch (error) {
      alert('댓글 신고 오류:', error);
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
      <div className="comment_body" key={index}>
        <div className="comment_box">
          <div className="commnet_box_user">
            <div className="commnet_box_user_1">
              <span>작성자 : {comment.userNickname}</span>{' '}
              <span>
                작성시간:{' '}
                {new Date(comment.time).toLocaleString(
                  'ko-KR',
                  {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }
                )}
              </span>
            </div>
            <div className="commnet_box_user_2">
              <span onClick={() => toggleModal(comment.id)}>
                <FontAwesomeIcon
                  style={{
                    marginLeft: '15px',
                    color: 'red',
                  }}
                  icon={faCircleExclamation}
                />
              </span>
            </div>
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
                option.userNames.includes(
                  comment.userNickname
                )
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
                onClick={() =>
                  handleReplyPress(comment, index)
                }
                icon={faReply}
              />

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
                    <div className="commnet_box_user_1">
                      <span>
                        작성자 : {childComment.userNickname}
                      </span>

                      <span>
                        작성시간:{' '}
                        {new Date(
                          childComment.time
                        ).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="commnet_box_user_2">
                      <span
                        onClick={() =>
                          toggleModal(childComment.id)
                        }
                      >
                        <FontAwesomeIcon
                          style={{
                            marginLeft: '15px',
                            color: 'red',
                          }}
                          icon={faCircleExclamation}
                        />
                      </span>
                    </div>
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
                          childComment.userNickname
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
  // 댓글 작성
  const handleCommentSubmit = async () => {
    setSend(true);

    try {
      if (!commentText.trim()) {
        alert('댓글 내용을 입력하세요.');
        return;
      }

      let formData = new FormData();

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

      const response = await axios.post(
        `https://dovote.p-e.kr/comments/${userId}/${vote.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: jwtToken,
          },
        }
      );

      if (response.status === 201) {
        const contentType =
          response.headers.get('content-type');
        setSend(false);
        setSelectedMedia(null);
        if (
          contentType &&
          contentType.includes('application/json')
        ) {
        } else {
        }
        setCommentText('');
      } else {
      }
    } catch (error) {}
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
        return;
      }
      let formData = new FormData();
      const parentCommentId = replyingIndex; // Get the parent comment ID

      // '@답글 ' 부분을 제거
      const mention = '@답글 ';
      const contentWithoutMention = replyText.startsWith(
        mention
      )
        ? replyText.slice(mention.length)
        : replyText;

      formData.append(
        'content',
        JSON.stringify({ content: contentWithoutMention })
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
      const response = await axios.post(
        `https://dovote.p-e.kr/comments/${userId}/${vote.id}/${parentCommentId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: jwtToken,
          },
        }
      );

      if (response.status === 201) {
        const contentType =
          response.headers.get('content-type');
        setSend(false);
        setSelectedMedia(null);
        if (
          contentType &&
          contentType.includes('application/json')
        ) {
        } else {
        }
        setIsReplyMode(false);
        setCommentText('');
      } else {
      }
    } catch (error) {}

    setShowReplyInput(false);
    setReplyingIndex(null);
    setCommentError('');
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
          pollId: vote.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
      } else {
      }
    } catch (error) {}
    try {
      const response = await axios.post(
        'https://dovote.p-e.kr/polls/close',
        Data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwtToken,
          },
        }
      );
      if (response.status === 200) {
      } else {
      }
    } catch (error) {}
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
    }
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
        keyId,
      },
    });
  };

  const voteDelete = async () => {
    try {
      const response = await axios.delete(
        `https://dovote.p-e.kr/polls/${vote.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwtToken,
          },
        }
      );

      navigate('/', {
        state: {
          isLoggedIn,
          userId,
          jwtToken,
          nickname,
          keyId,
        },
      });
    } catch (error) {}
  };
  return (
    <div className="vote_page">
      <ReportModal
        isVisible={isModalVisible}
        onClose={() => toggleModal(null)}
        onConfirm={() => toggleModal(null)}
        commentId={commentId}
        reportComment={reportComment}
      />
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
        <div className="vote_button_back_like_box">
          <div
            className="goBackButton"
            onClick={() =>
              isCategory ? goToCategory() : goToMain()
            }
          >
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              style={{ fontSize: '36px' }}
            />{' '}
          </div>
          <div className="likeButton">
            {heartType === 'empty' ? (
              <FontAwesomeIcon
                icon={faHeart}
                color="black"
                style={{ fontSize: '36px' }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faHeart}
                color="red"
                style={{ fontSize: '36px' }}
              />
            )}
          </div>
        </div>
        <div>
          <div className="vote_header">
            <>
              <h1>{vote.title}</h1>
            </>
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
          {pollOptions.map((option) => (
            <div className="vote_button">
              <p key={option.id}>{option.text}</p>
            </div>
          ))}
          <div className="comment_header">
            <p className="comment_header_text">
              댓글 {totalComments}
            </p>
            <select
              className="comment_header_select"
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
          </div>
          <div className="comment_write_box">
            {selectedMedia && (
              <img
                src={selectedMedia}
                alt="Selected media"
                className="comment_image"
              />
            )}
            <div className="comment_write_input">
              <input
                type="text"
                placeholder={
                  isReplyMode
                    ? '답글을 입력하세요.'
                    : '댓글을 입력하세요.'
                }
                value={
                  isReplyMode ? replyText : commentText
                }
                onChange={(e) =>
                  isReplyMode
                    ? setReplyText(e.target.value)
                    : setCommentText(e.target.value)
                }
              />
              <button
                className="comment_write_button"
                onClick={
                  isReplyMode
                    ? handleAddReplySubmit
                    : handleCommentSubmit
                }
              >
                댓글 작성
              </button>
              <div className="comment_image_button">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleImageChange}
                  id="file-input"
                  className="custom-file-input"
                />
                <label
                  htmlFor="file-input"
                  className="custom-file-label"
                >
                  <FontAwesomeIcon icon={faImage} />
                </label>

                <button
                  className="cancel-button"
                  onClick={cancelImage}
                >
                  X
                </button>
              </div>
              <button
                onClick={handleEndVote}
                className="vote_end_button_1"
              >
                투표 종료하기
              </button>
              {vote.createdBy === nickname ? (
                <button
                  onClick={voteDelete}
                  className="vote_end_button_2"
                >
                  투표 삭제하기
                </button>
              ) : null}
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

export default VoteCreatedUserPage;
