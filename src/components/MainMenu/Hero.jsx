import "./Hero.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function Hero() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data film dari backend
  useEffect(() => {
    fetch("http://localhost:8080/film")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((film) => ({
          id: film.idFilm,
          title: film.judul,
          genre: film.genre,
          duration: film.durasi,
          description: film.deskripsi,
          releaseDate: film.tanggalRilis,
          poster: `http://localhost:8080/film/${film.idFilm}/poster`,
        }));
        setMovies(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch film:", err);
        setLoading(false);
      });
  }, []);

  // Pilih film acak
  const randomMovie = useMemo(() => {
    if (movies.length === 0) return null;
    return movies[Math.floor(Math.random() * movies.length)];
  }, [movies]);

  if (loading || !randomMovie) return null;

  return (
    <div
      className="hero-container"
      style={{ backgroundImage: `url(${randomMovie.poster})` }}
    >
      <div className="hero-content">
        <h1 className="hero-title">{randomMovie.title}</h1>
        <p className="hero-description">
          {randomMovie.description.split(".")[0] + "."}
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
