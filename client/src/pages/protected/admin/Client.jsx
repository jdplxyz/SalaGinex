import { Link } from "react-router-dom";
import useWindowsDimension from "../../../hooks/useWindowsDimensions";
import { useEffect, useState } from "react";

export const ClientAdmin = () => {
  const [data, setData] = useState([]);
  const { width } = useWindowsDimension();
  const [email, setEmail] = useState("");
  const [userSearch, setUserSearch] = useState(null);
  const [userSelected, setUserSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [newUser, setNewUser] = useState({
    nombre: "",
    apellido: "",
    correo_electronico: "",
    clave: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const clientsPerPage = 5; // Número de clientes por página

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("");
      setErrorMessage("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [errorMessage, message]);

  useEffect(() => {
    fetch("https://salaginex.onrender.com/users")
      .then((response) => response.json())
      .then((clients) => {
        setData(clients.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  // Calcular los clientes que se deben mostrar en la página actual
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = data.slice(indexOfFirstClient, indexOfLastClient);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://salaginex.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Usuario registrado");
        setIsModalRegisterOpen(!isModalRegisterOpen);
        const updatedResponse = await fetch("https://salaginex.onrender.com/users");
        const updatedData = await updatedResponse.json();
        if (updatedData.data) {
          setData(updatedData.data);
        }
      } else {
        setMessage(data.message || "Usuario ya registrado.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error en la conexión con el servidor");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://salaginex.onrender.com/usersByEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setUserSearch({
          name: data.data[0].nombre,
          lastName: data.data[0].apellido,
          email: data.data[0].correo_electronico,
        });
        setErrorMessage("");
        setIsModalOpen(true);
      } else {
        setUserSearch(null);
        setErrorMessage("Usuario no encontrado");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      setUserSearch(null);
      setErrorMessage("Error al buscar el usuario");
      setIsModalOpen(true);
    }
  };

  const handleEditModal = (client) => {
    setUserSelected(client);
    setIsModalEditOpen(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const updatedUser = {
      name: userSelected.nombre,
      apellido: userSelected.apellido,
      email: userSelected.correo_electronico,
    };
    try {
      const response = await fetch(`https://salaginex.onrender.com/users/${userSelected.id_usuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        setMessage("Cliente actualizado satisfactoriamente.");
        setIsModalEditOpen(false);
        const updatedResponse = await fetch("https://salaginex.onrender.com/users");
        const updatedData = await updatedResponse.json();
        if (updatedData.data) {
          setData(updatedData.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClient = async (client) => {
    const id = client.id_usuario;
    try {
      const response = await fetch(`https://salaginex.onrender.com/users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMessage("Cliente eliminado satisfactoriamente.");
        const updatedResponse = await fetch("https://salaginex.onrender.com/users");
        const updatedData = await updatedResponse.json();
        if (updatedData.data) {
          setData(updatedData.data);
        }
      }
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      setErrorMessage("Error al eliminar el cliente");
    }
  };

  return (
    <section className="w-full mx-auto">
      <header className="w-full sm:w-[80%] mx-auto p-5 flex justify-between items-center">
        <h2 className="text-[24px] font-medium">Clientes Registrados</h2>
        <div className="flex gap-2">
          <Link to="/dashboard">
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
      <main className="w-full sm:w-[80%] sm:mx-auto p-5 relative overflow-x-auto">
        
        {data.length > 0 ? (
          <div className="w-full ">
            <form onSubmit={handleSubmit} className="w-[100%] flex flex-col items-start">
              <label
                htmlFor="correo_electronico"
                className="text-lg text-[#282827] font-medium sm:mx-[10%]"
              >
                Buscar Cliente:
              </label>
              <div className="flex gap-2 items-center sm:w-[50%] sm:mx-[10%]">
                <input
                  type="text"
                  id="correo_electronico"
                  placeholder="Ingrese el correo"
                  name="correo_electronico"
                  className="border p-3 rounded-[8px] font-xl w-[70%]"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="p-3 bg-[#010739] text-white font-medium w-[30%] rounded-[8px]">
                  Buscar
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Mostrar mensaje y botón para registrar un nuevo cliente
          <div className="w-full text-center">
            <h2 className="text-2xl font-medium mb-4">No hay clientes registrados</h2>
            <button
              onClick={() => setIsModalRegisterOpen(true)}
              className="p-3 bg-[#010739] text-white font-medium rounded-[8px]"
            >
              Registrar nuevo cliente
            </button>
          </div>
        )}

        {/* Renderizado condicional de la tabla o lista de clientes */}
        {width > 639 ? (
          // Vista para pantallas grandes (tabla)
          <div className="w-full overflow-x-auto">
            <table className="w-[100%] bg-white rounded-lg shadow-lg my-5">
              <thead className="bg-[#010739] text-white">
                <tr>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Apellido</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentClients.map((client, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 text-center">{client.nombre}</td>
                    <td className="p-3 text-center">{client.apellido}</td>
                    <td className="p-3 text-center">{client.correo_electronico}</td>
                    <td className="p-3 text-center flex gap-2 justify-center">
                      <button onClick={() => handleDeleteClient(client)}>
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
                      </button>
                      <button onClick={() => handleEditModal(client)}>
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
                            d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Vista para pantallas pequeñas (divs)
          <div className="w-full">
            {currentClients.map((client, index) => (
              <div
                key={index}
                className="w-full h-[125px] bg-white rounded-lg shadow-lg p-4 mb-4 flex flex-col gap-5 justify-center mt-5"
              >
                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {client.nombre} {client.apellido}
                    </p>
                    <p className="text-sm text-gray-600">{client.correo_electronico}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDeleteClient(client)}>
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
                    </button>
                    <button onClick={() => handleEditModal(client)}>
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
                          d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {data.length > clientsPerPage && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-[#010739] text-white rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastClient >= data.length}
              className="p-2 bg-[#010739] text-white rounded-lg disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Modales y mensajes (sin cambios) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              {userSearch ? (
                <>
                  <h3 className="text-lg font-medium">Resultado de la búsqueda:</h3>
                  <p>Nombre: {userSearch.name}</p>
                  <p>Apellido: {userSearch.lastName}</p>
                  <p>Correo: {userSearch.email}</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium">Error</h3>
                  <p>{errorMessage}</p>
                </>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 p-2 bg-[#010739] text-white rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {isModalRegisterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full">
            <div className="bg-white p-5 rounded-lg w-[90%] max-w-md">
              <h2 className="text-xl font-bold mb-5">Registrar nuevo cliente</h2>
              <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="p-2 border rounded"
                  onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  className="p-2 border rounded"
                  onChange={(e) => setNewUser({ ...newUser, apellido: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="p-2 border rounded"
                  onChange={(e) => setNewUser({ ...newUser, correo_electronico: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="p-2 border rounded"
                  onChange={(e) => setNewUser({ ...newUser, clave: e.target.value })}
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalRegisterOpen(false)}
                    className="p-2 bg-gray-500 text-white rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded"
                  >
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isModalEditOpen && userSelected && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full">
            <div className="bg-white p-5 rounded-lg w-[90%] max-w-md">
              <h2 className="text-xl font-bold mb-5">Editar Cliente</h2>
              <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={userSelected.nombre}
                  onChange={(e) => setUserSelected({ ...userSelected, nombre: e.target.value })}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={userSelected.apellido}
                  onChange={(e) => setUserSelected({ ...userSelected, apellido: e.target.value })}
                  className="p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={userSelected.correo_electronico}
                  onChange={(e) => setUserSelected({ ...userSelected, correo_electronico: e.target.value })}
                  className="p-2 border rounded"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalEditOpen(false)}
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

        {message && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full">
            <div className="bg-blue-500 text-white p-5 rounded-lg w-[90%] max-w-md">
              <h2>{message}</h2>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full">
            <div className="bg-red-500 text-white p-5 rounded-lg w-[90%] max-w-md">
              <h2>{errorMessage}</h2>
            </div>
          </div>
        )}
      </main>
      <div className="w-[80%] mx-auto">
      <button
        onClick={() => setIsModalRegisterOpen(!isModalRegisterOpen)}
        className="p-3  bg-[#010739] text-white font-medium w-[50%] sm:w-[20%] rounded-[8px] " 
      >
        Registrar Cliente
      </button>
      </div>
    </section>
  );
};