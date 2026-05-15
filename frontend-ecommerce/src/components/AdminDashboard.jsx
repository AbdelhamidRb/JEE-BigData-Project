import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const QUICK_ACTIONS = [
    { to: '/admin/products', label: 'Ajouter un produit', desc: 'Créer une nouvelle fiche produit', primary: true },
    { to: '/admin/users', label: 'Gérer les utilisateurs', desc: 'Voir et modifier les comptes', primary: false },
    { to: '/admin/categories', label: 'Gérer les catégories', desc: 'Organiser votre catalogue', primary: false },
    { to: '/admin/orders', label: 'Voir les commandes', desc: 'Suivre et traiter les commandes', primary: false },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0, avgOrderValue: 0, outOfStock: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [categorySales, setCategorySales] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, ordRes, userRes, catSalesRes] = await Promise.all([
                    api.get('/products/admin/all').catch(() => ({ data: [] })),
                    api.get('/orders/admin/all').catch(() => ({ data: [] })),
                    api.get('/users').catch(() => ({ data: [] })),
                    api.get('/analytics/sales-by-category').catch(() => ({ data: [] }))
                ]);
                const products = prodRes.data || [];
                const orders = ordRes.data || [];
                const users = userRes.data || [];
                const rawCatSales = catSalesRes.data || [];

                const activeProducts = products.filter(p => p.active || p.isActive).length;
                const outOfStock = products.filter(p => p.stock <= 0).length;
                const validOrders = orders.filter(o => o.status !== 'ANNULE');
                const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
                const avgOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;
                const clientsOnly = users.filter(user => user.roles && user.roles.some(role => role.name === 'ADMIN'));

                setStats({ products: activeProducts, orders: validOrders.length, users: clientsOnly.length, revenue: totalRevenue, avgOrderValue, outOfStock });

                const sortedOrders = [...orders].sort((a, b) => b.id - a.id);
                setRecentOrders(sortedOrders.slice(0, 5));

                const totalSalesSum = rawCatSales.reduce((sum, item) => sum + (item.totalSales || 0), 0);
                setCategorySales(rawCatSales.map(cat => ({
                    name: cat.categoryName || cat.name || 'Unknown',
                    pct: totalSalesSum > 0 ? Math.round(((cat.totalSales || 0) / totalSalesSum) * 100) : 0,
                    amount: cat.totalSales || 0
                })).slice(0, 5));

                const last7Days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().split('T')[0]; }).reverse();
                setChartData(last7Days.map(date => {
                    const dayOrders = validOrders.filter(o => o.orderDate && String(o.orderDate).startsWith(date));
                    return { date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }), total: dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) };
                }));
            } catch (error) { toast.error('Erreur lors du chargement des statistiques'); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const KPI_CARDS = [
        { label: 'Produits Actifs', value: loading ? '...' : stats.products, to: '/admin/products' },
        { label: "Chiffre d'affaires", value: loading ? '...' : `${stats.revenue.toFixed(2)} €`, to: '/admin/orders' },
        { label: 'Panier Moyen', value: loading ? '...' : `${stats.avgOrderValue.toFixed(2)} €`, to: '/admin/orders' },
        { label: 'Rupture de stock', value: loading ? '...' : stats.outOfStock, to: '/admin/products' },
    ];

    const getStatusColor = (status) => { if (status === 'LIVRE') return '#4CAF50'; if (status === 'ANNULE') return '#E24B4A'; return '#FF5E00'; };

    return (
        <>
            <style>{`
                .fad-root { font-family: 'Inter', sans-serif; }
                .fad-header { margin-bottom: 2rem; }
                .fad-eyebrow { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: #FF5E00; margin-bottom: 0.5rem; font-weight: 600; }
                .fad-title { font-family: 'Oswald', sans-serif; font-size: 2.2rem; color: #fff; line-height: 1.05; margin-bottom: 0.4rem; text-transform: uppercase; }
                .fad-title .hl { color: #FF5E00; }
                .fad-sub { font-size: 0.85rem; color: #6B6B6B; font-weight: 300; }
                .fad-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 2rem; }

                .fad-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 2rem; }
                .fad-kpi-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1.4rem; text-decoration: none; display: block; transition: all 0.2s; cursor: pointer; }
                .fad-kpi-card:hover { border-color: rgba(255,94,0,0.2); transform: translateY(-2px); }
                .fad-kpi-value { font-family: 'Oswald', sans-serif; font-size: 1.8rem; font-weight: 700; color: #FF5E00; line-height: 1; margin-bottom: 0.35rem; }
                .fad-kpi-label { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: #6B6B6B; }

                .fad-section-label { font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 1rem; font-weight: 500; }
                .fad-actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 2.5rem; }
                .fad-action-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1.2rem; text-decoration: none; display: flex; flex-direction: column; gap: 0.5rem; transition: all 0.18s; }
                .fad-action-card:hover { border-color: rgba(255,94,0,0.2); transform: translateY(-1px); }
                .fad-action-card.primary { background: rgba(255,94,0,0.08); border-color: rgba(255,94,0,0.15); }
                .fad-action-label { font-size: 0.78rem; font-weight: 500; color: #D4D4D4; }
                .fad-action-card.primary .fad-action-label { color: #FF5E00; }
                .fad-action-desc { font-size: 0.7rem; color: #6B6B6B; font-weight: 300; }

                .fad-panel { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1.5rem; margin-bottom: 1.5rem; }
                .fad-panel-title { font-family: 'Oswald', sans-serif; font-size: 1rem; color: #fff; text-transform: uppercase; margin-bottom: 1rem; }

                .fad-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                .fad-activity-list { display: flex; flex-direction: column; gap: 0.7rem; }
                .fad-activity-item { display: flex; align-items: center; gap: 0.8rem; padding-bottom: 0.7rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
                .fad-activity-item:last-child { border-bottom: none; padding-bottom: 0; }
                .fad-activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
                .fad-activity-text { font-size: 0.78rem; color: #B8B8B8; flex: 1; }
                .fad-activity-time { font-size: 0.68rem; color: #6B6B6B; white-space: nowrap; }
                .fad-status-list { display: flex; flex-direction: column; gap: 0.7rem; }
                .fad-status-row { display: flex; align-items: center; justify-content: space-between; }
                .fad-status-name { font-size: 0.78rem; color: #B8B8B8; }
                .fad-status-bar-wrap { flex: 1; height: 4px; background: rgba(255,255,255,0.06); margin: 0 1rem; }
                .fad-status-bar { height: 100%; background: #FF5E00; }
                .fad-status-val { font-size: 0.72rem; color: #6B6B6B; min-width: 28px; text-align: right; }

                @media (max-width: 1024px) { .fad-kpi-grid, .fad-actions-grid { grid-template-columns: repeat(2, 1fr); } .fad-bottom { grid-template-columns: 1fr; } }
                @media (max-width: 640px) { .fad-kpi-grid, .fad-actions-grid { grid-template-columns: 1fr; } }
            `}</style>

            <div className="fad-root">
                <header className="fad-header">
                    <div className="fad-eyebrow">Espace Administration</div>
                    <h1 className="fad-title">Tableau de <span className="hl">bord</span></h1>
                    <p className="fad-sub">Bienvenue dans votre espace d'administration.</p>
                </header>
                <div className="fad-divider" />

                <div className="fad-section-label">Vue d'ensemble</div>
                <div className="fad-kpi-grid">
                    {KPI_CARDS.map((kpi, i) => (
                        <Link to={kpi.to} key={i} className="fad-kpi-card">
                            <div className="fad-kpi-value">{kpi.value}</div>
                            <div className="fad-kpi-label">{kpi.label}</div>
                        </Link>
                    ))}
                </div>

                <div className="fad-section-label">Actions rapides</div>
                <div className="fad-actions-grid">
                    {QUICK_ACTIONS.map((item, i) => (
                        <Link to={item.to} key={i} className={`fad-action-card${item.primary ? ' primary' : ''}`}>
                            <div className="fad-action-label">{item.label}</div>
                            <div className="fad-action-desc">{item.desc}</div>
                        </Link>
                    ))}
                </div>

                <div className="fad-panel">
                    <div className="fad-panel-title">Revenus des 7 derniers jours</div>
                    {loading ? (
                        <p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>Chargement...</p>
                    ) : chartData.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>Aucune donnée disponible.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={chartData}>
                                <defs><linearGradient id="fadColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF5E00" stopOpacity={0.3}/><stop offset="95%" stopColor="#FF5E00" stopOpacity={0}/></linearGradient></defs>
                                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6B6B6B'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 12, fill: '#6B6B6B'}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px' }} />
                                <Area type="monotone" dataKey="total" stroke="#FF5E00" strokeWidth={2} fillOpacity={1} fill="url(#fadColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="fad-bottom">
                    <div className="fad-panel">
                        <div className="fad-panel-title">Commandes récentes</div>
                        <div className="fad-activity-list">
                            {loading ? (<p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>Chargement...</p>)
                            : recentOrders.length === 0 ? (<p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>Aucune commande récente.</p>)
                            : recentOrders.map((order) => (
                                <div className="fad-activity-item" key={order.id}>
                                    <div className="fad-activity-dot" style={{ background: getStatusColor(order.status) }} />
                                    <div className="fad-activity-text">Commande #{order.id} — {Number(order.totalAmount).toFixed(2)} €</div>
                                    <div className="fad-activity-time">{new Date(order.orderDate).toLocaleDateString('fr-FR')}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fad-panel">
                        <div className="fad-panel-title">Top Catégories (Ventes)</div>
                        <div className="fad-status-list">
                            {loading ? (<p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>Chargement...</p>)
                            : categorySales.length === 0 ? (<p style={{ fontSize: '0.85rem', color: '#6B6B6B' }}>Aucune donnée de vente.</p>)
                            : categorySales.map((cat, i) => (
                                <div className="fad-status-row" key={i}>
                                    <span className="fad-status-name">{cat.name}</span>
                                    <div className="fad-status-bar-wrap"><div className="fad-status-bar" style={{ width: `${cat.pct}%` }} /></div>
                                    <span className="fad-status-val">{cat.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
