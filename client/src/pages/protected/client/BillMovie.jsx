import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { QRCode } from "react-qr-code";
import { CurrencyContext } from "../../../contexts/CurrencyContext";
import { API_URL } from "../../../utils/ApiUrl";

export const BillMovie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [availablesSeat, setAvailableSeat] = useState(0);
  const [modalError, setModalError] = useState(false);
  const [messageError, setErrorMsg] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [reservationCode, setReservationCode] = useState("");
  const [reservationError, setReservationError] = useState("");

  const pricePerTicket = 2;
  const pricePerCombo = 4;
  const navigate = useNavigate();

  const { currencyRate, getRateCurrency } = useContext(CurrencyContext);

  useEffect(() => {
    getRateCurrency(1, "USD");
  }, []);

  const getMovie = async () => {
    const response = await fetch(`${API_URL}/pelicula/${id}`);
    const data = await response.json();
    if (!response.ok) {
      console.error("Película no encontrada.");
      return;
    }
    setMovie(data.data[0]);
  };

  const getSeatReservated = async () => {
    try {
      const response = await fetch(`${API_URL}/asientos/${id}`);
      if (!response.ok) {
        console.error("Error:", response.statusText);
        return;
      }
      const data = await response.json();
      const dataSeats = data.data;
      const seatReserved = dataSeats.flatMap((seat) => JSON.parse(seat.asientos));
      setReservedSeats(seatReserved);
    } catch (error) {
      console.error("Hubo un problema con la solicitud fetch:", error);
    }
  };

  useEffect(() => {
    getMovie();
    getSeatReservated();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const modifier = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convertir a formato de 12 horas
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Asegurar dos dígitos en los minutos

    return `${hours}:${formattedMinutes} ${modifier}`;
  };

  const isTimePassed = (time) => {
    const now = new Date();
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    // Convertir a formato de 24 horas
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    const movieTime = new Date();
    movieTime.setHours(hours, minutes, 0, 0); // Establecer la hora de la película

    return now > movieTime; // Comparar con la hora actual
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComboSelection = (combo) => {
    if (selectedCombos.some((c) => c.id === combo.id)) {
      setSelectedCombos(selectedCombos.filter((c) => c.id !== combo.id));
    } else {
      setSelectedCombos([...selectedCombos, combo]);
    }
  };

  const handleSeatSelection = (letter, seat) => {
    const uniqueSeat = `${letter}${seat}`;
    if (reservedSeats.includes(uniqueSeat)) {
      return;
    }
    if (selectedSeats.includes(uniqueSeat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== uniqueSeat));
      setAvailableSeat(availablesSeat - 1);
    } else {
      if (availablesSeat >= ticketQuantity) {
        setModalError(true);
        setErrorMsg("Limite Alcanzado. Compre mas tickets.");
        setTimeout(() => setModalError(false), 3000);
        return;
      }
      setSelectedSeats([...selectedSeats, uniqueSeat]);
      setAvailableSeat(availablesSeat + 1);
    }
  };

  const calculateTotal = () => {
    const ticketTotal = ticketQuantity * pricePerTicket;
    const combosTotal = selectedCombos.reduce((sum, combo) => sum + combo.precio, 0);
    const totalInUSD = ticketTotal + combosTotal;
    const totalInDesiredCurrency = totalInUSD * currencyRate;
    return totalInDesiredCurrency;
  };

  const openSeatModal = () => {
    setIsSeatModalOpen(true);
  };

  const closeSeatModal = () => {
    setIsSeatModalOpen(false);
  };

  const handleClose = () => {
    setIsConfirmationModalOpen(false);
    navigate("/");
  };

  const confirmReservation = async (movie) => {
    if (ticketQuantity > selectedSeats.length) {
      setReservationError("La cantidad de tickets no puede ser mayor que los asientos seleccionados.");
      setTimeout(() => setReservationError(""), 3000);
      return;
    }

    const totalPrice = calculateTotal();

    const uniqueCode = `RES-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    setReservationCode(uniqueCode);

    const newReservation = {
      id_pelicula: movie.id_pelicula,
      correo_electronico: localStorage.getItem("email"),
      asientos: selectedSeats,
      combos: selectedCombos,
      precio_total: totalPrice,
      codigo: uniqueCode,
    };

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/reservacion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReservation),
      credentials: "include",
    });

    if (response.ok) {
      setIsConfirmationModalOpen(true);
    } else {
      alert("Error al confirmar la reservación.");
    }
  };

  const handleTicketQuantityChange = (newQuantity) => {
    setTicketQuantity(newQuantity);

    if (newQuantity < selectedSeats.length) {
      const updatedSeats = selectedSeats.slice(0, newQuantity);
      setSelectedSeats(updatedSeats);
      setAvailableSeat(updatedSeats.length);
    }
  };

  if (!movie) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const rows = ["A", "B", "C", "D"];
  const columns = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <>
      <div className="w-full h-full bg-white">
        <header className="w-full p-5 flex justify-between items-center md:w-[80%] lg:w-[50%] md:mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold">Reservación</h2>
          <div className="flex gap-2">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </Link>
          </div>
        </header>

        <main className="w-full p-5 bg-white">
          {reservationError && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-red-500 text-white p-5 rounded-lg w-[95%] max-w-md">
                <p className="text-center text-xl">{reservationError}</p>
                <button
                  className="px-4 py-2 mt-2 bg-blue-500 text-lg font-medium text-white rounded"
                  onClick={() => setReservationError("")}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <section className="w-full flex flex-col md:flex-row gap-5 md:w-[80%] lg:w-[50%] md:mx-auto">
            <figure className="w-full md:w-[75%] flex justify-center">
              <img
                src={movie.poster}
                alt={`Poster ${movie.titulo}`}
                className="w-full h-auto md:h-[550px] object-cover rounded-lg"
              />
            </figure>
            <div className="w-full md:w-[35%] flex flex-col justify-between py-4">
              <div className="w-full flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{movie.titulo}</h2>
                <div className="w-full flex flex-col gap-2">
                  <label htmlFor="cantidad" className="text-lg font-bold text-gray-700">
                    Cantidad:
                  </label>
                  <input
                    type="number"
                    className="border px-2 py-1 rounded w-full"
                    value={ticketQuantity}
                    onChange={(e) => handleTicketQuantityChange(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="w-full md:hidden">
                <p className="text-lg font-bold text-gray-600">Sala de proyecciones</p>
                <h3 className="text-xl font-medium text-gray-800">Ginex</h3>
              </div>
            </div>
          </section>

          {currentStep === 1 && (
            <section className="w-full mt-5 md:w-[80%] lg:w-[50%] md:mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Combos de Comida</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 1, nombre: "Combo 1", precio: 2 },
                  { id: 2, nombre: "Combo 2", precio: 3 },
                  { id: 3, nombre: "Combo 3", precio: 4 },
                ].map((combo) => (
                  <div
                    key={combo.id}
                    className={`p-4 border rounded cursor-pointer ${
                      selectedCombos.some((c) => c.id === combo.id) ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleComboSelection(combo)}
                  >
                    <h3 className="text-lg font-bold">{combo.nombre}</h3>
                    <p className="text-sm">Precio Bs: {(combo.precio * currencyRate).toFixed(2)}</p>
                    <p className="text-sm">Precio $: {(combo.precio).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="w-full mt-5 md:w-[80%] lg:w-[50%] md:mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Selección de Asientos</h2>
              <button
                className="px-6 py-2 bg-blue-500 text-lg font-medium text-white rounded hover:bg-blue-600"
                onClick={openSeatModal}
              >
                Seleccionar Asientos
              </button>
            </section>
          )}

          {currentStep === 3 && (
            <section className="w-full mt-5 md:w-[80%] lg:w-[50%] md:mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Confirmación</h2>
              <div className="w-full flex flex-col gap-4">
                <div className="w-full flex justify-between">
                  <h2 className="text-lg font-bold">Precio por Ticket:</h2>
                  <p className="text-lg">${(pricePerTicket * currencyRate).toFixed(2)}</p>
                </div>
                <div className="w-full flex justify-between">
                  <h2 className="text-lg font-bold">Cantidad de Tickets:</h2>
                  <p className="text-lg">{ticketQuantity}</p>
                </div>
                <div className="w-full flex justify-between">
                  <h2 className="text-lg font-bold">Combos Seleccionados:</h2>
                  <p className="text-lg">
                    {selectedCombos.map((c) => `${c.nombre} (Bs ${(c.precio * currencyRate).toFixed(2)})`).join(", ")}
                  </p>
                </div>
                <div className="w-full flex justify-between">
                  <h2 className="text-lg font-bold">Asientos Seleccionados:</h2>
                  <p className="text-lg">{selectedSeats.join(", ")}</p>
                </div>
                <div className="w-full flex justify-between">
                  <h2 className="text-lg font-bold">Total:</h2>
                  <div className="flex flex-col items-end">
                    <p className="text-lg">Bs {calculateTotal().toFixed(2)}</p>
                    <p className="text-lg">$ {calculateTotal().toFixed(2) / currencyRate}</p>
                  </div>
                </div>
              </div>
              {isTimePassed(movie.hora_transmision) ? (
                <p className="text-red-500 text-lg font-bold mt-4">
                  La hora de transmisión ya pasó. No puedes reservar esta película.
                </p>
              ) : (
                <button
                  className="px-6 py-2 bg-green-500 text-lg font-medium text-white rounded hover:bg-green-600 mt-4"
                  onClick={() => confirmReservation(movie)}
                >
                  Confirmar
                </button>
              )}
            </section>
          )}

          <div className="w-full mt-5 md:w-[80%] lg:w-[50%] md:mx-auto flex justify-between">
            {currentStep > 1 && (
              <button
                className="px-6 py-2 bg-gray-500 text-lg font-medium text-white rounded hover:bg-gray-600"
                onClick={handlePreviousStep}
              >
                Anterior
              </button>
            )}
            {currentStep < 3 ? (
              <button
                className={`px-6 py-2 text-lg font-medium text-white rounded ${
                  isTimePassed(movie.hora_transmision)
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={handleNextStep}
                disabled={isTimePassed(movie.hora_transmision)}
              >
                Siguiente
              </button>
            ) : (
              <button
                className={`px-6 py-2 text-lg font-medium text-white rounded ${
                  isTimePassed(movie.hora_transmision)
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() => {
                  if (!isTimePassed(movie.hora_transmision)) {
                    confirmReservation(movie);
                  }
                }}
                disabled={isTimePassed(movie.hora_transmision)}
              >
                {isTimePassed(movie.hora_transmision)
                  ? "La hora de transmisión ya pasó"
                  : "Confirmar"}
              </button>
            )}
          </div>

          {isSeatModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg w-[95%] p-5 max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Selecciona tus asientos</h2>
                <div className="flex w-full gap-2 items-center">
                  <div className="w-full h-full flex flex-col items-center">
                    {modalError && (
                      <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-black opacity-85 text-white flex flex-col items-center rounded-lg w-[95%] p-5 max-w-xs">
                          <p className="text-center text-xl">{messageError}</p>
                          <button
                            className="px-4 py-2 mt-2 bg-blue-500 text-lg font-medium text-white rounded"
                            onClick={() => setModalError(false)}
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    )}

                    {rows.map((letter, rowIndex) => (
                      <div key={rowIndex} className="w-full flex items-center p-2">
                        <p className="w-[5%] text-xl">{letter}</p>
                        {columns.map((seat, colIndex) => {
                          const uniqueSeat = `${letter}${seat}`;
                          const isSelected = selectedSeats.includes(uniqueSeat);
                          const isReserved = reservedSeats.includes(uniqueSeat);

                          return (
                            <div
                              key={colIndex}
                              className={`w-[95%] ml-6 py-2 flex flex-col items-center transition duration-500 ease-in-out ${
                                isSelected ? "bg-blue-200" : isReserved ? "bg-red-200" : "bg-gray-100"
                              }`}
                              onClick={() => {
                                if (!isReserved) {
                                  handleSeatSelection(letter, seat);
                                } else {
                                  setErrorMsg("Asiento ya reservado.");
                                  setModalError(true);
                                }
                              }}
                            >
                              <p>{seat}</p>
                              <svg
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="28px"
                                height="28px"
                              >
                                <g
                                  fill="none"
                                  stroke={isSelected ? "#ffffff" : "#000000"}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                >
                                  <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                                  <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Zm2 2v2m14-2v2" />
                                </g>
                              </svg>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="px-6 py-2 bg-blue-500 text-lg font-medium text-white rounded hover:bg-blue-600"
                    onClick={closeSeatModal}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {isConfirmationModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg w-[95%] p-5 max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Reservación Confirmada</h2>
                <div className="flex flex-col items-center">
                  <QRCode
                    value={reservationCode}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="Q"
                  />
                  <p className="mt-2 text-xl font-bold">
                    Película: <small className="font-medium">{movie.titulo}</small>
                  </p>
                  <p>Asientos: {selectedSeats.join(", ")}</p>
                  <p>Combos: {selectedCombos.map((c) => `${c.nombre} (BS ${(c.precio * currencyRate).toFixed(2)})`).join(", ")}</p>
                  <p>Total: ${calculateTotal().toFixed(2)}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="px-6 py-2 bg-blue-500 text-lg font-medium text-white rounded hover:bg-blue-600"
                    onClick={handleClose}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};