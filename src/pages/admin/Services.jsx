import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', category: 'General', description: '', price: '', duration: 60, location: '', taxRate: 0
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/services`);
            setServices(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/services/${editingId}`, formData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/services`, formData, config);
            }
            setShowModal(false);
            setFormData({ name: '', category: 'General', description: '', price: '', duration: 60, location: '', taxRate: 0 });
            setEditingId(null);
            fetchServices();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleEdit = (service) => {
        setFormData(service);
        setEditingId(service._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/services/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchServices();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Services & Inventory</h2>
                <button
                    onClick={() => { setEditingId(null); setFormData({ name: '', category: 'General', description: '', price: '', duration: 60, location: '', taxRate: 0 }); setShowModal(true); }}
                    className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <FaPlus /> Add Service
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr> : services.map(service => (
                            <tr key={service._id}>
                                <td className="px-6 py-4">{service.name}</td>
                                <td className="px-6 py-4">{service.category}</td>
                                <td className="px-6 py-4">₹{service.price} (+{service.taxRate}%)</td>
                                <td className="px-6 py-4">{service.location || 'All'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-800 mr-3"><FaEdit /></button>
                                    <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingId ? 'Edit Service' : 'New Service'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500"><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input className="border p-2 rounded" placeholder="Service Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                <input className="border p-2 rounded" placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                            </div>
                            <textarea className="w-full border p-2 rounded" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" className="border p-2 rounded" placeholder="Price (₹)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                <input type="number" className="border p-2 rounded" placeholder="Tax Rate (%)" value={formData.taxRate} onChange={e => setFormData({ ...formData, taxRate: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" className="border p-2 rounded" placeholder="Duration (min)" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} required />
                                <input className="border p-2 rounded" placeholder="Location (Branch)" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
