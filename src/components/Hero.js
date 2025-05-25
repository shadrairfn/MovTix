import "./Hero.css"

function Hero() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Superman</h1>
        <p className="hero-description">
          The Man of Steel returns in this epic new adventure. Watch as Superman faces his greatest challenge yet.
        </p>
        <div className="hero-buttons">
          <button className="get-tickets-button">Get Tickets</button>
          <button className="watch-trailer-button">Watch Trailer</button>
        </div>
      </div>
    </div>
  )
}

export default Hero
