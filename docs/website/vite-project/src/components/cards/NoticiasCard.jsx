function NoticiasCard({ imagen, descripcion }) {
  return (
    <div className='bg-slate-50 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-slate-200'>
      {/* Sección de la imagen - ocupa todo el ancho */}
      <div className='w-full h-64 overflow-hidden bg-slate-100'>
        <img
          src={imagen}
          alt='Noticia'
          className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
        />
      </div>

      {/* Sección de la descripción */}
      <div className='p-6 bg-slate-50 flex-grow'>
        <p className='text-slate-700 text-base leading-relaxed'>
          {descripcion}
        </p>
      </div>
    </div>
  );
}

export default NoticiasCard;
