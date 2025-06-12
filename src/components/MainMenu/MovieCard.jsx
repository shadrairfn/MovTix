import "./MovieCard.css";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleGetTickets = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card">
      <div className="movie-poster" onClick={handleGetTickets}>
        <img src={movie.poster} alt={movie.title} />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        {movie.rating && (
          <div className="movie-rating">
            <span className="star-icon">★</span>
            <span>{movie.rating}</span>
          </div>
        )}
      </div>
      <button className="card-get-tickets" onClick={handleGetTickets}>
        Get Tickets
      </button>
    </div>
  );
}

export default MovieCard;
