import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('active');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/users', { headers: { 'Authorization': `Bearer ${token}` } });
            setUsers(Array.isArray(response.data) ? response.data : response.data.content || []);
        } catch (error) {
            console.error('Erreur réseau:', error);
            toast.error('Erreur lors du chargement des utilisateurs');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        const action = user.active ? 'désactiver' : 'réactiver';
        const result = await Swal.fire({
            title: 'Confirmation requise',
            text: `Voulez-vous vraiment ${action} le compte de "${user.username}" ?`,
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: user.active ? '#A32D2D' : '#3B6D11',
            cancelButtonColor: '#6B5B4E',
            confirmButtonText: `Oui, ${action}`, cancelButtonText: 'Annuler'
        });
        if (result.isConfirmed) {
            const loadingToast = toast.loading('Mise à jour en cours...');
            try {
                const token = localStorage.getItem('token');
                await api({
                    method: user.active ? 'delete' : 'put',
                    url: `/users/${user.id}${user.active ? '' : '/reactivate'}`,
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success(`Compte ${user.active ? 'désactivé' : 'réactivé'} avec succès`, { id: loadingToast });
                setUsers(users.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
            } catch (error) {
                console.error('Erreur statut:', error);
                toast.error('Erreur lors de la modification du statut', { id: loadingToast });
            }
        }
    };

    const currentUserEmail = localStorage.getItem('userEmail');
    const filteredUsers = users.filter(user => {
        if (user.email === currentUserEmail) return false;
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ? true :
            filterStatus === 'active' ? user.active === true : user.active === false;
        return matchesSearch && matchesStatus;
    });

    const activeCount = users.filter(u => u.email !== currentUserEmail && u.active).length;
    const inactiveCount = users.filter(u => u.email !== currentUserEmail && !u.active).length;

    return (
        <>
            <style>{styles}</style>
            <div className="vum-root">

                {/* HEADER */}
                <header className="vum-header">
                    <div>
                        <div className="vum-eyebrow">Administration</div>
                        <h1 className="vum-title">Gestion des <em>Utilisateurs</em></h1>
                    </div>
                    <div className="vum-stats-row">
                        <div className="vum-stat">
                            <span className="vum-stat-num">{users.length - 1}</span>
                            <span className="vum-stat-label">Total</span>
                        </div>
                        <div className="vum-stat-divider" />
                        <div className="vum-stat">
                            <span className="vum-stat-num" style={{ color: '#3B6D11' }}>{activeCount}</span>
                            <span className="vum-stat-label">Actifs</span>
                        </div>
                        <div className="vum-stat-divider" />
                        <div className="vum-stat">
                            <span className="vum-stat-num" style={{ color: '#A32D2D' }}>{inactiveCount}</span>
                            <span className="vum-stat-label">Inactifs</span>
                        </div>
                    </div>
                </header>
                <div className="vum-divider" />

                {/* FILTERS */}
                <div className="vum-filters">
                    <div className="vum-search-wrap">
                        <svg className="vum-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou email…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="vum-search-input"
                        />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="vum-filter-select">
                        <option value="all">Tous les utilisateurs</option>
                        <option value="active">Actifs uniquement</option>
                        <option value="inactive">Inactifs uniquement</option>
                    </select>
                    <div className="vum-results-count">
                        {filteredUsers.length} résultat{filteredUsers.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* TABLE */}
                <div className="vum-panel">
                    <div className="vum-table-scroll">
                        <table className="vum-table">
                            <thead>
                            <tr>
                                <th className="vum-th vum-th-center" style={{ width: 60 }}>ID</th>
                                <th className="vum-th">Utilisateur</th>
                                <th className="vum-th">Email</th>
                                <th className="vum-th vum-th-center">Rôle</th>
                                <th className="vum-th vum-th-center">Statut</th>
                                <th className="vum-th vum-th-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="vum-tr">
                                        <td className="vum-td vum-td-center"><div className="vum-skel" style={{ width: 24, margin: '0 auto' }} /></td>
                                        <td className="vum-td"><div className="vum-skel" style={{ width: 120 }} /></td>
                                        <td className="vum-td"><div className="vum-skel" style={{ width: 180 }} /></td>
                                        <td className="vum-td vum-td-center"><div className="vum-skel" style={{ width: 60, margin: '0 auto' }} /></td>
                                        <td className="vum-td vum-td-center"><div className="vum-skel" style={{ width: 50, margin: '0 auto' }} /></td>
                                        <td className="vum-td vum-td-right"><div className="vum-skel" style={{ width: 80, marginLeft: 'auto' }} /></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="vum-empty-row">
                                        <div className="vum-empty-inner">
                                            <div className="vum-empty-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                                    <circle cx="9" cy="7" r="4"/>
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                                </svg>
                                            </div>
                                            <span>Aucun utilisateur trouvé.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user.id} className={`vum-tr${!user.active ? ' inactive' : ''}`}>
                                    <td className="vum-td vum-td-center">
                                        <span className="vum-id">#{user.id}</span>
                                    </td>
                                    <td className="vum-td">
                                        <div className="vum-user-cell">
                                            <div className="vum-avatar">
                                                {user.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`vum-username${!user.active ? ' muted' : ''}`}>{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="vum-td">
                                        <span className="vum-email">{user.email}</span>
                                    </td>
                                    <td className="vum-td vum-td-center">
                                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                                            {user.roles?.map((r, i) => (
                                                <span key={i} className={`vum-role-badge${r.name === 'ADMIN' ? ' admin' : ''}`}>{r.name}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="vum-td vum-td-center">
                                            <span className={`vum-status-badge${user.active ? ' active' : ' inactive'}`}>
                                                <span className="vum-status-dot" />
                                                {user.active ? 'Actif' : 'Inactif'}
                                            </span>
                                    </td>
                                    <td className="vum-td vum-td-right">
                                        <button
                                            onClick={() => handleToggleStatus(user)}
                                            className={`vum-action-btn${user.active ? ' deactivate' : ' activate'}`}
                                        >
                                            {user.active ? 'Désactiver' : 'Réactiver'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
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

    .vum-root { max-width: 1100px; font-family: 'DM Sans', sans-serif; }

    /* HEADER */
    .vum-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
    .vum-eyebrow { font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
    .vum-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--black); line-height: 1.15; }
    .vum-title em { font-style: italic; color: var(--earth); }
    .vum-stats-row { display: flex; align-items: center; gap: 1.2rem; }
    .vum-stat { text-align: center; }
    .vum-stat-num { font-family: 'Playfair Display', serif; font-size: 1.7rem; color: var(--black); font-weight: 700; display: block; line-height: 1; }
    .vum-stat-label { font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--bark); margin-top: 3px; display: block; }
    .vum-stat-divider { width: 1px; height: 32px; background: var(--sand); }
    .vum-divider { height: 1px; background: var(--sand); margin-bottom: 2rem; }

    /* FILTERS */
    .vum-filters { display: flex; gap: 0.8rem; align-items: center; margin-bottom: 1.2rem; }
    .vum-search-wrap { flex: 1; position: relative; display: flex; align-items: center; }
    .vum-search-icon { position: absolute; left: 12px; color: var(--bark); }
    .vum-search-input {
        width: 100%; padding: 0.72rem 1rem 0.72rem 2.2rem;
        background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 2px;
        font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: var(--black);
        outline: none; transition: border-color 0.18s;
    }
    .vum-search-input:focus { border-color: var(--earth); }
    .vum-search-input::placeholder { color: var(--bark); font-weight: 300; }
    .vum-filter-select {
        padding: 0.72rem 2rem 0.72rem 0.9rem;
        background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 2px;
        font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: var(--earth);
        outline: none; appearance: none; cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%236B5B4E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right 10px center;
        transition: border-color 0.18s;
    }
    .vum-filter-select:focus { border-color: var(--earth); }
    .vum-results-count { font-size: 0.72rem; color: var(--bark); white-space: nowrap; letter-spacing: 0.06em; }

    /* PANEL + TABLE */
    .vum-panel { background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 3px; overflow: hidden; }
    .vum-table-scroll { overflow-x: auto; }
    .vum-table { width: 100%; border-collapse: collapse; }

    .vum-th {
        padding: 1rem 1.2rem;
        font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--bark); font-weight: 500; text-align: left;
        border-bottom: 1px solid rgba(184,168,152,0.2);
        background: var(--cream); white-space: nowrap;
    }
    .vum-th-center { text-align: center; }
    .vum-th-right { text-align: right; }

    .vum-tr { border-bottom: 1px solid rgba(184,168,152,0.1); transition: background 0.15s; }
    .vum-tr:last-child { border-bottom: none; }
    .vum-tr:hover { background: rgba(245,240,232,0.5); }
    .vum-tr.inactive { opacity: 0.5; }

    .vum-td { padding: 1rem 1.2rem; vertical-align: middle; }
    .vum-td-center { text-align: center; }
    .vum-td-right { text-align: right; }

    /* SKELETON */
    .vum-skel {
        height: 14px; border-radius: 2px;
        background: linear-gradient(90deg, var(--sand) 25%, var(--cream) 50%, var(--sand) 75%);
        background-size: 200% 100%;
        animation: vum-shimmer 1.4s ease-in-out infinite;
    }
    @keyframes vum-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    /* CELLS */
    .vum-id { font-size: 0.72rem; color: var(--bark); font-weight: 300; letter-spacing: 0.06em; }

    .vum-user-cell { display: flex; align-items: center; gap: 0.75rem; }
    .vum-avatar {
        width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
        background: var(--cream); border: 1px solid var(--sand);
        display: flex; align-items: center; justify-content: center;
        font-size: 0.78rem; font-weight: 500; color: var(--earth);
    }
    .vum-username { font-size: 0.85rem; color: var(--black); font-weight: 500; }
    .vum-username.muted { color: var(--bark); }

    .vum-email { font-size: 0.82rem; color: var(--earth); font-weight: 300; }

    .vum-role-badge {
        font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 500;
        padding: 0.25rem 0.6rem; border-radius: 2px;
        background: var(--cream); color: var(--earth); border: 1px solid var(--sand);
    }
    .vum-role-badge.admin { background: rgba(201,169,110,0.15); color: #7A5C1E; border-color: rgba(201,169,110,0.35); }

    .vum-status-badge {
        display: inline-flex; align-items: center; gap: 5px;
        font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
        padding: 0.28rem 0.65rem; border-radius: 2px; font-weight: 500;
    }
    .vum-status-badge.active { background: #EAF3DE; color: #3B6D11; }
    .vum-status-badge.inactive { background: #FCEBEB; color: #A32D2D; }
    .vum-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

    .vum-action-btn {
        font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
        padding: 0.38rem 0.9rem; border-radius: 2px; border: 1px solid;
        cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500;
        transition: background 0.15s, color 0.15s;
    }
    .vum-action-btn.deactivate { background: #FCEBEB; color: #A32D2D; border-color: rgba(163,45,45,0.2); }
    .vum-action-btn.deactivate:hover { background: #A32D2D; color: white; border-color: #A32D2D; }
    .vum-action-btn.activate { background: #EAF3DE; color: #3B6D11; border-color: rgba(59,109,17,0.2); }
    .vum-action-btn.activate:hover { background: #3B6D11; color: white; border-color: #3B6D11; }

    /* EMPTY */
    .vum-empty-row { padding: 3.5rem 1rem; }
    .vum-empty-inner { display: flex; flex-direction: column; align-items: center; gap: 0.8rem; color: var(--bark); }
    .vum-empty-icon {
        width: 52px; height: 52px; border-radius: 50%;
        background: var(--cream); border: 1px solid var(--sand);
        display: flex; align-items: center; justify-content: center;
        color: var(--bark);
    }
    .vum-empty-inner span { font-size: 0.85rem; font-weight: 300; }

    @media (max-width: 768px) {
        .vum-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
        .vum-filters { flex-wrap: wrap; }
    }
`;