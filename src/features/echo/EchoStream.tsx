import { useState } from "react";
import { sendStreamEcho } from "./echoStreamService";
import styles from "./EchoStream.module.css";

export default function EchoStream() {
  const [content, setContent] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Please enter some content.");
      setResponse(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      await sendStreamEcho(content, (chunk) => {
        setResponse((current) => (current ?? "") + chunk);
      });
    } catch (err: unknown) {
      setResponse(null);

      if (err instanceof Error && err.message.includes("401")) {
        setError("Authentication failed. Please sign in again.");
      } else {
        setError(
          "Could not send content. Check your connection and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.container} aria-labelledby="stream-echo-title">
      <h2 id="stream-echo-title">Streaming Echo</h2>
      <p>
        Send content to the streaming echo service and view the returned
        content.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="stream-echo-content">Content</label>
        <textarea
          id="stream-echo-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Enter content to send..."
          rows={5}
          disabled={loading}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "stream-echo-error" : undefined}
        />

        {error && (
          <p id="stream-echo-error" role="alert" className={styles.error}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading || !content}>
          {loading ? "Sending..." : "Send content"}
        </button>
      </form>

      {response !== null && (
        <div className={styles.response} aria-live="polite">
          <h3>Returned content</h3>
          <pre>{response}</pre>
        </div>
      )}
    </section>
  );
}
