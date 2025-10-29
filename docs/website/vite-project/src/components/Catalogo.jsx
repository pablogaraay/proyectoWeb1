import { useState } from 'react';
import data from '../data/contenidoCartas.json';
import Card from './Card';
import BotonBuscador from './botones/BotonBuscador.jsx';

function Catalogo() {
    const [mostrarBuscador, setMostrarBuscador] = useState(false);
    const [filtrar,setFiltrar] = useState("");

    const cartasFiltradas = data.cartas.filter((carta)=>carta.titulo.toLowerCase().includes(filtrar.trim().toLowerCase()));
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Catálogo de Productos
        </h1>
        <BotonBuscador onfiltrar = {()=>setMostrarBuscador(!mostrarBuscador)}/>
      </div>
      {mostrarBuscador && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={filtrar}
            onChange={(e) => setFiltrar(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cartasFiltradas.map((carta, index) => (
          <Card
            key={index}
            titulo={carta.titulo}
            descripcion={carta.descripcion}
            imagen={carta.imagen}
          />
        ))}
      </div>
    </div>
  );
}

export default Catalogo;
