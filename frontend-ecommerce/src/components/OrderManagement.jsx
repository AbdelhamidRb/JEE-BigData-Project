import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
    EN_ATTENTE: { label: 'En attente', bg: '#FAEEDA', color: '#854F0B', dot: '#EF9F27' },
    LIVRE:      { label: 'Livré',      bg: '#EAF3DE', color: '#3B6D11', dot: '#639922' },
    ANNULE:     { label: 'Annulé',     bg: '#FCEBEB', color: '#A32D2D', dot: '#E24B4A' },
};

const STATUS_OPTIONS = ['EN_ATTENTE', 'LIVRE', 'ANNULE'];

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Erreur chargement commandes');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        setUpdating(id);
        try {
            await api.patch(`/admin/orders/${id}/status`, status);
            toast.success('Statut mis à jour');
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch {
            toast.error('Erreur mise à jour');
        } finally {
            setUpdating(null);
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchSearch = (o.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(o.id).includes(searchTerm);
        const matchStatus = filterStatus === 'all' || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const counts = {
        total: orders.length,
        en_attente: orders.filter(o => o.status === 'EN_ATTENTE').length,
        livre: orders.filter(o => o.status === 'LIVRE').length,
        annule: orders.filter(o => o.status === 'ANNULE').length,
    };

    return (
        <>
            <style>{styles}</style>
            <div className="vom-root">

                {/* HEADER */}
                <header className="vom-header">
                    <div>
                        <div className="vom-eyebrow">Administration</div>
                        <h1 className="vom-title">Gestion des <em>Commandes</em></h1>
                    </div>
                </header>
                <div className="vom-divider" />

                {/* KPI ROW */}
                <div className="vom-kpi-row">
                    {[
                        { label: 'Total', value: counts.total, color: 'var(--black)', onClick: () => setFilterStatus('all'), active: filterStatus === 'all' },
                        { label: 'En attente', value: counts.en_attente, color: '#854F0B', onClick: () => setFilterStatus('EN_ATTENTE'), active: filterStatus === 'EN_ATTENTE' },
                        { label: 'Livrées', value: counts.livre, color: '#3B6D11', onClick: () => setFilterStatus('LIVRE'), active: filterStatus === 'LIVRE' },
                        { label: 'Annulées', value: counts.annule, color: '#A32D2D', onClick: () => setFilterStatus('ANNULE'), active: filterStatus === 'ANNULE' },
                    ].map((kpi, i) => (
                        <button key={i} className={`vom-kpi-card${kpi.active ? ' active' : ''}`} onClick={kpi.onClick}>
                            <span className="vom-kpi-value" style={{ color: kpi.color }}>{kpi.value}</span>
                            <span className="vom-kpi-label">{kpi.label}</span>
                        </button>
                    ))}
                </div>

                {/* FILTERS */}
                <div className="vom-filters">
                    <div className="vom-search-wrap">
                        <svg className="vom-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Rechercher par client ou ID…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="vom-search-input"
                        />
                    </div>
                    <div className="vom-results-count">
                        {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* TABLE */}
                <div className="vom-panel">
                    <div className="vom-table-scroll">
                        <table className="vom-table">
                            <thead>
                            <tr>
                                <th className="vom-th" style={{ width: 70 }}>Réf.</th>
                                <th className="vom-th">Client</th>
                                <th className="vom-th">Date</th>
                                <th className="vom-th">Total</th>
                                <th className="vom-th vom-th-center">Statut</th>
                                <th className="vom-th vom-th-right">Modifier</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="vom-tr">
                                        <td className="vom-td"><div className="vom-skel" style={{ width: 40 }} /></td>
                                        <td className="vom-td"><div className="vom-skel" style={{ width: 110 }} /></td>
                                        <td className="vom-td"><div className="vom-skel" style={{ width: 80 }} /></td>
                                        <td className="vom-td"><div className="vom-skel" style={{ width: 70 }} /></td>
                                        <td className="vom-td vom-td-center"><div className="vom-skel" style={{ width: 75, margin: '0 auto' }} /></td>
                                        <td className="vom-td vom-td-right"><div className="vom-skel" style={{ width: 120, marginLeft: 'auto' }} /></td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="vom-empty-row">
                                        <div className="vom-empty-inner">
                                            <div className="vom-empty-icon">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                                    <path d="M16 10a4 4 0 0 1-8 0"/>
                                                </svg>
                                            </div>
                                            <span>Aucune commande trouvée.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.map(order => {
                                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.EN_ATTENTE;
                                const isUpdating = updating === order.id;
                                return (
                                    <tr key={order.id} className="vom-tr">
                                        <td className="vom-td">
                                            <span className="vom-order-id">#{order.id}</span>
                                        </td>
                                        <td className="vom-td">
                                            <div className="vom-client-cell">
                                                <div className="vom-avatar">
                                                    {(order.user?.username || 'C').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="vom-client-name">{order.user?.username || 'Client'}</span>
                                            </div>
                                        </td>
                                        <td className="vom-td">
                                                <span className="vom-date">
                                                    {new Date(order.orderDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                        </td>
                                        <td className="vom-td">
                                            <span className="vom-amount">{Number(order.totalAmount).toFixed(2)} DH</span>
                                        </td>
                                        <td className="vom-td vom-td-center">
                                                <span className="vom-status-badge" style={{ background: cfg.bg, color: cfg.color }}>
                                                    <span className="vom-status-dot" style={{ background: cfg.dot }} />
                                                    {cfg.label}
                                                </span>
                                        </td>
                                        <td className="vom-td vom-td-right">
                                            <div className={`vom-select-wrap${isUpdating ? ' loading' : ''}`}>
                                                <select
                                                    className="vom-select"
                                                    value={order.status}
                                                    disabled={isUpdating}
                                                    onChange={e => updateStatus(order.id, e.target.value)}
                                                >
                                                    {STATUS_OPTIONS.map(s => (
                                                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                                                    ))}
                                                </select>
                                                {isUpdating ? (
                                                    <div className="vom-select-spinner" />
                                                ) : (
                                                    <svg className="vom-select-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <polyline points="6 9 12 15 18 9"/>
                                                    </svg>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
}

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    :root {
        --cream:#F5F0E8; --sand:#E8DDD0; --bark:#B8A898;
        --earth:#6B5B4E; --charcoal:#2A2420; --black:#0F0D0C;
        --accent:#C8472A; --gold:#C9A96E; --white:#FDFAF7;
    }

    .vom-root { max-width: 1100px; font-family: 'DM Sans', sans-serif; }

    /* HEADER */
    .vom-header { margin-bottom: 1.5rem; }
    .vom-eyebrow { font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
    .vom-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--black); line-height: 1.15; }
    .vom-title em { font-style: italic; color: var(--earth); }
    .vom-divider { height: 1px; background: var(--sand); margin-bottom: 2rem; }

    /* KPI ROW */
    .vom-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 1.5rem; }
    .vom-kpi-card {
        background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 3px;
        padding: 1.2rem 1.4rem; text-align: left; cursor: pointer;
        display: flex; flex-direction: column; gap: 4px;
        transition: border-color 0.18s, transform 0.15s, box-shadow 0.18s;
        font-family: 'DM Sans', sans-serif;
    }
    .vom-kpi-card:hover { border-color: var(--bark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(42,36,32,0.07); }
    .vom-kpi-card.active { border-color: var(--gold); box-shadow: 0 0 0 1px var(--gold); }
    .vom-kpi-value { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; line-height: 1; }
    .vom-kpi-label { font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--bark); }

    /* FILTERS */
    .vom-filters { display: flex; gap: 0.8rem; align-items: center; margin-bottom: 1.2rem; }
    .vom-search-wrap { flex: 1; position: relative; display: flex; align-items: center; }
    .vom-search-icon { position: absolute; left: 12px; color: var(--bark); }
    .vom-search-input {
        width: 100%; padding: 0.72rem 1rem 0.72rem 2.2rem;
        background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 2px;
        font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: var(--black);
        outline: none; transition: border-color 0.18s;
    }
    .vom-search-input:focus { border-color: var(--earth); }
    .vom-search-input::placeholder { color: var(--bark); font-weight: 300; }
    .vom-results-count { font-size: 0.72rem; color: var(--bark); white-space: nowrap; letter-spacing: 0.06em; }

    /* TABLE */
    .vom-panel { background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 3px; overflow: hidden; }
    .vom-table-scroll { overflow-x: auto; }
    .vom-table { width: 100%; border-collapse: collapse; }
    .vom-th {
        padding: 1rem 1.2rem; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--bark); font-weight: 500; text-align: left;
        border-bottom: 1px solid rgba(184,168,152,0.2); background: var(--cream); white-space: nowrap;
    }
    .vom-th-center { text-align: center; }
    .vom-th-right { text-align: right; }
    .vom-tr { border-bottom: 1px solid rgba(184,168,152,0.1); transition: background 0.15s; }
    .vom-tr:last-child { border-bottom: none; }
    .vom-tr:hover { background: rgba(245,240,232,0.5); }
    .vom-td { padding: 1rem 1.2rem; vertical-align: middle; }
    .vom-td-center { text-align: center; }
    .vom-td-right { text-align: right; }

    /* CELLS */
    .vom-order-id { font-size: 0.75rem; color: var(--bark); letter-spacing: 0.06em; font-weight: 300; }
    .vom-client-cell { display: flex; align-items: center; gap: 0.7rem; }
    .vom-avatar {
        width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
        background: var(--cream); border: 1px solid var(--sand);
        display: flex; align-items: center; justify-content: center;
        font-size: 0.75rem; font-weight: 500; color: var(--earth);
    }
    .vom-client-name { font-size: 0.85rem; color: var(--black); font-weight: 500; }
    .vom-date { font-size: 0.8rem; color: var(--earth); font-weight: 300; }
    .vom-amount { font-family: 'Playfair Display', serif; font-size: 0.95rem; color: var(--black); }

    .vom-status-badge {
        display: inline-flex; align-items: center; gap: 5px;
        font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
        padding: 0.28rem 0.65rem; border-radius: 2px; font-weight: 500;
        white-space: nowrap;
    }
    .vom-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

    /* SELECT */
    .vom-select-wrap {
        position: relative; display: inline-flex; align-items: center;
    }
    .vom-select {
        appearance: none; padding: 0.42rem 2rem 0.42rem 0.85rem;
        background: var(--cream); border: 1px solid var(--sand); border-radius: 2px;
        font-family: 'DM Sans', sans-serif; font-size: 0.75rem; color: var(--earth);
        cursor: pointer; outline: none;
        transition: border-color 0.18s, background 0.18s;
    }
    .vom-select:focus { border-color: var(--earth); background: var(--white); }
    .vom-select:disabled { opacity: 0.55; cursor: not-allowed; }
    .vom-select-arrow { position: absolute; right: 8px; pointer-events: none; color: var(--bark); }
    .vom-select-spinner {
        position: absolute; right: 8px;
        width: 11px; height: 11px; border-radius: 50%;
        border: 1.5px solid var(--sand); border-top-color: var(--gold);
        animation: vom-spin 0.7s linear infinite;
    }
    @keyframes vom-spin { to { transform: rotate(360deg); } }

    /* SKELETON */
    .vom-skel {
        height: 13px; border-radius: 2px;
        background: linear-gradient(90deg, var(--sand) 25%, var(--cream) 50%, var(--sand) 75%);
        background-size: 200% 100%; animation: vom-shimmer 1.4s ease-in-out infinite;
    }
    @keyframes vom-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    /* EMPTY */
    .vom-empty-row { padding: 3rem 1rem; }
    .vom-empty-inner { display: flex; flex-direction: column; align-items: center; gap: 0.8rem; }
    .vom-empty-icon {
        width: 50px; height: 50px; border-radius: 50%;
        background: var(--cream); border: 1px solid var(--sand);
        display: flex; align-items: center; justify-content: center; color: var(--bark);
    }
    .vom-empty-inner span { font-size: 0.85rem; color: var(--bark); font-weight: 300; }

    @media (max-width: 768px) {
        .vom-kpi-row { grid-template-columns: repeat(2, 1fr); }
        .vom-filters { flex-wrap: wrap; }
    }
`;