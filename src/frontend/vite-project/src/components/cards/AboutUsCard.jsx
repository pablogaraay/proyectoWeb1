import { useTranslation } from 'react-i18next';

function AboutUsCard() {
  const { t } = useTranslation();

  return (
    <div className='h-full min-h-[600px] bg-slate-50 rounded-3xl shadow-2xl p-12 flex flex-col dark:bg-gray-800 border border-slate-200'>
      {/* Encabezado con título grande */}
      <div className='mb-8'>
        <h1 className='text-5xl font-bold text-slate-800 dark:text-white mb-4'>
          {t('about.title')}
        </h1>
        <div className='w-24 h-1.5 bg-indigo-600 rounded-full'></div>
      </div>

      {/* Contenido principal */}
      <div className='flex-1 space-y-6 text-slate-700 dark:text-gray-300'>
        <p className='text-xl leading-relaxed'>
          {t('about.subtitle')}
        </p>

        <p className='text-lg leading-relaxed'>
          {t('about.mission')}
        </p>

        <p className='text-lg leading-relaxed'>
          {t('about.community')}
        </p>

        {/* Sección de características */}
        <div className='mt-8 pt-8 border-t border-slate-200 dark:border-gray-700'>
          <h3 className='text-2xl font-semibold text-slate-800 dark:text-white mb-4'>
            {t('about.whatWeOffer')}
          </h3>
          <ul className='space-y-3 text-lg'>
            <li className='flex items-start'>
              <span className='text-indigo-600 mr-3 text-2xl'>•</span>
              <span>{t('about.feature1')}</span>
            </li>
            <li className='flex items-start'>
              <span className='text-indigo-600 mr-3 text-2xl'>•</span>
              <span>{t('about.feature2')}</span>
            </li>
            <li className='flex items-start'>
              <span className='text-indigo-600 mr-3 text-2xl'>•</span>
              <span>{t('about.feature3')}</span>
            </li>
            <li className='flex items-start'>
              <span className='text-indigo-600 mr-3 text-2xl'>•</span>
              <span>{t('about.feature4')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutUsCard;
