function Home() {
  return (
    <>
      {/* Logo Section */}
      <div className='flex justify-center mb-12'>
        <div className='w-56 h-56 bg-white rounded-full flex items-center justify-center p-4'>
          <img
            src='/src/assets/logo.png'
            alt='TimeRated Logo'
            className='w-full h-full object-contain'
          />
        </div>
      </div>

      {/* Description Section */}
      <div className='bg-white border-2 border-slate-300 rounded-3xl p-12 shadow-sm'>
        <div className='text-center space-y-6'>
          <h1 className='text-3xl font-bold text-slate-800 mb-4'>
            Bienvenido a nuestro sitio web
          </h1>

          <div className='max-w-3xl mx-auto'>
            <p className='text-lg text-slate-600 leading-relaxed mb-6'>
              Descubre una experiencia única con nosotros. Ofrecemos contenido
              de calidad, noticias actualizadas y un catálogo completo de
              productos y servicios diseñados especialmente para ti.
            </p>

            <p className='text-base text-slate-500 leading-relaxed'>
              Navega por nuestras secciones y encuentra todo lo que necesitas.
              Estamos aquí para brindarte la mejor experiencia posible.
            </p>
          </div>

          {/* Call to Action */}
          <div className='pt-8'>
            <button className='px-8 py-3 bg-indigo-600 text-indigo-50 font-medium rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg'>
              Explorar contenido
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
