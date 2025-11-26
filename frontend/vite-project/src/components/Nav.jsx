import LogoNavBar from './logos/LogoNavBar.jsx';
import BotonCatalogo from './botones/BotonCatalogo.jsx';
import BotonAboutUs from './botones/BotonAboutUs.jsx';
import BotonIniciarSesion from './botones/BotonIniciarSesion.jsx';
import BotonNoticias from './botones/BotonNoticias.jsx';
import BotonPerfil from './botones/BotonPerfil.jsx';
import BotonAdmin from './botones/BotonAdmin.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import { INVITADO } from '../constantes.js';
import { useLocation } from 'react-router-dom';

function Nav({ esInvitado }) {
  const location = useLocation();
  
  // Obtener rol del usuario desde localStorage
  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role || 'client';
    } catch {
      return 'client';
    }
  };
  
  const userRole = getUserRole();

  return (
    <header className='bg-slate-50 border-b border-slate-200 shadow-sm sticky top-0 z-10 backdrop-blur-sm'>
      <nav className='relative flex justify-center items-center py-4 px-6'>
        {/* Logo a la izquierda - pegado al borde */}
        <div className='absolute left-6'>
          <LogoNavBar />
        </div>

        {/* Botones de navegación centrados */}
        <div className='flex gap-3'>
          <BotonCatalogo isActive={location.pathname === '/catalogo'} />
          <BotonNoticias isActive={location.pathname === '/noticias'} />
          <BotonAboutUs isActive={location.pathname === '/aboutus'} />
        </div>

        {/* Selector de idioma y botón de sesión a la derecha */}
        <div className='absolute right-6 flex items-center gap-4'>
          <LanguageSelector />
          {/* Botón Admin solo para usuarios support */}
          {esInvitado === INVITADO.NO && userRole === 'support' && (
            <BotonAdmin isActive={location.pathname === '/admin'} />
          )}
          {esInvitado === INVITADO.SI ? (
            <BotonIniciarSesion />
          ) : (
            <BotonPerfil />
          )}
        </div>
      </nav>
    </header>
  );
}

export default Nav;
