import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const QUICK_ACTIONS = [
    {
        to: '/admin/products', label: 'Ajouter un produit', desc: 'Créer une nouvelle fiche produit', primary: true,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    },
    {
        to: '/admin/users', label: 'Gérer les utilisateurs', desc: 'Voir et modifier les comptes', primary: false,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
        to: '/admin/categories', label: 'Gérer les catégories', desc: 'Organiser votre catalogue', primary: false,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
    },
    {
        to: '/admin/orders', label: 'Voir les commandes', desc: 'Suivre et traiter les commandes', primary: false,
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0, avgOrderValue: 0, outOfStock: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [categorySales, setCategorySales] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [prodRes, ordRes, userRes, catSalesRes] = await Promise.all([
                    api.get('/products/admin/all').catch(() => ({ data: [] })),
                    api.get('/orders/admin/all').catch(() => ({ data: [] })),
                    api.get('/users').catch(() => ({ data: [] })),
                    api.get('/orders/admin/sales-by-category').catch(() => ({ data: [] }))
                ]);

                const products = prodRes.data;
                const orders = ordRes.data;
                const users = userRes.data;
                const rawCatSales = catSalesRes.data;

                // 1. KPIs
                const activeProducts = products.filter(p => p.active || p.isActive).length;
                const outOfStock = products.filter(p => p.stock <= 0).length;
                const validOrders = orders.filter(o => o.status !== 'ANNULE');
                const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
                const avgOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

                const clientsOnly = users.filter(user => !user.roles.some(role => role.name === 'ADMIN'));

                setStats({
                    products: activeProducts,
                    orders: validOrders.length,
                    users: clientsOnly.length,
                    revenue: totalRevenue,
                    avgOrderValue: avgOrderValue,
                    outOfStock: outOfStock
                });

                // 2. Activité récente
                const sortedOrders = [...orders].sort((a, b) => b.id - a.id);
                setRecentOrders(sortedOrders.slice(0, 5));

                // 3. Ventes par catégories
                const totalSalesSum = rawCatSales.reduce((sum, item) => sum + item.totalSales, 0);
                const formattedCatSales = rawCatSales.map(cat => ({
                    name: cat.categoryName,
                    pct: totalSalesSum > 0 ? Math.round((cat.totalSales / totalSalesSum) * 100) : 0,
                    amount: cat.totalSales
                }));
                setCategorySales(formattedCatSales.slice(0, 5));

                // 4. Données du Graphique (7 derniers jours)
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse();

                const salesData = last7Days.map(date => {
                    const dayOrders = validOrders.filter(o => o.orderDate && o.orderDate.startsWith(date));
                    const total = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
                    return { date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }), total };
                });
                setChartData(salesData);

            } catch (error) {
                toast.error('Erreur lors du chargement des statistiques');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const KPI_CARDS = [
        {
            label: 'Produits Actifs', value: loading ? '...' : stats.products, to: '/admin/products',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        },
        {
            label: "Chiffre d'affaires", value: loading ? '...' : `${stats.revenue.toFixed(2)} `, to: '/admin/orders',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        },
        {
            label: 'Panier Moyen', value: loading ? '...' : `${stats.avgOrderValue.toFixed(2)} `, to: '/admin/orders',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        },
        {
            label: 'Rupture de stock', value: loading ? '...' : stats.outOfStock, to: '/admin/products',
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E24B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        },
    ];

    const getStatusColor = (status) => {
        if (status === 'LIVRE') return '#639922';
        if (status === 'ANNULE') return '#E24B4A';
        return '#EF9F27';
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

                :root { --cream: #F5F0E8; --sand: #E8DDD0; --bark: #B8A898; --earth: #6B5B4E; --charcoal: #2A2420; --black: #0F0D0C; --accent: #C8472A; --gold: #C9A96E; --white: #FDFAF7; }
                .vad-root { max-width: 1100px; font-family: 'DM Sans', sans-serif; }
                .vad-header { margin-bottom: 2.5rem; }
                .vad-eyebrow { font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.6rem; }
                .vad-title { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: var(--black); line-height: 1.15; margin-bottom: 0.4rem; }
                .vad-title em { font-style: italic; color: var(--earth); }
                .vad-sub { font-size: 0.88rem; color: var(--earth); font-weight: 300; }
                .vad-divider { height: 1px; background: var(--sand); margin-bottom: 2.5rem; }

                .vad-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 2rem; }
                .vad-kpi-card { background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 3px; padding: 1.5rem 1.4rem; text-decoration: none; display: block; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; cursor: pointer; position: relative; overflow: hidden; }
                .vad-kpi-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform 0.25s ease; }
                .vad-kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(42,36,32,0.08); border-color: var(--bark); }
                .vad-kpi-card:hover::before { transform: scaleX(1); }
                .vad-kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
                .vad-kpi-icon { width: 38px; height: 38px; background: var(--cream); border: 1px solid var(--sand); border-radius: 2px; display: flex; align-items: center; justify-content: center; color: var(--earth); }
                .vad-kpi-value { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: var(--black); line-height: 1; margin-bottom: 0.35rem; }
                .vad-kpi-label { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bark); }

                .vad-section-label { font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--bark); margin-bottom: 1rem; }

                .vad-actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 2.5rem; }
                .vad-action-card { background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 3px; padding: 1.3rem 1.2rem; text-decoration: none; display: flex; flex-direction: column; gap: 0.75rem; transition: background 0.18s, border-color 0.18s, transform 0.18s; }
                .vad-action-card:hover { background: var(--cream); border-color: var(--bark); transform: translateY(-1px); }
                .vad-action-card.primary { background: var(--charcoal); border-color: var(--charcoal); }
                .vad-action-card.primary:hover { background: var(--black); border-color: var(--black); }
                .vad-action-icon { width: 34px; height: 34px; background: var(--cream); border: 1px solid var(--sand); border-radius: 2px; display: flex; align-items: center; justify-content: center; color: var(--earth); }
                .vad-action-card.primary .vad-action-icon { background: rgba(253,250,247,0.1); border-color: rgba(253,250,247,0.15); color: var(--gold); }
                .vad-action-label { font-size: 0.8rem; font-weight: 500; color: var(--black); letter-spacing: 0.02em; }
                .vad-action-card.primary .vad-action-label { color: var(--white); }
                .vad-action-desc { font-size: 0.73rem; color: var(--earth); font-weight: 300; line-height: 1.4; }
                .vad-action-card.primary .vad-action-desc { color: rgba(253,250,247,0.45); }

                .vad-panel { background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 3px; padding: 1.6rem 1.5rem; margin-bottom: 1.5rem; }
                .vad-panel-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--black); margin-bottom: 1.2rem; }

                .vad-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                .vad-activity-list { display: flex; flex-direction: column; gap: 0.85rem; }
                .vad-activity-item { display: flex; align-items: center; gap: 0.9rem; padding-bottom: 0.85rem; border-bottom: 1px solid rgba(184,168,152,0.15); }
                .vad-activity-item:last-child { border-bottom: none; padding-bottom: 0; }
                .vad-activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
                .vad-activity-text { font-size: 0.8rem; color: var(--charcoal); flex: 1; line-height: 1.4; }
                .vad-activity-time { font-size: 0.7rem; color: var(--bark); white-space: nowrap; }
                .vad-status-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .vad-status-row { display: flex; align-items: center; justify-content: space-between; }
                .vad-status-name { font-size: 0.8rem; color: var(--charcoal); }
                .vad-status-bar-wrap { flex: 1; height: 4px; background: var(--sand); border-radius: 2px; margin: 0 1rem; }
                .vad-status-bar { height: 100%; border-radius: 2px; background: var(--gold); }
                .vad-status-val { font-size: 0.75rem; color: var(--earth); font-weight: 500; min-width: 28px; text-align: right; }

                @media (max-width: 1024px) { .vad-kpi-grid, .vad-actions-grid { grid-template-columns: repeat(2, 1fr); } .vad-bottom { grid-template-columns: 1fr; } }
                @media (max-width: 640px) { .vad-kpi-grid, .vad-actions-grid { grid-template-columns: 1fr; } }
            `}</style>

            <div className="vad-root">
                <header className="vad-header">
                    <div className="vad-eyebrow">Espace Administration</div>
                    <h1 className="vad-title">Tableau de <em>bord</em></h1>
                    <p className="vad-sub">Bienvenue dans votre espace d'administration.</p>
                </header>

                <div className="vad-divider" />

                {/* KPI CARDS */}
                <div className="vad-section-label">Vue d'ensemble</div>
                <div className="vad-kpi-grid">
                    {KPI_CARDS.map((kpi, i) => (
                        <Link to={kpi.to} key={i} className="vad-kpi-card">
                            <div className="vad-kpi-top">
                                <div className="vad-kpi-icon">{kpi.icon}</div>
                            </div>
                            <div className="vad-kpi-value">{kpi.value}</div>
                            <div className="vad-kpi-label">{kpi.label}</div>
                        </Link>
                    ))}
                </div>

                {/* GRAPH (Nouveau) */}
                <div className="vad-panel">
                    <div className="vad-panel-title">Revenus des 7 derniers jours</div>
                    <div style={{ width: '100%', height: 250 }}>
                        {loading ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--bark)' }}>Chargement du graphique...</p>
                        ) : (
                            <ResponsiveContainer>
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="var(--gold)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tick={{fontSize: 12, fill: 'var(--bark)'}} axisLine={false} tickLine={false} />
                                    <YAxis tick={{fontSize: 12, fill: 'var(--bark)'}} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: 'var(--white)', border: '1px solid var(--sand)', borderRadius: '3px' }}
                                        formatter={(value) => [`${value} $`, 'Revenus']}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="var(--gold)" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>



                {/* BOTTOM PANELS */}
                <div className="vad-bottom">
                    <div className="vad-panel">
                        <div className="vad-panel-title">Commandes récentes</div>
                        <div className="vad-activity-list">
                            {loading ? (
                                <p style={{ fontSize: '0.85rem', color: 'var(--bark)' }}>Chargement...</p>
                            ) : recentOrders.length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: 'var(--bark)' }}>Aucune commande récente.</p>
                            ) : (
                                recentOrders.map((order) => (
                                    <div className="vad-activity-item" key={order.id}>
                                        <div className="vad-activity-dot" style={{ background: getStatusColor(order.status) }} />
                                        <div className="vad-activity-text">
                                            Commande #{order.id} — {Number(order.totalAmount).toFixed(2)} $
                                        </div>
                                        <div className="vad-activity-time">
                                            {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="vad-panel">
                        <div className="vad-panel-title">Top Catégories (Ventes)</div>
                        <div className="vad-status-list">
                            {loading ? (
                                <p style={{ fontSize: '0.85rem', color: 'var(--bark)' }}>Chargement...</p>
                            ) : categorySales.length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: 'var(--bark)' }}>Aucune donnée de vente.</p>
                            ) : (
                                categorySales.map((cat, i) => (
                                    <div className="vad-status-row" key={i}>
                                        <span className="vad-status-name">{cat.name}</span>
                                        <div className="vad-status-bar-wrap" title={`${cat.amount} $`}>
                                            <div className="vad-status-bar" style={{ width: `${cat.pct}%` }} />
                                        </div>
                                        <span className="vad-status-val">{cat.pct}%</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}