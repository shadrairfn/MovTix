import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./confirmationPage.css"; // Pastikan path CSS sudah benar

function ConfirmationPage() {
  const { id } = useParams(); // idFilm dari URL
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const [movie, setMovie] = useState(null);
  const [bookingCode, setBookingCode] = useState("");

  useEffect(() => {
    // Ambil data order dari localStorage
    const savedOrder = JSON.parse(localStorage.getItem("pendingOrder") || "{}");
    setOrder(savedOrder);

    // Ambil atau buat booking code
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

        const movieWithPoster = {
          ...data,
          poster: `http://localhost:8080/film/${data.idFilm}/poster`,
          umur: data.batasUmur,
        };

        setMovie(movieWithPoster);
      } catch (err) {
        console.error("Gagal mengambil data film:", err);
        // Handle error, mungkin arahkan kembali atau tampilkan pesan kepada pengguna
        alert("Gagal memuat detail film. Silakan coba lagi.");
        navigate("/");
      }
    };

    fetchMovie();
  }, [id, navigate]); // Tambahkan navigate ke dependency array

  // Generate kode booking 4 digit acak
  const generateBookingCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const confirmBooking = async () => {
    console.log("=== DEBUG DATA BOOKING ===");
    console.log("movie:", movie);
    console.log("order:", order);
    // Debugging bioskopId, sekarang diambil dari objek movie
    console.log("bioskopId (from movie):", movie?.bioskop?.idBioskop);
    console.log("jadwalId:", order.jadwalId);
    console.log("seat:", order.seat);
    console.log("seat[0]:", order.seat && order.seat[0]);
    console.log("total (from order):", order.total); // Debugging property 'total'

    // Validasi data sebelum mengirim permintaan
    if (
      !movie ||
      !movie.idFilm || // Pastikan idFilm ada di movie
      !movie.bioskop || // Pastikan properti bioskop ada di movie
      !movie.bioskop.idBioskop || // Pastikan idBioskop ada di dalam bioskop
      !order ||
      !order.jadwalId ||
      !order.seat ||
      order.seat.length === 0 || // Pastikan array seat tidak kosong
      !order.total // Menggunakan order.total, bukan order.totalHarga
    ) {
      // Ganti alert dengan pesan yang lebih informatif atau modal kustom
      alert(
        "Data booking tidak lengkap. Pastikan semua data tersedia. Debug info: " +
          `Movie: ${!!movie}, Movie ID: ${!!movie?.idFilm}, Bioskop: ${!!movie?.bioskop}, Bioskop ID: ${!!movie
            ?.bioskop?.idBioskop}, ` +
          `Order: ${!!order}, Jadwal ID: ${!!order?.jadwalId}, Seat: ${
            !!order?.seat && order?.seat?.length > 0
          }, Total: ${!!order?.total}`
      ); // Menggunakan order.total di debug info
      return;
    }

    const bookingData = {
      film: { idFilm: movie.idFilm },
      bioskop: { idBioskop: movie.bioskop.idBioskop }, // Mengambil idBioskop dari objek movie
      jadwal: { idJadwal: order.jadwalId },
      // Mengirimkan semua kursi yang dipilih, bukan hanya yang pertama
      kursi: order.seat.map((seatId) => ({ idKursi: seatId })),
      totalHarga: order.total, // Menggunakan order.total, bukan order.totalHarga
    };

    console.log("Sending bookingData:", bookingData); // Debugging data yang dikirim

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
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`
        );
      }

      const result = await response.text();
      alert(result); // Ganti alert dengan modal konfirmasi yang lebih baik
      localStorage.removeItem("pendingOrder");
      localStorage.removeItem("bookingCode");
      navigate("/");
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Gagal mengkonfirmasi booking. Silakan coba lagi."); // Ganti alert
    }
  };

  // Tampilkan loading state jika data belum sepenuhnya dimuat
  if (!movie || !order || (Object.keys(order).length === 0 && !bookingCode)) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading booking summary...
      </div>
    );
  }

  // Tampilkan pesan jika tidak ada data order yang ditemukan
  if (Object.keys(order).length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Tidak ada order tertunda yang ditemukan. Silakan kembali ke halaman
        utama.
        <button
          className="back-button"
          onClick={() => navigate("/")}
          style={{ marginTop: "1rem" }}
        >
          Kembali ke Home
        </button>
      </div>
    );
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
                    {seat} {/* Menampilkan ID kursi langsung, bukan seat + 1 */}
                  </div>
                ))
              : "No Seats Selected"}
          </div>
        </div>
      </div>
      <div className="booking-code">
        <p>
          Booking Code: <strong>{bookingCode}</strong>
        </p>{" "}
        {/* Tampilkan booking code */}
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
