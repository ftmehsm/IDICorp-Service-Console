
import { useState, type FormEvent } from "react";
import { useTasks } from "./hooks";
import type { TaskFilters } from "./types";

export default function TaskList() {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<TaskFilters>({});

  const {
    data: tasks,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useTasks(filters);

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
        value === "all"
          ? undefined
          : value === "completed",
    }));
  }

  return (
    <section aria-labelledby="tasks-heading">
      <h2 id="tasks-heading">Tasks</h2>

      <form onSubmit={handleSearch}>
        <label htmlFor="task-search">Search tasks</label>
        <input
          id="task-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by title or description"
        />
        <button type="submit">Search</button>
      </form>

      <div>
        <label htmlFor="task-status">Filter by status</label>
        <select
          id="task-status"
          value={
            filters.completed === undefined
              ? "all"
              : filters.completed
                ? "completed"
                : "pending"
          }
          onChange={(event) =>
            handleStatusChange(event.target.value)
          }
        >
          <option value="all">All tasks</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {isLoading && (
        <p role="status">Loading tasks...</p>
      )}

      {isError && (
        <div role="alert">
          <p>
            {error instanceof Error
              ? error.message
              : "Failed to load tasks."}
          </p>
          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && tasks?.length === 0 && (
        <p>
          {filters.q || filters.completed !== undefined
            ? "No tasks match your filters."
            : "No tasks yet."}
        </p>
      )}

      {!isLoading && !isError && tasks && tasks.length > 0 && (
        <>
          <p aria-live="polite">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            {isFetching ? " · Updating..." : ""}
          </p>

          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <article>
                  <h3>{task.title}</h3>

                  {task.description && (
                    <p>{task.description}</p>
                  )}

                  <p>
                    Status:{" "}
                    <strong>
                      {task.completed ? "Completed" : "Pending"}
                    </strong>
                  </p>

                  <p>
                    Last updated:{" "}
                    <time dateTime={task.updated_at}>
                      {new Date(task.updated_at).toLocaleString()}
                    </time>
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
