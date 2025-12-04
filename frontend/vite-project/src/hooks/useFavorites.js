// src/hooks/useFavorites.js
import { useEffect, useState } from 'react';
import { API_URL } from '../constantes';

export function useFavorites(enabled) {
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        setLoadingFavorites(true);

        fetch(`${API_URL}/favorites`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('No se pudo cargar favoritos');
                return res.json();
            })
            .then((products) => {
                const ids = products.map((p) => String(p.id));
                setFavoriteIds(ids);
            })
            .catch(console.error)
            .finally(() => setLoadingFavorites(false));
    }, [enabled]);

    const addFavorite = async (productId) => {
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_URL}/products/${productId}/favorite`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            setFavoriteIds((prev) => [...new Set([...prev, String(productId)])]);
        }
    };

    const removeFavorite = async (productId) => {
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_URL}/products/${productId}/favorite`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            setFavoriteIds((prev) => prev.filter((id) => id !== String(productId)));
        }
    };

    const toggleFavorite = async (productId) => {
        const id = String(productId);

        if (favoriteIds.includes(id)) {
            await removeFavorite(id);
        } else {
            await addFavorite(id);
        }
    };

    return { favoriteIds, loadingFavorites, toggleFavorite };
}