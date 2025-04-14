// src/screens/PantallaBarista.js
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const PantallaBarista = () => {
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'mesas'), (snapshot) => {
      const mesasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMesas(mesasData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pedidos de las Mesas</h1>
      {mesas.length === 0 ? (
        <p>No hay pedidos.</p>
      ) : (
        mesas.map((mesa) => (
          <div key={mesa.id} className="mb-4 border p-4 rounded shadow">
            <h2 className="font-semibold text-xl mb-2">Mesa {mesa.numero}</h2>
            {/* Ronda Actual */}
            <div className="mb-2">
              <h3 className="text-lg font-bold">Ronda Actual:</h3>
              {mesa.rondaActual && mesa.rondaActual.length > 0 ? (
                mesa.rondaActual.map((item, index) => (
                  <div key={index} className="flex justify-between border-b py-1">
                    <span className="flex-1">
                      {item.cantidad} x {item.producto} {item.tipo && `(${item.tipo})`}
                    </span>
                    <span className="ml-2">{item.precio}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay productos añadidos en la ronda actual.</p>
              )}
            </div>
            {/* Rondas Confirmadas */}
            {mesa.rondasConfirmadas && Object.keys(mesa.rondasConfirmadas).length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-1">Rondas Confirmadas:</h3>
                {Object.entries(mesa.rondasConfirmadas).map(([roundKey, items]) => (
                  <div key={roundKey} className="mb-2 border p-2 rounded">
                    <p className="font-medium">{roundKey}</p>
                    {items.map((item, j) => (
                      <div key={j} className="flex justify-between border-b py-1">
                        <span className="flex-1">
                          {item.cantidad} x {item.producto} {item.tipo && `(${item.tipo})`}
                        </span>
                        <span className="ml-2">{item.precio}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PantallaBarista;
