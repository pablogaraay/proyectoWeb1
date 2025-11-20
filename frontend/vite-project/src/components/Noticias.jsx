import NoticiasCard from './cards/NoticiasCard';
import data from '../data/contenidoCartas.json';

function Noticias() {
  return (
    <div className='min-h-screen bg-slate-50 py-12 px-6'>
      <div className='grid grid-cols-4 gap-6'>
        {data.noticias.map((noticia) => (
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
