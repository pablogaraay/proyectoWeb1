import { useTranslation } from 'react-i18next';
import LogoHome from './logos/LogoHome.jsx';

function Home() {
  const { t } = useTranslation();

  return (
    <>
      <LogoHome />

      {/* Description Section */}
      <div className='bg-white border-2 border-slate-300 rounded-3xl p-12 shadow-sm'>
        <div className='text-center space-y-6'>
          <h1 className='text-3xl font-bold text-slate-800 mb-4'>
            {t('home.welcome')}
          </h1>

          <div className='max-w-3xl mx-auto'>
            <p className='text-lg text-slate-600 leading-relaxed mb-6'>
              {t('home.description')}
            </p>

            <p className='text-base text-slate-500 leading-relaxed'>
              {t('home.subdescription')}
            </p>
          </div>

          {/* Call to Action */}
          <div className='pt-8'>
            <button className='px-8 py-3 bg-indigo-600 text-indigo-50 font-medium rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg'>
              {t('home.explore')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
