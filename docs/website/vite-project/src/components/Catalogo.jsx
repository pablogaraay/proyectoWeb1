import { useState } from 'react';
import data from '../data/contenidoCartas.json';
import CatalogoCard from './cards/CatalogoCard';
import BotonBuscador from './botones/BotonBuscador.jsx';
import BarraBuscador from './BarraBuscador.jsx';
import { BUSCADOR } from '../constantes.js';
import CartaDesplegada from './CartaDesplegada';

// ⚙️ Sacamos marcas y colores únicos del JSON
const MARCAS_DISPONIBLES = [
  ...new Set(data.cartas.map((carta) => carta.marca).filter(Boolean)),
];

const COLORES_DISPONIBLES = [
  ...new Set(data.cartas.map((carta) => carta.color).filter(Boolean)),
];

function Catalogo() {
  const [mostrarBuscador, setMostrarBuscador] = useState(BUSCADOR.INEXISTENTE);
  const [filtrar, setFiltrar] = useState('');
  const [abrir, setAbrircarta] = useState(null);

  const [marcaFiltro, setMarcaFiltro] = useState('');     // '' = todas
  const [colorFiltro, setColorFiltro] = useState('');     // '' = todos
  const [precioMin, setPrecioMin] = useState('');         // string para inputs
  const [precioMax, setPrecioMax] = useState('');

  const onFiltrar = () => {
    const nuevoEstadoBuscador = !mostrarBuscador;
    setMostrarBuscador(nuevoEstadoBuscador);
    console.log(`Nuevo estado Buscador: ${nuevoEstadoBuscador}`);
  };

  const onChangeFiltro = (nuevoValor) => {
    setFiltrar(nuevoValor);
    console.log(`Nuevo estado Filtro: ${nuevoValor}`);
  };

  // 💡 Lógica de filtrado combinada
  const cartasFiltradas = data.cartas.filter((carta) => {
    const textoOk = carta.titulo
      .toLowerCase()
      .includes(filtrar.trim().toLowerCase());

    const marcaOk =
      !marcaFiltro || (carta.marca && carta.marca === marcaFiltro);

    const colorOk =
      !colorFiltro || (carta.color && carta.color === colorFiltro);

    const precio = Number(carta.precio); // suponemos número en el JSON
    const min = precioMin !== '' ? Number(precioMin) : null;
    const max = precioMax !== '' ? Number(precioMax) : null;

    const precioOk =
      (min === null || precio >= min) && (max === null || precio <= max);

    return textoOk && marcaOk && colorOk && precioOk;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark">
          Catálogo de Productos
        </h1>
        <BotonBuscador onFiltrar={onFiltrar} />
      </div>

      {mostrarBuscador === BUSCADOR.EXISTENTE && (
        <BarraBuscador onChangeFiltro={onChangeFiltro} valorFiltro={filtrar} />
      )}

      {/* 🔽 Panel de filtros extra */}
      <div className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end">
        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Marca
          </label>
          <select
            value={marcaFiltro}
            onChange={(e) => setMarcaFiltro(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Todas</option>
            {MARCAS_DISPONIBLES.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Color principal
          </label>
          <select
            value={colorFiltro}
            onChange={(e) => setColorFiltro(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Todos</option>
            {COLORES_DISPONIBLES.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Precio mínimo (€)
          </label>
          <input
            type="number"
            min="0"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            className="border rounded-lg px-3 py-2 w-32 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Precio máximo (€)
          </label>
          <input
            type="number"
            min="0"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            className="border rounded-lg px-3 py-2 w-32 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Botón limpiar filtros */}
        <button
          onClick={() => {
            setMarcaFiltro('');
            setColorFiltro('');
            setPrecioMin('');
            setPrecioMax('');
          }}
          className="ml-auto px-4 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Grid de cartas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cartasFiltradas.map((carta, index) => (
          <CatalogoCard
            key={index}
            titulo={carta.titulo}
            descripcion={carta.descripcion}
            imagen={carta.imagen}
            onClick={() => setAbrircarta(carta)}
          />
        ))}
      </div>

      {abrir && (
        <CartaDesplegada
          carta={abrir}
          onClose={() => setAbrircarta(null)}
        />
      )}
    </div>
  );
}

export default Catalogo;
