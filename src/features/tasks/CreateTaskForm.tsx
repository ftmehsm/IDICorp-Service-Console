
import { useState, type FormEvent } from "react";
import axios from "axios";
import { useCreateTask } from "./hooks";
import styles from "./CreateTaskForm.module.css";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((item: { msg?: string }) => item.msg ?? "")
        .filter(Boolean)
        .join(", ");
    }

    if (!error.response) {
      return "Network error. Please check your connection and try again.";
    }

    if (
      error.response.status === 401 ||
      error.response.status === 403
    ) {
      return "Your session may have expired. Please log in again.";
    }
  }

  return error instanceof Error
    ? error.message
    : "Failed to create task. Please try again.";
}

export default function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createTask = useCreateTask();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || trimmedTitle.length > 120) {
      return;
    }

    if (trimmedDescription.length > 2000) {
      return;
    }

    createTask.mutate(
      {
        title: trimmedTitle,
        description: trimmedDescription,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
        },
      },
    );
  }

  const titleIsValid =
    title.trim().length > 0 && title.trim().length <= 120;

  const descriptionIsValid = description.length <= 2000;

  return (
    <section
      className={styles.card}
      aria-labelledby="create-task-heading"
    >
      <h2
        id="create-task-heading"
        className={styles.heading}
      >
        Create a task
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label
            className={styles.label}
            htmlFor="new-task-title"
          >
            Title *
          </label>

          <input
            className={`${styles.input} ${
              title.length > 0 && !titleIsValid
                ? styles.invalid
                : ""
            }`}
            id="new-task-title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            required
            aria-invalid={title.length > 0 && !titleIsValid}
            aria-describedby="title-help"
          />

          <small
            id="title-help"
            className={styles.help}
          >
            Required, up to 120 characters.
          </small>
        </div>

        <div className={styles.field}>
          <label
            className={styles.label}
            htmlFor="new-task-description"
          >
            Description
          </label>

          <textarea
            className={`${styles.textarea} ${
              !descriptionIsValid ? styles.invalid : ""
            }`}
            id="new-task-description"
            name="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            maxLength={2000}
            rows={4}
            aria-invalid={!descriptionIsValid}
            aria-describedby="description-help"
          />

          <small
            id="description-help"
            className={styles.help}
          >
            Optional, up to 2000 characters.
          </small>
        </div>

        {createTask.isError && (
          <p
            className={`${styles.message} ${styles.error}`}
            role="alert"
          >
            {getErrorMessage(createTask.error)}
          </p>
        )}

        {createTask.isSuccess && (
          <p
            className={`${styles.message} ${styles.success}`}
            role="status"
          >
            Task created successfully.
          </p>
        )}

        <button
          className={styles.submit}
          type="submit"
          disabled={
            createTask.isPending ||
            !titleIsValid ||
            !descriptionIsValid
          }
        >
          {createTask.isPending
            ? "Creating..."
            : "Create task"}
        </button>
      </form>
    </section>
  );
}
