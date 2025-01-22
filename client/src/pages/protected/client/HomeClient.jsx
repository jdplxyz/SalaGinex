import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNextWeekendDates } from "../../../utils/GetDateMovies";

export const HomeClient = () => {
  const [dataMovie, setDataMovie] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:1234/peliculas");
        if (!response.ok) {
          throw new Error("Error al obtener las películas");
        }
        const data = await response.json();
        setDataMovie(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, []);


  const weekendDates = getNextWeekendDates();

  
  useEffect(() => {
    setSelectedDate(weekendDates.nextFriday);
  }, []); 

  const filteredMovies = selectedDate
    ? dataMovie.filter(
        (movie) => formatDate(movie.fecha_transmision) === formatDate(selectedDate)
      )
    : [];

  return (
    <section className="w-full ">
      <header className="w-full p-5 flex justify-between items-center">
        <h2 className="text-[24px] font-medium">Cartelera</h2>
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
      <main className="w-full p-5">
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded mb-5"
        >
          <option value={weekendDates.nextFriday}>
            Viernes ({weekendDates.nextFriday})
          </option>
          <option value={weekendDates.nextSaturday}>
            Sábado ({weekendDates.nextSaturday})
          </option>
          <option value={weekendDates.nextSunday}>
            Domingo ({weekendDates.nextSunday})
          </option>
        </select>

        {filteredMovies.length > 0 ? (
          <div className="mt-4 w-full flex flex-col items-center gap-4 sm:w-full lg:flex-row lg:justify-center ">
            {filteredMovies.map((movie, index) => (
              <Link to={`/pelicula/${movie.id_pelicula}`} key={index} className={`${
                filteredMovies.length === 1
                  ? "sm:w-[50%] lg:w-[40%] mx-auto"
                  : "w-full"
              }`}>
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
          <div className="w-full h-[300px] p-5 flex flex-col justify-center items-center">
            <p className="text-sm text-white">No hay películas disponibles.</p>
            <p className="text-2xl">Intenta más tarde.</p>
          </div>
        )}
      </main>
    </section>
  );
};