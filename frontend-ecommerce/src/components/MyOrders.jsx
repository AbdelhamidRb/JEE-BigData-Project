import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const STATUS_MAP = {
    'EN_ATTENTE': { label: 'En préparation', color: '#854F0B', bg: '#FAEEDA', dot: '#EF9F27' },
    'LIVRE':      { label: 'Livrée', color: '#3B6D11', bg: '#EAF3DE', dot: '#639922' },
    'ANNULE':     { label: 'Annulée', color: '#A32D2D', bg: '#FCEBEB', dot: '#E24B4A' }
};

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders/my-orders')
            .then(res => setOrders(res.data))
            .catch(() => toast.error('Erreur lors du chargement des commandes'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Chargement...</div>;

    return (
        <>
            <style>{`
                .vmo-root { max-width: 900px; margin: 3rem auto; padding: 0 1.5rem; font-family: 'DM Sans', sans-serif; }
                .vmo-title { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: #0F0D0C; margin-bottom: 2rem; }
                .vmo-title em { font-style: italic; color: #6B5B4E; }

                .vmo-card { background: #FDFAF7; border: 1px solid #E8DDD0; border-radius: 3px; margin-bottom: 1.5rem; }
                .vmo-header { padding: 1.2rem 1.5rem; border-bottom: 1px solid #E8DDD0; display: flex; justify-content: space-between; align-items: center; background: #F5F0E8; }

                .vmo-info-group { display: flex; gap: 2rem; }
                .vmo-info-item span { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #B8A898; margin-bottom: 4px; }
                .vmo-info-item strong { font-size: 0.9rem; color: #2A2420; }

                .vmo-status { display: inline-flex; align-items: center; gap: 6px; padding: 0.3rem 0.8rem; border-radius: 2px; font-size: 0.7rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; }
                .vmo-status-dot { width: 6px; height: 6px; border-radius: 50%; }

                .vmo-body { padding: 1.5rem; }
                .vmo-item { display: flex; align-items: center; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px dashed #E8DDD0; margin-bottom: 1rem; }
                .vmo-item:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }

                .vmo-item-img { width: 60px; height: 60px; object-fit: cover; border-radius: 2px; border: 1px solid #E8DDD0; }
                .vmo-item-details { flex: 1; }
                .vmo-item-name { font-size: 0.9rem; font-weight: 500; color: #0F0D0C; margin-bottom: 4px; }
                .vmo-item-meta { font-size: 0.8rem; color: #6B5B4E; }

                .vmo-item-price { font-weight: 500; color: #2A2420; }

                .vmo-footer { padding: 1.2rem 1.5rem; border-top: 1px solid #E8DDD0; display: flex; justify-content: flex-end; align-items: center; gap: 1rem; }
                .vmo-total-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: #6B5B4E; }
                .vmo-total-val { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: #0F0D0C; }

                .vmo-empty { text-align: center; padding: 4rem 0; color: #B8A898; }
                .vmo-btn { display: inline-block; margin-top: 1rem; padding: 0.6rem 1.5rem; background: #2A2420; color: #FFF; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem; border-radius: 2px; }
            `}</style>

            <div className="vmo-root">
                <h1 className="vmo-title">Mes <em>Commandes</em></h1>

                {orders.length === 0 ? (
                    <div className="vmo-empty">
                        <p>Vous n'avez pas encore passé de commande.</p>
                        <Link to="/produits" className="vmo-btn">Découvrir nos produits</Link>
                    </div>
                ) : (
                    orders.map(order => {
                        const status = STATUS_MAP[order.status] || STATUS_MAP['EN_ATTENTE'];
                        return (
                            <div key={order.id} className="vmo-card">
                                <div className="vmo-header">
                                    <div className="vmo-info-group">
                                        <div className="vmo-info-item">
                                            <span>Commande</span>
                                            <strong>#{order.id}</strong>
                                        </div>
                                        <div className="vmo-info-item">
                                            <span>Date</span>
                                            <strong>{new Date(order.orderDate).toLocaleDateString('fr-FR')}</strong>
                                        </div>
                                    </div>
                                    <div className="vmo-status" style={{ background: status.bg, color: status.color }}>
                                        <span className="vmo-status-dot" style={{ background: status.dot }}></span>
                                        {status.label}
                                    </div>
                                </div>

                                <div className="vmo-body">
                                    {order.orderItems.map(item => (
                                        <div key={item.id} className="vmo-item">
                                            <img src={item.product?.imageUrl || '/placeholder.png'} alt="Produit" className="vmo-item-img" />
                                            <div className="vmo-item-details">
                                                <div className="vmo-item-name">{item.product?.name || 'Produit indisponible'}</div>
                                                <div className="vmo-item-meta">Qté : {item.quantity}</div>
                                            </div>
                                            <div className="vmo-item-price">
                                                {Number(item.price).toFixed(2)} $
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="vmo-footer">
                                    <span className="vmo-total-label">Total TTC :</span>
                                    <span className="vmo-total-val">{Number(order.totalAmount).toFixed(2)} $</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}