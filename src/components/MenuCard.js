import React from 'react';

const MenuCard = ({ producto, onSeleccionar }) => {
    const {
        producto: nombre,
        precio,
        precio_entera,
        precio_media,
        ref,
        categoria,
        imagen, // Suponiendo que tienes una propiedad 'imagen' en tus datos
    } = producto;

    const mostrarPrecios = () => {
        if (precio_media) {
            const precioCompleto = precio_entera ? precio_entera : precio;
            return (
                <div className="text-sm text-neutral-600 mt-1">
                    <span className="inline-block bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded mr-1 text-xs">Media: {precio_media} €</span>
                    <span className="inline-block bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs">Entera: {precioCompleto} €</span>
                </div>
            );
        }
        return (
            <p className="text-sm text-neutral-600 mt-1 text-xs">
                Precio: {precio} 
            </p>
        );
    };

    return (
        <div
            className="bg-white border border-neutral-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition duration-200 ease-in-out cursor-pointer mb-2"
            onClick={() => onSeleccionar(producto)}
        >
            {imagen && (
                <img src={imagen} alt={nombre} className="w-full h-24 sm:h-32 object-cover" />
            )}
            <div className="p-2 sm:p-4">
                <h3 className="font-semibold text-neutral-800 text-sm sm:text-lg">{nombre}</h3>
                {mostrarPrecios()}
                <button className="bg-primary-500 text-white px-2 py-1 text-xs rounded-md mt-1 sm:mt-2 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75">
                    Pedir
                </button>
            </div>
        </div>
    );
};

export default MenuCard;








