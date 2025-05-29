import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-container">
          <div className="logo-square" onClick={() => navigate("/")}>
            MT
          </div>
        </div>
        <span className="logo-text" onClick={() => navigate("/")}>
          MovieTix
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
