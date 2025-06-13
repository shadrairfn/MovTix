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
          umur: film.batasUmur,
        }));

        const found = mapped.find((m) => m.id === id);
        setMovie(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch movie:", err);
        setLoading(false);
      });

    // Fetch bioskop & jadwal
    fetch("http://localhost:8080/bioskop")
      .then((res) => res.json())
      .then(async (data) => {
        const cinemaWithSchedules = await Promise.all(
          data.map(async (cinema) => {
            console.log("bioskop:", cinema);
            try {
              const res = await fetch(
                `http://localhost:8080/jadwal/film/${id}/bioskop/${cinema.idBioskop}`
              );
              const scheduleData = await res.json();

              if (scheduleData.length === 0) {
                return null;
              }

              const tanggal = new Date(scheduleData[0].waktu)
                .toISOString()
                .split("T")[0];

              return {
                bioskopId: cinema.idBioskop,
                nama: cinema.namaBioskop,
                lokasi: cinema.lokasi,
                tanggal,
                harga: scheduleData[0].harga,
                seatCount: scheduleData[0].totalKursi,
                times: scheduleData.map((s) => ({
                  time: new Date(s.waktu).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  jadwalId: s.idJadwal,
                })),
              };
            } catch (error) {
              console.error(
                "Gagal fetch jadwal untuk bioskop",
                cinema.idBioskop,
                error
              );
              return null;
            }
          })
        );

        setCinemas(cinemaWithSchedules.filter((c) => c !== null));
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

  const handleShowtimeClick = (cinema, time, jadwalId) => {
    console.log("cinema klik:", cinema);
    console.log("cinema.bioskopId:", cinema.bioskopId); // ✅ diperbaiki

    localStorage.setItem(
      "movieSession",
      JSON.stringify({
        jadwalId,
        cinemaId: cinema.bioskopId,
        cinemaName: cinema.nama,
        date: cinema.tanggal,
        time,
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
          <div className="cinema-card" key={cinema.bioskopId}>
            {" "}
            {/* ✅ key diganti */}
            <div className="cinema-header">
              <div>
                <h4>
                  {cinema.nama} {cinema.lokasi}
                </h4>
                <span className="cinema-date">{cinema.tanggal}</span>
              </div>
              <span className="price">
                Rp. {cinema.harga.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="showtime-buttons">
              {cinema.times.map(({ time, jadwalId }) => (
                <button
                  key={jadwalId}
                  onClick={() => handleShowtimeClick(cinema, time, jadwalId)}
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
