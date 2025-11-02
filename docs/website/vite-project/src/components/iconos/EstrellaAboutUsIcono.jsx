function EstrellaAboutUsIcono() {
  return (
    <div className='relative group w-52 h-52 bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 rounded-3xl flex flex-col items-center justify-center shadow-2xl hover:shadow-amber-500/60 transition-all duration-500 hover:scale-110 hover:-translate-y-2'>
      {/* Brillo sutil en la esquina */}
      <div className='absolute top-3 right-3 w-8 h-8 bg-white/30 rounded-full blur-xl'></div>

      <svg
        className='w-28 h-28 text-white mb-4 group-hover:rotate-12 transition-transform duration-500'
        fill='currentColor'
        viewBox='0 0 24 24'
      >
        <path d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' />
      </svg>
      <span className='text-white font-bold text-base tracking-wider uppercase'>
        Calidad
      </span>
    </div>
  );
}

export default EstrellaAboutUsIcono;
