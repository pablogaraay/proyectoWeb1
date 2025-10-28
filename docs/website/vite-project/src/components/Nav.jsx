import { useNavigate, useLocation } from 'react-router-dom';

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🎨 Estilos centralizados para los botones
  const buttonBaseStyles =
    'px-8 py-3 border-2 font-medium rounded-2xl transition-all duration-300 cursor-pointer';
  const buttonRegularStyles = `${buttonBaseStyles} border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-800 hover:shadow-md`;
  const buttonPrimaryStyles = `${buttonBaseStyles} border-indigo-600 bg-indigo-600 text-indigo-50 hover:bg-indigo-700 hover:border-indigo-700 hover:shadow-lg`;

  return (
    <header className='bg-gray-100 border-b-2 border-slate-200 shadow-lg sticky top-0 z-10'>
      <nav className='flex justify-between items-center p-8 max-w-6xl mx-auto'>
        {/* Logo a la izquierda - clic va a home */}
        <div
          className='flex items-center cursor-pointer'
          onClick={() => navigate('/')}
        >
          <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center p-1'>
            <img
              src='/src/assets/logo.png'
              alt='TimeRated Logo'
              className='w-full h-full object-contain'
            />
          </div>
        </div>

        {/* Botones de navegación centrados */}
        <div className='flex gap-5'>
          <button
            onClick={() => navigate('/catalogo')}
            className={buttonRegularStyles}
          >
            Catálogo
          </button>

          <button
            onClick={() => navigate('/noticias')}
            className={buttonRegularStyles}
          >
            Noticias
          </button>

          <button
            onClick={() => navigate('/aboutus')}
            className={buttonRegularStyles}
          >
            Sobre nosotros
          </button>

          <button
            className={buttonPrimaryStyles}
            onClick={() => {
              navigate('/login');
            }}
          >
            Iniciar sesión
          </button>
        </div>

        {/* Espacio vacío a la derecha para equilibrar */}
        <div className='w-12'></div>
      </nav>
    </header>
  );
}

export default Nav;
