// src/components/App.jsx
import { useState, useEffect } from 'react';
import Nav from './Nav';
import { Outlet } from 'react-router-dom';
import { INVITADO } from '../constantes';
import ChatWidget from './chat/ChatWidget';
import SupportPanel from './chat/SupportPanel';

function App() {
  const [esInvitado, setInvitado] = useState(INVITADO.SI);
  const [userRole, setUserRole] = useState('client'); // 'client' o 'support'

  // Al montar la app y cuando cambie esInvitado, actualizar rol
  useEffect(() => {
    const token = localStorage.getItem('token');
    setInvitado(token ? INVITADO.NO : INVITADO.SI);
    
    // Obtener rol del usuario
    const role = localStorage.getItem('userRole') || 'client';
    setUserRole(role);
  }, []);

  // Actualizar rol cuando cambie el estado de invitado (login/logout)
  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'client';
    setUserRole(role);
  }, [esInvitado]);

  // Esta función la usas desde Login / Account para cambiar el estado
  const handleInvitado = (valor) => {
    const nuevoEstado = valor === true ? INVITADO.NO : INVITADO.SI;
    setInvitado(nuevoEstado);
    console.log(`Invitado: ${nuevoEstado}`);
  };

  return (
    <div className="App">
      {/* Navigation */}
      <Nav esInvitado={esInvitado} />

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <Outlet context={{ handleInvitado, esInvitado }} />
      </div>

      {/* Chat de soporte - Widget para clientes (NO para soporte) */}
      {userRole !== 'support' && <ChatWidget esInvitado={esInvitado} />}
      
      {/* Panel de soporte - Solo visible para agentes */}
      {userRole === 'support' && <SupportPanel />}
    </div>
  );
}

export default App;
