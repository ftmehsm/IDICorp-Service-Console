import { Link } from "react-router";
import styles from "./DashboardPage.module.css";

const cards = [
  {
    to: "/tasks",
    title: "Tasks",
    description: "Create, search, and track work items in one place.",
  },
  {
    to: "/calculator",
    title: "Calculator",
    description: "Run quick calculations without leaving the console.",
  },
];

export default function DashboardPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Welcome</p>
        <h1 className={styles.title}>Service Console</h1>
        <p className={styles.subtitle}>
          Choose a tool below to get started, or use the sidebar to move
          between pages.
        </p>
      </header>

      <div className={styles.cards}>
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className={styles.card}>
            <h2 className={styles.cardTitle}>{card.title}</h2>
            <p className={styles.cardDescription}>{card.description}</p>
            <span className={styles.cardAction}>Open →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
