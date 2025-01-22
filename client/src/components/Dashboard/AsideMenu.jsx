import { Link } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";
import { useContext } from "react";

const AsideMenu = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <aside className="w-[85%] h-auto flex flex-col justify-end py-3 fixed top-[92%] left-7 bg-white z-50 sm:w-[12%] sm:h-full sm:justify-start sm:shadow-md sm:px-2 sm:top-[8%] sm:left-1 md:w-[10%] md:left-[-1] xl:w-[7%] xl:top-[10%]">
      <nav className="w-full">
        <ul className="w-full flex flex-row gap-10 justify-around sm:flex-col sm:justify-start sm:mt-2 sm:items-center sm:gap-4">
          <li className="flex flex-col items-center">
            <a href="/dashboard" className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12.707 2.293l9 9c.63 .63 .184 1.707 -.707 1.707h-1v6a3 3 0 0 1 -3 3h-1v-7a3 3 0 0 0 -2.824 -2.995l-.176 -.005h-2a3 3 0 0 0 -3 3v7h-1a3 3 0 0 1 -3 -3v-6h-1c-.89 0 -1.337 -1.077 -.707 -1.707l9 -9a1 1 0 0 1 1.414 0m.293 11.707a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883 -.993l.117 -.007z" />
              </svg>
              <span className="text-sm mt-1">Home</span>
            </a>
          </li>
          <li className="flex flex-col items-center">
            <Link to="/peliculas" className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                <path d="M8 4l0 16" />
                <path d="M16 4l0 16" />
                <path d="M4 8l4 0" />
                <path d="M4 16l4 0" />
                <path d="M4 12l16 0" />
                <path d="M16 8l4 0" />
                <path d="M16 16l4 0" />
              </svg>
              <span className="text-sm mt-1">Peliculas</span>
            </Link>
          </li>
          <li className="flex flex-col items-center">
            <Link to="/clientes" className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
              </svg>
              <span className="text-sm mt-1">Clientes</span>
            </Link>
          </li>
          <li className="flex flex-col items-center">
            <Link to="/facturar" className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 5l0 2" />
                <path d="M15 11l0 2" />
                <path d="M15 17l0 2" />
                <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2" />
              </svg>
              <span className="text-sm mt-1">Facturar</span>
            </Link>
          </li>
          <li className="flex flex-col items-center">
            <Link
              onClick={handleLogout}
              to="/"
              className="flex flex-col items-center text-red-500 hover:text-red-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
                <path d="M15 12h-12l3 -3" />
                <path d="M6 15l-3 -3" />
              </svg>
              <span className="text-sm mt-1">Salir</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AsideMenu;