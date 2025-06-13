import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./confirmationPage.css";

function ConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const [movie, setMovie] = useState(null);
  const [bookingCode, setBookingCode] = useState("");

  useEffect(() => {
    // Ambil data dari localStorage
    const savedOrder = JSON.parse(localStorage.getItem("pendingOrder") || "{}");
    setOrder(savedOrder);

    // Ambil kode booking dari localStorage atau buat baru jika belum ada
    const savedBookingCode = localStorage.getItem("bookingCode");
    if (savedBookingCode) {
      setBookingCode(savedBookingCode);
    } else {
      const newCode = generateBookingCode();
      setBookingCode(newCode);
      localStorage.setItem("bookingCode", newCode);
    }

    // Ambil data film dari backend
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:8080/film/${id}`);
        const data = await res.json();

        // Tambahkan properti poster ke objek movie
        const movieWithPoster = {
          ...data,
          poster: `http://localhost:8080/film/${data.idFilm}/poster`,
          umur: data.batasUmur,
        };

        setMovie(movieWithPoster);
      } catch (err) {
        console.error("Failed to fetch movie:", err);
      }
    };

    fetchMovie();
  }, [id]);

  const generateBookingCode = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const confirmBooking = async () => {
    const bookingData = {
      film: { idFilm: movie.idFilm }, // ID film
      bioskop: { idBioskop: order.bioskopId }, // ID bioskop
      jadwal: { idJadwal: order.jadwalId }, // ID jadwal
      kursi: { idKursi: order.seat[0] }, // ID kursi (ambil kursi pertama untuk contoh)
    };

    console.log("Data yang dikirim ke backend:", bookingData);

    try {
      const response = await fetch("http://localhost:8080/transaksi/buat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const result = await response.text();
      alert(result); // Tampilkan pesan sukses dari backend
      localStorage.removeItem("pendingOrder");
      localStorage.removeItem("bookingCode");
      navigate("/");
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  if (!movie || !order) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  return (
    <div className="confirmation-container">
      <div className="header">Booking Summary</div>
      <div className="ticket-summary">
        <img src={movie.poster} alt={movie.judul} className="poster" />
        <div className="movie-info">
          <div className="title-row">
            <h3>{movie.judul || "Movie Title Not Found"}</h3>
            <span className="label">{movie.umur || "N/A"}</span>
          </div>
          <p className="cinema">{order.cinemaName || "Cinema Not Found"}</p>
          <p className="datetime">
            {order.date || "Date Not Found"}, {order.time || "Time Not Found"}
          </p>
          <p>Selected Seat(s):</p>
          <div className="seat-grid">
            {order.seat && order.seat.length > 0
              ? order.seat.map((seat) => (
                  <div key={seat} className="seat-box">
                    {seat + 1}
                  </div>
                ))
              : "No Seats Selected"}
          </div>
        </div>
      </div>
      <div className="booking-code">
        <p>Booking QR Code:</p>
        <div className="qr-code-container">
          <img src="/QRTicket.jpg" alt="QR Code" className="qr-code-image" />
        </div>
      </div>
      <button className="confirm-button" onClick={confirmBooking}>
        Confirm Booking
      </button>
      <button
        className="back-button"
        onClick={() => {
          localStorage.removeItem("pendingOrder");
          localStorage.removeItem("bookingCode");
          navigate("/");
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default ConfirmationPage;
