import { useState } from 'react';
import Nav from './Nav';
import { Outlet } from 'react-router-dom';
import { INVITADO } from '../constantes';

function App() {
  const [esInvitado, setInvitado] = useState(INVITADO.SI);

  const handleInvitado = (valor) => {
    const nuevoEstado = valor === true ? INVITADO.NO : INVITADO.SI;
    setInvitado(nuevoEstado);
    console.log(`Invitado: ${nuevoEstado}`);
  };

  return (
    <div className='App'>
      {/* Navigation */}
      <Nav esInvitado={esInvitado} />

      {/* Main Content Container */}
      <div className='max-w-6xl mx-auto px-8 py-12'>
        <Outlet context={{ handleInvitado, esInvitado }} />
      </div>
    </div>
  );
}

export default App;
