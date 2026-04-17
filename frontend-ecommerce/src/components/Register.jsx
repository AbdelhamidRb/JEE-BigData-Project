import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '', city: '', state: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Création de votre compte...');

        try {
            await api.post('/auth/register', formData);
            toast.success("Compte créé avec succès !", { id: loadingToast });
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            toast.error(error.response?.data || "Erreur lors de l'inscription", { id: loadingToast });
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Créer un compte
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ou{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        connectez-vous à votre compte existant
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-gray-100">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                            <input type="text" name="username" onChange={handleChange} required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Email</label>
                            <input type="email" name="email" onChange={handleChange} required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                            <input type="password" name="password" onChange={handleChange} required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                <input type="text" name="city" onChange={handleChange} required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
                                <input type="text" name="state" onChange={handleChange} required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                        </div>

                        <button type="submit"
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
                            S'inscrire
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}