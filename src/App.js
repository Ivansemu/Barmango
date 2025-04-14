import React, { useState, useEffect } from 'react'; // Importa useEffect
import PantallaMenu from './screens/PantallaMenu';
import ResumenPedido from './screens/ResumenPedido';
import AsistenteVirtual from './screens/AsistenteVirtual';
import './i18n';

const STORAGE_KEY_RONDA_ACTUAL = 'barmanGo_rondaActual';
const STORAGE_KEY_RONDAS_CONFIRMADAS = 'barmanGo_rondasConfirmadas';

function App() {
    const [pestanaActiva, setPestanaActiva] = useState('menu');
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [rondaActual, setRondaActual] = useState(() => { // Carga desde localStorage al iniciar
        const storedRondaActual = localStorage.getItem(STORAGE_KEY_RONDA_ACTUAL);
        return storedRondaActual ? JSON.parse(storedRondaActual) : [];
    });
    const [rondasConfirmadas, setRondasConfirmadas] = useState(() => { // Carga desde localStorage al iniciar
        const storedRondasConfirmadas = localStorage.getItem(STORAGE_KEY_RONDAS_CONFIRMADAS);
        return storedRondasConfirmadas ? JSON.parse(storedRondasConfirmadas) : [];
    });
    const [mostrarContacto, setMostrarContacto] = useState(false);
    const [categoriaFiltro, setCategoriaFiltro] = useState(null); // Nuevo estado para el filtro

    const cantidadEnRonda = rondaActual.length;

    useEffect(() => { // Guarda en localStorage cada vez que cambia
        localStorage.setItem(STORAGE_KEY_RONDA_ACTUAL, JSON.stringify(rondaActual));
    }, [rondaActual]);

    useEffect(() => { // Guarda en localStorage cada vez que cambia
        localStorage.setItem(STORAGE_KEY_RONDAS_CONFIRMADAS, JSON.stringify(rondasConfirmadas));
    }, [rondasConfirmadas]);

    const handleSeleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setPestanaActiva('asistente');
    };

    const handleConfirmarProducto = (productoConCantidad) => {
        setRondaActual((prev) => [...prev, productoConCantidad]);
        setProductoSeleccionado(null);
    };

    const handleCancelarConfirmacion = () => {
        setProductoSeleccionado(null);
    };

    const handleConfirmarRonda = () => {
        if (rondaActual.length > 0) {
            setRondasConfirmadas((prev) => [...prev, rondaActual]);
            setRondaActual([]);
        }
    };

    const toggleContacto = () => {
        setMostrarContacto(!mostrarContacto);
    };

    // Función para limpiar el pedido (será llamada por la "app de barista" - simulado aquí)
    const limpiarPedido = () => {
        setRondaActual([]);
        setRondasConfirmadas([]);
        localStorage.removeItem(STORAGE_KEY_RONDA_ACTUAL);
        localStorage.removeItem(STORAGE_KEY_RONDAS_CONFIRMADAS);
    };

    const navegarAPestana = (pestana, categoria = null) => {
        setPestanaActiva(pestana);
        setCategoriaFiltro(categoria);
    };

    return (
        <div className="bg-neutral-100 min-h-screen font-sans">
            {/* Barra de navegación fija */}
            <div className="fixed top-0 left-0 w-full bg-primary-500 p-2 sm:p-3 flex justify-between items-center z-20">
                <button onClick={toggleContacto}>
                    <img
                        src="https://dc555.4shared.com/img/Er3OQji7jq/s23/195ec2c6f90/BARmangoo"
                        alt="Logo BarmanGo"
                        className="h-8 sm:h-10 cursor-pointer"
                    />
                </button>
                <nav className="flex space-x-1 sm:space-x-2">
                    <button
                        onClick={() => navegarAPestana('menu')}
                        className={`text-white px-2 py-1 rounded-md text-xs sm:text-sm font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75 ${pestanaActiva === 'menu' ? 'bg-primary-700' : ''}`}
                    >
                        <span className="text-lg mr-1">🍽️</span> Menú
                    </button>
                    <button
                        onClick={() => setPestanaActiva('pedido')}
                        className={`relative text-white px-2 py-1 rounded-md text-xs sm:text-sm font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75 ${pestanaActiva === 'pedido' ? 'bg-primary-700' : ''}`}
                    >
                        <span className="text-lg mr-1">🧾</span> Pedido
                        {cantidadEnRonda > 0 && (
                            <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-accent-500 text-white text-xs font-semibold rounded-full px-1 py-0.5 text-[0.7rem]">
                                {cantidadEnRonda}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setPestanaActiva('asistente')}
                        className={`text-white px-2 py-1 rounded-md text-xs sm:text-sm font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75 ${pestanaActiva === 'asistente' ? 'bg-primary-700' : ''}`}
                    >
                        <span className="text-lg mr-1">🤖</span> Asistente
                    </button>
                </nav>
            </div>

            {/* Contenido principal con padding superior para evitar solapamiento */}
            <div className="mt-[56px] sm:mt-[64px]">
                <div className="max-w-3xl mx-auto shadow-xl rounded-xl overflow-hidden">
                    {mostrarContacto && (
                        <div className="fixed top-0 left-0 w-full h-full bg-primary-500 bg-opacity-90 flex justify-center items-center z-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
                                <h2 className="text-xl font-bold text-primary-500 mb-3 sm:mb-4">¿Eres barista y quieres BarmanGo?</h2>
                                <p className="text-neutral-700 mb-1 sm:mb-2 text-sm">Contacta con nosotros:</p>
                                <p className="text-neutral-700 mb-1 sm:mb-2 text-sm">Correo: <a href="mailto:info@armangoapp.com" className="text-primary-500 underline">info@armangoapp.com</a></p>
                                <p className="text-neutral-700 mb-3 sm:mb-4 text-sm">Teléfono: <a href="tel:622622959" className="text-primary-500 underline">622 622 959</a></p>
                                <button onClick={toggleContacto} className="bg-primary-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75">
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pantallas */}
                    <div className="bg-white py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
                        {pestanaActiva === 'menu' && (
                            <PantallaMenu onSeleccionar={handleSeleccionarProducto} filtroCategoria={categoriaFiltro} />
                        )}
                        {pestanaActiva === 'pedido' && (
                            <ResumenPedido
                                rondaActual={rondaActual}
                                rondasConfirmadas={rondasConfirmadas}
                                setRondaActual={setRondaActual}
                                confirmarRonda={handleConfirmarRonda}
                            />
                        )}
                        {pestanaActiva === 'asistente' && (
                            <AsistenteVirtual
                                producto={productoSeleccionado}
                                confirmarProducto={handleConfirmarProducto}
                                cancelarConfirmacion={handleCancelarConfirmacion}
                                confirmarRonda={handleConfirmarRonda}
                                irAPestana={navegarAPestana}
                                rondaActual={rondaActual}
                                rondasConfirmadas={rondasConfirmadas}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Botón simulado de "cerrar mesa" para pruebas */}
            <button
                onClick={limpiarPedido}
                className="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-md z-50"
            >
                Simular Cerrar Mesa
            </button>
        </div>
    );
}

export default App;








