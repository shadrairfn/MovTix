import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Navbar from "./components/MainMenu/Navbar";
import Hero from "./components/MainMenu/Hero";
import MovieSection from "./components/MainMenu/MovieSection";
import MovieDetail from "./components/DetailFilm/MovieDetail";
import SeatPlan from "./components/PilihKursi/seatPlan";
import PaymentPage from "./components/BeliTiket/PaymentPage";
import ConfirmationPage from "./components/BeliTiket/confirmationPage";
import LihatTiket from "./components/LihatTiket/LihatTiket";
import { useEffect, useState } from "react";

function SeatPlanWrapper() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/film")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((film) => film.idFilm === id);
        if (found) {
          setMovie({
            id: found.idFilm,
            title: found.judul,
            genre: found.genre,
            duration: found.durasi,
            description: found.deskripsi,
            releaseDate: found.tanggalRilis,
            poster: found.poster,
            batasUmur: found.batasUmur,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data film:", err);
        setLoading(false);
      });
  }, [id]);

  if (!id) return <div>Invalid movie ID</div>;
  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  return <SeatPlan movie={movie} />;
}

function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (e) {
    return <div style={{ color: "red" }}>Error: {e.message}</div>;
  }
}

function HomePage() {
  const [movies, setMovies] = useState([]);

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
          poster: film.poster,
          umur: film.batasUmur,
          dimensi: film.dimensi,
        }));
        setMovies(mapped);
      })
      .catch((err) => {
        console.error("Gagal fetch movies:", err);
      });
  }, []);

  return (
    <>
      <Hero />
      <MovieSection title="Now Playing" movies={movies} />
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <main>
                <HomePage />
              </main>
            </ErrorBoundary>
          }
        />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route
          path="/movie/:id/selectSeat"
          element={<SeatPlanWrapper key={window.location.pathname} />}
        />
        <Route path="/movie/:id/payment" element={<PaymentPage />} />
        <Route path="/movie/:id/orderSummary" element={<ConfirmationPage />} />
        <Route path="/lihattiket" element={<LihatTiket />} />
      </Routes>
    </Router>
  );
}

export default App;
