import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { INVITADO } from '../constantes';
import { getUsuarioActual, limpiarUsuarioActual } from '../utils.js';

function Account() {
  const { esInvitado, handleInvitado } = useOutletContext();
  const navigate = useNavigate();
  const usuario = getUsuarioActual();

  const handleLogout = () => {
    limpiarUsuarioActual();     // limpiamos usuario en memoria
    handleInvitado(false);      // vuelve a estado INVITADO.SI en App.jsx
    navigate('/');              // redirigimos donde quieras
  };

  // Si NO está logueado
  if (esInvitado === INVITADO.SI || !usuario) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-slate-800 dark:text-white">
          Perfil
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-4">
          Debes iniciar sesión para ver tu perfil.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300"
          >
            Registrarme
          </Link>
        </div>
      </div>
    );
  }

  // Si SÍ está logueado
  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-slate-800 dark:text-white">
        Mi perfil
      </h2>

      <p className="text-slate-700 dark:text-slate-200 mb-2">
        <span className="font-semibold">Usuario / Email:</span> {usuario.usuario}
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default Account;
