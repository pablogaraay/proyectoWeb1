import { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  
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
    <header className='bg-slate-50 border-b border-slate-200 shadow-sm sticky top-0 z-40 backdrop-blur-sm'>
      <nav className='relative flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6'>
        {/* Logo - Izquierda */}
        <div className='flex-shrink-0'>
          <LogoNavBar />
        </div>

        {/* Botones de navegación - Centrados (Desktop) */}
        <div className='hidden md:flex gap-3 absolute left-1/2 -translate-x-1/2'>
          <BotonCatalogo isActive={location.pathname === '/catalogo'} />
          <BotonNoticias isActive={location.pathname === '/noticias'} />
          <BotonAboutUs isActive={location.pathname === '/aboutus'} />
        </div>

        {/* Derecha - Desktop */}
        <div className='hidden md:flex items-center gap-4'>
          <LanguageSelector />
          {esInvitado === INVITADO.NO && userRole === 'support' && (
            <BotonAdmin isActive={location.pathname === '/admin'} />
          )}
          {esInvitado === INVITADO.SI ? (
            <BotonIniciarSesion />
          ) : (
            <BotonPerfil />
          )}
        </div>

        {/* Menú hamburguesa - Mobile */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className='md:hidden p-2 text-slate-600 hover:text-slate-800'
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className='md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-3'>
          <div className='flex flex-col gap-2'>
            <BotonCatalogo isActive={location.pathname === '/catalogo'} />
            <BotonNoticias isActive={location.pathname === '/noticias'} />
            <BotonAboutUs isActive={location.pathname === '/aboutus'} />
          </div>
          <div className='flex items-center justify-between pt-3 border-t border-slate-100'>
            <LanguageSelector />
            <div className='flex items-center gap-2'>
              {esInvitado === INVITADO.NO && userRole === 'support' && (
                <BotonAdmin isActive={location.pathname === '/admin'} />
              )}
              {esInvitado === INVITADO.SI ? (
                <BotonIniciarSesion />
              ) : (
                <BotonPerfil />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Nav;
