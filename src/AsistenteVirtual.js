import React, { useEffect, useRef, useState } from 'react';
import menuData from '../data/menu';

const AsistenteVirtual = ({
    producto: productoProp, // Renombramos para evitar confusión con el estado local
    confirmarProducto,
    cancelarConfirmacion,
    confirmarRonda,
    irAPestana
}) => {
    const [mensajes, setMensajes] = useState([]);
    const chatRef = useRef(null);
    const [input, setInput] = useState('');
    const [productoTemporal, setProductoTemporal] = useState(null);
    const [cantidadTemporal, setCantidadTemporal] = useState(1); // Estado para la cantidad temporal

    useEffect(() => {
        setMensajes([
            {
                texto: '¡Buenas! Bienvenido al Bar Manoli II. Soy su camarero virtual 🤖 ¿En qué puedo ayudarle hoy?',
                tipo: 'bienvenida'
            },
            {
                texto: '¿Le gustaría ver nuestra carta o tiene alguna pregunta?',
                tipo: 'bot'
            }
        ]);
    }, []);

    const añadirMensaje = (msg) => {
        setMensajes((prev) => [...prev, msg]);
    };

    const añadirBot = (texto) => {
        añadirMensaje({ texto, tipo: 'bot' });
    };

    const enviarMensajeUsuario = (texto) => {
        añadirMensaje({ texto, tipo: 'user' });
        responderInteligente(texto.toLowerCase());
    };

    const responderInteligente = (texto) => {
        const palabras = texto.split(' ');
        const productoDetectado = menuData.find(p => texto.includes(p.producto.toLowerCase()));
        const cantidadDetectada = palabras.find(palabra => !isNaN(parseInt(palabra)));
        const cantidad = cantidadDetectada ? parseInt(cantidadDetectada) : 1;

        if (texto.includes('barmango')) {
            añadirBot('BarmanGo es un sistema para pedir desde tu mesa. Puede seleccionar productos, confirmarlos y pagar desde su móvil.');
        } else if (texto.includes('pagar')) {
            añadirBot('Puede pagar en efectivo o con tarjeta una vez confirme su pedido.');
        } else if (texto.includes('menu') || texto.includes('carta')) {
            const categorias = [...new Set(menuData.map((p) => p.categoria))];
            añadirBot(`Nuestra carta incluye: ${categorias.join(', ')}. ¿Qué le apetece hoy?`);
        } else if (texto.includes('cuánto') || texto.includes('precio')) {
            const coinc = menuData.find((p) => texto.includes(p.producto.toLowerCase()));
            if (coinc) {
                añadirBot(`"${coinc.producto}" cuesta ${coinc.precio}${coinc.precio_entera ? ' / ' + coinc.precio_entera : ''}`);
            } else {
                añadirBot('¿Qué producto le gustaría consultar el precio?');
            }
        } else if (productoDetectado) {
            setProductoTemporal(productoDetectado);
            setCantidadTemporal(cantidad);
            añadirMensaje({
                texto: `¿Quiere añadir *${cantidad}* unidad${cantidad > 1 ? 'es' : ''} de *${productoDetectado.producto}* a su pedido?`,
                tipo: 'confirmacion-cantidad',
                producto: productoDetectado,
                cantidad: cantidad
            });
        } else if (texto.includes('recomienda') || texto.includes('sugiere')) {
            // Aquí podrías implementar una lógica más avanzada para recomendaciones
            const platoAleatorio = menuData[Math.floor(Math.random() * menuData.length)];
            añadirBot(`Hoy le recomendaría probar nuestro delicioso "${platoAleatorio.producto}". ¡Es uno de los favoritos!`);
        } else if (texto.includes('no entiendo') || texto.includes('perdón')) {
            añadirBot('Disculpe, ¿podría reformular su pregunta? Estoy aquí para ayudarle.');
        } else {
            añadirBot('Estoy aprendiendo. ¿Hay algún plato o bebida en particular que le interese? También puede preguntar por el menú o la forma de pago.');
        }
    };

    useEffect(() => {
        if (productoProp) {
            if (productoProp.precio_media) {
                setProductoTemporal(productoProp);
                añadirMensaje({
                    tipo: 'elegirTipo',
                    texto: `¿Cómo quiere "${productoProp.producto}"?`
                });
            } else {
                mostrarConfirmacionProducto(productoProp, 1); // Si viene directamente del menú, cantidad por defecto 1
            }
        }
    }, [productoProp]);

    const mostrarConfirmacionProducto = (productoConfirmado, cantidad = 1) => {
        añadirMensaje({
            texto: `¿Quieres añadir *${cantidad}* unidad${cantidad > 1 ? 'es' : ''} de *${productoConfirmado.producto}* a tu pedido?`,
            tipo: 'confirmacion',
            producto: productoConfirmado,
            cantidad: cantidad
        });
    };

    const elegirMediaOEntera = (tipo) => {
        if (!productoTemporal) return;
        const productoFinal = {
            ...productoTemporal,
            producto: `${productoTemporal.producto} (${tipo})`,
            precio: tipo === 'media' ? productoTemporal.precio_media : productoTemporal.precio_entera
        };
        mostrarConfirmacionProducto(productoFinal, cantidadTemporal);
        setProductoTemporal(null);
        setCantidadTemporal(1); // Resetear la cantidad temporal
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [mensajes]);

    const alergenos = (producto) => {
        añadirBot(`Alérgenos de ${producto.producto}: No disponibles aún.`);
    };

    const ingredientes = (producto) => {
        añadirBot(`Ingredientes de ${producto.producto}: Aún no especificados.`);
    };

    const trasConfirmarProducto = () => {
        añadirBot('¿Quiere añadir algo más a la ronda o enviar el pedido al camarero?');
        añadirMensaje({ tipo: 'accionesPostConfirmacion' });
    };

    const handleConfirmarProductoConCantidad = (productoAConfirmar, cantidadAConfirmar) => {
        confirmarProducto({ ...productoAConfirmar, cantidad: cantidadAConfirmar });
        trasConfirmarProducto();
    };

    return (
        <div>
            <div
                ref={chatRef}
                className="h-[55vh] overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner space-y-3 mb-2"
            >
                {mensajes.map((msg, i) => (
                    <div key={i}>
                        {msg.tipo === 'bienvenida' && (
                            <div className="space-y-2">
                                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl w-fit text-sm">
                                    {msg.texto}
                                </div>
                                <button
                                    className="bg-[#BB5030] text-white text-xs px-3 py-1.5 rounded-md"
                                    onClick={() =>
                                        añadirBot('Con BarmanGo puede pedir desde su móvil, confirmar su pedido y pagar desde la mesa. El camarero recibe su comanda en tiempo real.')
                                    }
                                >
                                    Sí, cuénteme
                                </button>
                            </div>
                        )}

                        {msg.tipo === 'bot' && (
                            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl w-fit text-sm">
                                {msg.texto}
                            </div>
                        )}

                        {msg.tipo === 'user' && (
                            <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-xl w-fit ml-auto text-sm">
                                {msg.texto}
                            </div>
                        )}

                        {msg.tipo === 'elegirTipo' && (
                            <div>
                                <div className="bg-yellow-100 text-gray-800 font-medium px-4 py-2 rounded-xl w-fit text-sm mb-2">
                                    {msg.texto}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => elegirMediaOEntera('media')}
                                        className="bg-[#BB5030] text-white text-xs px-3 py-1 rounded-md"
                                    >
                                        Media
                                    </button>
                                    <button
                                        onClick={() => elegirMediaOEntera('entera')}
                                        className="bg-[#BB5030] text-white text-xs px-3 py-1 rounded-md"
                                    >
                                        Entera
                                    </button>
                                </div>
                            </div>
                        )}

                        {msg.tipo === 'confirmacion' && msg.producto && (
                            <div>
                                <div className="bg-yellow-100 text-gray-800 font-medium px-4 py-2 rounded-xl w-fit text-sm">
                                    {msg.texto}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <button
                                        onClick={() => {
                                            confirmarProducto({ ...msg.producto, cantidad: msg.cantidad || 1 });
                                            trasConfirmarProducto();
                                        }}
                                        className="bg-[#BB5030] text-white text-xs px-3 py-1 rounded-md"
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        onClick={cancelarConfirmacion}
                                        className="bg-gray-300 text-black text-xs px-3 py-1 rounded-md"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => alergenos(msg.producto)}
                                        className="bg-[#BB5030] text-white text-xs px-3 py-1 rounded-md"
                                    >
                                        Ver alérgenos
                                    </button>
                                    <button
                                        onClick={() => ingredientes(msg.producto)}
                                        className="bg-[#BB5030] text-white text-xs px-3 py-1 rounded-md"
                                    >
                                        Ver ingredientes
                                    </button>
                                </div>
                            </div>
                        )}

                        {msg.tipo === 'confirmacion-cantidad' && msg.producto && (
                            <div>
                                <div className="bg-yellow-100 text-gray-800 font-medium px-4 py-2 rounded-xl w-fit text-sm">
                                    {msg.texto}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <button
                                        onClick={() => handleConfirmarProductoConCantidad(msg.producto, msg.cantidad)}
                                        className="bg-[#BB5030] text-white text-xs px-3 py-1 rounded-md"
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        onClick={cancelarConfirmacion}
                                        className="bg-gray-300 text-black text-xs px-3 py-1 rounded-md"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => alergenos(msg.producto)}
                                        className="bg-[#BB5030] text-white text-xs px-3 py-1 rounded-md"
                                    >
                                        Ver alérgenos
                                    </button>
                                    <button
                                        onClick={() => ingredientes(msg.producto)}
                                        className="bg-[#BB5030] text-white text-xs px-3 py-1 rounded-md"
                                    >
                                        Ver ingredientes
                                    </button>
                                </div>
                            </div>
                        )}

                        {msg.tipo === 'accionesPostConfirmacion' && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                <button
                                    onClick={() => irAPestana('menu')}
                                    className="bg-[#BB5030] text-white text-xs px-3 py-1 rounded-md"
                                >
                                    Añadir más productos
                                </button>
                                <button
                                    onClick={() => {
                                        confirmarRonda();
                                        irAPestana('pedido');
                                    }}
                                    className="bg-green-600 text-white text-xs px-3 py-1 rounded-md"
                                >
                                    Confirmar ronda
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Escribe una pregunta..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-[#BB5030]/40"
                />
                <button
                    onClick={() => {
                        if (input.trim()) {
                            enviarMensajeUsuario(input.trim());
                            setInput('');
                        }
                    }}
                    className="bg-[#BB5030] text-white text-sm px-4 py-2 rounded-lg"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default AsistenteVirtual;





