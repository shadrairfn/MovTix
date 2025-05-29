import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieSection from "./components/MovieSection";
import MovieDetail from "./components/MovieDetail";
import movies from "./data/movies";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <MovieSection title="Now Playing" movies={movies} />
            </main>
          }
        />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
