import AboutUsCard from './cards/AboutUsCard';
import EstrellaAboutUsIcono from './iconos/EstrellaAboutUsIcono';
import RelojAboutUsIcono from './iconos/RelojAboutUsIcono';

function AboutUs() {
  return (
    <div className='pl-8 pr-16 pt-10'>
      <div className='flex gap-25'>
        {/* Columna izquierda - Iconos */}
        <div className='flex flex-col gap-18 pr-16 '>
          <RelojAboutUsIcono />
          <EstrellaAboutUsIcono />
        </div>

        {/* Columna derecha - Card con descripción (ocupa todo el espacio restante) */}
        <div className='flex-1'>
          <AboutUsCard />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
