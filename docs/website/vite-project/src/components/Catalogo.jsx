import data from '../data/contenidoCartas.json';
import Card from './Card';

function Catalogo() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Catálogo de Productos
        </h1>
        <button className='border-indigo-600 bg-indigo-600 text-indigo-50 hover:bg-indigo-700 hover:border-indigo-700 hover:shadow-lg px-8 py-3 border-2 font-medium rounded-2xl transition-all duration-300 cursor-pointer'>
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
