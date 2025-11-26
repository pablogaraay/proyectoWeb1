import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function BotonAboutUs({ isActive }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <button
        className={`px-6 py-2 text-sm font-medium transition-all duration-200 relative group ${
          isActive
            ? 'text-indigo-600 font-semibold'
            : 'text-slate-700 hover:text-indigo-600'
        }`}
        onClick={() => {
          navigate('/aboutus');
        }}
      >
        {t('nav.about')}
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
            isActive ? 'w-full' : 'w-0 group-hover:w-full'
          }`}
        ></span>
      </button>
    </>
  );
}

export default BotonAboutUs;
