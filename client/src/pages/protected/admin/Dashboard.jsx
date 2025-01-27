import { useState, useEffect, useContext } from "react";
import AsideMenu from "../../../components/Dashboard/AsideMenu";
import { Link } from "react-router-dom";
import { CurrencyContext } from "../../../contexts/CurrencyContext";
import { API_URL } from "../../../utils/ApiUrl";
import useWindowsDimension from "../../../hooks/useWindowsDimensions";

export const Dashboard = () => {
  const [userData, setUserData] = useState([]);
  const [ordersConfirmated, setOrdersConfirmated] = useState([]);
  const [moneyIncome, setMoneyIncome] = useState(0);
  const [currencySwitch, setCurrencySwitch] = useState(false);

  const { currencyRate, getRateCurrency } = useContext(CurrencyContext);
  const {width} = useWindowsDimension()


  const getUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
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
      const response = await fetch(`${API_URL}/orden`);
      const data = await response.json();
      if (!response.ok) {
        console.log("error");
      }
      const orderData = data.data.recordset;
      console.log(orderData);
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

  const recentOrders = ordersConfirmated
    .sort((a, b) => new Date(b.fecha_reserva) - new Date(a.fecha_reserva))
    .slice(0, width < 400 ? 2 : 4);


  return (
    <section className="w-[100%] h-screen bg-white relative flex flex-col items-center justify-start sm:flex-row sm:overflow-y-hidden">
      <AsideMenu />
      <div className="w-[100%] h-[75%] flex flex-col gap-4 absolute top-5 sm:w-[70%] md:w-[75%] lg:w-[80%]  sm:left-[25%] sm:top-[7%] md:left-[20%] xl:left-[13%]">
        <header className="w-[100%] flex px-5 items-center gap-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgF2suM5kFwk9AdFjesEr8EP1qcyUvah8G7w&s"
            alt="Foto de perfil"
            className="w-[64px] h-[64px] rounded-full"
          />
          <article>
          <p className="text-[24px] font-medium">{email}</p>
          <span className="text-md text-gray-500">{rol}</span>
          </article>
        </header>
        <main className="w-[100%] h-[100%] sm:h-[90%] lg:mt-[20px] flex flex-col ">
          <div className="w-[100%] h-[80%] px-5 flex flex-col gap-3 sm:grid sm:h-[55%] md:h-[25%] lg:h-[25%] xl:h-[20%] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <article className="p-5 shadow-lg w-[100%] sm:h-[100%] md:h-[100%] lg:h-[100%] ">
              <h2 className="text-2xl font-medium">Clientes Registrados: </h2>
              <p className="text-2xl font-bold">{userData.length}</p>
            </article>
            <article className=" p-5 shadow-lg w-[100%] md:h-[100%] lg:h-[100%] ">
            <h2 className="text-2xl font-medium">Tickets Hoy</h2>
            <p className="text-2xl font-bold">{ordersConfirmated.length}</p>
            </article>
            <article className=" p-5 shadow-lg w-[100%] md:h-[100%] lg:h-[100%] ">
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
                  <p className="text-2xl font-bold">{moneyIncome} Bs</p>
                ) : (
                  <p className="text-2xl font-bold">
                    {moneyIncome / currencyRate} $
                  </p>
                )}
            </article>
            <article className=" p-5 shadow-lg w-[100%] md:h-[100%] lg:h-[100%] ">
            <Link to={'/historial'} className="text-2xl font-medium">Ver historial de ventas</Link>
            </article>
          </div>

          <div className="w-[100%] h-[45%] lg:h-[50%] p-5 sm:mt-[60px] md:mt-[80px] lg:mt-[30px]">
          <header className="w-[100%]">
          <h2 className="text-gray-500 text-2xl">Ventas Recientes</h2>
          </header>
          <article className="w-[100%] h-[100%] mt-6 lg:mt-6 md:mt-6">
          {recentOrders.length > 0 ? (
                  <ul className="w-full flex flex-col gap-4">
                    {recentOrders.map((order, index) => {
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
                    <p className=" text-xl mt-[45px] sm:text-3xl sm:mt-[80px] text-gray-500">
                      No hay ordenes recientes
                    </p>
                  </section>
                )}
          </article>
          </div>



        </main>
      </div>
    </section>
  );
};
