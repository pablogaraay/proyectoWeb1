// src/components/App.jsx
import { useState, useEffect } from 'react';
import Nav from './Nav';
import { Outlet } from 'react-router-dom';
import { INVITADO } from '../constantes';

function App() {
  const [esInvitado, setInvitado] = useState(INVITADO.SI);

  // Al montar la app, miramos si hay token en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setInvitado(token ? INVITADO.NO : INVITADO.SI);
  }, []);

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
    </div>
  );
}

export default App;
