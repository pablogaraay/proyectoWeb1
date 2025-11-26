import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { INVITADO } from '../constantes';

function CartaDesplegada({ carta, onClose }) {
  const { t } = useTranslation();
  const [valoracion, setValoracion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);

  const { esInvitado } = useOutletContext();
  const navigate = useNavigate();

  const estaLogueado = esInvitado === INVITADO.NO;
  const comentarioVacio = comentario.trim() === '';

  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem('valoraciones')) || {};
    if (guardado[carta.titulo]) {
      setComentarios(guardado[carta.titulo].comentarios || []);
      setValoracion(guardado[carta.titulo].valoracion || 0);
    }
  }, [carta]);

  const guardarDatos = () => {
    if (!estaLogueado) {
      navigate('/login');
      return;
    }

    if (comentario.trim() === '') {
      return;
    }

    const guardado = JSON.parse(localStorage.getItem('valoraciones')) || {};
    const nuevosComentarios = [...comentarios, comentario.trim()];

    guardado[carta.titulo] = {
      valoracion,
      comentarios: nuevosComentarios,
    };

    localStorage.setItem('valoraciones', JSON.stringify(guardado));
    setComentarios(nuevosComentarios);
    setComentario('');
  };

  const eliminarComentario = (index) => {
    if (!estaLogueado) return;

    const guardado = JSON.parse(localStorage.getItem('valoraciones')) || {};
    const nuevosComentarios = comentarios.filter((_, i) => i !== index);

    guardado[carta.titulo] = {
      valoracion,
      comentarios: nuevosComentarios,
    };

    localStorage.setItem('valoraciones', JSON.stringify(guardado));
    setComentarios(nuevosComentarios);
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

        <label className="block text-gray-700 font-semibold">{t('product.rating')}:</label>
        <select
          value={valoracion}
          onChange={(e) => setValoracion(Number(e.target.value))}
          className={`border rounded-lg p-2 mb-3 w-full dark:bg-gray-700 dark:text-white ${
            !estaLogueado ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!estaLogueado}
        >
          <option value={0}>{t('product.noRating')}</option>
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
              ? t('product.comment')
              : t('product.loginToComment')
          }
          className={`w-full border rounded-lg p-2 mb-3 dark:bg-gray-700 dark:text-white ${
            !estaLogueado ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!estaLogueado}
        />

        {!estaLogueado && (
          <p className="text-sm text-red-500 mb-2">
            {t('product.loginRequired')}
          </p>
        )}

        <button
          onClick={guardarDatos}
          className={`bg-indigo-600 text-white px-4 py-2 rounded-lg transition ${
            estaLogueado && !comentarioVacio
              ? 'hover:bg-indigo-700'
              : 'opacity-60 cursor-not-allowed'
          }`}
          disabled={!estaLogueado || comentarioVacio}
        >
          {t('product.save')}
        </button>

        <button
          onClick={onClose}
          className="ml-3 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
        >
          {t('product.close')}
        </button>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">{t('product.comments')}:</h3>
          {comentarios.length === 0 ? (
            <p className="text-gray-500">{t('product.noComments')}</p>
          ) : (
            <ul className="space-y-1">
              {comentarios.map((c, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center text-gray-700 dark:text-gray-300"
                >
                  <span>{c}</span>
                  {estaLogueado && (
                    <button
                      onClick={() => eliminarComentario(i)}
                      className="ml-2 text-xs text-red-500 hover:text-red-700"
                    >
                      {t('product.delete')}
                    </button>
                  )}
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
