import React, { useEffect, useState } from 'react';

// Convierte "6,50€" a número 6.5
const convertirPrecio = (precio) => {
    if (!precio) return 0;
    return parseFloat(precio.replace('€', '').replace(',', '.')) || 0;
};

const PantallaPedido = ({ carrito, rondas, confirmarRonda, cancelarRonda }) => {
    const [mesa, setMesa] = useState(null);

    useEffect(() => {
        // Extraer número de mesa desde URL
        const partes = window.location.pathname.split('/');
        const idx = partes.findIndex((p) => p.toLowerCase() === 'mesa');
        if (idx !== -1 && partes[idx + 1]) {
            setMesa(partes[idx + 1]);
        }
    }, []);

    const calcularTotal = () => {
        let total = 0;
        rondas.forEach((ronda) => {
            ronda.forEach((item) => {
                total += convertirPrecio(item.precio);
            });
        });
        carrito.forEach((item) => {
            total += convertirPrecio(item.precio);
        });
        return total.toFixed(2);
    };

    const total = calcularTotal();

    return (
        <div>
            {/* Nº de Mesa */}
            {mesa && (
                <div className="text-sm text-gray-600 mb-3 font-medium text-right">
                    🪑 Mesa <strong>{mesa}</strong>
                </div>
            )}

            <h2 className="text-lg font-bold text-[#BB5030] mb-4">Tu Pedido</h2>

            {/* Rondas anteriores */}
            {rondas.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2 text-gray-700">🕓 Rondas anteriores:</h3>
                    {rondas.map((ronda, index) => (
                        <div key={index} className="mb-3 bg-gray-100 rounded-lg p-3 shadow-sm">
                            <h4 className="text-xs font-medium mb-2 text-gray-600">Ronda {index + 1}</h4>
                            <ul className="text-sm text-gray-800 list-disc list-inside">
                                {ronda.map((item, i) => (
                                    <li key={i}>
                                        {item.producto} - {item.precio}
                                        {item.precio_entera ? ` / ${item.precio_entera}` : ''}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Ronda actual */}
            <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-700">📝 Ronda actual:</h3>
                {carrito.length > 0 ? (
                    <ul className="text-sm text-gray-800 list-disc list-inside mb-4">
                        {carrito.map((item, index) => (
                            <li key={index}>
                                {item.producto} - {item.precio}
                                {item.precio_entera ? ` / ${item.precio_entera}` : ''}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No hay productos en la ronda actual.</p>
                )}
            </div>

            {/* Total acumulado */}
            {total > 0 && (
                <div className="bg-white border-t border-gray-200 py-4 px-2 mb-4 rounded-lg shadow-sm flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">💶 Total acumulado:</span>
                    <span className="text-lg font-bold text-[#BB5030]">{total} €</span>
                </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-4">
                    <button
                        onClick={confirmarRonda}
                        className="flex-1 bg-[#BB5030] text-white text-sm py-2 rounded-lg hover:bg-[#9a3d25] transition"
                    >
                        Confirmar Ronda
                    </button>
                    <button
                        onClick={cancelarRonda}
                        className="flex-1 bg-gray-300 text-black text-sm py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancelar Ronda
                    </button>
                </div>

                {/* Botón de pagar si hay productos */}
                {total > 0 && (
                    <button className="bg-green-600 text-white text-sm py-2 rounded-lg hover:bg-green-700 transition mt-2">
                        🧾 Pagar cuenta total
                    </button>
                )}
            </div>
        </div>
    );
};

export default PantallaPedido;



