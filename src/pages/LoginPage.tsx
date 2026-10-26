
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LoginForm from "../components/LoginForm";
import { getCaptcha, login } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const [captcha, setCaptcha] = useState({
    captcha: "",
    salt: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

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
      const response = await login({
        username: data.username,
        password: data.password,
        salt: captcha.salt,
        captcha_answer: data.captchaAnswer,
      });

      sessionStorage.setItem("access_token", response.access_token);


      loginSuccess();
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Login failed. Check your credentials and CAPTCHA.");
      await refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="loginLayout">
      <div className="loginIntro">
        <span className="eyebrow">IDICORP SERVICE CONSOLE</span>

        <h1 className="introTitle">
          Your workspace,
          <br />
          <span>under control.</span>
        </h1>

        <p className="introDescription">
          Sign in to access your service console and manage your tasks
          through one secure workspace.
        </p>

        <div className="featureList">
          <div className="featureItem">
            <span className="featureIcon" aria-hidden="true">✓</span>
            Secure authentication
          </div>
          <div className="featureItem">
            <span className="featureIcon" aria-hidden="true">✓</span>
            Task management in one place
          </div>
          <div className="featureItem">
            <span className="featureIcon" aria-hidden="true">✓</span>
            Real-time service tools
          </div>
        </div>
      </div>

      <div className="loginCard">
        <LoginForm
          captchaImage={captcha.captcha}
          isLoading={isLoading || isCaptchaLoading}
          error={error}
          onSubmit={handleLogin}
          onRefreshCaptcha={refreshCaptcha}
        />
      </div>
    </section>
  );
}
