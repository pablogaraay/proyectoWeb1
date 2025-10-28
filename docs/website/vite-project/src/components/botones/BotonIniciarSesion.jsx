import { useNavigate } from 'react-router-dom';

function BotonIniciarSesion() {
  const navigate = useNavigate();

  return (
    <>
      <button
        className='border-indigo-600 bg-indigo-600 text-indigo-50 hover:bg-indigo-700 hover:border-indigo-700 hover:shadow-lg px-8 py-3 border-2 font-medium rounded-2xl transition-all duration-300 cursor-pointer'
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
