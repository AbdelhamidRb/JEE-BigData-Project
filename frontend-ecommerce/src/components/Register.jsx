import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', city: '', state: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/register', formData);
            setMessage({ text: "Compte créé avec succès !", type: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage({ text: error.response?.data || "Erreur lors de l'inscription", type: 'error' });
        }
    };

    return (
        <div className="page-container">
            <div className="auth-card">
                <h2>Créer un compte</h2>

                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form-group">
                    <input type="text" name="username" placeholder="Nom d'utilisateur" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Adresse email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
                    <input type="text" name="city" placeholder="Ville" onChange={handleChange} required />
                    <input type="text" name="state" placeholder="Région" onChange={handleChange} required />
                    <button type="submit" className="btn-primary">S'inscrire</button>
                </form>
            </div>
        </div>
    );
}