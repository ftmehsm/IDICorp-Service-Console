
import { useCallback, useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import { getCaptcha, login } from "../api/auth";

export default function LoginPage() {
  const [captcha, setCaptcha] = useState({
    captcha: "",
    salt: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshCaptcha = useCallback(async () => {
    setIsCaptchaLoading(true);
    setError("");

    try {
      const result = await getCaptcha();
      setCaptcha(result);
    } catch {
      setError("Unable to load CAPTCHA. Please try again.");
    } finally {
      setIsCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCaptcha();
  }, [refreshCaptcha]);

  async function handleLogin(data: {
    username: string;
    password: string;
    captchaAnswer: string;
  }) {
    setIsLoading(true);
    setError("");

    try {
      const result = await login({
        username: data.username,
        password: data.password,
        salt: captcha.salt,
        captcha_answer: data.captchaAnswer,
      });

      // Temporary: verify successful response.
      console.log("Login successful", result);
    } catch {
      setError("Login failed. Check your credentials and CAPTCHA.");
      await refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <LoginForm
        captchaImage={captcha.captcha}
        isLoading={isLoading || isCaptchaLoading}
        error={error}
        onSubmit={handleLogin}
        onRefreshCaptcha={refreshCaptcha}
      />
    </main>
  );
}
