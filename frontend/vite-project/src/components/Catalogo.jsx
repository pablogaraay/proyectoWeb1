import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CatalogoCard from './cards/CatalogoCard';
import BotonBuscador from './botones/BotonBuscador.jsx';
import BarraBuscador from './BarraBuscador.jsx';
import { BUSCADOR } from '../constantes.js';
import ProductDetail from './ProductDetail';
import { useFavorites } from '../hooks/useFavorites';

const API_URL = 'http://localhost:3000/api';

function Catalogo() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarBuscador, setMostrarBuscador] = useState(BUSCADOR.INEXISTENTE);
  const [filtrar, setFiltrar] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const { favoriteIds, toggleFavorite } = useFavorites(isLoggedIn);

  const [marcaFiltro, setMarcaFiltro] = useState('');
  const [colorFiltro, setColorFiltro] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  // Cargar productos desde la API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extraer marcas y colores únicos de los productos
  const marcasDisponibles = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))],
    [products]
  );

  const coloresDisponibles = useMemo(
    () => [...new Set(products.map((p) => p.color).filter(Boolean))],
    [products]
  );

  const onFiltrar = () => {
    setMostrarBuscador(!mostrarBuscador);
  };

  const onChangeFiltro = (nuevoValor) => {
    setFiltrar(nuevoValor);
  };

  // Lógica de filtrado
  const productosFiltrados = products.filter((product) => {
    const textoOk = product.name
      .toLowerCase()
      .includes(filtrar.trim().toLowerCase());
    const marcaOk = !marcaFiltro || product.brand === marcaFiltro;
    const colorOk = !colorFiltro || product.color === colorFiltro;

    const precio = Number(product.price);
    const min = precioMin !== '' ? Number(precioMin) : null;
    const max = precioMax !== '' ? Number(precioMax) : null;
    const precioOk =
      (min === null || precio >= min) && (max === null || precio <= max);

    return textoOk && marcaOk && colorOk && precioOk;
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Hero Header - Responsive */}
      <div className='px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl shadow-xl'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2'>
              {t('catalog.title')}
            </h1>
            <p className='text-slate-300 text-sm sm:text-base max-w-2xl'>
              {t('catalog.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12'>
        {/* Barra de búsqueda */}
        <div className='mb-4 sm:mb-6'>
          <div className='relative'>
            <input
              type='text'
              placeholder={t('catalog.searchPlaceholder')}
              value={filtrar}
              onChange={(e) => setFiltrar(e.target.value)}
              className='w-full px-4 sm:px-5 py-3 sm:py-4 pl-10 sm:pl-12 bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl shadow-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all text-base sm:text-lg'
            />
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 sm:h-6 sm:w-6 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
        </div>

        {/* Panel de filtros - Responsive */}
        <div className='bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8'>
          <div className='flex items-center justify-between mb-3 sm:mb-4'>
            <h3 className='font-semibold text-slate-800 flex items-center gap-2 text-sm sm:text-base'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 sm:h-5 sm:w-5 text-amber-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
                />
              </svg>
              {t('catalog.filters')}
            </h3>
            <span className='text-xs sm:text-sm text-slate-500'>
              {productosFiltrados.length} {t('catalog.productsFound')}
            </span>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4'>
            {/* Marca */}
            <div>
              <label className='block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 sm:mb-2'>
                {t('catalog.brand')}
              </label>
              <select
                value={marcaFiltro}
                onChange={(e) => setMarcaFiltro(e.target.value)}
                className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm sm:text-base'
              >
                <option value=''>{t('catalog.allBrands')}</option>
                {marcasDisponibles.map((marca) => (
                  <option key={marca} value={marca}>
                    {marca}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className='block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 sm:mb-2'>
                {t('catalog.color')}
              </label>
              <select
                value={colorFiltro}
                onChange={(e) => setColorFiltro(e.target.value)}
                className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm sm:text-base'
              >
                <option value=''>{t('catalog.allColors')}</option>
                {coloresDisponibles.map((color) => (
                  <option key={color} value={color}>
                    {t(`colors.${color}`, color)}
                  </option>
                ))}
              </select>
            </div>

            {/* Precio mínimo */}
            <div>
              <label className='block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 sm:mb-2'>
                {t('catalog.minPrice')}
              </label>
              <input
                type='number'
                min='0'
                placeholder='0'
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
                className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm sm:text-base'
              />
            </div>

            {/* Precio máximo */}
            <div>
              <label className='block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 sm:mb-2'>
                {t('catalog.maxPrice')}
              </label>
              <input
                type='number'
                min='0'
                placeholder='∞'
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm sm:text-base'
              />
            </div>

            {/* Botón limpiar */}
            <div className='col-span-2 sm:col-span-1 flex items-end'>
              <button
                onClick={() => {
                  setMarcaFiltro('');
                  setColorFiltro('');
                  setPrecioMin('');
                  setPrecioMax('');
                  setFiltrar('');
                }}
                className='w-full px-4 py-2 sm:py-3 bg-slate-800 text-white rounded-lg sm:rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
                {t('catalog.clearFilters')}
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
          </div>
        )}

        {/* Grid de productos - 2 columnas en móvil */}
        {!loading && (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
            {productosFiltrados.length === 0 ? (
              <div className='col-span-full text-center py-12 text-gray-500'>
                <p>{t('catalog.noProducts')}</p>
              </div>
            ) : (
              productosFiltrados.map((product) => (
                <CatalogoCard
                  key={product.id}
                  titulo={product.name}
                  descripcion={product.description}
                  imagen={
                    product.image_url
                      ? `http://localhost:3000${product.image_url}`
                      : null
                  }
                  precio={product.price}
                  rating={product.avg_rating}
                  reviewCount={product.review_count}
                  onClick={() => setSelectedProduct(product)}
                  isFavorite={favoriteIds.includes(String(product.id))}
                  onFavoriteToggle={() => toggleFavorite(product.id)}
                  showFavoriteButton={isLoggedIn}
                />
              ))
            )}
          </div>
        )}

        {/* Modal de detalle del producto */}
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onReviewAdded={fetchProducts}
          />
        )}
      </div>
    </div>
  );
}

export default Catalogo;
