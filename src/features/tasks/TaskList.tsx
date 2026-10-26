
import { useState, type FormEvent } from "react";
import {
  useTasks,
  useUpdateTask,
  useDeleteTask,
} from "./hooks";
import type { Task, TaskFilters } from "./types";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import styles from "./TaskList.module.css";

export default function TaskList() {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<TaskFilters>({});
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const {
    data: tasks,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useTasks(filters);

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFilters((current) => ({
      ...current,
      q: searchInput.trim() || undefined,
    }));
  }

  function handleStatusChange(value: string) {
    setFilters((current) => ({
      ...current,
      completed:
        value === "all" ? undefined : value === "completed",
    }));
  }

  function handleToggleTask(id: number, completed: boolean) {
    updateTask.mutate({
      id,
      input: { completed: !completed },
    });
  }

  function handleDeleteTask(task: Task) {
    deleteTask.reset();
    setTaskToDelete(task);
  }

  function handleConfirmDelete() {
    if (!taskToDelete || deleteTask.isPending) return;

    deleteTask.mutate(taskToDelete.id, {
      onSuccess: () => {
        setTaskToDelete(null);
      },
    });
  }

  function handleCancelDelete() {
    if (deleteTask.isPending) return;

    setTaskToDelete(null);
    deleteTask.reset();
  }

  return (
    <section className={styles.card} aria-labelledby="tasks-heading">
      <h2 id="tasks-heading" className={styles.heading}>
        Tasks
      </h2>

      <form className={styles.filters} onSubmit={handleSearch}>
        <div className={styles.search}>
          <label className={styles.filterLabel} htmlFor="task-search">
            Search tasks
          </label>

          <div className={styles.searchRow}>
            <input
              className={styles.filterInput}
              id="task-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search tasks..."
            />

            <button className={styles.searchButton} type="submit">
              Search
            </button>
          </div>
        </div>

        <div className={styles.status}>
          <label className={styles.filterLabel} htmlFor="task-status">
            Filter by status
          </label>

          <select
            className={styles.filterSelect}
            id="task-status"
            value={
              filters.completed === undefined
                ? "all"
                : filters.completed
                  ? "completed"
                  : "pending"
            }
            onChange={(event) => handleStatusChange(event.target.value)}
          >
            <option value="all">All tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </form>

      {updateTask.isError && (
        <p className={`${styles.message} ${styles.error}`} role="alert">
          Failed to update the task. Please try again.
        </p>
      )}

      {isLoading && (
        <div
          className={`${styles.state} ${styles.loading}`}
          role="status"
        >
          <span className={styles.spinner} aria-hidden="true" />
          <span>Loading tasks...</span>
        </div>
      )}

      {isError && (
        <div className={`${styles.state} ${styles.error}`} role="alert">
          <p>
            {error instanceof Error
              ? error.message
              : "Failed to load tasks."}
          </p>

          <button
            className={styles.retryButton}
            type="button"
            onClick={() => refetch()}
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && tasks?.length === 0 && (
        <div className={styles.state}>
          {filters.q || filters.completed !== undefined
            ? "No tasks match your filters."
            : "No tasks yet."}
        </div>
      )}

      {!isLoading && !isError && tasks && tasks.length > 0 && (
        <>
          <p className={styles.count} aria-live="polite">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            {isFetching ? " · Updating..." : ""}
          </p>

          <ul className={styles.items}>
            {tasks.map((task) => (
              <li key={task.id}>
                <article className={styles.task}>
                  <header className={styles.taskHeader}>
                    <h3 className={styles.taskTitle}>{task.title}</h3>

                    <span
                      className={`${styles.statusBadge} ${
                        task.completed
                          ? styles.completed
                          : styles.pending
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </header>

                  {task.description && (
                    <p className={styles.description}>
                      {task.description}
                    </p>
                  )}

                  <p className={styles.updated}>
                    Last updated:{" "}
                    <time dateTime={task.updated_at}>
                      {new Date(task.updated_at).toLocaleString()}
                    </time>
                  </p>

                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      type="button"
                      disabled={updateTask.isPending}
                      onClick={() =>
                        handleToggleTask(task.id, task.completed)
                      }
                    >
                      {updateTask.isPending
                        ? "Saving..."
                        : task.completed
                          ? "Mark as pending"
                          : "Mark as completed"}
                    </button>

                    <button
                      className={styles.deleteButton}
                      type="button"
                      disabled={deleteTask.isPending}
                      onClick={() => handleDeleteTask(task)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDeleteModal
        open={taskToDelete !== null}
        taskTitle={taskToDelete?.title ?? ""}
        isDeleting={deleteTask.isPending}
        errorMessage={
          deleteTask.isError
            ? "Failed to delete the task. Please try again."
            : undefined
        }
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
