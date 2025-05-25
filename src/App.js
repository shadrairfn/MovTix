import "./App.css"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import MovieSection from "./components/MovieSection"

function App() {
  const nowPlayingMovies = [
    { id: 1, title: "A Minecraft Movie", poster: "/card/mcmovie.jpeg", rating: 4.5, year: 2023, month: "April" },
    { id: 2, title: "F1", poster: "/card/f1.jpeg",rating: 4.2, year: 2023 },
    { id: 3, title: "Superman", poster: "/card/superman.jpeg", rating: 4.4, year: 2023 },
    { id: 4, title: "Jumbo", poster: "/card/jumbo.jpeg", rating: 3.9, year: 2023 },
    { id: 5, title: "The Godfather", poster: "/card/godfather.jpeg", rating: 4.8, year: 1972 },
    { id: 6, title: "Joker", poster: "/card/joker.jpeg", rating: 4.8, year: 1972 },
    { id: 7, title: "Jokar", poster: "/card/joker.jpeg", rating: 4.8, year: 1972 },
    { id: 8, title: "Jokur", poster: "/card/joker.jpeg", rating: 4.8, year: 1972 },
    { id: 9, title: "Jokir", poster: "/card/joker.jpeg", rating: 4.8, year: 1972 },
    { id: 10, title: "Jokor", poster: "/card/joker.jpeg", rating: 4.8, year: 1972 },
  ]

  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <MovieSection title="Now Playing" movies={nowPlayingMovies} viewAllLink="#" />
      </main>
    </div>
  )
}

export default App
