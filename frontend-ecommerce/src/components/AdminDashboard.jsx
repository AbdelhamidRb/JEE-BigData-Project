import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-gray-500 mt-1">Bienvenue dans votre espace d'administration.</p>
            </header>

            {/* GRILLE DE STATISTIQUES (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-lg text-2xl">📦</div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Produits Actifs</p>
                        <h4 className="text-2xl font-bold text-gray-900">120</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-green-100 text-green-600 rounded-lg text-2xl">🛒</div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Commandes</p>
                        <h4 className="text-2xl font-bold text-gray-900">45</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-lg text-2xl">👥</div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Clients</p>
                        <h4 className="text-2xl font-bold text-gray-900">300</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-yellow-100 text-yellow-600 rounded-lg text-2xl">💰</div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
                        <h4 className="text-2xl font-bold text-gray-900">15,200 €</h4>
                    </div>
                </div>
            </div>

            {/* SECTION ACTIONS RAPIDES */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Actions rapides</h3>
                <div className="flex flex-wrap gap-4">
                    <Link to="/admin/products" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2">
                        <span>+</span> Ajouter un produit
                    </Link>
                    <Link to="/admin/users" className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2">
                        <span>👥</span> Gérer les utilisateurs
                    </Link>
                </div>
            </div>
        </div>
    );
}