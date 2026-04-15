import { useState, useEffect } from 'react';

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [showInactive, setShowInactive] = useState(false); // État pour basculer la vue

    useEffect(() => {
        fetchUsers();
    }, [showInactive]); // Recharge quand on change de vue (Actifs/Inactifs)

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const currentUserEmail = localStorage.getItem('userEmail');

            const response = await fetch('http://localhost:8080/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();

                // On filtre : exclure soi-même ET filtrer par statut active/inactive
                const filtered = data.filter(user =>
                    user.email !== currentUserEmail && user.active === !showInactive
                );
                setUsers(filtered);
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
        }
    };

    const handleToggleStatus = async (user) => {
        const action = user.active ? "désactiver" : "réactiver";
        if (!window.confirm(`Voulez-vous vraiment ${action} cet utilisateur ?`)) return;

        try {
            const token = localStorage.getItem('token');
            // Si actif -> DELETE (désactivation), si inactif -> PUT (réactivation)
            const url = `http://localhost:8080/api/users/${user.id}${user.active ? '' : '/reactivate'}`;
            const method = user.active ? 'DELETE' : 'PUT';

            const response = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                // Supprimer de la liste actuelle pour donner un feedback immédiat
                setUsers(users.filter(u => u.id !== user.id));
            }
        } catch (error) {
            console.error(`Erreur lors de la modification du statut:`, error);
        }
    };

    return (
        <div className="admin-users-container" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="text-xl font-bold">
                    Gestion des Utilisateurs {showInactive ? "(Inactifs)" : "(Actifs)"}
                </h2>
                <button
                    onClick={() => setShowInactive(!showInactive)}
                    style={{
                        padding: '8px 15px',
                        backgroundColor: showInactive ? '#2ecc71' : '#95a5a6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    {showInactive ? "Voir les Actifs" : "Voir les Inactifs"}
                </button>
            </div>

            <table border="1" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th>Nom d'utilisateur</th>
                        <th>Email</th>
                        <th>Rôles</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                <td style={{ padding: '10px' }}>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.roles && user.roles.map(r => r.name).join(', ')}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleToggleStatus(user)}
                                        style={{
                                            color: user.active ? '#e67e22' : '#27ae60',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            border: 'none',
                                            background: 'none'
                                        }}
                                    >
                                        {user.active ? "Désactiver" : "Réactiver"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                Aucun utilisateur trouvé dans cette catégorie.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}