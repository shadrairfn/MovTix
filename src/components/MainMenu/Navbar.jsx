import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <div className="logo-container">
          <div className="logo-square">MT</div>
        </div>
        <span className="logo-text">MovieTix</span>
      </div>
      <div className="navbar-right">
        <button
          className="lihat-tiket-btn"
          onClick={() => navigate("/lihattiket")}
        >
          Lihat Tiket
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
