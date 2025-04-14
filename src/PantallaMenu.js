import React, { useState } from 'react';
import menuData from './data/menu';

const PantallaMenu = ({ solicitarConfirmacion }) => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const categorias = ['Todas', ...new Set(menuData.map(p => p.categoria))];

    const filtrarProductos = () => {
        return categoriaSeleccionada === 'Todas'
            ? menuData
            : menuData.filter(p => p.categoria === categoriaSeleccionada);
    };

    return (
        <div>
            <h1 className="text-xl font-bold text-[#BB5030] text-center mb-4">
                Bienvenido a Bar Manoli II
            </h1>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Filtrar por categoría:</label>
                <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-[#BB5030]/40"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                >
                    {categorias.map((cat) => (
                        <option key={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filtrarProductos().map((producto) => (
                    <div
                        key={producto.ref}
                        className="bg-white p-4 rounded-xl shadow border border-gray-200"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-semibold text-[#BB5030]">{producto.producto}</h3>
                                <p className="text-sm text-gray-600">
                                    {producto.precio}
                                    {producto.precio_entera ? ` / ${producto.precio_entera}` : ''}
                                </p>
                            </div>
                            <button
                                onClick={() => solicitarConfirmacion(producto)}
                                className="bg-[#BB5030] text-white text-xs px-3 py-1.5 rounded-lg hover:bg-[#9a3d25] transition"
                            >
                                Añadir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PantallaMenu;


