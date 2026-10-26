
import { useState, type FormEvent } from "react";
import styles from "./LoginForm.module.css";

interface LoginFormProps {
  captchaImage: string;
  isLoading: boolean;
  error: string;
  onSubmit: (data: {
    username: string;
    password: string;
    captchaAnswer: string;
  }) => void;
  onRefreshCaptcha?: () => void;
}

export default function LoginForm({
  captchaImage,
  isLoading,
  error,
  onSubmit,
  onRefreshCaptcha,
}: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      username: username.trim(),
      password,
      captchaAnswer: captchaAnswer.trim(),
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          Enter your credentials to access the service console.
        </p>
      </div>

      <div className={styles.field}>
        <label htmlFor="username" className={styles.label}>
          Username
        </label>
        <input
          id="username"
          name="username"
          className={styles.input}
          type="text"
          autoComplete="username"
          placeholder="Enter your username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          className={styles.input}
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="captcha" className={styles.label}>
          CAPTCHA
        </label>

        <div className={styles.captchaBox}>
          {captchaImage ? (
            <img
              className={styles.captchaImage}
              src={captchaImage}
              alt="CAPTCHA challenge"
            />
          ) : (
            <span className={styles.captchaPlaceholder}>
              CAPTCHA unavailable
            </span>
          )}

          {onRefreshCaptcha && (
            <button
              className={styles.refreshButton}
              type="button"
              onClick={onRefreshCaptcha}
              disabled={isLoading}
              aria-label="Refresh CAPTCHA"
            >
              Refresh
            </button>
          )}
        </div>

        <input
          id="captcha"
          name="captcha"
          className={styles.input}
          type="text"
          autoComplete="off"
          placeholder="Enter the CAPTCHA text"
          value={captchaAnswer}
          onChange={(event) => setCaptchaAnswer(event.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button
        className={styles.submitButton}
        type="submit"
        disabled={isLoading || !captchaImage}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
