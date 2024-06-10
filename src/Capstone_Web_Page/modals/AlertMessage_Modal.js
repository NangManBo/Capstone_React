import React from 'react';
import Modal from 'react-modal';
import './styles/report_style.css';

export const AlertModal = ({
  isVisible,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      className="modalContent"
      overlayClassName="modalOverlay"
    >
      <h2 className="title">{message}</h2>

      <div className="buttonContainer">
        <button
          className="button2"
          onClick={() => {
            onConfirm();
          }}
        >
          확인
        </button>
      </div>
    </Modal>
  );
};
