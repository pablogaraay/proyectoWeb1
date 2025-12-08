function CatalogoCard({
  titulo,
  descripcion,
  imagen,
  precio,
  rating,
  reviewCount,
  onClick,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton,
}) {
  // Formatear precio con separadores de miles
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES').format(price);
  };

  return (
    <div
      onClick={onClick}
      className='group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col border border-slate-100 cursor-pointer hover:-translate-y-1 sm:hover:-translate-y-2'
    >
      {/* Botón de favoritos - Fuera del contenedor con overflow */}
      {showFavoriteButton && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // evita abrir modal
            onFavoriteToggle();
          }}
          className={`absolute top-2 left-2 sm:top-3 sm:left-3 z-10 text-2xl sm:text-3xl transition-transform ${
            isFavorite ? 'text-amber-500' : 'text-white/80'
          } drop-shadow-md hover:scale-125`}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      )}

      {/* Imagen con overlay */}
      <div className='relative w-full h-32 sm:h-44 lg:h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200'>
        {imagen ? (
          <>
            <img
              src={imagen}
              alt={titulo}
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
          </>
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-slate-300'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
        )}

        {/* Badge de precio en la imagen */}
        {precio !== undefined && (
          <div className='absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg'>
            <span className='text-xs sm:text-sm font-bold text-slate-800'>
              {formatPrice(precio)}€
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className='p-3 sm:p-4 lg:p-5 flex flex-col grow'>
        {/* Título */}
        <h2 className='text-sm sm:text-base lg:text-lg font-bold text-slate-800 mb-1 sm:mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors'>
          {titulo}
        </h2>

        {/* Rating */}
        <div className='flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3'>
          <div className='flex items-center gap-0.5'>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns='http://www.w3.org/2000/svg'
                className={`h-3 w-3 sm:h-4 sm:w-4 ${star <= Math.round(rating || 0) ? 'text-amber-400' : 'text-slate-200'}`}
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
            ))}
          </div>
          <span className='text-xs sm:text-sm text-slate-500'>
            {rating ? rating.toFixed(1) : '0.0'} ({reviewCount || 0})
          </span>
        </div>

        {/* Descripción - máximo 3 líneas */}
        <p
          className='hidden sm:block text-slate-500 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 overflow-hidden'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {descripcion}
        </p>

        {/* Botón ver más */}
        <div className='mt-auto pt-2 sm:pt-3 border-t border-slate-100'>
          <span className='inline-flex items-center text-xs sm:text-sm font-medium text-amber-600 group-hover:text-amber-700 transition-colors'>
            Ver detalles
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-3 w-3 sm:h-4 sm:w-4 ml-1 transition-transform group-hover:translate-x-1'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export default CatalogoCard;
