import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { MainBanner } from '../components/mainBanner_components';
import './styles/voteMake_style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { LeftBar } from '../components/leftBar_components';
function VoteMakePage() {
  // React Router의 useLocation 훅을 사용하여 URL의 상태 접근
  const location = useLocation();
  // React Router의 useNavigate 훅을 사용하여 프로그래밍 방식으로 내비게이션
  const navigate = useNavigate();

  // location.state를 통해 전달된 매개변수 접근
  const { userId, isLoggedIn, jwtToken, nickname, keyId } =
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
    try {
      const formData = new FormData();
      const pollData = {
        title: titleInput,
        category: selectedCategory,
        question: description,
        userId: keyId,
      };
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
          'pollData',
          JSON.stringify(pollData)
        );

        if (mediaFile) {
          formData.append('mediaData', mediaFile);
        }
      }
      console.log('투표 생성 요청 pollData:', pollData);
      console.log('투표 생성 요청 formData:', formData);
      const response = await axios.post(
        'https://dovote.p-e.kr/polls/upload',
        formData,
        {
          headers: {
            Authorization: jwtToken,
            'Content-Type': 'multipart/form-data',
          },
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
            'https://dovote.p-e.kr/choices/create/' +
              parsedData.pollId,
            data,
            {
              headers: {
                'content-type': 'application/json',
              },
            }
          );

          if (response.status === 201) {
            console.log('투표 항목 성공:', response.data);
            navigate('/', {
              state: {
                isLoggedIn,
                userId,
                jwtToken,
                nickname,
                keyId,
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
        console.error('투표 오류 응답:', response.status);
      }
    } catch (error) {
      console.error('투표 오류 응답:', error);
    }
  };

  return (
    <div className="vote_page">
      {MainBanner(jwtToken, isLoggedIn, userId, nickname)}
      <LeftBar />
      <div className="right_page">
        <h2
          className="goBackButton"
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
          이전 페이지로
        </h2>
        <div className="voteMake_header">
          <h1>게시글 작성하기</h1>
        </div>
        <div className="voteMake_titlebox">
          <label className="voteMake_title">제목</label>
          <input
            className="no-border-input"
            type="text"
            placeholder=""
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
        </div>

        <div className="voteMake_categorybox">
          <label className="voteMake_title">카테고리</label>
          <select
            className="category_select"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
          >
            <option value=""></option>
            {categories.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="voteMake_question">
          <div>
            <label className="voteMake_title">본문</label>
          </div>
          <div className="image-button">
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
        </div>

        <textarea
          className="voteMake_textarea"
          placeholder="본문 내용을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="voteMake_image">
          <div>
            {selectedMedia && (
              <img
                src={selectedMedia}
                alt="Selected media"
                style={{ width: '200px', height: '200px' }}
              />
            )}
          </div>
          <div className="voteMake_choice">
            <div>
              {options.map((option, index) => (
                <div
                  className="voteMake_choice_box"
                  key={index}
                >
                  <input
                    className="choice_input"
                    type="text"
                    value={option}
                    onChange={(e) => {
                      let newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                  />
                  <button
                    className="choice_button"
                    onClick={() => removeOption(index)}
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
            <div className="voteMake_choice_box">
              <label className="choice_label">
                투표 항목을 추가하려면 +를 눌러주세요
              </label>
              <button
                className="choice_button"
                onClick={addOption}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="voteMake_makebutton_box">
          <button
            className="voteMake_makebutton"
            onClick={voteMake}
          >
            투표 항목 생성하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoteMakePage;
