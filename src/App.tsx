
import { Outlet, Link } from "react-router";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="appHeader">
        <Link to="/login" className="brand">
          <span className="brandMark">i</span>
          <span className="brandName">IDICorp</span>
          <span className="brandDivider" />
          <span className="brandProduct">Service Console</span>
        </Link>

        <div className="headerStatus">
          <span className="statusDot" />
          Service Portal
        </div>
      </header>

      <main className="appMain">
        <Outlet />
      </main>

      <footer className="appFooter">
        <span>© IDICorp · Service Console</span>
        <span>Secure access portal</span>
      </footer>
    </div>
  );
}

export default App;
