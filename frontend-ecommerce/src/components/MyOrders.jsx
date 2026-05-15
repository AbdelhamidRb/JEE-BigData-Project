import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const STATUS_MAP = {
    'EN_ATTENTE': { label: 'En préparation', color: '#FF5E00', bg: 'rgba(255,94,0,0.12)', dot: '#FF5E00' },
    'LIVRE':      { label: 'Livrée', color: '#4CAF50', bg: 'rgba(76,175,80,0.12)', dot: '#4CAF50' },
    'ANNULE':     { label: 'Annulée', color: '#E24B4A', bg: 'rgba(226,75,74,0.12)', dot: '#E24B4A' }
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

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: '#6B6B6B', fontFamily: "'Inter', sans-serif" }}>Chargement...</div>;

    return (
        <>
            <style>{`
                .fmo-root { max-width: 900px; margin: 2.5rem auto; padding: 0 1.5rem; font-family: 'Inter', sans-serif; }
                .fmo-title { font-family: 'Oswald', sans-serif; font-size: 2.2rem; color: #fff; margin-bottom: 2rem; text-transform: uppercase; }
                .fmo-title .hl { color: #FF5E00; }
                .fmo-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); margin-bottom: 1.2rem; }
                .fmo-header { padding: 1rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.04); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); }
                .fmo-info-group { display: flex; gap: 1.5rem; }
                .fmo-info-item span { display: block; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; color: #6B6B6B; margin-bottom: 4px; }
                .fmo-info-item strong { font-size: 0.85rem; color: #D4D4D4; }
                .fmo-status { display: inline-flex; align-items: center; gap: 6px; padding: 0.25rem 0.7rem; font-size: 0.65rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.12em; }
                .fmo-status-dot { width: 6px; height: 6px; border-radius: 50%; }
                .fmo-body { padding: 1.2rem; }
                .fmo-item { display: flex; align-items: center; gap: 1rem; padding-bottom: 0.8rem; border-bottom: 1px dashed rgba(255,255,255,0.04); margin-bottom: 0.8rem; }
                .fmo-item:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
                .fmo-item-img { width: 56px; height: 56px; object-fit: cover; border: 1px solid rgba(255,255,255,0.06); filter: grayscale(40%); }
                .fmo-item-details { flex: 1; }
                .fmo-item-name { font-size: 0.85rem; font-weight: 500; color: #D4D4D4; margin-bottom: 4px; }
                .fmo-item-meta { font-size: 0.75rem; color: #6B6B6B; }
                .fmo-item-price { font-weight: 500; color: #FF5E00; font-family: 'Oswald', sans-serif; }
                .fmo-footer { padding: 1rem 1.2rem; border-top: 1px solid rgba(255,255,255,0.04); display: flex; justify-content: flex-end; align-items: center; gap: 1rem; }
                .fmo-total-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #6B6B6B; }
                .fmo-total-val { font-family: 'Oswald', sans-serif; font-size: 1.3rem; font-weight: 600; color: #FF5E00; }
                .fmo-empty { text-align: center; padding: 4rem 0; color: #6B6B6B; }
                .fmo-btn { display: inline-block; margin-top: 1rem; padding: 0.6rem 1.5rem; background: #FF5E00; color: #0A0A0A; text-decoration: none; text-transform: uppercase; font-family: 'Oswald', sans-serif; letter-spacing: 0.12em; font-size: 0.72rem; font-weight: 600; }
            `}</style>
            <div className="fmo-root">
                <h1 className="fmo-title">Mes <span className="hl">Commandes</span></h1>
                {orders.length === 0 ? (
                    <div className="fmo-empty">
                        <p>Vous n'avez pas encore passé de commande.</p>
                        <Link to="/produits" className="fmo-btn">Découvrir nos produits</Link>
                    </div>
                ) : orders.map(order => {
                    const status = STATUS_MAP[order.status] || STATUS_MAP['EN_ATTENTE'];
                    return (
                        <div key={order.id} className="fmo-card">
                            <div className="fmo-header">
                                <div className="fmo-info-group">
                                    <div className="fmo-info-item"><span>Commande</span><strong>#{order.id}</strong></div>
                                    <div className="fmo-info-item"><span>Date</span><strong>{new Date(order.orderDate).toLocaleDateString('fr-FR')}</strong></div>
                                </div>
                                <div className="fmo-status" style={{ background: status.bg, color: status.color }}>
                                    <span className="fmo-status-dot" style={{ background: status.dot }} />{status.label}
                                </div>
                            </div>
                            <div className="fmo-body">
                                {order.orderItems.map(item => (
                                    <div key={item.id} className="fmo-item">
                                        <img src={item.product?.imageUrl || '/placeholder.png'} alt="Produit" className="fmo-item-img" />
                                        <div className="fmo-item-details">
                                            <div className="fmo-item-name">{item.product?.name || 'Produit indisponible'}</div>
                                            <div className="fmo-item-meta">Qté : {item.quantity}</div>
                                        </div>
                                        <div className="fmo-item-price">{Number(item.price).toFixed(2)} €</div>
                                    </div>
                                ))}
                            </div>
                            <div className="fmo-footer">
                                <span className="fmo-total-label">Total TTC :</span>
                                <span className="fmo-total-val">{Number(order.totalAmount).toFixed(2)} €</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
