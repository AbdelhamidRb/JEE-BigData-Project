import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="bg-white">
            {/* HERO SECTION */}
            <div className="relative bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
                        <main className="mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">La qualité premium</span>{' '}
                                    <span className="block text-blue-600 xl:inline">à portée de clic</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Découvrez notre nouvelle collection. Des produits soigneusement sélectionnés pour répondre à toutes vos exigences, avec une livraison rapide et sécurisée.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link to="/dashboard" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg transition-colors">
                                            Voir les produits
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg transition-colors">
                                            Créer un compte
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                {/* Image d'illustration (Placeholder esthétique) */}
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-blue-50 flex items-center justify-center">
                     <span className="text-9xl">🛍️</span>
                </div>
            </div>

            {/* SECTION RÉASSURANCE (Bandeau de confiance) */}
            <div className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="text-4xl mb-4">🚚</div>
                            <h3 className="text-lg font-bold text-gray-900">Livraison Rapide</h3>
                            <p className="mt-2 text-gray-500">Partout dans le pays en 24/48h.</p>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl mb-4">🔒</div>
                            <h3 className="text-lg font-bold text-gray-900">Paiement Sécurisé</h3>
                            <p className="mt-2 text-gray-500">Vos données sont 100% protégées.</p>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl mb-4">📞</div>
                            <h3 className="text-lg font-bold text-gray-900">Support 24/7</h3>
                            <p className="mt-2 text-gray-500">Une équipe à votre écoute.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION CATÉGORIES EN VEDETTE */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Catégories Populaires</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Carte Catégorie 1 */}
                    <div className="relative rounded-2xl bg-gray-100 h-64 flex items-end p-6 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <div className="relative z-20 w-full">
                            <h3 className="text-xl font-bold text-white">Électronique</h3>
                            <p className="text-gray-200 text-sm mt-1">Smartphones, PC, Accessoires</p>
                        </div>
                        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity z-10"></div>
                    </div>
                    {/* Carte Catégorie 2 */}
                    <div className="relative rounded-2xl bg-gray-100 h-64 flex items-end p-6 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <div className="relative z-20 w-full">
                            <h3 className="text-xl font-bold text-white">Mode & Vêtements</h3>
                            <p className="text-gray-200 text-sm mt-1">Nouvelle collection hiver</p>
                        </div>
                        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity z-10"></div>
                    </div>
                    {/* Carte Catégorie 3 */}
                    <div className="relative rounded-2xl bg-gray-100 h-64 flex items-end p-6 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <div className="relative z-20 w-full">
                            <h3 className="text-xl font-bold text-white">Maison & Déco</h3>
                            <p className="text-gray-200 text-sm mt-1">Mobilier et aménagement</p>
                        </div>
                        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity z-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}