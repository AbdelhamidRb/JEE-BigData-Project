import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlist([]);
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await api.get('/wishlist');
            setWishlist(response.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            const response = await api.post(`/wishlist/${productId}`);
            await fetchWishlist();
            toast.success('Produit ajouté à la wishlist !');
            return response.data;
        } catch (error) {
            const msg = error.response?.data || 'Erreur lors de l\'ajout';
            toast.error(msg);
            throw new Error(msg);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await api.delete(`/wishlist/${productId}`);
            await fetchWishlist();
            toast.success('Produit retiré de la wishlist');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.product?.id === productId);
    };

    const wishlistCount = wishlist.length;

    return (
        <WishlistContext.Provider value={{ wishlist, wishlistCount, loading, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};