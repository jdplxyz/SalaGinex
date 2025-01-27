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
    <aside className="w-[100%] h-[10%] mt-[100px] shadow-lg sticky top-[92%] left-[5%] sm:top-[0] sm:w-[20%] sm:h-[90%] sm:left-0 md:w-[15%] lg:w-[15%] xl:w-[10%] 2xl:w-[8%]">
      <nav className="w-[100%] h-[100%]">
        <ul className="w-[100%] h-[100%] flex justify-between items-center p-5 sm:flex-col sm:justify-start sm:gap-[30px]">
          <li className="w-[100%]">
            <Link
              href="/dashboard"
              className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12.707 2.293l9 9c.63 .63 .184 1.707 -.707 1.707h-1v6a3 3 0 0 1 -3 3h-1v-7a3 3 0 0 0 -2.824 -2.995l-.176 -.005h-2a3 3 0 0 0 -3 3v7h-1a3 3 0 0 1 -3 -3v-6h-1c-.89 0 -1.337 -1.077 -.707 -1.707l9 -9a1 1 0 0 1 1.414 0m.293 11.707a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883 -.993l.117 -.007z" />
              </svg>
              <span className="text-lg mt-1 sm:text-xl">Home</span>
            </Link>
          </li>
          <li className="w-[100%]">
            <Link
              to="/peliculas"
              className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors"
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
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]"
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
              <span className="text-lg mt-1 sm:text-xl">Peliculas</span>
            </Link>
          </li>
          <li className="w-[100%]">
            <Link
              to="/clientes"
              className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
              </svg>
              <span className="text-lg mt-1 sm:text-xl">Clientes</span>
            </Link>
          </li>
          <li className="w-[100%]">
            <Link
              to="/facturar"
              className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors"
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
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 5l0 2" />
                <path d="M15 11l0 2" />
                <path d="M15 17l0 2" />
                <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2" />
              </svg>
              <span className="text-lg mt-1 sm:text-xl">Facturar</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AsideMenu;
