import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function VoteMakePage() {
  // React Router의 useLocation 훅을 사용하여 URL의 상태 접근
  const location = useLocation();
  // React Router의 useNavigate 훅을 사용하여 프로그래밍 방식으로 내비게이션
  const navigate = useNavigate();

  // location.state를 통해 전달된 매개변수 접근
  const { userId, isLoggedIn, jwtToken, nickname } =
    location.state || {};

  const [titleInput, setTitleInput] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('');
  const [options, setOptions] = useState(['', '']);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaFile, setMediaFile] = useState(null); // 파일 자체를 저장하기 위한 상태
  // 선택 사항 추가
  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    } else {
      alert(
        '알림',
        '투표항목은 최대 4개까지 등록 가능합니다.'
      );
    }
  };
  // 선택 사항 삭제
  const removeOption = (indexToRemove) => {
    if (options.length > 2) {
      const newOptions = options.filter(
        (_, index) => index !== indexToRemove
      );
      setOptions(newOptions);
    } else {
      alert(
        '알림',
        '투표항목은 최소 2개 이상이어야 합니다.'
      );
    }
  };
  const categories = [
    { label: '정치', value: '정치' },
    { label: '경제', value: '경제' },
    { label: '스포츠', value: '스포츠' },
    { label: '문화와예술', value: '문화와예술' },
    { label: '시사', value: '시사' },
    { label: '게임', value: '게임' },
    { label: '반려동물', value: '반려동물' },
    { label: '음식', value: '음식' },
  ];

  // 사진 고른거 삭제
  const cancelImage = () => {
    setSelectedMedia(null);
    console.log(jwtToken);
  };
  // Existing state declarations...

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

  // 투표 생성
  const voteMake = async () => {
    console.log('이미지 url', selectedMedia);
    console.log('이미지 file', mediaFile);
    try {
      const formData = new FormData();

      if (titleInput.trim() === '') {
        alert('알림', '제목을 입력하세요.');
      } else if (
        selectedCategory.trim() === '' ||
        selectedCategory === '선택'
      ) {
        alert('알림', '카테고리를 선택해주세요.');
      } else if (description.trim() === '') {
        alert('알림', '본문 내용을 입력해주세요.');
      } else if (
        options.some((option) => option.trim() === '')
      ) {
        alert('알림', '투표항목내용을 입력해주세요.');
      } else {
        formData.append(
          'user',
          JSON.stringify({ user: nickname })
        );
        formData.append(
          'title',
          JSON.stringify({ title: titleInput })
        );
        formData.append(
          'question',
          JSON.stringify({ question: description })
        );

        //   if (selectedMedia) {
        //     const localUri = selectedMedia;
        //     const filename = localUri.split('/').pop();
        //     const match = /\.(\w+)$/.exec(filename ?? '');
        //     const type = match
        //       ? `image/${match[1]}`
        //       : 'image';

        //     const response = await fetch(localUri);
        //     const blob = await response.blob();

        //     formData.append('mediaData', {
        //       uri: localUri,
        //       name: filename,
        //       type: type, // Use the actual Content-Type from the result
        //       blob: blob,
        //     });
        //   }
        // }
        // 파일이 선택되었다면 FormData에 추가
        if (mediaFile) {
          formData.append('mediaData', mediaFile);
        }
      }
      const response = await fetch(
        'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/polls/upload/' +
          selectedCategory,
        {
          method: 'POST',
          headers: {
            'AUTH-TOKEN': jwtToken,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const contentType =
          response.headers.get('content-type');
        setSelectedMedia(null);
        console.log('투표 생성 성공');

        let parsedData;
        if (
          contentType &&
          contentType.includes('application/json')
        ) {
          parsedData = await response.json();
          console.log('투표 작성 성공:', parsedData);
        } else {
          console.log('투표 작성 성공');
        }

        try {
          const data = {
            choiceDtos: options.map((option, index) => ({
              text: option.trim(),
            })),
          };

          const response = await axios.post(
            'https://port-0-capstone-project-gj8u2llon19kg3.sel5.cloudtype.app/choices/create/' +
              parsedData.pollId,
            data
          );

          if (response.status === 201) {
            console.log('투표 항목 성공:', response.data);
            navigate('/', {
              state: {
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
              },
            });
          } else {
            console.error(
              '투표항목 생성 실패:',
              response.data
            );
          }
        } catch (error) {
          console.error('투표항목 생성 오류:', error);
        }
      } else {
        const errorData = await response.text();
        console.error(
          '투표 오류 응답:',
          response.status,
          errorData
        );
      }
    } catch (error) {
      console.error('투표 오류 응답:', error);
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
      <h1>투표생성하기</h1>

      <div>
        <label>제목:</label>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        />
      </div>

      <div>
        <label>카테고리:</label>
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
        >
          <option value="">선택</option>
          {categories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        {/* 생략된 입력 필드 및 버튼 */}
        <input
          type="file"
          accept="image/*,video/*" // Accept both images and videos
          onChange={handleImageChange}
        />
        <button onClick={cancelImage}>X</button>
      </div>

      <textarea
        placeholder="본문 내용을 입력하세요"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      {selectedMedia && (
        <img
          src={selectedMedia}
          alt="Selected media"
          style={{ width: '300px', height: '300px' }}
        />
      )}

      {options.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            value={option}
            onChange={(e) => {
              let newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
          />
          <button onClick={() => removeOption(index)}>
            -
          </button>
        </div>
      ))}

      <button onClick={addOption}>+</button>

      <button onClick={voteMake}>
        투표 항목 생성하러 가기
      </button>
    </div>
  );
}

export default VoteMakePage;
