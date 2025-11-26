import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Register() {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmarPassword = formData.get('confirmarPassword');

    // Validación en cliente
    if (!email.includes('@')) {
      setError('Email inválido');
      setCargando(false);
      return;
    }
    if (password.length < 6) {
      setError('Min. 6 caracteres');
      setCargando(false);
      return;
    }
    if (password !== confirmarPassword) {
      setError(t('register.passwordMismatch'));
      setCargando(false);
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error || 'Error al registrar usuario');
      } else {
        // Guardamos token en localStorage para mantener sesión
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuarioEmail', data.user.email);
        // Redirigimos al login o al catálogo
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex items-start justify-center px-4 pt-2 pb-8'>
      <div className='bg-slate-50 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-slate-200'>
        <h1 className='text-4xl font-bold text-slate-800 text-center mb-6'>
          {t('register.title')}
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-slate-700 mb-2'>
              {t('register.email')}
            </label>
            <input
              type='text'
              id='email'
              name='email'
              className='w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors'
              placeholder={t('register.email')}
              required
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-slate-700 mb-2'>
              {t('register.password')}
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className='w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors'
              placeholder={t('register.password')}
              required
            />
          </div>

          <div>
            <label htmlFor='confirmarPassword' className='block text-sm font-medium text-slate-700 mb-2'>
              {t('register.confirmPassword')}
            </label>
            <input
              type='password'
              id='confirmarPassword'
              name='confirmarPassword'
              className='w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors'
              placeholder={t('register.confirmPassword')}
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
            {cargando ? t('register.loading') : t('register.submit')}
          </button>
        </form>

        <p className='text-center mt-5 text-slate-600 text-sm'>
          {t('register.hasAccount')}{' '}
          <Link
            to='/login'
            className='text-indigo-600 hover:text-indigo-700 font-medium hover:underline'
          >
            {t('register.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
