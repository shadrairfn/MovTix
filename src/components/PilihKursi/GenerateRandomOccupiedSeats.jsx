function generateRandomOccupiedSeats(min, max, seatCount) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const seats = new Set();
  while (seats.size < count) {
    seats.add(Math.floor(Math.random() * seatCount));
  }
  return Array.from(seats);
}
export default generateRandomOccupiedSeats;
