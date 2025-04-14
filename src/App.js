// src/App.js
import React, { useState, useEffect } from 'react';
import PantallaMenu from './screens/PantallaMenu';
import ResumenPedido from './screens/ResumenPedido';
import AsistenteVirtual from './screens/AsistenteVirtual';
import PantallaBarista from './screens/PantallaBarista';
import './i18n';

// Importa funciones de Firestore
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const STORAGE_KEY_RONDA_ACTUAL = 'barmanGo_rondaActual';
const STORAGE_KEY_RONDAS_CONFIRMADAS = 'barmanGo_rondasConfirmadas';

function App() {
  // Número de mesa (puedes hacerlo dinámico según lo requieras)
  const mesaNumero = 1;

  const [pestanaActiva, setPestanaActiva] = useState('menu');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [rondaActual, setRondaActual] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY_RONDA_ACTUAL);
    return stored ? JSON.parse(stored) : [];
  });
  
  // Si en localStorage existe un array, lo descartamos y usamos un objeto vacío
  const [rondasConfirmadas, setRondasConfirmadas] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY_RONDAS_CONFIRMADAS);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? {} : parsed;
    }
    return {};
  });

  const [mostrarContacto, setMostrarContacto] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState(null);

  // Estados para el login de barista
  const [isBarista, setIsBarista] = useState(false);
  const [mostrarLoginBarista, setMostrarLoginBarista] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const cantidadEnRonda = rondaActual.length;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RONDA_ACTUAL, JSON.stringify(rondaActual));
  }, [rondaActual]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RONDAS_CONFIRMADAS, JSON.stringify(rondasConfirmadas));
  }, [rondasConfirmadas]);

  // Sincroniza en Firestore cada vez que cambie el pedido de la mesa
  useEffect(() => {
    const mesaDoc = doc(db, 'mesas', `mesa_${mesaNumero}`);
    setDoc(
      mesaDoc,
      { 
        numero: mesaNumero, 
        rondaActual, 
        rondasConfirmadas 
      },
      { merge: true }
    );
  }, [mesaNumero, rondaActual, rondasConfirmadas]);

  const handleSeleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setPestanaActiva('asistente');
  };

  const handleConfirmarProducto = (productoConCantidad) => {
    setRondaActual(prev => [...prev, productoConCantidad]);
    setProductoSeleccionado(null);
  };

  const handleCancelarConfirmacion = () => {
    setProductoSeleccionado(null);
  };

  // Al confirmar la ronda, se guarda en el objeto "rondasConfirmadas" usando una clave única
  const handleConfirmarRonda = () => {
    if (rondaActual.length > 0) {
      const newRoundNumber = Object.keys(rondasConfirmadas).length + 1;
      setRondasConfirmadas(prev => ({
         ...prev,
         [`round_${newRoundNumber}`]: rondaActual,
      }));
      setRondaActual([]);
    }
  };

  const toggleContacto = () => {
    setMostrarContacto(!mostrarContacto);
  };

  const limpiarPedido = () => {
    setRondaActual([]);
    setRondasConfirmadas({});
    localStorage.removeItem(STORAGE_KEY_RONDA_ACTUAL);
    localStorage.removeItem(STORAGE_KEY_RONDAS_CONFIRMADAS);
  };

  const navegarAPestana = (pestana, categoria = null) => {
    setPestanaActiva(pestana);
    setCategoriaFiltro(categoria);
  };

  // Función para manejar el login de barista
  const handleBaristaLogin = () => {
    // Se usa una contraseña hardcodeada "barista123". Cámbiala o implementa un sistema más seguro.
    if (passwordInput === "barista123") {
      setIsBarista(true);
      setMostrarLoginBarista(false);
      setPasswordInput('');
      setMensajeError('');
      setPestanaActiva('barista');
    } else {
      setMensajeError("Contraseña incorrecta. Inténtalo de nuevo.");
    }
  };

  const handleBaristaClick = () => {
    if (isBarista) {
      setPestanaActiva('barista');
    } else {
      setMostrarLoginBarista(true);
    }
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
          <button
            onClick={handleBaristaClick}
            className={`text-white px-2 py-1 rounded-md text-xs sm:text-sm font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75 ${pestanaActiva === 'barista' ? 'bg-primary-700' : ''}`}
          >
            <span className="text-lg mr-1">👀</span> Barista
          </button>
        </nav>
      </div>

      {/* Modal de login para Barista */}
      {mostrarLoginBarista && (
        <div className="fixed top-0 left-0 w-full h-full bg-primary-500 bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <h2 className="text-xl font-bold text-primary-500 mb-3 sm:mb-4">
              Acceso de Barista
            </h2>
            <p className="text-neutral-700 mb-3">Introduce la contraseña para acceder:</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring focus:ring-primary-400"
            />
            {mensajeError && <p className="text-red-500 text-sm mb-3">{mensajeError}</p>}
            <div className="flex justify-center gap-2">
              <button
                onClick={handleBaristaLogin}
                className="bg-primary-500 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                Ingresar
              </button>
              <button
                onClick={() => {
                  setMostrarLoginBarista(false);
                  setPasswordInput('');
                  setMensajeError('');
                }}
                className="bg-gray-300 text-black px-3 py-1 rounded-md text-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="mt-[56px] sm:mt-[64px]">
        <div className="max-w-3xl mx-auto shadow-xl rounded-xl overflow-hidden">
          {mostrarContacto && (
            <div className="fixed top-0 left-0 w-full h-full bg-primary-500 bg-opacity-90 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
                <h2 className="text-xl font-bold text-primary-500 mb-3 sm:mb-4">
                  ¿Eres barista y quieres BarmanGo?
                </h2>
                <p className="text-neutral-700 mb-1 sm:mb-2 text-sm">
                  Contacta con nosotros:
                </p>
                <p className="text-neutral-700 mb-1 sm:mb-2 text-sm">
                  Correo: <a href="mailto:info@armangoapp.com" className="text-primary-500 underline">info@armangoapp.com</a>
                </p>
                <p className="text-neutral-700 mb-3 sm:mb-4 text-sm">
                  Teléfono: <a href="tel:622622959" className="text-primary-500 underline">622 622 959</a>
                </p>
                <button
                  onClick={toggleContacto}
                  className="bg-primary-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

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
            {pestanaActiva === 'barista' && (
              <PantallaBarista />
            )}
          </div>
        </div>
      </div>

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









