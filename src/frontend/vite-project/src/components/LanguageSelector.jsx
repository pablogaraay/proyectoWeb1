import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const currentLang = i18n.language;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => changeLanguage('es')}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          currentLang === 'es'
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
        title="Español"
      >
        ES
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          currentLang === 'en'
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  );
}

export default LanguageSelector;
