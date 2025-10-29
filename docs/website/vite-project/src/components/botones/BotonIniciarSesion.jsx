import { useNavigate } from 'react-router-dom';

function BotonIniciarSesion() {
  const navigate = useNavigate();

  return (
    <>
      <button
        className='px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md'
        onClick={() => {
          navigate('/login');
        }}
      >
        Iniciar sesión
      </button>
    </>
  );
}

export default BotonIniciarSesion;
