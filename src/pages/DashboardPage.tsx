
import CreateTaskForm from "../features/tasks/CreateTaskForm";
import TaskList from "../features/tasks/TaskList";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
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
