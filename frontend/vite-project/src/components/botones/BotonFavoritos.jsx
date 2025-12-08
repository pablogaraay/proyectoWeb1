import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function BotonFavoritos({ isActive }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/favoritos');
  };

  return (
    <button
      onClick={handleClick}
      className={`
        px-3 py-2 rounded-full text-sm sm:text-base font-medium transition-colors
        ${
          isActive
            ? 'bg-amber-500 text-white shadow-md'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }
      `}
    >
      {t('nav.favorites')}
    </button>
  );
}

export default BotonFavoritos;
