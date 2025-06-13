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
        <span className="age-label">{movie.batasUmur}</span>
        <img src={`data:image/jpeg;base64,${movie.poster}`} alt={movie.title} />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
      </div>
      <button className="card-get-tickets" onClick={handleGetTickets}>
        Get Tickets
      </button>
    </div>
  );
}

export default MovieCard;
