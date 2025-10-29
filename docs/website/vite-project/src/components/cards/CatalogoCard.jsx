function CatalogoCard({ titulo, descripcion, imagen }) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 dark:divide-gray-700">
      <div className="p-4 flex flex-col items-center">
        <img
          src={imagen}
          alt={titulo}
          className="w-32 h-32 object-cover rounded-md mb-3"
        />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{titulo}</h2>
      </div>
      <div className="p-4 text-gray-600 text-sm dark:text-gray-300">
        {descripcion}
      </div>
    </div>
  );
}

export default CatalogoCard;
