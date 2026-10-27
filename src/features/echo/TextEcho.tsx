
import { useState, type FormEvent } from "react";

import { useEchoSocket } from "./useEchoSocket";
import styles from "./TextEcho.module.css";

const STATUS_LABELS = {
  connecting: "Connecting...",
  ready: "Connected",
  disconnected: "Disconnected",
  error: "Connection error",
} as const;

export default function TextEcho() {
  const [input, setInput] = useState("");

  const {
    status,
    messages,
    error,
    sendMessage,
    clearMessages,
  } = useEchoSocket();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (sendMessage(input)) {
      setInput("");
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Text Echo</h1>
          <p>Send text messages and receive the server's echo.</p>
        </div>

        <div
          className={`${styles.status} ${styles[status]}`}
          role="status"
          aria-live="polite"
        >
          <span className={styles.statusIndicator} />
          {STATUS_LABELS[status]}
        </div>
      </header>

      <section className={styles.panel} aria-label="Echo messages">
        <div className={styles.panelHeader}>
          <h2>Message history</h2>

          <button
            type="button"
            className={styles.clearButton}
            onClick={clearMessages}
            disabled={messages.length === 0}
          >
            Clear history
          </button>
        </div>

        <div
          className={styles.messageList}
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.length === 0 ? (
            <p className={styles.emptyState}>
              No messages yet. Send a message to get started.
            </p>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                className={`${styles.message} ${
                  message.direction === "sent"
                    ? styles.sent
                    : styles.received
                }`}
              >
                <div className={styles.messageMeta}>
                  <span>
                    {message.direction === "sent" ? "You" : "Echo server"}
                  </span>
                  <time dateTime={new Date(message.timestamp).toISOString()}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </time>
                </div>

                <p className={styles.messageText}>{message.text}</p>
              </article>
            ))
          )}
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <form className={styles.composer} onSubmit={handleSubmit}>
          <label htmlFor="echo-message">Your message</label>

          <textarea
            id="echo-message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type a message..."
            rows={3}
            maxLength={5000}
            disabled={status !== "ready"}
          />

          <div className={styles.composerFooter}>
            <span className={styles.hint}>
              {status === "ready"
                ? "Press Send to transmit your message."
                : "Sending is available when the connection is ready."}
            </span>

            <button
              type="submit"
              className={styles.sendButton}
              disabled={status !== "ready" || !input.trim()}
            >
              Send message
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
