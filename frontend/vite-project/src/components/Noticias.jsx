import { useTranslation } from 'react-i18next';
import NoticiasCard from './cards/NoticiasCard';
import data from '../data/contenidoCartas.json';

function Noticias() {
  const { t } = useTranslation();

  // Mapeamos las noticias del JSON con sus traducciones
  const noticiasConTraduccion = data.noticias.map((noticia) => ({
    ...noticia,
    descripcion: t(`news.news${noticia.id}`),
  }));

  return (
    <div className='min-h-screen bg-slate-50 py-12 px-6'>
      <div className='grid grid-cols-4 gap-6'>
        {noticiasConTraduccion.map((noticia) => (
          <NoticiasCard
            key={noticia.id}
            imagen={noticia.imagen}
            descripcion={noticia.descripcion}
          />
        ))}
      </div>
    </div>
  );
}

export default Noticias;
