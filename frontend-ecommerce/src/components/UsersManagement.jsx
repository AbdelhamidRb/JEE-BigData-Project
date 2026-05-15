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

    const fetchUsers = async () => { setLoading(true); try { const token = localStorage.getItem('token'); const response = await api.get('/users', { headers: { 'Authorization': `Bearer ${token}` } }); setUsers(Array.isArray(response.data) ? response.data : response.data.content || []); } catch { toast.error('Erreur'); } finally { setLoading(false); } };

    const handleToggleStatus = async (user) => {
        const action = user.active ? 'désactiver' : 'réactiver';
        const result = await Swal.fire({ title: 'Confirmation', text: `${action} "${user.username}" ?`, icon: 'warning', showCancelButton: true, confirmButtonColor: user.active ? '#E24B4A' : '#4CAF50', cancelButtonColor: '#6B6B6B', confirmButtonText: `Oui`, cancelButtonText: 'Annuler' });
        if (result.isConfirmed) {
            const t = toast.loading('Mise à jour...');
            try { const token = localStorage.getItem('token'); await api({ method: user.active ? 'delete' : 'put', url: `/users/${user.id}${user.active ? '' : '/reactivate'}`, headers: { 'Authorization': `Bearer ${token}` } }); toast.success(`Compte ${user.active ? 'désactivé' : 'réactivé'}`, { id: t }); setUsers(users.map(u => u.id === user.id ? { ...u, active: !u.active } : u)); } catch { toast.error('Erreur', { id: t }); }
        }
    };

    const currentUserEmail = localStorage.getItem('userEmail');
    const filtered = users.filter(user => {
        if (user.email === currentUserEmail) return false;
        const ms = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const mf = filterStatus === 'all' ? true : filterStatus === 'active' ? user.active === true : user.active === false;
        return ms && mf;
    });

    const activeCount = users.filter(u => u.email !== currentUserEmail && u.active).length;
    const inactiveCount = users.filter(u => u.email !== currentUserEmail && !u.active).length;

    return (
        <>
            <style>{`
                .fum-root { font-family: 'Inter', sans-serif; }
                .fum-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
                .fum-eyebrow { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: #FF5E00; margin-bottom: 0.5rem; font-weight: 600; }
                .fum-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #fff; line-height: 1.05; }
                .fum-title .hl { color: #FF5E00; }
                .fum-stats-row { display: flex; align-items: center; gap: 1rem; }
                .fum-stat { text-align: center; }
                .fum-stat-num { font-family: 'Oswald', sans-serif; font-size: 1.6rem; color: #FF5E00; font-weight: 600; display: block; line-height: 1; }
                .fum-stat-label { font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase; color: #6B6B6B; margin-top: 3px; display: block; }
                .fum-stat-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.06); }
                .fum-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 2rem; }
                .fum-filters { display: flex; gap: 0.8rem; align-items: center; margin-bottom: 1rem; }
                .fum-search-input { flex: 1; padding: 0.6rem 0.9rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #D4D4D4; font-family: 'Inter', sans-serif; font-size: 0.82rem; outline: none; }
                .fum-filter-select { padding: 0.6rem 0.9rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #B8B8B8; font-family: 'Inter', sans-serif; cursor: pointer; outline: none; }
                .fum-results-count { font-size: 0.7rem; color: #6B6B6B; white-space: nowrap; }
                .fum-panel { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); overflow: hidden; }
                .fum-table-scroll { overflow-x: auto; }
                .fum-table { width: 100%; border-collapse: collapse; }
                .fum-th { padding: 0.8rem 1rem; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #6B6B6B; font-weight: 500; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); white-space: nowrap; }
                .fum-th-center { text-align: center; }
                .fum-th-right { text-align: right; }
                .fum-tr { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.15s; }
                .fum-tr:hover { background: rgba(255,255,255,0.02); }
                .fum-tr.inactive { opacity: 0.5; }
                .fum-td { padding: 0.8rem 1rem; vertical-align: middle; }
                .fum-td-center { text-align: center; }
                .fum-td-right { text-align: right; }
                .fum-id { font-size: 0.7rem; color: #6B6B6B; }
                .fum-user-cell { display: flex; align-items: center; gap: 0.6rem; }
                .fum-avatar { width: 30px; height: 30px; border-radius: 50%; background: rgba(255,94,0,0.1); border: 1px solid rgba(255,94,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 500; color: #FF5E00; }
                .fum-username { font-size: 0.8rem; color: #D4D4D4; font-weight: 500; }
                .fum-email { font-size: 0.78rem; color: #6B6B6B; font-weight: 300; }
                .fum-role-badge { font-size: 0.58rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 500; padding: 0.2rem 0.5rem; background: rgba(255,255,255,0.04); color: #6B6B6B; border: 1px solid rgba(255,255,255,0.08); }
                .fum-role-badge.admin { background: rgba(255,94,0,0.1); color: #FF5E00; border-color: rgba(255,94,0,0.15); }
                .fum-status-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; padding: 0.25rem 0.55rem; font-weight: 500; }
                .fum-status-badge.active { background: rgba(76,175,80,0.12); color: #4CAF50; }
                .fum-status-badge.inactive { background: rgba(226,75,74,0.12); color: #E24B4A; }
                .fum-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
                .fum-action-btn { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.3rem 0.7rem; border: 1px solid rgba(255,255,255,0.08); cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500; transition: all 0.15s; background: transparent; color: #6B6B6B; }
                .fum-action-btn:hover { border-color: #FF5E00; color: #FF5E00; }
                .fum-action-btn.deactivate { border-color: rgba(226,75,74,0.2); color: #E24B4A; }
                .fum-action-btn.deactivate:hover { background: rgba(226,75,74,0.1); }
                .fum-action-btn.activate { border-color: rgba(76,175,80,0.2); color: #4CAF50; }
                .fum-action-btn.activate:hover { background: rgba(76,175,80,0.1); }
                .fum-empty-row { text-align: center; padding: 2.5rem; color: #6B6B6B; }
                .fum-skel { height: 12px; background: rgba(255,255,255,0.04); border-radius: 2px; }
                @media (max-width: 768px) { .fum-filters { flex-wrap: wrap; } }
            `}</style>
            <div className="fum-root">
                <header className="fum-header">
                    <div><div className="fum-eyebrow">Administration</div><h1 className="fum-title">Gestion des <span className="hl">Utilisateurs</span></h1></div>
                    <div className="fum-stats-row">
                        <div className="fum-stat"><span className="fum-stat-num" style={{ color: '#FF5E00' }}>{users.length - 1}</span><span className="fum-stat-label">Total</span></div>
                        <div className="fum-stat-divider" />
                        <div className="fum-stat"><span className="fum-stat-num" style={{ color: '#4CAF50' }}>{activeCount}</span><span className="fum-stat-label">Actifs</span></div>
                        <div className="fum-stat-divider" />
                        <div className="fum-stat"><span className="fum-stat-num" style={{ color: '#E24B4A' }}>{inactiveCount}</span><span className="fum-stat-label">Inactifs</span></div>
                    </div>
                </header>
                <div className="fum-divider" />
                <div className="fum-filters">
                    <input type="text" placeholder="Rechercher par nom ou email…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="fum-search-input" />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="fum-filter-select">
                        <option value="all">Tous</option><option value="active">Actifs</option><option value="inactive">Inactifs</option>
                    </select>
                    <div className="fum-results-count">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</div>
                </div>
                <div className="fum-panel">
                    <div className="fum-table-scroll">
                        <table className="fum-table">
                            <thead><tr><th className="fum-th fum-th-center" style={{width:50}}>ID</th><th className="fum-th">Utilisateur</th><th className="fum-th">Email</th><th className="fum-th fum-th-center">Rôle</th><th className="fum-th fum-th-center">Statut</th><th className="fum-th fum-th-right">Actions</th></tr></thead>
                            <tbody>
                                {loading ? [...Array(5)].map((_, i) => (
                                    <tr key={i} className="fum-tr">
                                        <td className="fum-td fum-td-center"><div className="fum-skel" style={{width:20,margin:'0 auto'}} /></td>
                                        <td className="fum-td"><div className="fum-skel" style={{width:100}} /></td>
                                        <td className="fum-td"><div className="fum-skel" style={{width:150}} /></td>
                                        <td className="fum-td fum-td-center"><div className="fum-skel" style={{width:50,margin:'0 auto'}} /></td>
                                        <td className="fum-td fum-td-center"><div className="fum-skel" style={{width:40,margin:'0 auto'}} /></td>
                                        <td className="fum-td fum-td-right"><div className="fum-skel" style={{width:70,marginLeft:'auto'}} /></td>
                                    </tr>
                                )) : filtered.length === 0 ? (
                                    <tr><td colSpan="6" className="fum-empty-row">Aucun utilisateur trouvé.</td></tr>
                                ) : filtered.map(user => (
                                    <tr key={user.id} className={`fum-tr${!user.active ? ' inactive' : ''}`}>
                                        <td className="fum-td fum-td-center"><span className="fum-id">#{user.id}</span></td>
                                        <td className="fum-td"><div className="fum-user-cell"><div className="fum-avatar">{user.username?.charAt(0).toUpperCase()}</div><span className="fum-username">{user.username}</span></div></td>
                                        <td className="fum-td"><span className="fum-email">{user.email}</span></td>
                                        <td className="fum-td fum-td-center">{user.roles?.map((r, i) => <span key={i} className={`fum-role-badge${r.name === 'ADMIN' ? ' admin' : ''}`}>{r.name}</span>)}</td>
                                        <td className="fum-td fum-td-center"><span className={`fum-status-badge${user.active ? ' active' : ' inactive'}`}><span className="fum-status-dot" />{user.active ? 'Actif' : 'Inactif'}</span></td>
                                        <td className="fum-td fum-td-right">
                                            <button onClick={() => handleToggleStatus(user)} className={`fum-action-btn${user.active ? ' deactivate' : ' activate'}`}>{user.active ? 'Désactiver' : 'Réactiver'}</button>
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
