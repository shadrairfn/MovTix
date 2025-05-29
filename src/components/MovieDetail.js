import { useParams } from "react-router-dom";
import movies from "../data/movies";
import "./MovieDetail.css"; // Buat file ini nanti

function MovieDetail() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === parseInt(id));

  if (!movie) {
    return <div style={{ padding: "2rem" }}>Film tidak ditemukan</div>;
  }

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-header">
        <img src={movie.poster} alt={movie.title} className="movie-detail-poster" />
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <p className="movie-duration"><span>🎬</span> 118 Minutes</p>
          <div className="movie-tags">
            <span className="tag">2D</span>
            <span className="tag">R13+</span>
          </div>
        </div>
      </div>

      <div className="movie-showtimes">
        <div className="cinema-card">
          <div className="cinema-header">
            <h4>TSM MALL XXI</h4>
            <span>14/04/2025</span>
            <span className="price">Rp. 40.000</span>
          </div>
          <div className="showtime-buttons">
            {["15:40", "17:50", "18:20", "19:35", "20:10"].map((time) => (
              <button key={time}>{time}</button>
            ))}
          </div>
        </div>

        <div className="cinema-card">
          <div className="cinema-header">
            <h4>SUMMARECON MALL BANDUNG XXI</h4>
            <span>14/04/2025</span>
            <span className="price">Rp. 45.000</span>
          </div>
          <div className="showtime-buttons">
            {["13:20", "13:50", "18:05"].map((time) => (
              <button key={time}>{time}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
