import { useState, useEffect } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { INVITADO } from '../constantes';
import { limpiarUsuarioActual } from '../utils.js';
import { API_BASE_URL } from '../config.js';

function Account() {
  const { esInvitado, handleInvitado } = useOutletContext();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  // 🔹 Cargar datos de perfil desde el backend SIEMPRE declaramos el hook
  useEffect(() => {
    if (!token) return; // si no hay token no intentamos ni llamar al backend

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');

        const resp = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await resp.json().catch(() => ({}));

        if (!resp.ok) {
          // Si el backend dice 401, tratamos como sesión caducada
          if (resp.status === 401) {
            console.warn('Sesión caducada o token inválido. Cerrando sesión.');
            limpiarUsuarioActual();
            // márcalo como invitado según tu enum
            handleInvitado(INVITADO.SI);
            navigate('/login');
            return;
          }

          throw new Error(data.error || 'No se pudo cargar el perfil');
        }

        setProfile(data);
        setEditName(data.display_name || '');
        setEditAvatar(data.avatar_url || '');
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error cargando perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate, handleInvitado]);

  const handleLogout = () => {
    limpiarUsuarioActual();
    // aquí tú ya usabas false, lo mantengo para no reventar nada del layout
    handleInvitado(false);
    navigate('/');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const resp = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          display_name: editName,
          avatar_url: editAvatar,
        }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data.error || 'No se pudo actualizar el perfil');
      }

      setProfile(data);
      setSuccess('Perfil actualizado correctamente.');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmado = window.confirm(
      '⚠️ Esta acción eliminará tu cuenta y todos tus datos. ¿Seguro que quieres continuar?'
    );
    if (!confirmado) return;

    try {
      setError('');
      const resp = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data.error || 'No se pudo eliminar la cuenta');
      }

      limpiarUsuarioActual();
      handleInvitado(false);
      navigate('/');
      alert('Tu cuenta ha sido eliminada correctamente.');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // 🔹 AHORA vienen los returns condicionales (sin hooks nuevos debajo)

  // Si es invitado o no hay token, vista de “debes iniciar sesión”
  if (esInvitado === INVITADO.SI || !token) {
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

  // Estado de carga inicial (hay token pero aún no hay perfil)
  if (loading && !profile) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-slate-700 dark:text-slate-200">
        Cargando perfil...
      </div>
    );
  }

  // Si ha habido error y no tenemos perfil cargado
  if (error && !profile) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-slate-800 dark:text-white">
          Error al cargar el perfil
        </h2>
        <p className="text-center text-red-500 mb-4">{error}</p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  // Vista normal de perfil
  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-slate-800 dark:text-white">
        Mi perfil
      </h2>

      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <img
          src={
            editAvatar ||
            'https://ui-avatars.com/api/?name=User&background=4f46e5&color=ffffff'
          }
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
        />
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Email (solo lectura) */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Email
          </label>
          <input
            type="text"
            value={profile?.email || ''}
            readOnly
            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-100 text-slate-700"
          />
        </div>

        {/* Nombre de perfil */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Nombre de perfil
          </label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 dark:bg-white dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tu nombre visible"
          />
        </div>

        {/* URL de la foto */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            URL de la foto de perfil
          </label>
          <input
            type="text"
            value={editAvatar}
            onChange={(e) => setEditAvatar(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 dark:bg-white dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://..."
          />
          <p className="text-xs text-slate-500 mt-1">
            (Para simplificar, usamos una URL de imagen; subir ficheros sería
            otro endpoint.)
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
        {success && (
          <p className="text-emerald-500 text-sm text-center">{success}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      <hr className="my-4 border-slate-300" />

      <button
        onClick={handleLogout}
        className="w-full py-2 mb-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300"
      >
        Cerrar sesión
      </button>

      <button
        onClick={handleDeleteAccount}
        className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Eliminar mi cuenta
      </button>
    </div>
  );
}

export default Account;
