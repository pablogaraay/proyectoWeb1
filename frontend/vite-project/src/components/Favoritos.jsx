import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CatalogoCard from './cards/CatalogoCard';
import ProductDetail from './ProductDetail';

const API_URL = 'http://localhost:3000/api'; // igual que en Catalogo

function Favoritos() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAuthError(true);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_URL}/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          setAuthError(true);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error('Error al cargar favoritos');
        }

        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error('Error cargando favoritos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const isFavorite = favorites.some((f) => f.id === productId);

    try {
      const res = await fetch(`${API_URL}/products/${productId}/favorite`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      // Actualizamos el estado local
      if (isFavorite) {
        setFavorites((prev) => prev.filter((p) => p.id !== productId));
        setSelectedProduct((prev) =>
          prev && prev.id === productId ? null : prev
        );
      }
    } catch (err) {
      console.error('Error actualizando favorito:', err);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500'></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-slate-600'>{t('favorites.loginRequired')}</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl shadow-xl'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2'>
              {t('favorites.title')}
            </h1>
            <p className='text-slate-300 text-sm sm:text-base max-w-2xl'>
              {t('favorites.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12'>
        {favorites.length === 0 ? (
          <div className='text-center py-12 text-slate-500'>
            <p>{t('favorites.noFavorites')}</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
            {favorites.map((product) => (
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
                onClick={() => {
                  setSelectedProduct(product);
                }}
                // siempre son favoritos en esta vista
                isFavorite={true}
                showFavoriteButton={true}
                onFavoriteToggle={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
        )}
      </div>
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default Favoritos;
