function CatalogoCard({ titulo, descripcion, imagen }) {
  return (
    <div className='overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 flex flex-col'>
      {/* Imagen ocupa todo el ancho */}
      <div className='w-full h-56 overflow-hidden'>
        <img src={imagen} alt={titulo} className='w-full h-full object-cover' />
      </div>
      {/* Título */}
      <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-white text-center'>
          {titulo}
        </h2>
      </div>
      {/* Descripción */}
      <div className='p-4 text-gray-600 text-sm dark:text-gray-300 flex-grow'>
        {descripcion}
      </div>
    </div>
  );
}

export default CatalogoCard;
