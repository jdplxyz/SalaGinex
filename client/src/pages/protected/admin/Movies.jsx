import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNextWeekendDates } from "../../../utils/GetDateMovies";
import { API_URL } from "../../../utils/ApiUrl";


export const Movies = () => {
  const [dataMovie, setDataMovie] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [newMovie, setNewMovie] = useState({
    titulo: "",
    genero: "",
    fecha_transmision: "",
    hora_transmision: "5:00 PM",
    sinopsis: "",
    poster: null,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/peliculas`);
      if (!response.ok) {
        throw new Error("Error al obtener las películas");
      }
      const data = await response.json();
      setDataMovie(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("");
      setOpenMessageModal(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleDeleteMovie = async (movie) => {
    const { id_pelicula } = movie;

    if (!id_pelicula) {
      console.error("ID de película no válido");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/pelicula/${id_pelicula}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al eliminar película:", errorData);
        return;
      }

      setMessage("Película eliminada correctamente.");
      setOpenMessageModal(true);

      // Actualiza la lista de películas
      const updatedResponse = await fetch(`${API_URL}/peliculas`);
      const updatedMovies = await updatedResponse.json();
      setDataMovie(updatedMovies.data || []);





    } catch (error) {
      console.error("Error al eliminar película:", error);
    }
  };

  const weekendDates = getNextWeekendDates();

  const filteredMovies = selectedDate
    ? dataMovie.filter((movie) => formatDate(movie.fecha_transmision) === formatDate(selectedDate))
    : [];

  const handleModal = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/peliculas/${selectedMovie.id_pelicula}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: selectedMovie.titulo,
            gender: selectedMovie.genero,
            broadcastDate: selectedMovie.fecha_transmision,
            broadcastHour: selectedMovie.hora_transmision,
            sinopsis: selectedMovie.sinopsis,
          }),
        }
      );

      if (!response.ok) {
        console.error("Error al actualizar la película");
        return;
      }

      const updatedMovies = dataMovie.map((movie) =>
        movie.id_pelicula === selectedMovie.id_pelicula ? { ...movie, ...selectedMovie } : movie
      );

      setDataMovie(updatedMovies);
      setModalOpen(false);
      setMessage("Película actualizada correctamente.");
      setOpenMessageModal(!openMessageModal);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNewMovieChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "poster") {
      setNewMovie({ ...newMovie, [name]: files[0] });
    } else {
      setNewMovie({ ...newMovie, [name]: value });
    }
  };

  const isTimeSlotAvailable = (date, time) => {
    return !dataMovie.some(
      (movie) =>
        formatDate(movie.fecha_transmision) === formatDate(date) &&
        movie.hora_transmision === time
    );
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();

    if (!isTimeSlotAvailable(newMovie.fecha_transmision, newMovie.hora_transmision)) {
      setMessage("La hora seleccionada ya está ocupada.");
      setOpenMessageModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", newMovie.titulo);
    formData.append("gender", newMovie.genero);
    formData.append("broadcastDate", newMovie.fecha_transmision);
    formData.append("broadcastHour", newMovie.hora_transmision);
    formData.append("sinopsis", newMovie.sinopsis);
    formData.append("posterImg", newMovie.poster);

    try {
      const response = await fetch(`${API_URL}/peliculas`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const updatedResponse = await fetch(`${API_URL}/peliculas`);
        const updatedData = await updatedResponse.json();
        setDataMovie(updatedData);
        setMessage("Película agregada correctamente.");
        setNewMovie({
          titulo: "",
          genero: "",
          fecha_transmision: "",
          hora_transmision: "5:00 PM",
          sinopsis: "",
          poster: null,
        });
        setMessage("Pelicula agregada correctamente.")
        setOpenMessageModal(true)
      } else {
        setMessage("Error al agregar la película.");
        setOpenMessageModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="w-[100%] h-screen bg-white">
      <header className="w-[100%] p-5 mx-auto flex justify-between items-center md:flex-row  mb-5 sm:w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] sm:mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold">Registro de Películas</h2>
        <Link to="/dashboard" >
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
      </header>
      <div className="w-full px-5 mb-5 sm:w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] sm:mx-auto">
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full md:w-1/2 p-4 border rounded"
        >
          <option value="" className="sm:text-xl">Selecciona una fecha</option>
          <option value={weekendDates.nextFriday} className="sm:text-xl">Viernes ({weekendDates.nextFriday})</option>
          <option value={weekendDates.nextSaturday} className="sm:text-xl">Sábado ({weekendDates.nextSaturday})</option>
          <option value={weekendDates.nextSunday} className="sm:text-xl">Domingo ({weekendDates.nextSunday})</option>
        </select>
      </div>
      <main className="w-[100%] px-5 sm:w-[95%] md:w-[85%] lg:w-[75%] xl:w-[65%] mx-auto">
        {filteredMovies.length > 0 ?
          <div className="w-[100%] bg-black flex flex-col bg-white sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {filteredMovies.map((movie, index) => (
              <article key={movie.id_pelicula} className="w-[100%] flex flex-col shadow-lg p-5">
                <img src={`${movie.poster}`} alt={`Poster ${movie.titulo}`} />
                <div className="w-[100%] flex justify-between items-center gap-2 py-3 px-1">
                  <h2 className="text-2xl font-medium">{movie.titulo}</h2>
                  <p className="text-lg text-gray-500">{movie.genero}</p>
                </div>
                <div className="w-[100%] flex justify-between items-center gap-2 py-3 px-1">
                  <p className="text-xl font-medium">{selectedDate}</p>
                  <p className="text-lg text-gray-500">{movie.hora_transmision}</p>
                </div>
                <p className="p-2 w-full text-md text-gray-600 font-medium">{movie.sinopsis}</p>
                <div className="w-full flex gap-2 p-2">
                    <a className="cursor-pointer" onClick={() => handleDeleteMovie(movie)}>
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </a>
                    <a
                      href={movie.id}
                      className="cursor-pointer"
                      onClick={() => handleModal(movie)}
                    >
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </a>
                  </div>
              </article>
            ))}
          </div>
          :
          <div className="w-[100%] h-screen">
            <form onSubmit={handleAddMovie} className="w-full flex flex-col gap-5">
              <h2 className="text-xl font-bold">Agregar Nueva Película</h2>
              <div className="w-full">
                <input
                  type="text"
                  name="titulo"
                  placeholder="Título"
                  value={newMovie.titulo}
                  onChange={handleNewMovieChange}
                  className="p-4  border rounded w-full sm:text-xl"
                  required
                />
              </div>
              <input
                type="text"
                name="genero"
                placeholder="Género"
                value={newMovie.genero}
                onChange={handleNewMovieChange}
                className="p-4  border rounded sm:text-xl"
                required
              />
              <input
                type="date"
                name="fecha_transmision"
                value={newMovie.fecha_transmision}
                onChange={handleNewMovieChange}
                className="p-4  border rounded sm:text-xl"
                required
              />
              <select
                name="hora_transmision"
                value={newMovie.hora_transmision}
                onChange={handleNewMovieChange}
                className="p-4  border rounded sm:text-xl"
                required
              >
                <option value="5:00 PM">5:00 PM</option>
                <option value="7:00 PM">7:00 PM</option>
                <option value="9:00 PM">9:00 PM</option>
              </select>
              <textarea
                name="sinopsis"
                placeholder="Sinopsis"
                value={newMovie.sinopsis}
                onChange={handleNewMovieChange}
                className="p-4  border rounded sm:text-xl"
                required
              />
              <input
                type="file"
                name="poster"
                onChange={handleNewMovieChange}
                className="p-4  border rounded sm:text-xl"
                required
              />
              <button
                type="submit"
                className="p-4  bg-[#010739] text-white text-xl font-medium rounded sm:w-[50%] md:w-[30%] sm:p-3"
              >
                Agregar Película
              </button>
            </form>
          </div>}
      </main>
      {modalOpen && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full">
          <div className="bg-white p-5 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-5">Editar Película</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Título"
                value={selectedMovie.titulo}
                onChange={(e) =>
                  setSelectedMovie({ ...selectedMovie, titulo: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Género"
                value={selectedMovie.genero}
                onChange={(e) =>
                  setSelectedMovie({ ...selectedMovie, genero: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="date"
                value={selectedMovie.fecha_transmision}
                onChange={(e) =>
                  setSelectedMovie({
                    ...selectedMovie,
                    fecha_transmision: e.target.value,
                  })
                }
                className="p-2 border rounded"
              />
              <select
                value={selectedMovie.hora_transmision}
                onChange={(e) =>
                  setSelectedMovie({
                    ...selectedMovie,
                    hora_transmision: e.target.value,
                  })
                }
                className="p-2 border rounded"
              >
                <option value="5:00 PM">5:00 PM</option>
                <option value="7:00 PM">7:00 PM</option>
                <option value="9:00 PM">9:00 PM</option>
              </select>
              <textarea
                placeholder="Sinopsis"
                value={selectedMovie.sinopsis}
                onChange={(e) =>
                  setSelectedMovie({
                    ...selectedMovie,
                    sinopsis: e.target.value,
                  })
                }
                className="p-2 border rounded"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-2 bg-gray-500 text-white rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de mensaje */}
      {openMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full">
          <div className="bg-white p-5 rounded-lg w-[90%] max-w-md">
            <p>{message}</p>
          </div>
        </div>
      )}
    </section>
  );
};