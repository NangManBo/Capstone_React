import React, { useState } from 'react';
import Modal from 'react-modal';
import './styles/report_style.css';

export const reportComment = async (
  commentId,
  reportReason
) => {
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
      console.log('댓글 신고 성공:', response.data);
    } else {
      console.error('댓글 신고 실패:', response.data);
    }
  } catch (error) {
    console.error('댓글 신고 오류:', error);
  }
};

export const ReportModal = ({
  isVisible,
  onClose,
  onConfirm,
  commentId,
}) => {
  const [selectedValue, setSelectedValue] = useState('');

  const options = [
    {
      label: '마음에 들지 않아요',
      value: '마음에들지않아요',
    },
    { label: '선정적이에요', value: '선정적이에요' },
    { label: '테러를 조장해요', value: '테러를조장해요' },
    { label: '부적절해요', value: '부적절해요' },
    { label: '스팸이에요', value: '스팸이에요' },
    { label: '혐오 발언이에요', value: '혐오발언이에요' },
    {
      label: '공격적인 내용이 있어요',
      value: '공격적인내용이있어요',
    },
    {
      label: '거짓 정보가 포함돼 있어요',
      value: '거짓정보가포함돼있어요',
    },
    {
      label: '개인정보를 침해해요',
      value: '개인정보를침해해요',
    },
    {
      label: '불법적인 내용이 포함돼 있어요',
      value: '불법적인내용이포함돼있어요',
    },
    { label: '괴롭힘이 있어요', value: '괴롭힘이있어요' },
    {
      label: '원치 않는 광고예요',
      value: '원치않는광고에요',
    },
    {
      label: '불건전한 만남 및 대화가 있어요',
      value: '불건전한만남및대화가있어요',
    },
    {
      label: '게시판 성격에 부적절해요',
      value: '게시판성격에부적절해요',
    },
    {
      label: '상업적 광고 및 판매가 있어요',
      value: '상업적광고및판매가있어요',
    },
    {
      label: '욕설 비하가 있어요',
      value: '욕설비하가있어요',
    },
    {
      label: '유출 사칭 사기가 있어요',
      value: '유출사칭사기가있어요',
    },
    {
      label: '정치인 비하 및 선거운동이 있어요',
      value: '정치인비하및선거운동이있어요',
    },
  ];

  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      contentLabel="신고 사유 선택"
      className="modalContent"
      overlayClassName="modalOverlay"
    >
      <h2 className="title">신고 사유 선택</h2>
      <select
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        className="selectBox"
      >
        <option value="">신고사유</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="buttonContainer">
        <button className="button1" onClick={onClose}>
          취소
        </button>
        <button
          className="button2"
          onClick={() => {
            reportComment(commentId, selectedValue);
            onConfirm();
          }}
        >
          신고
        </button>
      </div>
    </Modal>
  );
};
