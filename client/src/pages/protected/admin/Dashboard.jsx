import { useState, useEffect, useContext } from "react";
import AsideMenu from "../../../components/Dashboard/AsideMenu";
import { Link } from "react-router-dom";
import { CurrencyContext } from "../../../contexts/CurrencyContext";

export const Dashboard = () => {
  const [userData, setUserData] = useState([]);
  const [ordersConfirmated, setOrdersConfirmated] = useState([]);
  const [moneyIncome, setMoneyIncome] = useState(0);
  const [currencySwitch, setCurrencySwitch] = useState(false);

  const { currencyRate, getRateCurrency } = useContext(CurrencyContext);


  const getUserData = async () => {
    try {
      const response = await fetch("http://localhost:1234/users");
      const data = await response.json();
      if (!response.ok) {
        console.log("error");
      }
      setUserData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getOrdenConfirmated = async () => {
    try {
      const response = await fetch("http://localhost:1234/orden");
      const data = await response.json();
      if (!response.ok) {
        console.log("error");
      }
      const orderData = data.data.recordset;
      console.log(orderData)
      const todayOrders = ordersToday(orderData);
      setOrdersConfirmated(todayOrders);
    } catch (error) {
      console.error(error);
    }
  };

 

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Fecha inválida";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  const ordersToday = (orders) => {
    const today = new Date();
    const todayFormatted = formatDate(today.toISOString());
    const ordersFiltered = orders.filter(
      (order) => formatDate(order.fecha_reserva) === todayFormatted
    );
    console.log(ordersFiltered)
    return ordersFiltered;
  };

  useEffect(() => {
    getRateCurrency(1, "USD");
  }, []);

  useEffect(() => {
    getUserData();
    getOrdenConfirmated();
  }, []);

  useEffect(() => {
    const incomeToday = ordersConfirmated.reduce(
      (total, order) => total + order.total,
      0
    );
    setMoneyIncome(incomeToday);
  }, [ordersConfirmated]);


  const rol = localStorage.getItem("rol");
  const email = localStorage.getItem("email");

  const lastThreeOrders = ordersConfirmated
    .sort((a, b) => new Date(b.fecha_reserva) - new Date(a.fecha_reserva))
    .slice(0, 2);

  return (
    <>
      <section className="w-[100%] px-5 mx-auto h-screen flex flex-col sm:w-[80%]">
        <AsideMenu className="h-screen" />

        <div className="w-full h-screen flex flex-col overflow-y-auto">
          {/* Header */}
          <header className="w-full p-5 flex gap-2 items-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgF2suM5kFwk9AdFjesEr8EP1qcyUvah8G7w&s"
              alt="Foto de perfil"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-lg font-medium">{email}</p>
              <span className="text-sm text-gray-500">{rol}</span>
            </div>
          </header>

          {/* Main Content */}
          <main className="w-full p-5 flex-1">
            {" "}
            {/* flex-1 para que ocupe el espacio restante */}
            {/* Estadísticas */}
            <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="w-full p-[26px] border rounded-lg shadow-sm flex flex-col gap-2 justify-start">
                <h2 className="text-2xl font-medium">Clientes Registrados: </h2>
                <p className="text-2xl font-bold">{userData.length}</p>
              </div>
              <div className="w-full p-4 border rounded-lg shadow-sm flex flex-col gap-2 justify-start">
                <h2 className="text-2xl font-medium">Tickets Hoy</h2>
                <p className="text-2xl font-bold">{ordersConfirmated.length}</p>
              </div>
              <div className="w-full p-4 border rounded-lg shadow-sm flex flex-col gap-2 justify-start">
                <header className="w-full flex items-center justify-between gap-2">
                  <h2 className="text-2xl font-medium">Ingreso Diario</h2>
                  <svg
                    onClick={() => setCurrencySwitch(!currencySwitch)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 cursor-pointer transition duratio-500 ease-in-out hover:text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                    />
                  </svg>
                </header>
                {currencySwitch ? (
                  <p className="text-2xl font-bold">{moneyIncome} $</p>
                ) : (
                  <p className="text-2xl font-bold">
                    {moneyIncome * currencyRate} BS
                  </p>
                )}
              </div>
              <Link
                to={"/historial"}
                className="w-full p-4 border rounded-lg shadow-sm flex items-center justify-center flex flex-col gap-2"
              >
                <p className="text-2xl font-medium">Ver historial de ventas</p>
              </Link>
            </section>
            {/* Ventas Recientes */}
            <section className="w-full mt-8">
              <header className="w-full">
                <h3 className="text-3xl font-medium text-gray-700">
                  Ventas Recientes
                </h3>
              </header>
              <div className="w-full mt-4">
                {lastThreeOrders.length > 0 ? (
                  <ul className="w-full flex flex-col gap-4">
                    {lastThreeOrders.map((order, index) => {
                      const user = userData.find(
                        (user) => user.id_usuario === order.id_usuario
                      );
                      return (
                        <li
                          key={index}
                          className="w-full p-4 border rounded-lg shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgF2suM5kFwk9AdFjesEr8EP1qcyUvah8G7w&s"
                                alt=""
                                className="w-10 h-10 rounded-full"
                              />
                              <p className="text-lg font-medium">
                                {user
                                  ? `${user.nombre} ${user.apellido}`
                                  : "Usuario no encontrado"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <p>Tickets:</p>
                              <p className="font-medium">
                                {order.asientos
                                  ? JSON.parse(order.asientos).length
                                  : 0}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <section className="w-full flex justify-center items-center">
                    <p className=" sm:text-3xl sm:mt-[80px] text-gray-500">
                      No hay ordenes recientes
                    </p>
                  </section>
                )}
              </div>
            </section>
          </main>
        </div>
      </section>
    </>
  );
};
