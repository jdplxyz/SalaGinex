import { useContext, useState, useEffect } from "react"; // Importa useEffect
import { Link } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";
import './Header.css';

export const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar la visibilidad del menú

  const handleLogout = () => {
    localStorage.removeItem("auth_token"); // Elimina el token
    setIsAuthenticated(false); // Actualiza el estado de autenticación
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Cambia el estado del menú
  };

  // Efecto para restablecer el estado del menú al cambiar a escritorio
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint en Tailwind
        setIsMenuOpen(false); // Cierra el menú al cambiar a escritorio
      }
    };

    // Agrega un listener para el evento de redimensionamiento
    window.addEventListener("resize", handleResize);

    // Limpia el listener al desmontar el componente
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="shadow-gray-700 max-w-full h-[80px] py-2 bg-[#010739] flex flex-row items-center lg:px-5 xl:pr-[70px] overflow-hidden 2xl:max-w-full pb-2">
      <nav className="w-full flex items-center p-5 shadow md:flex justify-between">
        <div className="flex justify-between items-center">
          <span className="text-white text-xl mx-2 block">
            <a href="/" className="sm:flex text-white text-2xl font-bold">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdLRKhtd3Euj7Me2sOifiySAUgif-N1vMzIQ&s" alt="Sala Ginex Logo" width={75} height={75}/>
            </a>
          </span>
        </div>

        {isAuthenticated ? (
          <ul
            className={`md:flex md:items-center md:static absolute bg-[#010739] w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-3 transition-all ease-in duration-500 ${
              isMenuOpen
                ? "opacity-100 z-[1] top-[70px]" // Menú abierto en móvil
                : "opacity-0 z-[-1] top-[-100%] md:opacity-100 md:z-[1] md:top-0" // Menú cerrado en móvil, pero visible en escritorio
            }`}
          >
            <li className="mx-4 my-6 md:my-0">
              <Link
                to="/login"
                onClick={handleLogout}
                className="text-lg font-bold hover:border-b text-white pb-2 duration-500 overflow-y-hidden"
              >
                Cerrar Sesion
              </Link>
            </li>
          </ul>
        ) : (
          <ul
            className={`md:flex md:items-center md:static absolute bg-[#010739] w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-3 transition-all ease-in duration-500 ${
              isMenuOpen
                ? "opacity-100 z-[1] top-[70px]" // Menú abierto en móvil
                : "opacity-0 z-[-1] top-[-100%] md:opacity-100 md:z-[1] md:top-0" // Menú cerrado en móvil, pero visible en escritorio
            }`}
          >
            <li className="mx-4 my-6 md:my-0">
              <Link
                to="/login"
                className="text-2xl font-bold hover:border-b text-white pb-2 duration-500 overflow-y-hidden"
              >
                Iniciar Sesion
              </Link>
            </li>
            <li className="mx-4 my-6 md:my-0">
              <Link
                to="/register"
                className="text-2xl font-bold hover:border-b text-white pb-2 duration-500"
              >
                Registrar Usuario
              </Link>
            </li>
          </ul>
        )}

        {/* Ícono de hamburguesa (solo visible en móvil) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="menu size-6 w-[35px] h-[35px] my-auto sm:hidden flex cursor-pointer"
          onClick={toggleMenu} // Evento para abrir/cerrar el menú
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </nav>
    </header>
  );
};