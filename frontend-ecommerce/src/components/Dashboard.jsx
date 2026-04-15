import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const email = localStorage.getItem('userEmail');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="page-container">
            <div className="auth-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
                <h2>Mon Espace Client</h2>
                <div style={{ padding: '20px', background: 'var(--bg-light)', borderRadius: '8px', margin: '20px 0' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Identifiant connecté :</p>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{email}</strong>
                </div>
                <button onClick={handleLogout} className="btn-danger">
                    Se déconnecter
                </button>
            </div>
        </div>
    );
}