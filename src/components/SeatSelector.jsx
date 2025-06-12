import React from "react";

function SeatSelector({
  movie,
  selectedSeats,
  recommendedSeat,
  onSelectedSeatsChange,
  onRecommendedSeatChange,
}) {
  const seatCount = movie.seatCount || 64;
  const cols = 8;
  const rows = Math.ceil(seatCount / cols);

  // Buat array kursi 1D
  const seats = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const seatNum = row * cols + col;
      if (seatNum < seatCount) seats.push(seatNum);
    }
  }

  function handleSelectedState(seat) {
    const isSelected = selectedSeats.includes(seat);
    if (isSelected) {
      onSelectedSeatsChange(selectedSeats.filter((s) => s !== seat));
    } else {
      onSelectedSeatsChange([...selectedSeats, seat]);
    }
    if (onRecommendedSeatChange) {
      onRecommendedSeatChange(null);
    }
  }

  return (
    <div className="Cinema">
      <div className="screen">SCREEN</div>
      <div className="seats">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat);
          const isOccupied = movie.occupied.includes(seat);
          const isRecommended = Array.isArray(recommendedSeat)
            ? recommendedSeat.includes(seat) && selectedSeats.length === 0
            : recommendedSeat === seat && selectedSeats.length === 0;

          let seatClass = "seat";
          if (isOccupied) seatClass += " occupied";
          if (isSelected) seatClass += " selected";
          if (isRecommended) seatClass += " recommended";

          return (
            <button
              type="button"
              tabIndex="0"
              key={seat}
              className={seatClass}
              onClick={() => !isOccupied && handleSelectedState(seat)}
              onKeyPress={
                !isOccupied
                  ? (e) => {
                      if (e.key === "Enter") {
                        handleSelectedState(seat);
                      }
                    }
                  : undefined
              }
              disabled={isOccupied}
              title={`Kursi ${seat + 1}`}
            >
              {seat + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SeatSelector;
