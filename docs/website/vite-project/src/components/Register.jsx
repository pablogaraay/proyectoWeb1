import { useNavigate } from 'react-router-dom';
import { estaUsadoEmail, añadirCuenta } from '../utils.js';

function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmarPassword = formData.get('confirmarPassword');

    console.log(
      `Email: ${email}, contraseña: ${password}, confirmar contraseña: ${confirmarPassword}`
    );

    // 1) Comprobar que las contraseñas coinciden
    if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // 2) Comprobar que el email no está ya usado
    if (estaUsadoEmail(email)) {
      alert('Ese email ya está registrado. Usa otro o inicia sesión.');
      return;
    }

    // 3) Crear cuenta en memoria
    añadirCuenta(email, password);
    alert('Cuenta creada correctamente. Ahora inicia sesión.');

    // 4) Redirigir al login
    navigate('/login');
  };

  return (
    <>
      <div className='min-h-screen bg-slate-50 flex items-start justify-center px-4 pt-2 pb-8'>
        <div className='bg-slate-50 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-slate-200'>
          {/* Título */}
          <h1 className='text-4xl font-bold text-slate-800 text-center mb-6'>
            Registro
          </h1>

          {/* Icono */}
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

          {/* Formulario */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Campo Usuario/Email */}
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

            {/* Campo Contraseña */}
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

            {/* Campo Confirmar Contraseña */}
            <div>
              <label
                htmlFor='confirmarPassword'
                className='block text-sm font-medium text-slate-700 mb-2'
              >
                Confirmar Contraseña
              </label>
              <input
                type='password'
                id='confirmarPassword'
                name='confirmarPassword'
                className='w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors'
                placeholder='Confirma la contraseña'
                required
              />
            </div>

            {/* Botón Submit */}
            <button
              type='submit'
              className='w-full py-3 bg-indigo-600 text-white font-semibold text-lg rounded-xl hover:bg-indigo-700 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl'
            >
              Crear Cuenta
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
