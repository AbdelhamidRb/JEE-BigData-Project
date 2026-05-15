import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
    EN_ATTENTE: { label: 'En attente', bg: 'rgba(255,94,0,0.12)', color: '#FF5E00', dot: '#FF5E00' },
    LIVRE: { label: 'Livré', bg: 'rgba(76,175,80,0.12)', color: '#4CAF50', dot: '#4CAF50' },
    ANNULE: { label: 'Annulé', bg: 'rgba(226,75,74,0.12)', color: '#E24B4A', dot: '#E24B4A' },
};

const STATUS_OPTIONS = ['EN_ATTENTE', 'LIVRE', 'ANNULE'];

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => { setLoading(true); try { setOrders((await api.get('/orders/admin/all')).data); } catch { toast.error('Erreur'); } finally { setLoading(false); } };
    const updateStatus = async (id, status) => { setUpdating(id); try { await api.patch(`/orders/admin/${id}/status`, { status }); toast.success('Statut mis à jour'); setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)); } catch { toast.error('Erreur'); } finally { setUpdating(null); } };

    const filtered = orders.filter(o => {
        const ms = (o.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) || String(o.id).includes(searchTerm);
        const mf = filterStatus === 'all' || o.status === filterStatus;
        return ms && mf;
    });

    const counts = { total: orders.length, en_attente: orders.filter(o => o.status === 'EN_ATTENTE').length, livre: orders.filter(o => o.status === 'LIVRE').length, annule: orders.filter(o => o.status === 'ANNULE').length };

    return (
        <>
            <style>{`
                .fom-root { font-family: 'Inter', sans-serif; }
                .fom-header { margin-bottom: 1.5rem; }
                .fom-eyebrow { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: #FF5E00; margin-bottom: 0.5rem; font-weight: 600; }
                .fom-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #fff; line-height: 1.05; }
                .fom-title .hl { color: #FF5E00; }
                .fom-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 2rem; }
                .fom-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 1.5rem; }
                .fom-kpi-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1rem 1.2rem; cursor: pointer; display: flex; flex-direction: column; gap: 4px; transition: all 0.18s; font-family: 'Inter', sans-serif; text-align: left; }
                .fom-kpi-card:hover { border-color: rgba(255,94,0,0.2); }
                .fom-kpi-card.active { border-color: #FF5E00; }
                .fom-kpi-value { font-family: 'Oswald', sans-serif; font-size: 1.6rem; font-weight: 600; line-height: 1; }
                .fom-kpi-label { font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: #6B6B6B; }
                .fom-filters { display: flex; gap: 0.8rem; align-items: center; margin-bottom: 1rem; }
                .fom-search-input { flex: 1; padding: 0.6rem 0.9rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #D4D4D4; font-family: 'Inter', sans-serif; font-size: 0.82rem; outline: none; }
                .fom-results-count { font-size: 0.7rem; color: #6B6B6B; white-space: nowrap; }
                .fom-panel { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); overflow: hidden; }
                .fom-table-scroll { overflow-x: auto; }
                .fom-table { width: 100%; border-collapse: collapse; }
                .fom-th { padding: 0.8rem 1rem; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #6B6B6B; font-weight: 500; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); white-space: nowrap; }
                .fom-th-center { text-align: center; }
                .fom-th-right { text-align: right; }
                .fom-tr { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.15s; }
                .fom-tr:hover { background: rgba(255,255,255,0.02); }
                .fom-td { padding: 0.8rem 1rem; vertical-align: middle; }
                .fom-td-center { text-align: center; }
                .fom-td-right { text-align: right; }
                .fom-order-id { font-size: 0.72rem; color: #6B6B6B; }
                .fom-client-cell { display: flex; align-items: center; gap: 0.6rem; }
                .fom-avatar { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,94,0,0.1); border: 1px solid rgba(255,94,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 500; color: #FF5E00; }
                .fom-client-name { font-size: 0.8rem; color: #D4D4D4; font-weight: 500; }
                .fom-date { font-size: 0.78rem; color: #6B6B6B; font-weight: 300; }
                .fom-amount { font-family: 'Oswald', sans-serif; font-size: 0.9rem; color: #FF5E00; }
                .fom-status-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; padding: 0.25rem 0.55rem; font-weight: 500; white-space: nowrap; }
                .fom-status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
                .fom-select { appearance: none; padding: 0.35rem 1.6rem 0.35rem 0.7rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #D4D4D4; font-family: 'Inter', sans-serif; font-size: 0.72rem; cursor: pointer; outline: none; }
                .fom-select-wrap { position: relative; display: inline-flex; align-items: center; }
                .fom-empty-row { text-align: center; padding: 2.5rem; color: #6B6B6B; }
                .fom-skel { height: 12px; background: rgba(255,255,255,0.04); border-radius: 2px; }
                @media (max-width: 768px) { .fom-kpi-row { grid-template-columns: repeat(2, 1fr); } }
            `}</style>
            <div className="fom-root">
                <header className="fom-header"><div className="fom-eyebrow">Administration</div><h1 className="fom-title">Gestion des <span className="hl">Commandes</span></h1></header>
                <div className="fom-divider" />
                <div className="fom-kpi-row">
                    {[
                        { label: 'Total', value: counts.total, color: '#FF5E00', onClick: () => setFilterStatus('all'), active: filterStatus === 'all' },
                        { label: 'En attente', value: counts.en_attente, color: '#FF5E00', onClick: () => setFilterStatus('EN_ATTENTE'), active: filterStatus === 'EN_ATTENTE' },
                        { label: 'Livrées', value: counts.livre, color: '#4CAF50', onClick: () => setFilterStatus('LIVRE'), active: filterStatus === 'LIVRE' },
                        { label: 'Annulées', value: counts.annule, color: '#E24B4A', onClick: () => setFilterStatus('ANNULE'), active: filterStatus === 'ANNULE' },
                    ].map((kpi, i) => (
                        <button key={i} className={`fom-kpi-card${kpi.active ? ' active' : ''}`} onClick={kpi.onClick}>
                            <span className="fom-kpi-value" style={{ color: kpi.color }}>{kpi.value}</span>
                            <span className="fom-kpi-label">{kpi.label}</span>
                        </button>
                    ))}
                </div>
                <div className="fom-filters">
                    <input type="text" placeholder="Rechercher par client ou ID…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="fom-search-input" />
                    <div className="fom-results-count">{filtered.length} commande{filtered.length !== 1 ? 's' : ''}</div>
                </div>
                <div className="fom-panel">
                    <div className="fom-table-scroll">
                        <table className="fom-table">
                            <thead><tr><th className="fom-th" style={{width:60}}>Réf.</th><th className="fom-th">Client</th><th className="fom-th">Date</th><th className="fom-th">Total</th><th className="fom-th fom-th-center">Statut</th><th className="fom-th fom-th-right">Modifier</th></tr></thead>
                            <tbody>
                                {loading ? [...Array(5)].map((_, i) => (
                                    <tr key={i} className="fom-tr">
                                        <td className="fom-td"><div className="fom-skel" style={{width:30}} /></td>
                                        <td className="fom-td"><div className="fom-skel" style={{width:100}} /></td>
                                        <td className="fom-td"><div className="fom-skel" style={{width:70}} /></td>
                                        <td className="fom-td"><div className="fom-skel" style={{width:60}} /></td>
                                        <td className="fom-td fom-td-center"><div className="fom-skel" style={{width:65,margin:'0 auto'}} /></td>
                                        <td className="fom-td fom-td-right"><div className="fom-skel" style={{width:100,marginLeft:'auto'}} /></td>
                                    </tr>
                                )) : filtered.length === 0 ? (
                                    <tr><td colSpan="6" className="fom-empty-row">Aucune commande trouvée.</td></tr>
                                ) : filtered.map(order => {
                                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.EN_ATTENTE;
                                    const isUpdating = updating === order.id;
                                    return <tr key={order.id} className="fom-tr">
                                        <td className="fom-td"><span className="fom-order-id">#{order.id}</span></td>
                                        <td className="fom-td"><div className="fom-client-cell"><div className="fom-avatar">{(order.user?.username || 'C').charAt(0).toUpperCase()}</div><span className="fom-client-name">{order.user?.username || 'Client'}</span></div></td>
                                        <td className="fom-td"><span className="fom-date">{new Date(order.orderDate).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' })}</span></td>
                                        <td className="fom-td"><span className="fom-amount">{Number(order.totalAmount).toFixed(2)} €</span></td>
                                        <td className="fom-td fom-td-center"><span className="fom-status-badge" style={{background:cfg.bg,color:cfg.color}}><span className="fom-status-dot" style={{background:cfg.dot}} />{cfg.label}</span></td>
                                        <td className="fom-td fom-td-right">
                                            <div className="fom-select-wrap">
                                                <select className="fom-select" value={order.status} disabled={isUpdating} onChange={e => updateStatus(order.id, e.target.value)}>
                                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>;
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
