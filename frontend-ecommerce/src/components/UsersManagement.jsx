import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Nouveaux états pour la recherche et le filtre
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('active'); // 'all', 'active', 'inactive'

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("DATA:", response.data);
            // On stocke tous les utilisateurs (le filtrage se fera côté client pour la recherche)
            setUsers(Array.isArray(response.data) ? response.data : response.data.content || []);
        } catch (error) {
            console.error('Erreur réseau:', error);
            toast.error("Erreur lors du chargement des utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        const action = user.active ? "désactiver" : "réactiver";

        const result = await Swal.fire({
            title: 'Confirmation requise',
            text: `Voulez-vous vraiment ${action} le compte de "${user.username}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: user.active ? '#ef4444' : '#22c55e',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Oui, ${action}`,
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            const loadingToast = toast.loading('Mise à jour en cours...');
            try {
                const token = localStorage.getItem('token');
                const url = `/users/${user.id}${user.active ? '' : '/reactivate'}`;
                const method = user.active ? 'delete' : 'put';

                await api({
                    method: method,
                    url: url,
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                toast.success(`Compte ${user.active ? 'désactivé' : 'réactivé'} avec succès`, { id: loadingToast });

                // Mise à jour de l'UI : on inverse le statut de l'utilisateur modifié
                setUsers(users.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
            } catch (error) {
                console.error(`Erreur lors de la modification du statut:`, error);
                toast.error("Erreur lors de la modification du statut", { id: loadingToast });
            }
        }
    };

    // --- LOGIQUE DE FILTRAGE INTELLIGENTE ---
    const currentUserEmail = localStorage.getItem('userEmail');

    const filteredUsers = users.filter(user => {
        // 1. Exclure l'administrateur actuellement connecté
        if (user.email === currentUserEmail) return false;

        // 2. Filtre par recherche (nom ou email)
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());

        // 3. Filtre par statut
        const matchesStatus = filterStatus === 'all' ? true :
                              filterStatus === 'active' ? user.active === true :
                              user.active === false;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-200 pb-4 mb-8">
                Gestion des Utilisateurs
            </h2>

            {/* BARRE DE RECHERCHE ET FILTRES */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="🔍 Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm bg-white"
                >
                    <option value="all">Tous les utilisateurs</option>
                    <option value="active">🟢 Actifs uniquement</option>
                    <option value="inactive">🔴 Inactifs uniquement</option>
                </select>
            </div>

            {/* TABLEAU AVEC SKELETON LOADER */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold text-center w-16">ID</th>
                                <th className="px-6 py-4 font-semibold">Nom d'utilisateur</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold text-center">Rôles</th>
                                <th className="px-6 py-4 font-semibold text-center">Statut</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4 text-center"><div className="h-4 bg-gray-200 rounded w-6 mx-auto"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                                        <td className="px-6 py-4 text-center"><div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div></td>
                                        <td className="px-6 py-4 text-center"><div className="h-6 bg-gray-200 rounded-full w-16 mx-auto"></div></td>
                                        <td className="px-6 py-4 flex justify-end"><div className="h-8 bg-gray-200 rounded w-24"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${!user.active && 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4 text-center text-gray-500">{user.id}</td>
                                        <td className={`px-6 py-4 font-medium ${!user.active ? 'text-gray-400' : 'text-gray-900'}`}>{user.username}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-center">
                                            {user.roles && user.roles.map((r, index) => (
                                                <span key={index} className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full mx-1 ${r.name === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {r.name}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                                                    user.active
                                                        ? 'text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200'
                                                        : 'text-green-600 hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-200'
                                                }`}
                                            >
                                                {user.active ? "Désactiver" : "Réactiver"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                            </svg>
                                            Aucun utilisateur trouvé.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}