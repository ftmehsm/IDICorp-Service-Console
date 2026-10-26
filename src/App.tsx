
import LoginPage from "./pages/LoginPage";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="appHeader">
        <a className="brand" href="/" aria-label="IDICorp home">
          <span className="brandMark">I</span>
          <span className="brandName">IDICorp</span>
          <span className="brandDivider" />
          <span className="brandProduct">Service Console</span>
        </a>

        <span className="headerStatus">
          <span className="statusDot" />
          Service Portal
        </span>
      </header>

      <main className="appMain">
        <section className="loginLayout">
          <div className="loginIntro">
            <span className="eyebrow">INTERNAL SERVICE PLATFORM</span>

            <h1 className="introTitle">
              One place for
              <br />
              your <span>service tasks.</span>
            </h1>

            <p className="introDescription">
              Sign in to manage tasks and access the IDICorp service tools.
            </p>

            <div className="featureList">
              <div className="featureItem">
                <span className="featureIcon" aria-hidden="true">
                  ✓
                </span>
                <span>Manage and track tasks</span>
              </div>

              <div className="featureItem">
                <span className="featureIcon" aria-hidden="true">
                  ✓
                </span>
                <span>Access service utilities</span>
              </div>

              <div className="featureItem">
                <span className="featureIcon" aria-hidden="true">
                  ✓
                </span>
                <span>Work through a secure session</span>
              </div>
            </div>
          </div>

          <div className="loginCard">
            <LoginPage />
          </div>
        </section>
      </main>

      <footer className="appFooter">
        <span>IDICorp Service Console</span>
        <span>Internal access only</span>
      </footer>
    </div>
  );
}
