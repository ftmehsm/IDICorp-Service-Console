
import { useEffect, useRef, useState, type FormEvent } from "react";
import axios from "axios";
import type { Task } from "./types";
import { useUpdateTask } from "./hooks";
import styles from "./EditTaskModal.module.css";

type EditTaskModalProps = {
  task: Task | null;
  onClose: () => void;
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail)) {
      return detail
        .map((item: { msg?: string }) => item.msg ?? "")
        .filter(Boolean)
        .join(", ");
    }

    if (!error.response) {
      return "Network error. Please check your connection.";
    }

    if (error.response.status === 401 || error.response.status === 403) {
      return "Your session may have expired. Please log in again.";
    }
  }

  return error instanceof Error
    ? error.message
    : "Failed to update task. Please try again.";
}

export default function EditTaskModal({
  task,
  onClose,
}: EditTaskModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const updateTask = useUpdateTask();

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);
    setDescription(task.description);
    updateTask.reset();
  }, [task?.id]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (task && !dialog.open) {
      dialog.showModal();
    } else if (!task && dialog.open) {
      dialog.close();
    }
  }, [task]);

  function handleClose() {
    if (!updateTask.isPending) {
      onClose();
    }
  }

  function handleCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    handleClose();
  }

  function handleBackdropClick(
    event: React.MouseEvent<HTMLDialogElement>,
  ) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!task || updateTask.isPending) return;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (
      !trimmedTitle ||
      trimmedTitle.length > 120 ||
      trimmedDescription.length > 2000
    ) {
      return;
    }

    updateTask.mutate(
      {
        id: task.id,
        input: {
          title: trimmedTitle,
          description: trimmedDescription,
        },
      },
      {
        onSuccess: () => onClose(),
      },
    );
  }

  const isTitleValid =
    title.trim().length > 0 && title.trim().length <= 120;
  const isDescriptionValid = description.length <= 2000;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="edit-task-heading"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        <h2 id="edit-task-heading" className={styles.heading}>
          Edit task
        </h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-task-title">
              Title *
            </label>

            <input
              className={styles.input}
              id="edit-task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              required
              aria-invalid={!isTitleValid}
            />

            <small className={styles.help}>
              Required, up to 120 characters.
            </small>
          </div>

          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="edit-task-description"
            >
              Description
            </label>

            <textarea
              className={styles.textarea}
              id="edit-task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={2000}
              rows={4}
              aria-invalid={!isDescriptionValid}
            />

            <small className={styles.help}>
              Optional, up to 2000 characters.
            </small>
          </div>

          {updateTask.isError && (
            <p className={styles.error} role="alert">
              {getErrorMessage(updateTask.error)}
            </p>
          )}

          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={handleClose}
              disabled={updateTask.isPending}
            >
              Cancel
            </button>

            <button
              className={styles.saveButton}
              type="submit"
              disabled={
                updateTask.isPending ||
                !isTitleValid ||
                !isDescriptionValid
              }
            >
              {updateTask.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
