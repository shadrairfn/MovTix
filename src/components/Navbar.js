import "./Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-container">
          <div className="logo-square">MT</div>
        </div>
        <span className="logo-text">MovieTix</span>
      </div>

      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search movies..." />
        <button className="search-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <div className="navbar-actions">
        <button className="sign-in-button">Sign in</button>
        <button className="get-tickets-button">Get Tickets</button>
      </div>
    </nav>
  )
}

export default Navbar
