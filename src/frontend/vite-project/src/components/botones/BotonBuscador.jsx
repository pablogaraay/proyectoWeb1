import { useTranslation } from 'react-i18next';

function BotonBuscador({onFiltrar}) {
    const { t } = useTranslation();

    return(
        <button className='border-indigo-600 bg-indigo-600 text-indigo-50 hover:bg-indigo-700 hover:border-indigo-700 hover:shadow-lg px-8 py-3 border-2 font-medium rounded-2xl transition-all duration-300 cursor-pointer'
          onClick={onFiltrar}
        >
          {t('catalog.filterProducts')}
        </button>
    );
}

export default BotonBuscador
