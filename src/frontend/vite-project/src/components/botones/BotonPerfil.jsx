import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function BotonPerfil() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <button
        className='px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md'
        onClick={() => {
          navigate('/account');
        }}
      >
        {t('nav.account')}
      </button>
    </>
  );
}

export default BotonPerfil;
