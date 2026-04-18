import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Erreur chargement commandes");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/orders/${id}/status`, status);
            toast.success("Statut mis à jour");
            fetchOrders();
        } catch (err) { toast.error("Erreur mise à jour"); }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'LIVRE': return 'bg-green-100 text-green-800';
            case 'ANNULE': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Gestion des Commandes</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Client</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Statut</th>
                        <th className="p-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                    {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">#{order.id}</td>
                            <td className="p-4 font-medium">{order.user?.username || 'Client'}</td>
                            <td className="p-4 text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="p-4 font-semibold text-blue-600">{order.totalAmount} DH</td>
                            <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                            </td>
                            <td className="p-4">
                                <select
                                    className="border border-gray-300 rounded-md text-sm p-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                    value={order.status}
                                >
                                    <option value="EN_ATTENTE">En attente</option>
                                    <option value="LIVRE">Livré</option>
                                    <option value="ANNULE">Annulé</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}