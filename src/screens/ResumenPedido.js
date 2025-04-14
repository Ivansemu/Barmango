// src/screens/ResumenPedido.js
import React, { useState } from 'react';

const ResumenPedido = ({
  rondaActual,
  rondasConfirmadas,
  setRondaActual,
  confirmarRonda,
  mesa = 1,
}) => {
  const [mensajePago, setMensajePago] = useState('');

  const cancelarItem = (index) => {
    const nuevaRonda = [...rondaActual];
    nuevaRonda.splice(index, 1);
    setRondaActual(nuevaRonda);
  };

  const calcularTotal = () => {
    // Convierte el objeto rondasConfirmadas en un array de arrays y los aplanamos
    const roundsArray = Object.values(rondasConfirmadas);
    const totalRondas = roundsArray.flat().reduce((acc, item) => {
      const precioUnitario = parseFloat(
        item.precio?.replace('€', '').replace(',', '.') || 0
      );
      return acc + precioUnitario * (item.cantidad || 1);
    }, 0);
    const totalActual = rondaActual.reduce((acc, item) => {
      const precioUnitario = parseFloat(
        item.precio?.replace('€', '').replace(',', '.') || 0
      );
      return acc + precioUnitario * (item.cantidad || 1);
    }, 0);
    return (totalRondas + totalActual).toFixed(2);
  };

  const realizarPago = () => {
    setMensajePago('✅ Tu camarero ha sido avisado y se acercará a cobrar.');
    // Aquí podrías integrar alguna llamada a tu backend o a Firebase para registrar el pago
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#BB5030] mb-4">
        Resumen del Pedido - Mesa {mesa}
      </h2>

      {/* Rondas confirmadas */}
      {Object.keys(rondasConfirmadas).length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-1">🧾 Rondas Confirmadas:</h3>
          {Object.entries(rondasConfirmadas).map(([roundKey, items]) => (
            <div key={roundKey} className="mb-2 bg-gray-100 p-2 rounded-md border">
              <p className="text-sm font-medium text-[#BB5030] mb-1">
                {roundKey}
              </p>
              {items.map((item, idx) => (
                <div key={idx} className="text-sm flex justify-between text-gray-700">
                  <span>
                    {item.cantidad > 1 && `${item.cantidad} x `}{item.producto} {item.tipo && `(${item.tipo})`}
                  </span>
                  <span>
                    {(parseFloat(item.precio?.replace('€', '').replace(',', '.') || 0) * (item.cantidad || 1)).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Ronda actual */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1">🕒 Ronda Actual:</h3>
        {rondaActual.length === 0 ? (
          <p className="text-sm text-gray-500">No hay productos añadidos.</p>
        ) : (
          <div className="bg-white p-2 rounded-md border">
            {rondaActual.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm mb-2">
                <span>
                  {item.cantidad > 1 && `${item.cantidad} x `}{item.producto} {item.tipo && `(${item.tipo})`}
                </span>
                <div className="flex items-center gap-2">
                  <span>
                    {(parseFloat(item.precio?.replace('€', '').replace(',', '.') || 0) * (item.cantidad || 1)).toFixed(2)} €
                  </span>
                  <button
                    className="text-red-500 font-bold text-xs"
                    onClick={() => cancelarItem(index)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total y acciones */}
      {(rondaActual.length > 0 || Object.keys(rondasConfirmadas).length > 0) && (
        <div className="space-y-2">
          <div className="text-sm text-center">
            <p className="text-gray-600">Total estimado:</p>
            <p className="text-lg font-bold text-[#BB5030]">{calcularTotal()} €</p>
          </div>

          {/* Botón confirmar ronda */}
          {rondaActual.length > 0 && (
            <button
              onClick={confirmarRonda}
              className="bg-[#BB5030] text-white px-3 py-1 text-sm rounded-md w-full hover:bg-[#a84328]"
            >
              ✅ Confirmar ronda
            </button>
          )}

          {/* Botón pagar */}
          {Object.keys(rondasConfirmadas).length > 0 && (
            <button
              onClick={realizarPago}
              className="bg-green-600 text-white px-3 py-1 text-sm rounded-md w-full hover:bg-green-700"
            >
              💳 Pagar pedido
            </button>
          )}

          {/* Mensaje tras pago */}
          {mensajePago && (
            <p className="text-green-700 text-sm mt-2 text-center">{mensajePago}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumenPedido;












