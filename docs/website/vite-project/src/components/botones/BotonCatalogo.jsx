import { useNavigate } from 'react-router-dom';

function BotonCatalogo() {
  const navigate = useNavigate();

  return (
    <>
      <button
        className='px-6 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-all duration-200 relative group'
        onClick={() => {
          navigate('/catalogo');
        }}
      >
        Catálogo
        <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300'></span>
      </button>
    </>
  );
}

export default BotonCatalogo;
