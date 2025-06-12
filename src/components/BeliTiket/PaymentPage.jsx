import "./PaymentPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function PaymentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [order, setOrder] = useState(null);
  const [movie, setMovie] = useState(null);

  // Ambil detail order dari localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem("pendingOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  // Fetch detail film berdasarkan ID dari backend
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:8080/film/${id}`);
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };

    fetchMovie();
  }, [id]);

  const handlePayNow = () => {
    if (!selectedPayment) {
      alert("Please select a payment method.");
      return;
    }

    alert("Payment successful using: " + selectedPayment);
    navigate(`/movie/${id}/orderSummary`);
  };

  if (!order || !movie)
    return <div style={{ padding: "2rem" }}>Loading...</div>;

  const totalTiket =
    order.price && order.seat ? order.price * order.seat.length : 0;
  const totalAdmin = order.seat ? order.seat.length * 4000 : 0;
  const totalPembayaran = totalTiket + totalAdmin;

  return (
    <div className="payment-container">
      <div className="header">Transaction Detail</div>
      <div className="ticket-summary">
        <img src={movie.poster} alt={movie.judul} className="poster" />
        <div className="movie-info">
          <div className="title-row">
            <h3>{movie.judul}</h3>
            <span className="label">{movie.umur || "-"}</span>
          </div>
          <p className="cinema">{order.cinemaName || "-"}</p>
          <p className="datetime">
            {order.date || "-"}, {order.time || "-"}
          </p>
        </div>
      </div>

      <div className="section-title">Seat Detail</div>
      <div className="details-section ticket-style">
        <div className="details-left">
          <div className="details-row">
            <span className="details-label">
              {order.seat?.length || 0} Tickets
            </span>
            <span className="details-value">
              {order.seat ? order.seat.map((s) => s + 1).join(", ") : "-"}
            </span>
          </div>
          <div className="details-row">
            <span className="details-label">Regular Seat</span>
            <span className="details-value">
              Rp {totalTiket.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="details-row">
            <span className="details-label">
              Admin{" "}
              <span className="admin-mult">
                (Rp4.000 x {order.seat?.length || 0})
              </span>
            </span>
            <span className="details-value">
              Rp {totalAdmin.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      <div className="ticket-divider"></div>

      <div className="section-title">Payment Methods</div>
      <div className="payment-methods">
        {["GoPay", "Dana", "ShopeePay"].map((method) => (
          <label className="payment-radio" key={method}>
            <input
              type="radio"
              name="payment"
              value={method}
              onChange={(e) => setSelectedPayment(e.target.value)}
            />
            <span className="radio-label">{method}</span>
            <span className="radio-dot" />
          </label>
        ))}
        <div className="more-methods">
          Choose Another Payment Methods --&gt;
        </div>
      </div>

      <div className="section-title">Promos/Vouchers</div>
      <div className="promo-section">
        <p className="no-promo">
          Oops! Unfortunately, there are no vouchers or promos available at the
          moment.
        </p>
        <ul className="warnings">
          <li>Tickets cannot be canceled or changed.</li>
          <li>Children aged 2 and above are required to purchase a ticket.</li>
          <li>Please watch movies according to the age rating.</li>
        </ul>
      </div>

      <div className="total-section">
        <p>Total</p>
        <p>Rp {totalPembayaran.toLocaleString("id-ID")}</p>
      </div>

      <button className="pay-button" onClick={handlePayNow}>
        COMPLETE YOUR PAYMENT
      </button>
    </div>
  );
}

export default PaymentPage;
