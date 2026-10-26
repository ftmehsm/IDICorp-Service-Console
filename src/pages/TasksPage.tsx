import CreateTaskForm from "../features/tasks/CreateTaskForm";
import TaskList from "../features/tasks/TaskList";
import styles from "./TasksPage.module.css";

export default function TasksPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tasks</h1>
        <p className={styles.subtitle}>
          Manage, search, and track your tasks.
        </p>
      </header>

      <div className={styles.content}>
        <CreateTaskForm />
        <TaskList />
      </div>
    </main>
  );
}
