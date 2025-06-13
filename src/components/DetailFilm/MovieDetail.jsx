import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./MovieDetail.css";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [showFull, setShowFull] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch movie
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
          dimensi: film.dimensi,
          umur: film.batas_umur,
        }));

        const found = mapped.find((m) => m.id === id);
        setMovie(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch movie:", err);
        setLoading(false);
      });

    // Fetch bioskop
    fetch("http://localhost:8080/bioskop")
      .then((res) => res.json())
      .then((data) => {
        const mappedCinemas = data.map((cinema) => ({
          id_cinemas: cinema.idBioskop,
          nama: cinema.namaBioskop,
          lokasi: cinema.lokasi,
          tanggal: "2025-06-10", // sementara default
          harga: 50000, // sementara default
          seatCount: 100, // sementara default
          times: ["13:00", "15:30", "18:00"], // sementara default
        }));
        setCinemas(mappedCinemas);
      })
      .catch((err) => {
        console.error("Gagal fetch bioskop:", err);
      });
  }, [id]);

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!movie)
    return <div style={{ padding: "2rem" }}>Film tidak ditemukan</div>;

  const sentences = movie.description.split(".");
  const preview = sentences[0] + (sentences.length > 1 ? "." : "");
  const full = movie.description;

  const handleShowtimeClick = (cinema, time) => {
    localStorage.setItem(
      "movieSession",
      JSON.stringify({
        cinemaId: cinema.id_cinemas,
        cinemaName: cinema.nama,
        date: cinema.tanggal,
        time: time,
        price: cinema.harga,
        seatCount: cinema.seatCount,
      })
    );
    navigate(`/movie/${movie.id}/selectSeat`);
  };

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-header">
        <img
          src={movie.poster}
          alt={movie.title}
          className="movie-detail-poster"
        />
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <p className="movie-sinopsis">
            {showFull ? full : preview}
            {sentences.length > 2 && (
              <span
                className="toggle-sinopsis"
                onClick={() => setShowFull(!showFull)}
              >
                {showFull ? "Sembunyikan" : "Baca selengkapnya"}
              </span>
            )}
          </p>
          <p className="movie-duration">
            <span>🎬</span> {movie.duration} Minutes
          </p>
          <div className="movie-tags">
            <span className="tag">{movie.dimensi}</span>
            <span className="tag">{movie.umur}</span>
          </div>
        </div>
      </div>

      <div className="movie-showtimes">
        {cinemas.map((cinema) => (
          <div className="cinema-card" key={cinema.id_cinemas}>
            <div className="cinema-header">
              <div>
                <h4>
                  {cinema.nama} {cinema.lokasi}{" "}
                </h4>
                <span className="cinema-date">{cinema.tanggal}</span>
              </div>
              <span className="price">
                Rp. {cinema.harga.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="showtime-buttons">
              {cinema.times.map((time) => (
                <button
                  key={time}
                  onClick={() => handleShowtimeClick(cinema, time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieDetail;
