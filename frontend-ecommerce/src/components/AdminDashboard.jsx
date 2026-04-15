import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stats');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return (
                    <div className="admin-content-card">
                        <h3>📦 Gestion des Produits</h3>
                        <p style={{ marginTop: '10px', color: 'var(--apple-muted)' }}>Interface de gestion CRUD à intégrer ici.</p>
                        <button className="btn-primary" style={{ marginTop: '20px', width: 'auto' }}>+ Ajouter un produit</button>
                    </div>
                );
            case 'orders':
                return <div className="admin-content-card"><h3>🛒 Commandes récentes</h3></div>;
            case 'users':
                return <div className="admin-content-card"><h3>👥 Utilisateurs inscrits</h3></div>;
            default:
                return (
                    <div className="admin-content-card">
                        <h3>📊 Aperçu des performances</h3>
                        <div className="stats-grid">
                            <div className="stat-item"><h4>120</h4><p>Produits Actifs</p></div>
                            <div className="stat-item"><h4>45</h4><p>Commandes</p></div>
                            <div className="stat-item"><h4>300</h4><p>Clients</p></div>
                            <div className="stat-item"><h4>15,200 MAD</h4><p>Chiffre d'affaires</p></div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="admin-dashboard-container">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2 style={{ color: 'var(--apple-text)' }}>Admin Panel</h2>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>📊 Synthèse</li>
                        <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>📦 Produits</li>
                        <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>🛒 Commandes</li>
                        <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>👥 Utilisateurs</li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-danger-outline" style={{ width: '100%' }}>Déconnexion</button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h2>Tableau de bord Administrateur</h2>
                </header>
                <div className="admin-page-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
