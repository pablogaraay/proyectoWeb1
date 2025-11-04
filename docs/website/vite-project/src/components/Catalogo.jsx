import { useState } from 'react';
import data from '../data/contenidoCartas.json';
import CatalogoCard from './cards/CatalogoCard';
import BotonBuscador from './botones/BotonBuscador.jsx';
import BarraBuscador from './BarraBuscador.jsx';
import { BUSCADOR } from '../constantes.js';


function Catalogo() {
  const [mostrarBuscador, setMostrarBuscador] = useState(BUSCADOR.INEXISTENTE);
  const [filtrar, setFiltrar] = useState('');
  const [abrir,setAbrircarta] = useState(null);

  const onFiltrar = () => {
    const nuevoEstadoBuscador = !mostrarBuscador;
    setMostrarBuscador(nuevoEstadoBuscador);
    console.log(`Nuevo estado Buscador: ${nuevoEstadoBuscador}`);
  };

  const onChangeFiltro = (nuevoValor) => {
    setFiltrar(nuevoValor);
    console.log(`Nuevo estado Filtro: ${nuevoValor}`);
  };

  const cartasFiltradas = data.cartas.filter((carta) =>
    carta.titulo.toLowerCase().includes(filtrar.trim().toLowerCase())
  );
  return (
    <div className='p-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Catálogo de Productos
        </h1>
        <BotonBuscador onFiltrar={onFiltrar} />
      </div>
      {mostrarBuscador === BUSCADOR.EXISTENTE && (
        <BarraBuscador onChangeFiltro={onChangeFiltro} valorFiltro={filtrar} />
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {cartasFiltradas.map((carta, index) => (
          <CatalogoCard
            key={index}
            titulo={carta.titulo}
            descripcion={carta.descripcion}
            imagen={carta.imagen}
            onClick={()=>setAbrircarta(carta)}
          />
        ))}
      </div>
    </div>
  );
}

export default Catalogo;
