import { useState } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config.js';
import { setUsuarioActual } from '../utils.js';

function Login() {
  const { handleInvitado } = useOutletContext();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const resp = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error || 'Error al iniciar sesión');
        handleInvitado(false);      // sigue siendo invitado
      } else {
        // Guardamos token y email para la sesión de forma centralizada
        setUsuarioActual(data.user.email, data.token);
        
        // Guardar el rol del usuario
        localStorage.setItem('userRole', data.user.role || 'client');

        handleInvitado(true);       // ya no es invitado
        navigate('/catalogo');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor.');
      handleInvitado(false);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex items-start justify-center px-4 pt-2 pb-8'>
      <div className='bg-slate-50 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-slate-200'>
        <h1 className='text-4xl font-bold text-slate-800 text-center mb-6'>
          Login
        </h1>

        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-10 h-10 text-indigo-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-slate-700 mb-2'
            >
              Usuario / Email
            </label>
            <input
              type='text'
              id='email'
              name='email'
              className='w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors'
              placeholder='Introduce tu email'
              required
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-slate-700 mb-2'
            >
              Contraseña
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className='w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors'
              placeholder='Introduce tu contraseña'
              required
            />
          </div>

          {error && (
            <p className='text-red-500 text-sm text-center'>{error}</p>
          )}

          <button
            type='submit'
            disabled={cargando}
            className='w-full py-3 bg-indigo-600 text-white font-semibold text-lg rounded-xl hover:bg-indigo-700 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60'
          >
            {cargando ? 'Accediendo...' : 'Acceder'}
          </button>
        </form>

        <p className='text-center mt-5 text-slate-600 text-sm'>
          ¿No te has registrado todavía?{' '}
          <Link
            to='/register'
            className='text-indigo-600 hover:text-indigo-700 font-medium hover:underline'
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
