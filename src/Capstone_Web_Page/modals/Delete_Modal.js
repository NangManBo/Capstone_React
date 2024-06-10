import React from 'react';
import Modal from 'react-modal';
import './DeleteConfirmationModal.css';

const DeleteModal = ({ isVisible, onCancel, onDelete }) => {
  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onCancel}
      contentLabel="Delete Confirmation"
      className="modalContent"
      overlayClassName="modalOverlay"
    >
      <div className="modalContent">
        <p className="modalText">삭제하시겠습니까?</p>
        <div className="buttonContainer">
          <button
            className="button cancelButton"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="button deleteButton"
            onClick={onDelete}
          >
            삭제
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
