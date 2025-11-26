import { useTranslation } from 'react-i18next';

function BarraBuscador({ onChangeFiltro, valorFiltro }) {
    const { t } = useTranslation();

    const handleChange = (e) => {
        onChangeFiltro(e.target.value)
    }
  return (
    <>
      <div className='mb-6'>
        <input
          type='text'
          placeholder={t('common.search') + '...'}
          value={valorFiltro}
          onChange={handleChange}
          className='w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-white'
        />
      </div>
    </>
  );
}

export default BarraBuscador;
