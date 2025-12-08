import { useTranslation } from 'react-i18next';

function RelojAboutUsIcono() {
  const { t } = useTranslation();

  return (
    <div className='relative group w-52 h-52 bg-linear-to-br from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl flex flex-col items-center justify-center shadow-2xl hover:shadow-indigo-600/60 transition-all duration-500 hover:scale-110 hover:-translate-y-2'>
      {/* Brillo sutil en la esquina */}
      <div className='absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-full blur-xl'></div>

      <svg
        className='w-28 h-28 text-white mb-4 group-hover:rotate-12 transition-transform duration-500'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
      <span className='text-white font-bold text-base tracking-wider uppercase'>
        {t('about.time')}
      </span>
    </div>
  );
}

export default RelojAboutUsIcono;
