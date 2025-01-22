import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const BillTicket = () => {
    const [currentOrden, setCurrentOrden] = useState(false);
    const [code, setCode] = useState('');
    const [ordenData, setOrdenData] = useState({});
    const [error, setError] = useState('');
    const [messageConfirmated, setMessageConfirmated] = useState('');
    const [modalConfirmated, setModalConfirmated] = useState(false);

  
    useEffect(() => {
        if (error || modalConfirmated) {
            const timer = setTimeout(() => {
                setError('');
                setCode('');
                setModalConfirmated(false);
                setOrdenData({})
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error,modalConfirmated]);

    // Obtener la orden reservada
    const getOrderReservated = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://salaginex.onrender.com/orden', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ code: code }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al buscar la orden');
            }

            if (data.error) {
                setError(data.error);
                setCurrentOrden(false);
                setOrdenData({});
            } else {
                const orden = data.data[0];
                if (typeof orden.asientos === 'string') {
                    orden.asientos = JSON.parse(orden.asientos);
                }
                if (typeof orden.combos === 'string') {
                    orden.combos = JSON.parse(orden.combos);
                }

                setOrdenData(orden);
                setCurrentOrden(true);
                setError('');
            }
        } catch (error) {
            console.error(error);
            setError(error.message || 'Ocurrió un error al buscar la orden');
            setCurrentOrden(false);
            setOrdenData({});
        }
    };

    // Confirmar la reservación
    const handleConfirmReservation = async () => {
        try {
            const response = await fetch('http://salaginex.onrender.com/orden', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ confirmado: 1, codigo: ordenData.codigo }),
                credentials: 'include'
            });
            const data = await response.json();

            if (!response.ok) {
                setError('Error al confirmar la orden.');
            } else {
                setMessageConfirmated('Orden confirmada.');
                setCode('');
                setError('');
                setModalConfirmated(true); // Mostrar el modal de confirmación
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <section className="w-full h-full sm:w-[60%] sm:mx-auto">
                <header className="w-full p-5 flex justify-between items-center">
                    <h2 className="text-[24px] font-medium">Facturar Ticket</h2>
                    <div className="flex gap-2">
                        <Link to='/dashboard'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                    </div>
                </header>
                <main className="w-[100%] p-5">
                    <form className="w-full flex flex-col gap-2" onSubmit={getOrderReservated}>
                        <div className="w-full flex flex-col gap-3">
                            <label htmlFor="codigo" className="text-lg font-medium">Código de ticket: </label>
                            <input
                                type="text"
                                id="codigo"
                                placeholder="Ingresa el código QR"
                                className="p-3 border rounded-[8px] w-full"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="p-3 bg-[#010739] text-white font-medium w-[30%] rounded-[8px] mt-2 lg:w-[20%]">
                            Buscar
                        </button>
                    </form>

                    {currentOrden && ordenData.asientos && ordenData.combos ? (
                        <section className="w-full h-[300px] flex flex-col mt-4 shadow-md p-5">
                            <h2 className="text-2xl font-bold mx-auto">Factura</h2>
                            <ul className="w-full flex flex-col justify-center mt-5 px-2">
                                <li className="flex items-center justify-between gap-2">
                                    <p className="text-left text-lg font-medium">Fecha de reservación: </p>
                                    <small className="text-[15px]">{new Date(ordenData.fecha_reserva).toLocaleDateString()}</small>
                                </li>
                                <li className="flex items-center justify-between gap-2">
                                    <p className="text-left text-lg font-medium">Asientos reservados: </p>
                                    <small className="text-[15px]">{Array.isArray(ordenData.asientos) ? ordenData.asientos.join(", ") : "No hay asientos"}</small>
                                </li>
                                <li className="flex items-center justify-between gap-2">
                                    <p className="text-left text-lg font-medium">Combos seleccionados: </p>
                                    <small className="text-[15px]">{Array.isArray(ordenData.combos) ? ordenData.combos.map((combo) => combo.nombre).join(", ") : "No hay combos"}</small>
                                </li>
                                <li className="flex items-center justify-between gap-2">
                                    <p className="text-left text-lg font-medium">Total: </p>
                                    <small className="text-[15px]">${ordenData.total}</small>
                                </li>
                                <li className="flex items-center justify-between gap-2">
                                    <p className="text-left text-lg font-medium">Total BS: </p>
                                    <small className="text-[15px]">{ordenData.total * 60} BS</small>
                                </li>
                            </ul>

                            <button onClick={handleConfirmReservation} className="p-2 bg-[#010739] text-white font-medium w-[30%] rounded-[8px] mt-4">Confirmar</button>
                        </section>
                    ) : (
                        <section className="w-full h-[250px] flex justify-center items-center">
                            {error ? (
                                <p className="text-red-500 text-[52px] mt-4 mx-auto">{error}</p>
                            ) : (
                                <p className="text-3xl text-gray-300 text-center">No hay órdenes</p>
                            )}
                        </section>
                    )}

                    {modalConfirmated && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white rounded-lg w-[95%] p-5 max-w-2xl">
                                <p>{messageConfirmated}</p>
                        
                            </div>
                        </div>
                    )}
                </main>
            </section>
        </>
    );
};