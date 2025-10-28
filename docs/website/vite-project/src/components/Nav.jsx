import { useNavigate, useLocation } from 'react-router-dom';
import info from '../info.json';
import LogoNavBar from './logos/LogoNavBar.jsx';
import BotonCatalogo from './botones/BotonCatalogo.jsx';
import BotonAboutUs from './botones/BotonAboutUs.jsx';
import BotonIniciarSesion from './botones/BotonIniciarSesion.jsx';
import BotonNoticias from './botones/BotonNoticias.jsx';
import BotonPerfil from './botones/BotonPerfil.jsx';

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className='bg-gray-100 border-b-2 border-slate-200 shadow-lg sticky top-0 z-10'>
      <nav className='relative flex justify-center items-center p-8'>
        {/* Logo a la izquierda - pegado al borde */}
        <div className='absolute left-8'>
          <LogoNavBar />
        </div>

        {/* Botones de navegación centrados */}
        <div className='flex gap-5'>
          <BotonCatalogo />
          <BotonNoticias />
          <BotonAboutUs />
        </div>

        {/* Botón de iniciar sesión a la derecha - pegado al borde */}
        <div className='absolute right-8'>
          {info.esInvitado === true ? <BotonIniciarSesion /> : <BotonPerfil />}
        </div>
      </nav>
    </header>
  );
}

export default Nav;
