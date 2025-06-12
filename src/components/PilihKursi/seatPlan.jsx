import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import generateRandomOccupiedSeats from "./GenerateRandomOccupiedSeats";
import SeatSelector from "./SeatSelector";
import SeatShowcase from "./SeatShowcase";
import "./seatPlan.css";

const DEFAULT_SEAT_COUNT = 64;

function SeatPlan({ movie }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [recommendedSeat, setRecommendedSeat] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [movieSession, setMovieSession] = useState(null);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    const storedMovieSession = JSON.parse(localStorage.getItem("movieSession"));
    if (storedMovieSession) {
      setMovieSession(storedMovieSession);
    }
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.userName);
      setUserId(storedUser.userId);
    }
  }, [movie, location]);

  const seatCount = DEFAULT_SEAT_COUNT;

  const occupiedSeats = useMemo(
    () => generateRandomOccupiedSeats(0, 0, seatCount),
    [seatCount]
  );

  const filteredAvailableSeats = useMemo(
    () =>
      Array.from({ length: seatCount }, (_, i) => i).filter(
        (seat) => !occupiedSeats.includes(seat)
      ),
    [seatCount, occupiedSeats]
  );

  useEffect(() => {
    if (filteredAvailableSeats.length === 0) {
      setRecommendedSeat([]);
      return;
    }
    let cols = 8;
    let rows = Math.ceil(seatCount / cols);
    const midRow = Math.floor(rows / 2);
    const startIdx = midRow * cols + Math.floor((cols - 4) / 2);
    const recommended = [];
    for (let i = 0; i < 4; i++) {
      const seatNum = startIdx + i;
      if (
        seatNum < seatCount &&
        !occupiedSeats.includes(seatNum) &&
        filteredAvailableSeats.includes(seatNum)
      ) {
        recommended.push(seatNum);
      }
    }
    setRecommendedSeat(recommended);
  }, [filteredAvailableSeats, occupiedSeats, seatCount]);

  let selectedSeatText = "";
  if (selectedSeats.length > 0) {
    selectedSeatText = selectedSeats.map((seat) => seat + 1).join(", ");
  }

  const seatPrice =
    movieSession && movieSession.price ? movieSession.price : 40000;
  let totalPrice = selectedSeats.length * seatPrice;

  const handleButtonClick = (e) => {
    e.preventDefault();

    // Simpan data order ke localStorage
    const orderData = {
      movieId: movie.id,
      movieTitle: movie.title,
      seat: selectedSeats,
      price: seatPrice,
      total: totalPrice,
      cinemaName: movieSession?.cinemaName,
      time: movieSession?.time,
      date: movieSession?.date,
      poster: movie.poster,
      umur: movie.umur,
      userName,
      userId,
    };

    console.log("Order data:", orderData);
    localStorage.setItem("pendingOrder", JSON.stringify(orderData));

    navigate(`/movie/${movie.id}/payment`);
  };

  function handleSelectedSeatsChange(newSelected) {
    if (newSelected.length > 4) {
      setAlertMsg("You can only select up to 4 seats!");
      setTimeout(() => setAlertMsg(""), 2000);
      return;
    }
    setAlertMsg("");
    setSelectedSeats(newSelected);
  }

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: "100%" }}>
        <h2
          className="choose-title mb-8 text-2xl font-semibold"
          style={{ textAlign: "center", width: "100%" }}
        >
          Choose your seats by clicking on the available seats
        </h2>
        {movieSession && (
          <div
            className="session-time"
            style={{ textAlign: "center", width: "100%", marginBottom: 8 }}
          >
            <strong className="session-movie-title">{movie.title}</strong>{" "}
            <br />
            <strong className="session-cinema-name">
              {movieSession.cinemaName}
            </strong>
            {" — "}
            <span className="session-price">
              Rp.{seatPrice.toLocaleString("id-ID")}
            </span>{" "}
            <br />
            <span className="session-time-label">
              Show Time: {movieSession.time}
            </span>
            <br />
          </div>
        )}
      </div>

      <div className="CinemaPlan">
        <SeatSelector
          movie={{ ...movie, occupied: occupiedSeats, seatCount }}
          selectedSeats={selectedSeats}
          recommendedSeat={recommendedSeat}
          onSelectedSeatsChange={handleSelectedSeatsChange}
          onRecommendedSeatChange={setRecommendedSeat}
        />
        <div style={{ margin: "24px 16px 16px 16px" }}>
          <SeatShowcase />
        </div>

        <p className="info mb-2 text-sm md:text-sm lg:text-base">
          You have selected{" "}
          <span className="count font-semibold">{selectedSeats.length}</span>{" "}
          seat{selectedSeats.length !== 1 ? "s" : ""}
          {selectedSeats.length === 0 ? "" : ":"}{" "}
          {selectedSeatText ? (
            <span className="selected-seats font-semibold">
              {" "}
              {selectedSeatText}
            </span>
          ) : (
            <span></span>
          )}{" "}
          {selectedSeats.length > 0 && (
            <>
              for the price of{" "}
              <span className="total font-semibold">
                Rp.{totalPrice.toLocaleString("id-ID")}
              </span>
            </>
          )}
        </p>

        {alertMsg && <div className="alert-max-seat">{alertMsg}</div>}

        <div style={{ textAlign: "center" }}>
          <button
            className={`buy-btn${
              selectedSeats.length === 0 ? " disabled" : ""
            }`}
            onClick={handleButtonClick}
            disabled={selectedSeats.length === 0}
          >
            Buy at Rp.{totalPrice.toLocaleString("id-ID")}
          </button>
        </div>

        {!selectedSeats.length && (
          <div>
            <p className="info text-sm md:text-sm lg:text-base">
              Please select a seat
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatPlan;
