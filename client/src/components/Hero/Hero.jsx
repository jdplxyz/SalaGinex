import { useContext } from "react";
import { AuthContext } from "../../utils/AuthContext"; 
import { Link } from "react-router-dom";
export const Hero = () => {
  const { isAuthenticated } = useContext(AuthContext); 
  const typeClient = localStorage.getItem("rol"); // Obtén el rol del usuario

  return (
    <section className="w-full h-[800px] flex flex-col relative ">

      <img
        className="w-full h-full object-cover absolute inset-0"
        src="https://wallpapers.com/images/hd/movie-theater-background-2048-x-1536-9wlq655dcp63cdi8.jpg"
        alt="Logo"
      />

      <div className="absolute inset-0 flex flex-col justify-center items-start p-8 text-white bg-black bg-opacity-50">
        {/* Título */}
        <h1 className="text-[54px] absolute top-[10%]  sm:text-[95px] ">
          Sala Ginex
        </h1>

        {/* Descripción */}
        <p className="text-[38px]  absolute top-[20%]  sm:text-[55px] sm:top-[25%]  font-medium mb-8 max-w-[80%]">
          Paseo Libertador (Boulevard) Edificio Gilda
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 absolute top-[50%] sm:top-[60%] lg:top-[48%] xl:top-[45%] 2xl:top-[40%]">
          {isAuthenticated ? ( // Si el usuario está autenticado
            typeClient === "Cliente" ? ( // Verifica el rol del usuario
              <a
                className="text-lg md:text-xl lg:text-2xl text-center border border-white px-6 py-3 rounded-full transition ease-in duration-300 hover:bg-white hover:text-black font-bold sm:p-[25px]"
                href="/inicio"
              >
                Comprar Ticket
              </a>
            ) : (
              <a
                className="text-lg md:text-xl lg:text-2xl text-center border border-white px-6 py-3 rounded-full transition ease-in duration-300 hover:bg-white hover:text-black font-bold sm:p-[25px]"
                href="/dashboard"
              >
                Dashboard
              </a>
            )
          ) : ( // Si el usuario no está autenticado
            <Link
              className="text-lg md:text-xl lg:text-2xl text-center border border-white px-6 py-3 rounded-full transition ease-in duration-300 hover:bg-white hover:text-black font-bold sm:p-[25px]"
              to="/login"
            >
              Iniciar Sesión
            </Link>
          )}

          
        </div>
      </div>

      {/* Flecha animada */}
      <svg
        className="absolute bottom-8 top-[75%] left-[155px] sm:left-[48%] sm:top-[80%] transform -translate-x-1/2 w-16 h-16 text-white animate-bounce xl:w-[64px]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
        />
      </svg>
    </section>
  );
};