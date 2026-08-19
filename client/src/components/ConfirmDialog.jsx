function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="confirm-actions">
          <button
            className="confirm-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="confirm-delete"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
