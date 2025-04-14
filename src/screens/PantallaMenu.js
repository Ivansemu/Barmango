import React, { useEffect, useState } from 'react';
import menuData from '../data/menu';
import MenuCard from '../components/MenuCard';
import { useTranslation } from 'react-i18next';

const PantallaMenu = ({ onSeleccionar, filtroCategoria }) => {
    const [activeCategory, setActiveCategory] = useState('Todos');
    const { t } = useTranslation();
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        // Se obtienen las categorías únicas del menú
        const uniqueCategories = Array.from(new Set(menuData.map((item) => item.categoria)));
        // Se añade la opción "Todos" para mostrar todos los productos
        setCategorias(['Todos', ...uniqueCategories]);
    }, []); // El array de dependencias vacío asegura que esto solo se ejecute una vez al montar el componente

    useEffect(() => {
        // Si se recibe un filtro de categoría, se aplica
        if (filtroCategoria && categorias.includes(filtroCategoria)) {
            setActiveCategory(filtroCategoria);
        } else {
            setActiveCategory('Todos'); // O la categoría por defecto que prefieras cuando no hay filtro válido
        }
    }, [filtroCategoria, categorias]); // Reacciona a cambios en filtroCategoria o en la lista de categorías (aunque esta última no debería cambiar)

    // Filtra los productos dependiendo de la categoría activa
    const filteredMenuData =
        activeCategory === 'Todos'
            ? menuData
            : menuData.filter((item) => item.categoria === activeCategory);

    return (
        <div className="py-4">
            {/* Título del Bar */}
            <div className="px-4 mb-4 flex justify-center">
                <h1 className="text-xl sm:text-2xl font-bold text-primary-500">BAR MANOLI II</h1>
            </div>

            {/* Botones de categoría */}
            <div className="bg-white shadow-sm rounded-md overflow-x-auto flex gap-2 px-2 py-1 mb-4 sticky top-0 z-10">
                {categorias.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-shrink-0 px-3 py-1 rounded-md text-sm font-semibold focus:outline-none transition-colors ${activeCategory === cat
                                ? 'bg-primary-500 text-white'
                                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                            }`}
                    >
                        {t(cat)}
                    </button>
                ))}
            </div>

            {/* Contenido filtrado */}
            <div className="overflow-y-auto space-y-6 pb-12 pt-2">
                <div className="px-2">
                    <h2 className="text-primary-500 font-bold text-lg mb-2">
                        {activeCategory !== 'Todos' ? t(activeCategory) : t('Menú Completo')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredMenuData.map((item) => (
                            <MenuCard key={item.ref} producto={item} onSeleccionar={onSeleccionar} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PantallaMenu;



