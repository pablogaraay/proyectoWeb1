import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { INVITADO } from '../constantes';

function CartaDesplegada({ carta, onClose }) {
  const [valoracion, setValoracion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);

  const { esInvitado } = useOutletContext();
  const navigate = useNavigate();

  const estaLogueado = esInvitado === INVITADO.NO;

  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem('valoraciones')) || {};
    if (guardado[carta.titulo]) {
      setComentarios(guardado[carta.titulo].comentarios || []);
      setValoracion(guardado[carta.titulo].valoracion || 0);
    }
  }, [carta]);

  const guardarDatos = () => {
    if (!estaLogueado) {
      // Por seguridad extra: mandamos al login si intenta guardar
      navigate('/login');
      return;
    }

    const guardado = JSON.parse(localStorage.getItem('valoraciones')) || {};
    const nuevosComentarios = [...comentarios, comentario];

    guardado[carta.titulo] = {
      valoracion,
      comentarios: nuevosComentarios,
    };

    localStorage.setItem('valoraciones', JSON.stringify(guardado));
    setComentarios(nuevosComentarios);
    setComentario('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-2">{carta.titulo}</h2>
        <img
          src={carta.imagen}
          alt={carta.titulo}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {carta.descripcion}
        </p>

        <label className="block text-gray-700 font-semibold">Valoración:</label>
        <select
        value={valoracion}
        onChange={(e) => setValoracion(Number(e.target.value))}
        className={`border rounded-lg p-2 mb-3 w-full dark:bg-gray-700 dark:text-white ${
            !estaLogueado ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!estaLogueado}          // 👈 también bloqueamos la valoración
        >
        <option value={0}>Sin valorar</option>
        {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
            {n} ⭐
            </option>
        ))}
        </select>

        <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder={
            estaLogueado
            ? 'Escribe un comentario...'
            : 'Debes iniciar sesión para comentar.'
        }
        className={`w-full border rounded-lg p-2 mb-3 dark:bg-gray-700 dark:text-white ${
            !estaLogueado ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!estaLogueado}
        />

        {!estaLogueado && (
        <p className="text-sm text-red-500 mb-2">
            Para dejar un comentario o valoración debes estar registrado e iniciar sesión.
        </p>
        )}

        <button
          onClick={guardarDatos}
          className={`bg-indigo-600 text-white px-4 py-2 rounded-lg transition ${
            estaLogueado ? 'hover:bg-indigo-700' : 'opacity-60 cursor-not-allowed'
          }`}
          disabled={!estaLogueado}
        >
          Guardar
        </button>

        <button
          onClick={onClose}
          className="ml-3 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
        >
          Cerrar
        </button>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Comentarios:</h3>
          {comentarios.length === 0 ? (
            <p className="text-gray-500">Sin comentarios aún.</p>
          ) : (
            <ul className="list-disc pl-4">
              {comentarios.map((c, i) => (
                <li key={i} className="text-gray-700 dark:text-gray-300">
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartaDesplegada;
