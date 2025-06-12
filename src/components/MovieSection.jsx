import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./MovieSection.css";
import MovieCard from "./MovieCard";

function MovieSection({ title }) {
  const isNowPlaying = title.toLowerCase() === "now playing";
  const [activeIndex, setActiveIndex] = useState(0);
  const [movies, setMovies] = useState([]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

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
        }));
        setMovies(mapped);
      });
  }, []);

  return (
    <section className="movie-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>

      {isNowPlaying ? (
        <div className="carousel-wrapper">
          <Swiper
            modules={[Navigation, Autoplay]}
            loop={movies.length > 7}
            slidesPerView={Math.min(7, movies.length)}
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            className="movie-carousel"
            breakpoints={{
              0: { slidesPerView: 2 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
              1200: { slidesPerView: 5 },
              1400: { slidesPerView: 6 },
              1600: { slidesPerView: 7 },
            }}
          >
            {movies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <MovieCard movie={movie} />
              </SwiperSlide>
            ))}
            <div ref={prevRef} className="custom-swiper-button-prev">
              <div className="swiper-button-prev" />
            </div>
            <div ref={nextRef} className="custom-swiper-button-next">
              <div className="swiper-button-next" />
            </div>
          </Swiper>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default MovieSection;
