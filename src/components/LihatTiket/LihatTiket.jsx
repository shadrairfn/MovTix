import React, { useEffect, useState } from "react";
import "./LihatTiket.css";

function LihatTiket() {
  const [transaksiList, setTransaksiList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/transaksi")
      .then((res) => res.json())
      .then((data) => {
        console.log("Transaksi fetched:", data); // Tambahkan log ini
        setTransaksiList(data);
      })
      .catch((err) => console.error("Gagal fetch transaksi:", err));
  }, []);

  return (
    <div className="lihat-tiket-container">
      <h2>Daftar Tiket</h2>
      {transaksiList.length === 0 ? (
        <p>Belum ada transaksi.</p>
      ) : (
        <div className="tiket-list">
          {transaksiList.map((t) => (
            <div className="tiket-card" key={t.idTransaksi}>
              <h3>{t.namaFilm}</h3>
              <p>
                <strong>Nama Bioskop:</strong> {t.namaBioskop}
              </p>
              <p>
                <strong>Jam Tayang:</strong> {t.jamTayang}
              </p>
              <p>
                <strong>Kode Tiket:</strong> {t.kodeTiket}
              </p>
              <p>
                <strong>Kursi:</strong> {t.daftarKursi.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LihatTiket;
