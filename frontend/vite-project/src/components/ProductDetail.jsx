import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { INVITADO } from '../constantes';

const API_URL = 'http://localhost:3000/api';

function ProductDetail({ product, onClose, onReviewAdded }) {
  const { t } = useTranslation();
  const { esInvitado } = useOutletContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [myReview, setMyReview] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const token = localStorage.getItem('token');
  const estaLogueado = esInvitado === INVITADO.NO;

  useEffect(() => {
    fetchProductDetails();
    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    // Activar animación de entrada
    setTimeout(() => setIsVisible(true), 10);
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product.id]);

  // Función para cerrar con animación
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const fetchProductDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/products/${product.id}`);
      if (!res.ok) throw new Error('Error al cargar detalles');
      const data = await res.json();
      setReviews(data.reviews || []);
      
      // Buscar si el usuario actual ya tiene una review
      if (token) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const existing = data.reviews?.find(r => r.user_id === user.id);
        if (existing) {
          setMyReview(existing);
          setRating(existing.rating);
          setComment(existing.comment || '');
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!rating) {
      setError(t('product.selectRating'));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment: comment.trim() || null })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al enviar valoración');
      }

      setSuccess(myReview ? t('product.reviewUpdated') : t('product.reviewAdded'));
      fetchProductDetails();
      if (onReviewAdded) onReviewAdded();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMyReview = async () => {
    if (!confirm(t('product.confirmDeleteReview'))) return;

    try {
      const res = await fetch(`${API_URL}/products/${product.id}/reviews`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al eliminar valoración');

      setMyReview(null);
      setRating(0);
      setComment('');
      setSuccess(t('product.reviewDeleted'));
      fetchProductDetails();
      if (onReviewAdded) onReviewAdded();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStars = (value, interactive = false) => {
    const displayValue = interactive ? (hoverRating || rating) : value;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`transition-all ${interactive ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-8 w-8 transition-colors ${star <= displayValue ? 'text-amber-400' : 'text-slate-300'}`}
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES').format(price);
  };

  // Cerrar al hacer clic fuera
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4 transition-all duration-300 ${
        isVisible && !isClosing ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 ease-out ${
        isVisible && !isClosing 
          ? 'translate-y-0 opacity-100 sm:scale-100' 
          : 'translate-y-full opacity-0 sm:translate-y-0 sm:scale-95'
      }`}>
        {/* Header con imagen */}
        <div className="relative h-48 sm:h-72 bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0">
          {product.image_url ? (
            <img
              src={product.image_url.startsWith('http') ? product.image_url : `http://localhost:3000${product.image_url}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 sm:h-24 sm:w-24 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Precio badge */}
          <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6">
            <span className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg">
              {formatPrice(product.price)}€
            </span>
          </div>
          
          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Info del producto */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3">{product.name}</h2>
            
            {/* Rating y badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star}
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ${star <= Math.round(product.avg_rating || 0) ? 'text-amber-400' : 'text-slate-200'}`}
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-amber-700 ml-1">
                  {(product.avg_rating || 0).toFixed(1)} ({product.review_count || 0})
                </span>
              </div>
              
              {product.brand && (
                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">{product.brand}</span>
              )}
              {product.color && (
                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">{product.color}</span>
              )}
            </div>

            <p className="text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Formulario de valoración */}
          <div className="border-t border-slate-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              {myReview ? t('product.updateReview') : t('product.addReview')}
            </h3>

            {!estaLogueado ? (
              <p className="text-slate-500 text-sm bg-slate-50 p-4 rounded-lg">
                {t('product.loginRequired')}
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('product.yourRating')}
                  </label>
                  {renderStars(rating, true)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('product.yourComment')}
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('product.commentPlaceholder')}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={submitReview}
                    disabled={submitting || !rating}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition"
                  >
                    {submitting ? t('common.loading') : (myReview ? t('product.updateReview') : t('product.submitReview'))}
                  </button>
                  {myReview && (
                    <button
                      onClick={deleteMyReview}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      {t('common.delete')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Lista de reviews */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              {t('product.allReviews')} ({reviews.length})
            </h3>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-slate-500 text-center py-4">{t('product.noReviews')}</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium text-sm">
                            {(review.display_name || review.email || '?')[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {review.display_name || review.email?.split('@')[0] || 'Usuario'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-slate-600 dark:text-slate-300 text-sm">{review.comment}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
