import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/ui/login_page";
import Dashboard from "./components/ui/dashboard";

const App: React.FC = () => {
  const token = sessionStorage.getItem("token");
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    sessionStorage.removeItem("token");
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
