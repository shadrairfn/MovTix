import "./MovieCard.css"

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />
        {movie.comingSoon && <div className="coming-soon-badge">Coming Soon</div>}
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        {movie.rating && (
          <div className="movie-rating">
            <span className="star-icon">★</span>
            <span>{movie.rating}</span>
          </div>
        )}
        {movie.year && <span className="movie-year">{movie.year}</span>}
        {movie.month && <span className="movie-month">{movie.month}</span>}
      </div>
      {!movie.comingSoon && <button className="card-get-tickets">Get Tickets</button>}
    </div>
  )
}

export default MovieCard