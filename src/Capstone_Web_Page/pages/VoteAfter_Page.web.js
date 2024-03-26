import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { fetchComments } from '../functions/fetchComment_function';
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
  } = location.state || {};
  const [comments, setComments] = useState([]); // 댓글
  const [standard, setStandard] = useState('');
  const [heartType, setHeartType] = useState('empty');
  const [sortedComments, setSortedComments] = useState([]); // 정렬한 댓글
  const [commentText, setCommentText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const standards = [
    { label: '최신 순', value: '시간' },
    { label: '인기 순', value: '인기' },
  ];

  useEffect(() => {
    fetchComments(vote.id, jwtToken, setComments);
  }, []);

  useEffect(() => {
    sortComments(standard);
    console.log('vote', vote);
  }, [comments, standard]);

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

    console.log('userVotes : ', userVotes);
    console.log('vote : ', vote);
  };

  // 댓글 작성
  const handleCommentSubmit = async () => {
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

  return (
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
      <h1>Vote After Page</h1>
      <div>
        <button onClick={handleHeartClick}>
          {heartType === 'empty' ? '좋아요' : '좋아요 취소'}
        </button>
        {/* 좋아요 버튼: 클릭시 색상 변경 */}
      </div>
      <div>
        <h1>{JSON.parse(vote.title).title}</h1>
        <div>
          <p>투표 기간 설정: {vote.createdAt}</p>
          <p>주최자: {vote.createdBy}</p>
        </div>

        <p>{JSON.parse(vote.question).question}</p>
        {vote.mediaUrl && (
          <img src={vote.mediaUrl} alt="vote" />
        )}
        {/* 본문 내용 표시 */}

        {vote.choice.map((choice) => {
          // userVotes가 배열인지 확인하고, 배열이 아니면 빈 배열로 처리
          const isSelectedByUser =
            Array.isArray(userVotes) &&
            userVotes.some(
              (userVote) => userVote.choiceId === choice.id
            );
          return (
            <div
              key={choice.id}
              style={{
                backgroundColor: isSelectedByUser
                  ? '#4B89DC'
                  : 'transparent',
              }}
            >
              <p
                style={{
                  color: isSelectedByUser
                    ? 'white'
                    : 'black',
                }}
              >
                {choice.text}
              </p>
            </div>
          );
        })}
      </div>
      <div className="vote-page">
        <div className="comments-section">
          <h2>댓글</h2>
          <div>
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="댓글을 입력하세요"
            />
            <button type="submit">댓글 달기</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VoteAfterPage;
