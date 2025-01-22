import { useState, useEffect } from "react";
import { getNextWeekendDates } from "../../utils/GetDateMovies";
import { formatDate } from "../../utils/FormatDate";
import { Link } from "react-router-dom";

export const Slider = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [dataMovie, setDataMovie] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const weekendDates = getNextWeekendDates();

  const getAllMovies = async () => {
    try {
      const response = await fetch("http://localhost:1234/peliculas");
      if (!response.ok) {
        throw new Error("Error al obtener las películas");
      }
      const data = await response.json();
      setDataMovie(data);
      const moviesFiltered = filterMoviesByDate(data, selectedDate);
      setFilteredMovies(moviesFiltered);
    } catch (error) {
      console.error(error);
    }
  };

  const filterMoviesByDate = (movies, date) => {
    return movies.filter((movie) => formatDate(movie.fecha_transmision) === formatDate(date));
  };

  useEffect(() => {
    getAllMovies();
    setSelectedDate(weekendDates.nextFriday);
  }, []);

  useEffect(() => {
    if (dataMovie.length > 0) {
      const moviesFiltered = filterMoviesByDate(dataMovie, selectedDate);
      setFilteredMovies(moviesFiltered);
    }
  }, [selectedDate, dataMovie]);

  return (
    <section className="h-auto bg-[#010739] w-full flex flex-col p-8">
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
                  : "w-full"
              }`}
            >
              <div className="w-full h-[100%] bg-white p-5 rounded-md lg:w-[100%] lg:h-[100%] shadow-md">
            <img
              className="w-[100%] h-max-[250px] md:h-[70%] md:w-[100%] object-cover"
              src={movie.poster}
              
              alt={`Poster ${movie.titulo}`}
            />
            <div className="w-full flex justify-between p-2 items-center">
              <h2 className="text-md font-medium sm:text-lg">{movie.titulo}</h2>
              <p className="text-sm text-[#ccc] sm:text-md">{movie.genero}</p>
            </div>
            <div className="w-full flex justify-between p-2">
              <p className="font-medium text-md sm:text-lg">Fecha: {selectedDate}</p>
              <p className="text-md text-[#ccc] text-sm sm:text-md">{movie.hora_transmision}</p>
            </div>
            <p className="p-2 w-full text-black text-gray-600 font-medium text-[15px]">
              {movie.sinopsis}
            </p>
          </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full h-[312px] p-5 flex flex-col justify-center items-center">
          <p className="text-sm md:text-xl lg:text-2xl text-white">
            No hay películas disponibles.
          </p>
          <p className="text-sm md:text-lg lg:text-xl text-white">
            Intenta más tarde.
          </p>
        </div>
      )}
    </section>
  );
};