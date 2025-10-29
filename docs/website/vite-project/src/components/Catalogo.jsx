import data from '../data/contenidoCartas.json';
import Card from './Card';

function Catalogo() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Catálogo de Productos
        </h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
          Filtrar Productos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.cartas.map((carta, index) => (
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
