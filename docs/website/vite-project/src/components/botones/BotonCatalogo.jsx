import { useNavigate } from 'react-router-dom';

function BotonCatalogo() {
  const navigate = useNavigate();

  return (
    <>
      <button
        className=' border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-800 hover:shadow-md px-8 py-3 border-2 font-medium rounded-2xl transition-all duration-300 cursor-pointer'
        onClick={() => {
          navigate('/catalogo');
        }}
      >
        Catálogo
      </button>
    </>
  );
}

export default BotonCatalogo;
