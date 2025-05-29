import "./Hero.css";
import movies from "../data/movies"; // sesuaikan path jika perlu
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

function Hero() {
  const navigate = useNavigate();

  // Ambil movie secara acak hanya 1x render
  const randomMovie = useMemo(() => {
    return movies[Math.floor(Math.random() * movies.length)];
  }, []);

  return (
    <div
      className="hero-container"
      style={{
        backgroundImage: `url(${randomMovie.poster})`,
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">{randomMovie.title}</h1>
        <p className="hero-description">
          {randomMovie.sinopsis.split(".")[0] + "."}
        </p>
        <div className="hero-buttons">
          <button
            className="get-tickets-button"
            onClick={() => navigate(`/movie/${randomMovie.id}`)}
          >
            Get Tickets
          </button>
          <button className="watch-trailer-button">Watch Trailer</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
