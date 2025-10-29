function AboutUsCard() {
  return (
    <div className='h-full min-h-[600px] bg-white rounded-3xl shadow-2xl p-12 flex flex-col dark:bg-gray-800'>
      {/* Encabezado con título grande */}
      <div className='mb-8'>
        <h1 className='text-5xl font-bold text-slate-800 dark:text-white mb-4'>
          Sobre TimeRated
        </h1>
        <div className='w-24 h-1.5 bg-indigo-600 rounded-full'></div>
      </div>

      {/* Contenido principal */}
      <div className='flex-1 space-y-6 text-slate-700 dark:text-gray-300'>
        <p className='text-xl leading-relaxed'>
          TimeRated es tu plataforma de confianza para descubrir, comparar y
          valorar relojes de todas las marcas.
        </p>

        <p className='text-lg leading-relaxed'>
          Nuestra misión es conectar a los entusiastas de la relojería con
          información detallada, reseñas auténticas y las últimas novedades del
          mundo horológico.
        </p>

        <p className='text-lg leading-relaxed'>
          Con una comunidad apasionada y experta, te ayudamos a encontrar el
          reloj perfecto que se adapte a tu estilo y necesidades.
        </p>

        {/* Sección de características */}
        <div className='mt-8 pt-8 border-t border-slate-200 dark:border-gray-700'>
          <h3 className='text-2xl font-semibold text-slate-800 dark:text-white mb-4'>
            ¿Qué ofrecemos?
          </h3>
          <ul className='space-y-3 text-lg'>
            <li className='flex items-start'>
              <span className='text-indigo-600 mr-3 text-2xl'>•</span>
              <span>Catálogo completo de relojes de alta gama</span>
            </li>
            <li className='flex items-start'>
              <span className='text-indigo-600 mr-3 text-2xl'>•</span>
              <span>Reseñas y valoraciones de la comunidad</span>
            </li>
            <li className='flex items-start'>
              <span className='text-indigo-600 mr-3 text-2xl'>•</span>
              <span>Noticias y tendencias del sector relojero</span>
            </li>
            <li className='flex items-start'>
              <span className='text-indigo-600 mr-3 text-2xl'>•</span>
              <span>Comparativas y guías de compra</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutUsCard;
