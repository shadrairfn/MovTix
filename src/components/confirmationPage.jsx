import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./confirmationPage.css";

function ConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [bookingCode, setBookingCode] = useState("");

  useEffect(() => {
    const savedOrder = localStorage.getItem("pendingOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }

    const savedBookingCode = localStorage.getItem("bookingCode");
    if (savedBookingCode) {
      setBookingCode(savedBookingCode);
    } else {
      const newCode = generateBookingCode();
      setBookingCode(newCode);
      localStorage.setItem("bookingCode", newCode);
    }
  }, []);

  const generateBookingCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleBackToHome = () => {
    localStorage.removeItem("pendingOrder");
    localStorage.removeItem("bookingCode");
    navigate("/");
  };

  if (!order)
    return <div style={{ padding: "2rem" }}>Loading confirmation...</div>;

  return (
    <div className="confirmation-container">
      <div className="header">Booking Summary</div>

      <div className="ticket-summary">
        {order.poster && (
          <img src={order.poster} alt="Poster" className="poster" />
        )}

        <div className="movie-info">
          <div className="title-row">
            <h3>{order.movieTitle || "Movie Title Not Found"}</h3>
            <span className="label">{order.umur || "N/A"}</span>
          </div>
          <p className="cinema">{order.cinemaName || "-"}</p>
          <p className="datetime">
            {order.date || "-"}, {order.time || "-"}
          </p>

          <p>Selected Seat(s):</p>
          <div className="seat-grid">
            {order.seat?.length > 0 ? (
              order.seat.map((seat) => (
                <div key={seat} className="seat-box">
                  {seat + 1}
                </div>
              ))
            ) : (
              <span>No Seats Selected</span>
            )}
          </div>
        </div>
      </div>

      <div className="booking-code">
        <p>Booking Code:</p>
        <h2>{bookingCode}</h2>
      </div>

      <button className="back-button" onClick={handleBackToHome}>
        Back to Home
      </button>
    </div>
  );
}

export default ConfirmationPage;
