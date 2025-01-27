import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNextWeekendDates } from "../../../utils/GetDateMovies";
import { formatDate } from "../../../utils/FormatDate";
import { API_URL } from "../../../utils/ApiUrl";

export const HomeClient = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [dataMovie, setDataMovie] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [error, setError] = useState(null);


  const weekendDates = getNextWeekendDates();

  // Obtener todas las películas
  const getAllMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/peliculas`);
      if (!response.ok) {
        throw new Error("Error al obtener las películas");
      }
      const data = await response.json();
      setDataMovie(data);
    } catch (error) {
      console.error(error);
      setError("Error al cargar las películas. Intenta más tarde.");
    }
  };

  // Filtrar películas por fecha
  const filterMoviesByDate = (movies, date) => {
    return movies.filter(
      (movie) => formatDate(movie.fecha_transmision) === formatDate(date)
    );
  };

  // Obtener películas al cargar el componente
  useEffect(() => {
    getAllMovies();
    setSelectedDate(weekendDates.nextFriday); // Establecer la fecha inicial
  }, []);

  // Filtrar películas cuando cambia la fecha seleccionada o los datos de películas
  useEffect(() => {
    if (dataMovie.length > 0) {
      const moviesFiltered = filterMoviesByDate(dataMovie, selectedDate);
      setFilteredMovies(moviesFiltered);
    }
  }, [selectedDate, dataMovie]);

  // Función para verificar si la película ya comenzó
  const isMovieStarted = (movieTime) => {
    const now = new Date(); // Hora actual
    const movieDateTime = new Date(`${selectedDate}T${movieTime}`); // Combina fecha y hora de la película
    return now > movieDateTime; // Devuelve true si la película ya comenzó
  };

  if(!filteredMovies ){
    return <p className="text-white">Cargando peliculas.</p>
  }

  return (
    <section className="h-auto bg-[#010739] w-full flex flex-col p-8">
      <header className="w-[100%] mx-auto px-5">
      <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
        Cartelera de esta semana
      </h1>
      <div className="w-full flex flex-row gap-4 items-center pb-4 border-b">
        <p className="text-white text-lg md:text-xl lg:text-2xl font-bold">Ver el </p>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded bg-transparent text-white"
        >
          <option value={weekendDates.nextFriday} className="bg-[#010739]">
            Viernes ({weekendDates.nextFriday})
          </option>
          <option value={weekendDates.nextSaturday} className="bg-[#010739]">
            Sábado ({weekendDates.nextSaturday})
          </option>
          <option value={weekendDates.nextSunday} className="bg-[#010739]">
            Domingo ({weekendDates.nextSunday})
          </option>
        </select>
      </div>
      </header>
      {filteredMovies.length > 0 ? (
        <div
          className={`mt-4 w-full grid ${
            filteredMovies.length === 1
              ? "grid-cols-1 justify-center"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          } gap-6`}
        >
          {filteredMovies.map((movie, index) => (
            <Link
              to={`/pelicula/${movie.id_pelicula}`}
              key={index}
              className={`${
                filteredMovies.length === 1
                  ? "sm:w-[50%] lg:w-[40%] mx-auto"
                  : "w-full md:max-h-[100%] "
              }`}
            >
              <div className="w-full h-[100%] bg-transparent  rounded-md lg:w-[100%] lg:h-[100%] shadow-md">
            <img
              className="w-[100%] h-max-[250px] md:max-h-[50%] md:w-[100%] object-cover"
              src={movie.poster}
              
              alt={`Poster ${movie.titulo}`}
            />
            <div className="w-full sm:w-[100%] sm:h-[50%] xl:h-[42%] 2xl:h-[35%] 3xl:h-[32%] bg-white p-5">
            <div className="w-full flex justify-between p-2 items-center ">
              <h2 className="text-[22px] font-medium sm:text-lg">{movie.titulo}</h2>
              <p className="text-[16px] text-[#ccc] sm:text-md">{movie.genero}</p>
            </div>
            <div className="w-full flex justify-between items-center p-2">
              <p className="font-medium text-[22px] sm:text-lg">Fecha: {selectedDate}</p>
              <p className="text-[18px] text-[#ccc] text-sm sm:text-md">{movie.hora_transmision}</p>
            </div>
            <p className="p-2 w-full text-black text-gray-600 font-medium text-[20px]">
              {movie.sinopsis}
            </p>
          </div>
          </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full h-screen p-5 flex flex-col justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </section>
  );
};