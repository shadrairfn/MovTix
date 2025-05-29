import MovieCard from "./MovieCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./MovieSection.css";

function MovieSection({ title, movies, viewAllLink }) {
  const isNowPlaying = title.toLowerCase() === "now playing";
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <section className="movie-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>

      {isNowPlaying ? (
        <div className="carousel-wrapper">
          <Swiper
            modules={[Navigation, Autoplay]}
            loop={true}
            slidesPerView={7}
            speed={800}
            navigation={{
              prevEl: ".custom-swiper-button-prev",
              nextEl: ".custom-swiper-button-next",
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            loopFillGroupWithBlank={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="movie-carousel"
          >
            {movies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <MovieCard movie={movie} />
              </SwiperSlide>
            ))}
            <div
              className={`custom-swiper-button-prev ${
                activeIndex === 0 ? "hidden" : ""
              }`}
            >
              <div className="swiper-button-prev" />
            </div>

            <div className="custom-swiper-button-next">
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
