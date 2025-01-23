import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import jsPDF from "jspdf";
import { API_URL } from "../../../utils/ApiUrl";

export const Invoices = () => {
    const [ordenData, setOrdenData] = useState([]);
    const [currentsOrden, setCurrentsOrden] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [usersWithReservations, setUsersWithReservations] = useState([]);
    const [moviesWithReservations, setMoviesWithReservations] = useState([]);
    const [invoiceModal, setInvoiceModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dataSelected, setDataSelected] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const ordersPerPage = 2;


    const getOrdenConfirmated = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/orden`);
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            const orderData = data.data.recordset;
            setOrdenData(orderData);
            setFilteredOrders(orderData); // Inicialmente, mostrar todas las órdenes
            updateCurrentOrders(orderData, currentPage);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getUsersWithReservations = async () => {
        try {
            const response = await fetch(`${API_URL}/reservacion`);
            const data = await response.json();
            if (!response.ok) {
                console.log('Error al obtener usuarios con reservaciones');
            }
            setUsersWithReservations(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getMoviesWithReservations = async () => {
        try {
            const response = await fetch(`${API_URL}/peliculas/reservacion`);
            const data = await response.json();
            if (!response.ok) {
                console.log('Error al obtener películas con reservaciones');
            }
            setMoviesWithReservations(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const formatDate = (dateString) => {
        let date;

        if (dateString.includes("T") && dateString.includes("Z")) {
            date = new Date(dateString); // Crear fecha directamente desde formato ISO
        } else {
            date = new Date(dateString + "T00:00:00"); // Añadir hora local para evitar problemas de zona horaria
        }

        if (isNaN(date.getTime())) {
            console.error("Fecha no válida:", dateString);
            return "Fecha no válida";
        }

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const updateCurrentOrders = (data, page) => {
        const startIndex = page * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        const currentsOrden = data.slice(startIndex, endIndex);
        setCurrentsOrden(currentsOrden);
    };

    const handlePageChange = (direction) => {
        let newPage = currentPage;
        if (direction === "next") {
            newPage = currentPage + 1;
        } else if (direction === "prev" && currentPage > 0) {
            newPage = currentPage - 1;
        }
        setCurrentPage(newPage);
        updateCurrentOrders(filteredOrders, newPage);
    };

    const openInvoiceModal = (orden, user, movie) => {
        setSelectedOrder(orden);
        setSelectedMovie(movie);
        setSelectedUser(user);
        setInvoiceModal(true);
    };

    const filteredOrdersPerDate = () => {
        if (!dataSelected) {
            setFilteredOrders(ordenData);
            updateCurrentOrders(ordenData, currentPage);
            return;
        }

        const updateOrdersPerDate = ordenData.filter(
            (orden) => formatDate(orden.fecha_reserva) === formatDate(dataSelected)
        );
        setFilteredOrders(updateOrdersPerDate);
        updateCurrentOrders(updateOrdersPerDate, currentPage);
    };

    const generatePDF = () => {
        const doc = new jsPDF({
            unit: "px", // Usar píxeles para mayor precisión
            format: [125, 180],
        });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        doc.setFontSize(20);
        doc.text("Factura", 36, 15);

        doc.setFontSize(10);
        doc.text(`Ticket: ${selectedOrder.id_reservacion}`, 10, 30);
        doc.text(`Fecha: ${formatDate(selectedOrder.fecha_reserva)}`, 10, 38);

        // Línea divisoria
        doc.setDrawColor(0);

        // Información del cliente
        doc.text(`Cliente: ${selectedUser ? `${selectedUser.nombre} ${selectedUser.apellido}` : "Usuario desconocido"}`, 10, 50);

        // Combos
        if (selectedOrder.combos) {
            doc.text("Combos:", 10, 62);
            let y = 62;
            JSON.parse(selectedOrder.combos).forEach((combo, index) => {
                doc.text(`${combo.nombre}: ${combo.precio} $`, 42, y);
                y += 10;
            });
        }

        // Asientos
        if (selectedOrder.asientos) {
            doc.text("Asientos:", 10, 75);
            let y = 75;
            JSON.parse(selectedOrder.asientos).forEach((asiento, index) => {
                doc.text(`${asiento}`, 42, y);
                y += 10;
            });
        }

        doc.text(`Total: ${selectedOrder.total} $`, 10, 90);
        doc.text(`Total BS: ${selectedOrder.total * 60} BS`, 10, 100);

        doc.save(`factura_${selectedOrder.id_reservacion}.pdf`);
    };

    useEffect(() => {
        getOrdenConfirmated();
        getUsersWithReservations();
        getMoviesWithReservations();
    }, []);

    useEffect(() => {
        filteredOrdersPerDate();
    }, [dataSelected]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className="w-full min-h-screen p-5 bg-gray-100 md:flex md:flex-col md:items-center ">
           
            <header className="w-full flex flex md:flex-row sm:w-[85%] lg:w-[75%] justify-between items-center mb-5">
                <h2 className="text-2xl md:text-3xl font-bold lg:text-3xl">Historial</h2>
                <Link to="/dashboard" className="mt-4 md:mt-0">
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
            </header>

            {/* Filtro de fecha */}
            <div className="w-full mb-5 sm:w-[85%] lg:w-[75%]">
                <p className="text-lg font-bold sm:text-2xl ">Seleccionar fechas: </p>
                <input
                    type="date"
                    className="w-full md:w-1/2 border p-3 rounded mt-2 text-2xl"
                    onChange={(e) => setDataSelected(e.target.value)}
                />
            </div>

            {/* Lista de órdenes */}
            <main className="w-full sm:w-[85%] lg:w-[75%]">
                {filteredOrders.length > 0 ? (
                    <section className="w-full flex flex-col  gap-4">
                        {currentsOrden.map((orden) => {
                            const user = usersWithReservations.find(
                                (user) => user.id_usuario === orden.id_usuario
                            );
                            const movie = moviesWithReservations.find(
                                (movie) => movie.id_pelicula === orden.id_pelicula
                            );

                            return (
                                <div
                                    key={orden.id_reservacion}
                                    className="w-full md:w-full lg:w-full p-4 border rounded-lg bg-white shadow-md cursor-pointer"
                                    onClick={() => openInvoiceModal(orden, user, movie)}
                                >
                                    <p className="text-lg font-medium sm:text-[22px]">Usuario: {user ? `${user.nombre} ${user.apellido}` : "Desconocido"}</p>
                                    <p className="text-md sm:text-[22px]">Película: {movie ? movie.titulo : "Desconocido"}</p>
                                    <p className="text-md sm:text-[22px]">Fecha: {formatDate(orden.fecha_reserva)}</p>
                                    <p className="text-md sm:text-[22px]">Total: {orden.total} $</p>
                                    <p className="text-md sm:text-[22px]">TotalBS: {orden.total * 60} BS</p>
                                </div>
                            );
                        })}

                        <div className="w-full flex justify-between mt-5 ">
                            <button
                                onClick={() => handlePageChange("prev")}
                                disabled={currentPage === 0}
                                className="p-4 bg-[#010739] text-white rounded text-lg font-medium disabled:opacity-50 text-[25px]"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => handlePageChange("next")}
                                disabled={(currentPage + 1) * ordersPerPage >= filteredOrders.length}
                                className="p-3 sm:p-4 bg-[#010739] text-white rounded text-lg font-medium disabled:opacity-50 text-[25px]"
                            >
                                Siguiente
                            </button>
                        </div>
                    </section>
                ) : (
                    <div className="w-full flex justify-center items-center">
                        <p className="text-2xl text-gray-500 text-center">No hay órdenes para la fecha seleccionada</p>
                    </div>
                )}
            </main>

            {/* Modal de factura */}
            {invoiceModal && selectedOrder && (
                <section className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full">
                    <div className="bg-white p-5 rounded-lg w-[90%] max-w-md">
                        <header className="w-full flex flex-col items-center gap-2 pb-6 border-b-2">
                            <h2 className="text-2xl font-bold">Factura</h2>
                            <div className="w-full flex justify-between mt-5">
                                <div>
                                    <p className="text-lg font-medium">Ticket: {selectedOrder.id_reservacion}</p>
                                    <p><strong>Fecha:</strong> {formatDate(selectedOrder.fecha_reserva)}</p>
                                </div>
                                <QRCode
                                    value={selectedOrder.codigo || "No disponible"}
                                    size={80}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    level="Q"
                                />
                            </div>
                        </header>
                        <main className="w-full mt-5">
                            <header className="w-full flex justify-between">
                                <p className="text-lg font-medium">Cliente: </p>
                                <p className="text-md font-medium">
                                    {selectedUser ? `${selectedUser.nombre} ${selectedUser.apellido}` : "Usuario desconocido"}
                                </p>
                            </header>

                            {selectedOrder.combos && (
                                <div className="w-full flex justify-between">
                                    <p className="text-md font-medium">Combos:</p>
                                    <div className="flex gap-2">
                                        {JSON.parse(selectedOrder.combos).map((combo, index) => (
                                            <p key={index}>{combo.nombre}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedOrder.asientos && (
                                <div className="w-full flex justify-between">
                                    <p className="text-md font-medium">Asientos:</p>
                                    <div className="flex gap-2">
                                        {JSON.parse(selectedOrder.asientos).map((asiento, index) => (
                                            <p key={index}>{asiento}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="w-full flex justify-between">
                                <p className="text-md font-medium">Total: </p>
                                <p>{selectedOrder.total} $</p>
                            </div>
                            <div className="w-full flex justify-between">
                                <p className="text-md font-medium">Total BS: </p>
                                <p>{selectedOrder.total * 60} BS</p>
                            </div>
                            <div className="w-full flex justify-center gap-4">
                                <button
                                    onClick={() => setInvoiceModal(false)}
                                    className="mt-4 p-2 bg-[#010739] text-white mx-auto rounded text-lg font-medium"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={generatePDF}
                                    className="mt-4 p-2 bg-green-500 text-white mx-auto rounded text-lg font-medium"
                                >
                                    Descargar PDF
                                </button>
                            </div>
                        </main>
                    </div>
                </section>
            )}
        </section>
    );
};