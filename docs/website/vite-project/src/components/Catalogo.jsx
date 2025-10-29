import data from '../data/contenidoCartas.json';
import Card from './Card';

function Catalogo() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Catálogo de Productos
      </h1>
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
