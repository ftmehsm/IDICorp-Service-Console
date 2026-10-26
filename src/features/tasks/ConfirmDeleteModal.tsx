
import { useEffect, useRef } from "react";
import styles from "./ConfirmDeleteModal.module.css";

type ConfirmDeleteModalProps = {
  open: boolean;
  taskTitle: string;
  isDeleting: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({
  open,
  taskTitle,
  isDeleting,
  errorMessage,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();

    if (!isDeleting) {
      onCancel();
    }
  }

  function handleBackdropClick(
    event: React.MouseEvent<HTMLDialogElement>,
  ) {
    if (event.target === event.currentTarget && !isDeleting) {
      onCancel();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden="true">
          !
        </div>

        <h2 id="delete-modal-title" className={styles.title}>
          Delete task?
        </h2>

        <p id="delete-modal-description" className={styles.description}>
          Are you sure you want to delete{" "}
          <strong className={styles.taskTitle}>{taskTitle}</strong>?
          This action cannot be undone.
        </p>

        {errorMessage && (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete task"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
