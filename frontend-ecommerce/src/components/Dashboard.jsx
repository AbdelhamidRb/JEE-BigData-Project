import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const email = localStorage.getItem('userEmail');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="page-container">
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <h2>Tableau de bord</h2>
                <p style={{ margin: '20px 0', color: '#4b5563' }}>
                    Bienvenue, <strong>{email}</strong>
                </p>
                <div style={{ marginTop: '30px' }}>
                    <button onClick={handleLogout} className="btn-danger">
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
}